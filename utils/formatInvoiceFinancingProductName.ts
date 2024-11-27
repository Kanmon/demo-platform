const formatInvoiceFinancingProductName = (plural = false) => {
  const words = 'Invoice'
  return plural ? words + 's' : words
}

export default formatInvoiceFinancingProductName
