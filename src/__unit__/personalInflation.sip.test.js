import { describe, it, expect } from 'vitest'
import { calculateSIPFutureValue } from '@/utils/calculations'
import {
  SIP_BUYING_POWER,
  deflateToToday,
  sipBuyingPowerEnd,
  sipBuyingPowerSeries,
} from '@/utils/personalInflationSip'

describe('personalInflationSip', () => {
  it('demo is ₹10,000 a month at 12% for 10 years', () => {
    expect(SIP_BUYING_POWER).toEqual({ monthly: 10000, annualReturn: 0.12, years: 10 })
  })

  it('deflates a corpus to today’s rupees', () => {
    expect(deflateToToday(100, 0, 10)).toBe(100)
    expect(deflateToToday(100, 10, 1)).toBeCloseTo(100 / 1.1, 8)
  })

  it('year-10 your line is below India’s published figure when your inflation is higher', () => {
    const end = sipBuyingPowerEnd({ yourInflationPct: 6.7, publishedInflationPct: 4.45 })
    const nominal = calculateSIPFutureValue(10000, 0.12, 120)
    expect(end.year).toBe(10)
    expect(end.your).toBeCloseTo(nominal / Math.pow(1.067, 10), 4)
    expect(end.published).toBeCloseTo(nominal / Math.pow(1.0445, 10), 4)
    expect(end.your).toBeLessThan(end.published)
  })

  it('your line moves when your inflation moves; published line does not', () => {
    const a = sipBuyingPowerSeries({ yourInflationPct: 6.7, publishedInflationPct: 4.45 })
    const b = sipBuyingPowerSeries({ yourInflationPct: 11, publishedInflationPct: 4.45 })
    expect(a[10].published).toBeCloseTo(b[10].published, 6)
    expect(b[10].your).toBeLessThan(a[10].your)
  })
})
