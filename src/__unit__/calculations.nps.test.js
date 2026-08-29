/**
 * NPS Calculator — unit tests (calculateNPS*, schema, tax)
 * Golden source: tests/fixtures/golden/nps.json
 * Scenario IDs: NPS-03, NPS-08, NPS-13, NPS-14, NPS-20, NPS-21, NPS-22, NPS-24
 */

import { describe, it, expect } from 'vitest'
import {
  calculateNPSWeightedReturn,
  calculateNPSFutureValue,
  calculateNPSEvolution,
} from '@/utils/calculations'
import { npsSchema } from '@/components/calculators/NPSCalculator/npsSchema'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import goldenCases from '../../tests/fixtures/golden/nps.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const baseInputs = {
  tenure: 10,
  currentAge: 35,
  equityAllocation: 50,
  corporateBondsAllocation: 30,
  governmentBondsAllocation: 20,
  alternativeAllocation: 0,
  equityReturn: 12,
  corporateBondsReturn: 9,
  governmentBondsReturn: 8,
  alternativeReturn: 7,
  useAgeBasedCaps: false,
  withdrawalPercentage: 80,
}

const computeFromGolden = (row) => {
  const { inputs } = row
  const w = calculateNPSWeightedReturn(
    inputs.equityAllocation / 100,
    inputs.equityReturn / 100,
    inputs.corporateBondsAllocation / 100,
    inputs.corporateBondsReturn / 100,
    inputs.governmentBondsAllocation / 100,
    inputs.governmentBondsReturn / 100,
    (inputs.alternativeAllocation || 0) / 100,
    (inputs.alternativeReturn || 0) / 100
  )
  const fv = calculateNPSFutureValue(inputs.monthlyContribution, w, inputs.tenure)
  const invested = inputs.monthlyContribution * 12 * inputs.tenure
  return { w, fv, invested, returns: fv - invested }
}

describe('calculateNPS — golden fixtures', () => {
  it('NPS-14: golden calculation matches reference value (10 years, 10.3% weighted)', () => {
    const row = findGolden('NPS-14')
    const { w, fv, invested, returns } = computeFromGolden(row)

    expect(withinTolerance(w * 100, row.expected.weightedReturn, 0.1)).toBe(true)
    expect(withinTolerance(fv, row.expected.corpusValue, row.expected.tolerance)).toBe(true)
    expect(withinTolerance(invested, row.expected.totalInvested, 1)).toBe(true)
    expect(withinTolerance(returns, row.expected.returnsEarned, row.expected.tolerance)).toBe(true)
  })

  it('NPS-03: post-tax amount at 30% slab — 60% tax-free / 40% taxable', () => {
    const row = findGolden('NPS-03')
    const { fv, invested, returns } = computeFromGolden(row)

    const tax = calculateTaxOnWithdrawal(fv, 'nps', row.inputs.tenure, {
      incomeTaxSlab: row.inputs.incomeTaxSlab,
      principal: invested,
      returns,
    })

    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
    expect(tax.taxRateLabel).toBe(row.expected.taxRateLabel)
  })

  it('NPS-20: minimum ₹500/month with 100% allocation accepted', () => {
    const row = findGolden('NPS-20')
    const { fv } = computeFromGolden(row)

    expect(withinTolerance(fv, row.expected.corpusValue, row.expected.tolerance)).toBe(true)
  })

  it('NPS-21: weighted return reflects 40/35/20/5 allocation mix', () => {
    const row = findGolden('NPS-21')
    const { w, fv } = computeFromGolden(row)

    expect(withinTolerance(w * 100, row.expected.weightedReturn, 0.1)).toBe(true)
    expect(withinTolerance(fv, row.expected.corpusValue, row.expected.tolerance)).toBe(true)
  })

  it('NPS-22: 60% tax-free / 40% taxable split at 30% slab', () => {
    const row = findGolden('NPS-22')
    const { fv, invested, returns } = computeFromGolden(row)
    const { incomeTaxSlab } = row.inputs

    const tax = calculateTaxOnWithdrawal(fv, 'nps', row.inputs.tenure, {
      incomeTaxSlab,
      principal: invested,
      returns,
    })

    expect(withinTolerance(fv * 0.6, row.expected.taxFreePortion, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(fv * 0.4, row.expected.taxablePortion, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(tax.taxRule).toMatch(/60% tax-free/i)
  })

  it('NPS-24: negative weighted return does not produce NaN', () => {
    const row = findGolden('NPS-24')
    const { w, fv } = computeFromGolden(row)

    expect(Number.isFinite(fv)).toBe(true)
    expect(Number.isNaN(fv)).toBe(false)
    expect(withinTolerance(w * 100, row.expected.weightedReturn, 0.1)).toBe(true)
    expect(withinTolerance(fv, row.expected.corpusValue, row.expected.tolerance)).toBe(true)
  })

  it('NPS-13: extremely large monthly contribution handled without overflow', () => {
    const row = findGolden('NPS-13')
    const { fv } = computeFromGolden(row)

    expect(Number.isFinite(fv)).toBe(true)
    expect(withinTolerance(fv, row.expected.corpusValue, row.expected.tolerance)).toBe(true)
  })
})

describe('npsSchema — validation (NPS-08, NPS-09, NPS-11)', () => {
  it('NPS-08: monthly contribution below ₹500 fails validation', () => {
    const row = findGolden('NPS-08')
    const { error } = npsSchema.validate({
      ...baseInputs,
      monthlyContribution: row.inputs.monthlyContribution,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum contribution is/i)
  })

  it('NPS-09: allocation not summing to 100% fails validation', () => {
    const { error } = npsSchema.validate({
      ...baseInputs,
      monthlyContribution: 5000,
      equityAllocation: 50,
      corporateBondsAllocation: 30,
      governmentBondsAllocation: 15,
      alternativeAllocation: 0,
    })
    expect(error).toBeDefined()
    const msg = error.details[0].context?.message || error.details[0].message
    expect(msg).toMatch(/must equal 100%/i)
  })

  it('NPS-11: negative monthly contribution fails validation', () => {
    const { error } = npsSchema.validate({
      ...baseInputs,
      monthlyContribution: -1000,
    })
    expect(error).toBeDefined()
  })

  it('NPS-20: minimum ₹500 with valid allocation passes validation', () => {
    const row = findGolden('NPS-20')
    const { error } = npsSchema.validate({
      ...baseInputs,
      monthlyContribution: row.inputs.monthlyContribution,
    })
    expect(error).toBeUndefined()
  })
})

describe('calculateNPSEvolution — adversarial (NPS-06)', () => {
  it('NPS-06: evolution table has tenure year rows for default 25-year tenure', () => {
    const w = calculateNPSWeightedReturn(0.5, 0.12, 0.3, 0.09, 0.2, 0.08, 0, 0)
    const evolution = calculateNPSEvolution(5000, w, 25, 35, false, {
      equity: 0.5,
      corporateBonds: 0.3,
      governmentBonds: 0.2,
      alternative: 0,
    })
    expect(evolution).toHaveLength(25)
    expect(evolution[0].year).toBe(1)
    expect(evolution[24].year).toBe(25)
  })
})

describe('calculateNPS — adversarial null/NaN inputs', () => {
  it('returns 0 for zero monthly contribution', () => {
    expect(calculateNPSFutureValue(0, 0.103, 10)).toBe(0)
  })

  it('weighted return with zero allocation returns 0', () => {
    expect(
      calculateNPSWeightedReturn(0, 0.12, 0, 0.09, 0, 0.08, 0, 0.07)
    ).toBe(0)
  })
})
