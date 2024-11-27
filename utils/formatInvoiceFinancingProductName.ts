import { ProductType } from '../types/MoreTypes'

const formatInvoiceFinancingProductName = (
  productType?: 'INVOICE_FINANCING' | 'ACCOUNTS_PAYABLE_FINANCING' | null,
  plural = false,
) => {
  if (!productType) {
    return ''
  }

  const words =
    productType === ProductType.INVOICE_FINANCING
      ? 'Invoice'
      : 'Accounts Payable'
  return plural ? words + 's' : words
}

export default formatInvoiceFinancingProductName
