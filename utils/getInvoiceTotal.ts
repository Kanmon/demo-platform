import { PlatformInvoice } from '../types/DemoInvoicesTypes'

const getInvoiceTotalCents = (invoice: PlatformInvoice, withTax = false) =>
  Math.round(
    (withTax ? 1.1 : 1) *
      invoice.items.reduce(
        (total, nextItem) =>
          total + nextItem.itemCostCents * nextItem.itemQuantity,
        0,
      ),
  )

export default getInvoiceTotalCents
