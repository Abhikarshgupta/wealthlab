/**
 * SSY calculation unit tests — TASK-W3-SSY (T3)
 * Golden source: tests/fixtures/golden/ssy.json
 */

import { describe, it, expect } from 'vitest'
import { calculatePPF } from '@/utils/calculations'
import { ssySchema } from '@/components/calculators/SSYCalculator/ssySchema'
import goldenCases from '../../tests/fixtures/golden/ssy.json'

const getGolden = (id) => {
  const row = goldenCases.find((c) => c.id === id)
  if (!row) throw new Error(`Golden case ${id} not found`)
  return row
}

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const toDecimalRate = (percent) => percent / 100

const yearsTillMaturity = (girlsAge) => 21 - girlsAge

describe('SSY calculations (golden)', () => {
  it('SSY-14: standard contribution matches golden maturity (age 5, 16 years)', () => {
    const golden = getGolden('SSY-14')
    const { yearlyInvestment, girlsAge, rate } = golden.inputs
    const tenure = yearsTillMaturity(girlsAge)
    const maturity = calculatePPF(yearlyInvestment, toDecimalRate(rate), tenure)

    expect(tenure).toBe(golden.expected.yearsTillMaturity)
    expect(
      withinTolerance(Math.round(maturity), golden.expected.maturityValue, golden.expected.tolerance)
    ).toBe(true)
  })

  it('SSY-14-max: maximum annual contribution from newborn matches golden maturity', () => {
    const golden = getGolden('SSY-14-max')
    const { yearlyInvestment, girlsAge, rate } = golden.inputs
    const tenure = yearsTillMaturity(girlsAge)
    const maturity = calculatePPF(yearlyInvestment, toDecimalRate(rate), tenure)

    expect(tenure).toBe(21)
    expect(
      withinTolerance(Math.round(maturity), golden.expected.maturityValue, golden.expected.tolerance)
    ).toBe(true)
  })

  it('SSY-22: newborn account matures in 21 years', () => {
    const golden = getGolden('SSY-22')
    const { yearlyInvestment, girlsAge, rate, startYear } = golden.inputs
    const tenure = yearsTillMaturity(girlsAge)
    const maturity = calculatePPF(yearlyInvestment, toDecimalRate(rate), tenure)

    expect(tenure).toBe(golden.expected.yearsTillMaturity)
    expect(startYear + tenure).toBe(golden.expected.maturityYear)
    expect(
      withinTolerance(Math.round(maturity), golden.expected.maturityValue, golden.expected.tolerance)
    ).toBe(true)
  })

  it('SSY-23: EEE — post-tax equals nominal maturity (no tax applied in calc)', () => {
    const golden = getGolden('SSY-23')
    const { yearlyInvestment, girlsAge, rate } = golden.inputs
    const tenure = yearsTillMaturity(girlsAge)
    const maturity = calculatePPF(yearlyInvestment, toDecimalRate(rate), tenure)

    expect(golden.expected.taxAmount).toBe(0)
    expect(golden.expected.postTaxAmount).toBe(golden.expected.maturityValue)
    expect(
      withinTolerance(Math.round(maturity), golden.expected.postTaxAmount, golden.expected.tolerance)
    ).toBe(true)
  })
})

describe('SSY schema validation', () => {
  it('SSY-20: girl child age 9 (below 10) is accepted', () => {
    const golden = getGolden('SSY-20')
    const { error, value } = ssySchema.validate(golden.inputs)

    expect(error).toBeUndefined()
    expect(value.girlsAge).toBe(9)
    expect(yearsTillMaturity(value.girlsAge)).toBe(golden.expected.yearsTillMaturity)
  })

  it('SSY-20: girl child age 10 is rejected', () => {
    const { error } = ssySchema.validate({
      yearlyInvestment: 10000,
      girlsAge: 10,
      startYear: 2026,
      rate: 8.2,
      stepUpEnabled: false,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/below 10 years/i)
  })

  it('SSY-21: yearly investment at ₹1,50,000 is accepted', () => {
    const golden = getGolden('SSY-21')
    const { error, value } = ssySchema.validate(golden.inputs)

    expect(error).toBeUndefined()
    expect(value.yearlyInvestment).toBe(150000)
  })

  it('SSY-08: yearly investment below minimum ₹250 is rejected', () => {
    const { error } = ssySchema.validate({
      yearlyInvestment: 249,
      girlsAge: 5,
      startYear: 2026,
      rate: 8.2,
      stepUpEnabled: false,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment is/i)
  })

  it('SSY-09: yearly investment above maximum ₹1.5L is rejected', () => {
    const { error } = ssySchema.validate({
      yearlyInvestment: 150001,
      girlsAge: 5,
      startYear: 2026,
      rate: 8.2,
      stepUpEnabled: false,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum investment is/i)
  })
})

describe('SSY adversarial inputs', () => {
  it('SSY-10: null yearly investment returns zero from calculatePPF', () => {
    expect(calculatePPF(null, 0.082, 16)).toBe(0)
  })

  it('SSY-11: negative yearly investment fails schema validation', () => {
    const { error } = ssySchema.validate({
      yearlyInvestment: -1000,
      girlsAge: 5,
      startYear: 2026,
      rate: 8.2,
      stepUpEnabled: false,
    })

    expect(error).toBeDefined()
  })

  it('SSY-21: maximum investment maturity matches golden', () => {
    const golden = getGolden('SSY-21')
    const { yearlyInvestment, girlsAge, rate } = golden.inputs
    const tenure = yearsTillMaturity(girlsAge)
    const maturity = calculatePPF(yearlyInvestment, toDecimalRate(rate), tenure)

    expect(
      withinTolerance(Math.round(maturity), golden.expected.maturityValue, golden.expected.tolerance)
    ).toBe(true)
  })
})
