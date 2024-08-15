import {
  formatDollarsWithCents,
  formatRatio,
  formatWholeDollars,
} from './formatMoney'
import { DateFormat, formatUTCISODate } from './formatUTCISODate'
import { isNil, upperFirst } from 'lodash'

type MaybeBoolean = boolean | null | undefined
type MaybeNumber = number | null | undefined
type MaybeString = string | null | undefined
type MaybeDate = Date | string | null | undefined

export const renderValue = (value: string | number | null | undefined) =>
  !isNil(value) ? value : '-'

// This expects a value like 1.0 and renders it as `$1`
export const renderValueAsDollars = (value: MaybeNumber) => {
  return isNil(value) || isNaN(value) ? '—' : formatWholeDollars(value)
}

// This expects a value like 1.0 'month' and renders it as `$1/month`
export const renderValueAsDollarsPer = (
  value: MaybeNumber,
  unit: 'month' | 'year',
) => {
  return isNil(value) || isNaN(value)
    ? '—'
    : formatWholeDollars(value) + `/${unit}`
}

// This expects a value like 1.27 and renders it as `$1.27`
export const renderValueAsDollarsWithCents = (value: MaybeNumber) => {
  return isNil(value) || isNaN(value) ? '—' : formatDollarsWithCents(value)
}

// This expects a value like 127 and renders it as `$1.27`
export const renderCentsValueAsDollarsWithCents = (value: MaybeNumber) => {
  return isNil(value) || isNaN(value)
    ? '—'
    : formatDollarsWithCents(value / 100)
}

// This expects a value like 127 or 193 and renders it as `$1`
export const renderCentsValueAsDollarsWithoutCents = (value: MaybeNumber) => {
  return isNil(value) || isNaN(value) ? '—' : formatWholeDollars(value / 100)
}

// This expects a value like 1.0 and renders it as `1.0`
export const renderValueAsNumber = (value: MaybeNumber) => {
  return isNil(value) || isNaN(value) ? '—' : value.toString()
}

// This expects a value like 1.0 with a unit like 'meters'
// and renders it as `1.0 meters`
export const renderValueAsNumberWithUnit = (
  value: MaybeNumber,
  unit: string,
) => {
  return isNil(value) || isNaN(value) ? '—' : value.toString() + ` ${unit}`
}

// This expects a value like 0.01 and renders it as `1%`
export const renderValueAsPercentage = (
  value: MaybeNumber,
  precision?: number,
) => {
  if (isNil(value) || isNaN(value)) return '—'

  if (precision) {
    return (value * 100).toFixed(precision) + '%'
  }

  return (value * 100).toString() + '%'
}

// This expects a value like 8.5 and renders it as `8.5%`
export const renderValueAsRate = (value: MaybeNumber) => {
  return isNil(value) || isNaN(value) ? '—' : value.toString() + '%'
}

// This expects a value like 1.25 and renders it as `1.25×`
export const renderValueAsRatio = (value: MaybeNumber) => {
  return isNil(value) || isNaN(value) ? '—' : formatRatio(value) + '×'
}

// This expects a value like 'foo' and renders it as `foo`
export const renderValueAsString = (value: MaybeString) => {
  return isNil(value) ? '—' : upperFirst(value)
}

export const renderValueAsPhoneNumber = (value: MaybeString) => {
  if (isNil(value)) return '—'

  const cleaned = ('' + value).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const intlCode = match[1] ? '+1 ' : ''
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  } else {
    return value
  }
}

export const renderValueAsDate = (
  date: MaybeDate,
  format: DateFormat = 'yyyy-MM-dd',
): string => {
  return isNil(date) ? '—' : formatUTCISODate(date, format)
}

// This expects a value like 'new Date()' and renders it as `YYYY-MM-DD`
export const renderValueAsBoolean = (value: MaybeBoolean) => {
  return isNil(value) ? '—' : value ? 'True' : 'False'
}

// This expects a value like, whatever, and renders it lowercase
// with non-alphanumeric characters replaced with dashes
export const renderValueAsSlug = (value: any) => {
  return isNil(value)
    ? '—'
    : value
        .toString()
        .toLowerCase()
        .replaceAll(/[^A-Za-z0-9]/g, '-')
}

export const autoPay = (autoPayStatus: boolean) =>
  autoPayStatus ? 'Enabled' : 'Disabled'
