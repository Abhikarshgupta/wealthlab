import { calculateSIPFutureValue } from '@/utils/calculations'

/** Demo SIP on results — not the full calculator (tax, step-up, corpus). */
export const SIP_BUYING_POWER = {
  monthly: 10000,
  annualReturn: 0.12,
  years: 10,
}

export const deflateToToday = (nominal, inflationPct, years) => {
  if (!Number.isFinite(nominal)) return 0
  if (years <= 0) return nominal
  const rate = (Number(inflationPct) || 0) / 100
  return nominal / Math.pow(1 + rate, years)
}

export const sipBuyingPowerSeries = ({ yourInflationPct, publishedInflationPct }) => {
  const { monthly, annualReturn, years } = SIP_BUYING_POWER
  const points = []
  for (let year = 0; year <= years; year += 1) {
    const nominal = year === 0 ? 0 : calculateSIPFutureValue(monthly, annualReturn, year * 12)
    points.push({
      year,
      your: deflateToToday(nominal, yourInflationPct, year),
      published: deflateToToday(nominal, publishedInflationPct, year),
    })
  }
  return points
}

export const sipBuyingPowerEnd = (args) => {
  const points = sipBuyingPowerSeries(args)
  return points[points.length - 1]
}
