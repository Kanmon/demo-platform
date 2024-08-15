import numeral from 'numeral'
import { isNil } from 'lodash'

export const formatWholeDollars = (dollars: number) => {
  const prefix = dollars < 0 ? '-$' : '$'
  return prefix + numeral(Math.abs(dollars)).format('0,0')
}

export const formatDollarsWithCents = (
  moneyWithCents: number,
  config: { includeCommas?: boolean; prefixDollarSign?: boolean } = {
    includeCommas: true,
    prefixDollarSign: true,
  },
) => {
  // Numeral returns NaN for numbers that are too long after decimal.
  // We're formatting it after anyways, lets set a steady set of decimals.
  // -4.263256414560601e-14 => NaN
  // Now
  // -4.263256414560601e-14 => 0.00
  const formatStyle = config.includeCommas ? '0,0.00' : '0.00'

  let prefix = moneyWithCents < 0 ? '-' : ''
  if (config.prefixDollarSign) {
    prefix = moneyWithCents < 0 ? '-$' : '$'
  }

  return (
    prefix + numeral(Math.abs(moneyWithCents).toFixed(2)).format(formatStyle)
  )
}

export const formatRatio = (ratio: number | undefined) => {
  return isNil(ratio) ? '-' : numeral(ratio).format('0.00')
}

export const formatRatioAsPercentage = (
  ratio: number | undefined,
  format = '0.00%',
) => {
  return isNil(ratio) ? '-' : numeral(ratio).format(format)
}

export const formatMoney = (value: number | undefined | null) => {
  return isNil(value) ? '-' : formatDollarsWithCents(value)
}

export const formatInteger = (value: number | undefined) => {
  return isNil(value) ? '-' : value.toString()
}

export const convertCentsToDollars = (amountCents: number) => {
  return amountCents / 100
}

export const convertDollarsToCents = (amountDollar: number) => {
  return amountDollar * 100
}

export const formatCentsToDollars = (
  moneyWithCents: number,
  config: { includeCommas?: boolean; prefixDollarSign?: boolean } = {},
) => {
  const configWithDefaults = {
    includeCommas: config.includeCommas ?? true,
    prefixDollarSign: config.prefixDollarSign ?? true,
  }

  return formatDollarsWithCents(
    convertCentsToDollars(moneyWithCents),
    configWithDefaults,
  )
}

export const percentageFormatter = (ratio: number, fractionDigits = 3) =>
  `${parseFloat((ratio * 100).toFixed(fractionDigits)).toString()}%`
