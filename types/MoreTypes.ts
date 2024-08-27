import { Address } from '@kanmon/sdk'
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator'

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
  INTEGRATED_MCA = 'INTEGRATED_MCA',
  TERM_LOAN = 'TERM_LOAN',
}

export class CreateBusinessAndUserRequestBody {
  @IsString()
  email!: string

  @IsEnum(ProductType)
  @ValidateIf(
    (o: CreateBusinessAndUserRequestBody) =>
      !!o.prequalifyForProduct || !!o.prequalType,
  )
  prequalifyForProduct?: ProductType

  @IsString()
  platformBusinessId!: string

  @IsEnum(UserRole, { each: true })
  userRoles!: UserRole[]

  @IsEnum(TestingPrequalType)
  @IsOptional()
  prequalType?: TestingPrequalType
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
  [ProductType.INTEGRATED_MCA]: 'Integrated Merchant Cash Advances',
}

export enum PayorType {
  BUSINESS = 'BUSINESS',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface ResponseWithErrorCode {
  errorCode: string
  message?: string
}