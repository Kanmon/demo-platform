import {
  FinanceInvoiceRequestBody,
  Invoice,
  KanmonPlatformApi,
  ProductType,
} from '@kanmon/sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { extractApiKeyFromHeader } from '../../utils'
import { PlatformInvoice } from '../../types/DemoInvoicesTypes'
import getInvoiceTotalCents from '../../utils/getInvoiceTotal'

export interface FinanceInvoicePayload {
  invoices: PlatformInvoice[]
  issuedProductId: string
  platformBusinessId: string
}

export interface FailedInvoice {
  platformInvoiceId: string
  platformInvoiceNumber: string
  error: string
  errorCode: string
}

export interface FinanceInvoiceResponse {
  invoices: Invoice[]
  failedInvoices: FailedInvoice[]
}

const financeInvoice = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const NEXT_PUBLIC_DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV as
    | 'production'
    | 'sandbox'
    | 'staging'
    | 'development'

  // Block this endpoint in production
  if (NEXT_PUBLIC_DEPLOY_ENV === 'production') {
    res.status(404).send({
      message: 'Endpoint not found',
      errorCode: 'NotFoundException',
    })
    return
  }

  const requestBody: FinanceInvoicePayload = req.body

  const sdkClient = new KanmonPlatformApi(apiKey, NEXT_PUBLIC_DEPLOY_ENV)

  // Get the issued product to retrieve the invoice payment plan ID
  const issuedProductsResponse =
    await sdkClient.issuedProducts.getAllIssuedProducts({
      ids: requestBody.issuedProductId,
    })

  const issuedProduct = issuedProductsResponse.issuedProducts.find(
    (ip) => ip.id === requestBody.issuedProductId,
  )

  if (!issuedProduct) {
    res.status(404).send({
      message: 'Issued product not found',
      errorCode: 'NotFoundException',
    })
    return
  }

  if (
    issuedProduct.servicingData.productType !==
      ProductType.ACCOUNTS_PAYABLE_FINANCING &&
    issuedProduct.servicingData.productType !== ProductType.INVOICE_FINANCING
  ) {
    res.status(409).send({
      message: 'The product type is not supported for this operation.',
      errorCode: 'IncorrectProductTypeException',
    })
    return
  }

  const servicingData = issuedProduct.servicingData
  if (!servicingData.pricingPlans || servicingData.pricingPlans.length === 0) {
    res.status(404).send({
      message: 'Pricing plans not found',
      errorCode: 'NotFoundException',
    })
    return
  }

  const invoicePaymentPlanId = servicingData.pricingPlans[0].id

  // Finance each invoice, handling partial failures
  const financedInvoices: Invoice[] = []
  const failedInvoices: FailedInvoice[] = []

  for (const invoice of requestBody.invoices) {
    try {
      const invoiceAmountCents = getInvoiceTotalCents(invoice, true)
      const financeRequestBody: FinanceInvoiceRequestBody = {
        issuedProductId: requestBody.issuedProductId,
        invoicePaymentPlanId: invoicePaymentPlanId,
        platformInvoiceId: invoice.id,
        platformInvoiceNumber: invoice.invoiceNumber,
        invoiceAmountCents: invoiceAmountCents,
        amountRequestedForFinancingCents: invoiceAmountCents,
        invoiceDueDate: invoice.dueDateIsoDate as string,
        invoiceIssuedDate: invoice.createdAtIsoDate,
        description:
          invoice.items.map((item) => item.itemName).join(', ') || 'an invoice',
        ...(issuedProduct.servicingData.productType ===
        ProductType.INVOICE_FINANCING
          ? {
              payorType:
                invoice.payorType === 'BUSINESS' ? 'BUSINESS' : 'INDIVIDUAL',
              payorBusinessName: invoice.billFromBusinessName,
              payorFirstName: invoice.customerFirstName,
              payorLastName: invoice.customerLastName,
              payorEmail: invoice.billFromBusinessEmail,
              payorAddress: invoice.billFromPersonAddress,
            }
          : {
              payeeEmail: invoice.billFromBusinessEmail,
              payeeAddress: invoice.billFromPersonAddress,
              payeeType:
                invoice.payorType === 'BUSINESS' ? 'BUSINESS' : 'INDIVIDUAL',
              payeeBusinessName: invoice.billFromBusinessName,
              payeeFirstName: invoice.customerFirstName,
              payeeLastName: invoice.customerLastName,
            }),
      }

      const financedInvoice = await sdkClient.invoices.financeInvoice({
        financeInvoiceRequestBody: financeRequestBody,
      })
      financedInvoices.push(financedInvoice)
    } catch (invoiceError: any) {
      console.log('error', invoiceError)
      const errorData = await invoiceError.response.json()

      failedInvoices.push({
        platformInvoiceId: invoice.id,
        platformInvoiceNumber: invoice.invoiceNumber,
        error:
          errorData?.message ||
          'Please try again or reach out to Kanmon for help.',
        errorCode: errorData?.errorCode || 'InternalServerError',
      })
    }
  }

  // Always return 200 with both successful and failed invoices
  const response: FinanceInvoiceResponse = {
    invoices: financedInvoices,
    failedInvoices: failedInvoices,
  }
  res.status(200).json(response)
}

export default financeInvoice
