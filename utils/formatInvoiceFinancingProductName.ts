import { ProductType } from '../types/MoreTypes'

const formatInvoiceFinancingProductName = (
  productType?: 'INVOICE_FINANCING' | 'PURCHASE_ORDER' | null,
  plural = false,
) => {
  if (!productType) {
    return ''
  }

  const words =
    productType === ProductType.INVOICE_FINANCING ? 'Invoice' : 'Purchase Order'
  return plural ? words + 's' : words
}

export default formatInvoiceFinancingProductName
