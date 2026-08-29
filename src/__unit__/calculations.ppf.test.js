/**
 * PPF calculation unit tests — TASK-W1-PPF (T3)
 * Golden source: tests/fixtures/golden/ppf.json
 */

import { describe, it, expect } from 'vitest'
import {
  calculatePPF,
  calculatePPFWithStepUp,
  calculatePPFEvolution,
} from '@/utils/calculations'
import { ppfSchema } from '@/components/calculators/PPFCalculator/ppfSchema'
import goldenCases from '../../tests/fixtures/golden/ppf.json'

const getGolden = (id) => {
  const row = goldenCases.find((c) => c.id === id)
  if (!row) throw new Error(`Golden case ${id} not found`)
  return row
}

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const toDecimalRate = (percent) => percent / 100

describe('PPF calculations (golden)', () => {
  it('PPF-14: standard contribution matches golden maturity', () => {
    const golden = getGolden('PPF-14')
    const { yearlyInvestment, tenure, rate } = golden.inputs
    const maturity = calculatePPF(
      yearlyInvestment,
      toDecimalRate(rate),
      tenure
    )

    expect(
      withinTolerance(
        Math.round(maturity),
        golden.expected.maturityValue,
        golden.expected.tolerance
      )
    ).toBe(true)
  })

  it('PPF-14-max: maximum annual contribution matches golden maturity', () => {
    const golden = getGolden('PPF-14-max')
    const { yearlyInvestment, tenure, rate } = golden.inputs
    const maturity = calculatePPF(
      yearlyInvestment,
      toDecimalRate(rate),
      tenure
    )

    expect(
      withinTolerance(
        Math.round(maturity),
        golden.expected.maturityValue,
        golden.expected.tolerance
      )
    ).toBe(true)
  })

  it('PPF-22: step-up maturity exceeds flat baseline', () => {
    const golden = getGolden('PPF-22')
    const { yearlyInvestment, tenure, rate, stepUpPercentage } = golden.inputs
    const stepUp = calculatePPFWithStepUp(
      yearlyInvestment,
      toDecimalRate(stepUpPercentage),
      toDecimalRate(rate),
      tenure
    )
    const flat = calculatePPF(yearlyInvestment, toDecimalRate(rate), tenure)

    expect(
      withinTolerance(
        Math.round(stepUp),
        golden.expected.maturityValue,
        golden.expected.tolerance
      )
    ).toBe(true)
    expect(stepUp).toBeGreaterThan(flat)
    expect(stepUp).toBeGreaterThan(golden.expected.flatMaturityBaseline)
  })

  it('PPF-24: EEE — post-tax equals nominal maturity (no tax applied in calc)', () => {
    const golden = getGolden('PPF-24')
    const { yearlyInvestment, tenure, rate } = golden.inputs
    const maturity = calculatePPF(
      yearlyInvestment,
      toDecimalRate(rate),
      tenure
    )

    expect(golden.expected.taxAmount).toBe(0)
    expect(golden.expected.postTaxAmount).toBe(golden.expected.maturityValue)
    expect(
      withinTolerance(
        Math.round(maturity),
        golden.expected.postTaxAmount,
        golden.expected.tolerance
      )
    ).toBe(true)
  })
})

describe('PPF schema validation', () => {
  it('PPF-20: yearly investment at ₹1,50,000 is accepted', () => {
    const golden = getGolden('PPF-20')
    const { error, value } = ppfSchema.validate(golden.inputs)

    expect(error).toBeUndefined()
    expect(value.yearlyInvestment).toBe(150000)
  })

  it('PPF-21: yearly investment at ₹500 is accepted', () => {
    const golden = getGolden('PPF-21')
    const { error, value } = ppfSchema.validate(golden.inputs)

    expect(error).toBeUndefined()
    expect(value.yearlyInvestment).toBe(500)
  })

  it('PPF-08: yearly investment below minimum ₹500 is rejected', () => {
    const { error } = ppfSchema.validate({
      yearlyInvestment: 499,
      tenure: 15,
      rate: 7.1,
      stepUpEnabled: false,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment is/i)
  })

  it('PPF-09: yearly investment above maximum ₹1.5L is rejected', () => {
    const { error } = ppfSchema.validate({
      yearlyInvestment: 150001,
      tenure: 15,
      rate: 7.1,
      stepUpEnabled: false,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum investment is/i)
  })
})

describe('PPF adversarial inputs (DS-6)', () => {
  it('PPF-10: null yearly investment returns zero from calculatePPF', () => {
    expect(calculatePPF(null, 0.071, 15)).toBe(0)
  })

  it('PPF-10: undefined rate returns zero from calculatePPF', () => {
    expect(calculatePPF(10000, undefined, 15)).toBe(0)
  })

  it('PPF-11: negative yearly investment fails schema validation', () => {
    const { error } = ppfSchema.validate({
      yearlyInvestment: -1000,
      tenure: 15,
      rate: 7.1,
      stepUpEnabled: false,
    })

    expect(error).toBeDefined()
  })

  it('PPF-13: evolution handles 15-year tenure without empty rows', () => {
    const evolution = calculatePPFEvolution(10000, 0.071, 15)

    expect(evolution).toHaveLength(15)
    expect(evolution[14].closingBalance).toBeGreaterThan(0)
  })
})
