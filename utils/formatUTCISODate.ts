import { DateTime } from 'luxon'

export type DateFormat = 'MM-dd-yyyy' | 'yyyy-MM-dd' | 'MM/dd/yy' | 'MM/dd/yyyy'

export const formatUTCISODate = (
  date: string | Date,
  format: DateFormat = 'yyyy-MM-dd',
) => {
  return typeof date === 'string'
    ? DateTime.fromISO(date, { zone: 'utc' }).toFormat(format)
    : DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(format)
}
