const formatInvoiceFinancingProductName = (
  productType?: 'INVOICE_FINANCING' | 'ACCOUNTS_PAYABLE_FINANCING' | null,
  plural = false,
) => {
  if (!productType) {
    return ''
  }

  const words = 'Invoice'
  return plural ? words + 's' : words
}

export default formatInvoiceFinancingProductName
