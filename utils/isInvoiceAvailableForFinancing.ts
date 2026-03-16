import { DateTime } from 'luxon'
import { PlatformInvoice } from '../types/DemoInvoicesTypes'

const isInvoiceAvailableForFinancing = (
  invoice: PlatformInvoice,
  financingCutoffDate: DateTime,
): boolean =>
  !invoice.dueDateIsoDate ||
  DateTime.fromISO(invoice.dueDateIsoDate) >= financingCutoffDate

export default isInvoiceAvailableForFinancing
