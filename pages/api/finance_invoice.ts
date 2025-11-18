import { FinanceInvoiceRequestBody, KanmonPlatformApi } from '@kanmon/sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { extractApiKeyFromHeader } from '../../utils'
import { PlatformInvoice } from '../../types/DemoInvoicesTypes'
import getInvoiceTotalCents from '../../utils/getInvoiceTotal'

export interface FinanceInvoicePayload {
  invoices: PlatformInvoice[]
  issuedProductId: string
  platformBusinessId: string
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
    res.status(501).send({
      message: 'This endpoint is not supported in production',
      errorCode: 'InternalServerError',
    })
    return
  }

  const requestBody: FinanceInvoicePayload = req.body

  const sdkClient = new KanmonPlatformApi(apiKey, NEXT_PUBLIC_DEPLOY_ENV)

  try {
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

    // Get invoice payment plan ID from the first pricing plan
    const servicingData = issuedProduct.servicingData as any
    if (
      !servicingData.pricingPlans ||
      servicingData.pricingPlans.length === 0
    ) {
      res.status(400).send({
        message: 'No pricing plans found for issued product',
        errorCode: 'BadRequestException',
      })
      return
    }

    const invoicePaymentPlanId = servicingData.pricingPlans[0].id

    // Finance each invoice
    const financedInvoices = []
    for (const invoice of requestBody.invoices) {
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
        payeeEmail: invoice.billFromBusinessEmail,
        payeeAddress: invoice.billFromPersonAddress,
        payeeType: invoice.payorType === 'BUSINESS' ? 'BUSINESS' : 'INDIVIDUAL',
        payeeBusinessName: invoice.billFromBusinessName,
        payeeFirstName: invoice.customerFirstName,
        payeeLastName: invoice.customerLastName,
      }

      const financedInvoice = await sdkClient.invoices.financeInvoice({
        financeInvoiceRequestBody: financeRequestBody,
      })
      financedInvoices.push(financedInvoice)
    }

    res.json({ invoices: financedInvoices })
  } catch (ex: any) {
    let errorData: any = null
    let statusCode = 500
    let errorMessage = 'Please try again or reach out to Kanmon for help.'
    let errorCode = 'InternalServerError'

    // Handle SDK ResponseError (Fetch API Response)
    if (ex.response && typeof ex.response.json === 'function') {
      statusCode = ex.response.status || 500

      errorData = (await ex.response.json()) || null

      if (errorData) {
        errorMessage = errorData.message || errorMessage
        errorCode = errorData.errorCode || errorCode
      }
    }

    res.status(statusCode).send({
      message: errorMessage,
      errorCode: errorCode,
    })
  }
}

export default financeInvoice
