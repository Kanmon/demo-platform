import {
  CreateSessionTokenRequestBodyData,
  KanmonPlatformApi,
  SessionInvoice,
  SessionInvoiceWithInvoiceFile,
} from '@kanmon/sdk'
import { KanmonConnectComponent } from '@kanmon/web-sdk'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

import _ from 'lodash'
import path from 'path'
import { PlatformInvoice } from '../../types/DemoInvoicesTypes'
import { extractApiKeyFromHeader, KanmonClient } from '../../utils'
import getInvoiceTotalCents from '../../utils/getInvoiceTotal'

export interface CreateEmbeddedSessionPayload {
  invoices: PlatformInvoice[]
  platformBusinessId: string
  includeInvoiceFile: boolean
}

export interface ConnectSessionTokenData {
  businessId?: string
  platformBusinessId?: string
  data: CreateSessionTokenRequestBodyData
}

export class PlatformApiCreateEmbeddedSessionResponse {
  sessionToken!: string
}

const getSessionInvoiceConnectSessionTokenData = ({
  platformBusinessId,
  invoices,
}: CreateEmbeddedSessionPayload): ConnectSessionTokenData => {
  return {
    platformBusinessId,
    data: {
      component: KanmonConnectComponent.SESSION_INVOICE_FLOW,
      invoices: invoices.map((invoice) => {
        const sessionInvoice: SessionInvoice = {
          payorType: invoice.payorType,
          platformInvoiceId: invoice.id,
          platformInvoiceNumber: invoice.invoiceNumber,
          invoiceAmountCents: getInvoiceTotalCents(invoice, true),
          invoiceIssuedDate: invoice.createdAtIsoDate,
          invoiceDueDate: invoice.dueDateIsoDate as string,
          payorBusinessName: invoice.billFromBusinessName,
          payorFirstName: invoice.customerFirstName,
          payorLastName: invoice.customerLastName,
          payorEmail: invoice.billFromBusinessEmail,
          payorAddress: invoice.billFromPersonAddress,
          description: invoice.items.map((item) => item.itemName).join(', '),
        }

        return sessionInvoice
      }),
    },
  }
}

const getSessionInvoiceWithFileConnectSessionTokenData = async (
  { platformBusinessId, invoices }: CreateEmbeddedSessionPayload,
  sdkClient: KanmonPlatformApi,
): Promise<ConnectSessionTokenData> => {
  const blobInvoices: Blob[] = []

  for (const _ of invoices) {
    const data = fs.readFileSync(
      path.join(
        process.cwd(),
        process.env.CWD_PATH_TO_PUBLIC as string,
        '/sample-invoice.pdf',
      ),
    )

    const blob = new Blob([data], { type: 'application/pdf' })

    blobInvoices.push(blob)
  }

  const documentResponse = await sdkClient.documents.createBusinessDocument({
    platformBusinessId,
    invoices: blobInvoices,
  })

  return {
    platformBusinessId,
    data: {
      component: KanmonConnectComponent.SESSION_INVOICE_FLOW_WITH_INVOICE_FILE,
      invoices: invoices.map((invoice, i) => {
        const totalCents = getInvoiceTotalCents(invoice, true)
        const sessionInvoice: SessionInvoiceWithInvoiceFile = {
          documentId: documentResponse.documents[i].id,
          payorType: invoice.payorType,
          platformInvoiceId: invoice.id,
          platformInvoiceNumber: invoice.invoiceNumber,
          invoiceAmountCents: totalCents > 0 ? totalCents : undefined,
          invoiceIssuedDate: invoice.createdAtIsoDate,
          invoiceDueDate: invoice.dueDateIsoDate,
          payorBusinessName: invoice.billFromBusinessName,
          payorFirstName: invoice.customerFirstName,
          payorLastName: invoice.customerLastName,
          payorEmail: invoice.billFromBusinessEmail,
          payorAddress: invoice.billFromPersonAddress,
          description:
            invoice.items.map((item) => item.itemName).join(', ') ||
            'an invoice',
        }

        return sessionInvoice
      }),
    },
  }
}

const getSessionInvoiceRelaxedConnectSessionTokenData = ({
  platformBusinessId,
  invoices,
}: CreateEmbeddedSessionPayload): ConnectSessionTokenData => {
  return {
    platformBusinessId,
    data: {
      component: 'SESSION_INVOICE_FLOW_RELAXED',
      invoices: invoices.map((invoice) => {
        const sessionInvoice = {
          payorType: invoice.payorType,
          platformInvoiceId: invoice.id,
          platformInvoiceNumber: invoice.invoiceNumber,
          invoiceAmountCents: getInvoiceTotalCents(invoice, true),
          invoiceIssuedDate: invoice.createdAtIsoDate,
          invoiceDueDate: invoice.dueDateIsoDate,
          payorBusinessName: invoice.billFromBusinessName,
          payorFirstName: invoice.customerFirstName,
          payorLastName: invoice.customerLastName,
          payorEmail: invoice.billFromBusinessEmail,
          payorAddress: invoice.billFromPersonAddress,
          description: invoice.items.map((item) => item.itemName).join(', '),
        }

        return sessionInvoice
      }),
    } as any,
  }
}

const getConnectSessionTokenData = async (
  requestBody: CreateEmbeddedSessionPayload,
  sdkClient: KanmonPlatformApi,
): Promise<ConnectSessionTokenData> => {
  if (requestBody.includeInvoiceFile) {
    return getSessionInvoiceWithFileConnectSessionTokenData(
      requestBody,
      sdkClient,
    )
  }

  if (
    requestBody.invoices.some(
      (invoice) =>
        _.isNil(invoice.dueDateIsoDate) || _.isNil(invoice.createdAtIsoDate),
    )
  ) {
    return getSessionInvoiceRelaxedConnectSessionTokenData(requestBody)
  }

  return getSessionInvoiceConnectSessionTokenData(requestBody)
}

const createEmbeddedSessions = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const kanmonUserId = req.headers['authorization']?.split(' ')?.[1]

  if (!kanmonUserId) {
    res.status(400).send({
      message: 'User ID is required',
      errorCode: 'BadRequestException',
    })
  }

  const requestBody: CreateEmbeddedSessionPayload = req.body

  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const client = new KanmonClient(apiKey)

  const NEXT_PUBLIC_DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV as
    | 'production'
    | 'sandbox'
    | 'staging'
    | 'development'

  const sdkClient = new KanmonPlatformApi(apiKey, NEXT_PUBLIC_DEPLOY_ENV)

  const createEmbeddedSessionForInvoiceFlowBody: ConnectSessionTokenData =
    await getConnectSessionTokenData(requestBody, sdkClient)

  if (
    (createEmbeddedSessionForInvoiceFlowBody.data.component as any) ===
    'SESSION_INVOICE_FLOW_RELAXED'
  ) {
    const session = await client.TEST_ONLY_CreateEmbeddedSession(
      createEmbeddedSessionForInvoiceFlowBody,
    )
    res.send(session)
    return
  }

  const session = await sdkClient.embeddedSessions.createEmbeddedSession({
    createSessionTokenRequestBody: {
      businessId: createEmbeddedSessionForInvoiceFlowBody.businessId,
      platformBusinessId:
        createEmbeddedSessionForInvoiceFlowBody.platformBusinessId,
      data: createEmbeddedSessionForInvoiceFlowBody.data,
    },
  })
  res.send(session)
  return
}

export default createEmbeddedSessions
