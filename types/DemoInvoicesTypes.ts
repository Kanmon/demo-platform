import { Address, IssuedProduct, Invoice as KanmonInvoice } from '@kanmon/sdk'

export enum PlatformInvoiceStatus {
  OVERDUE = 'OVERDUE',
  PAID = 'PAID',
  DUE = 'DUE',
}
export enum PlatformInvoiceType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  ONE_TIME = 'ONE_TIME',
}

export interface PlatformInvoice {
  id: string
  invoiceNumber: string
  status: PlatformInvoiceStatus
  createdAtIsoDate: string
  dueDateIsoDate?: string
  paidOnIsoDate?: string | null
  kanmonInvoiceId?: string
  payorType: 'BUSINESS' | 'INDIVIDUAL'
  customerFirstName?: string
  customerLastName?: string
  billFromBusinessName?: string
  type: PlatformInvoiceType
  phoneNumber: string
  billToPersonFullName?: string
  billToPersonAddress: Address
  billFromBusinessEmail: string
  billFromPersonAddress: Address
  items: { itemName: string; itemCostCents: number; itemQuantity: number }[]
}

export type PlatformInvoiceStatusFilter = 'ALL' | PlatformInvoiceStatus

export interface ApiInvoicesState {
  availableLimitCents: number | null
  invoices: PlatformInvoice[]
  invoiceStatusFilter: PlatformInvoiceStatusFilter
  invoiceFinancingIssuedProduct?: IssuedProduct | null
  kanmonInvoices: KanmonInvoice[]
  productTypeForPage?: 'INVOICE_FINANCING' | 'PURCHASE_ORDER' | null
}
