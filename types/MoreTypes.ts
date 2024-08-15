import { Address } from '@kanmon/sdk'

export enum TestingPrequalType {
  STANDARD = 'STANDARD',
  ANON = 'ANON',
}

export enum UserRole {
  PRIMARY_OWNER = 'PRIMARY_OWNER',
  OPERATOR = 'OPERATOR',
}

export enum ProductType {
  INVOICE_FINANCING = 'INVOICE_FINANCING',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  LINE_OF_CREDIT = 'LINE_OF_CREDIT',
  MCA = 'MCA',
  TERM_LOAN = 'TERM_LOAN',
}

export class CreateBusinessAndUserRequestBody {
  email!: string
  prequalifyForProduct?: ProductType
  platformBusinessId!: string
  userRoles!: UserRole[]
  prequalType!: TestingPrequalType
}

export type CreateUserResponsePayload = {
  id: string
  email: string
  businessId: string
  firstName?: string
  lastName?: string
  address?: Address
  createdAt: string
  updatedAt: string
}

export const productTypeToDisplayName: Record<ProductType, string> = {
  [ProductType.INVOICE_FINANCING]: 'Invoice Financing',
  [ProductType.PURCHASE_ORDER]: 'Purchase Order Financing',
  [ProductType.LINE_OF_CREDIT]: 'Line of Credit',
  [ProductType.TERM_LOAN]: 'Term Loan',
  [ProductType.MCA]: 'Merchant Cash Advances',
}

export enum PayorType {
  BUSINESS = 'BUSINESS',
  INDIVIDUAL = 'INDIVIDUAL',
}
