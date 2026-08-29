/**
 * NSC Calculator — unit tests (calculateNSC, schema, evolution)
 * Golden source: tests/fixtures/golden/nsc.json
 * Scenario IDs: NSC-03, NSC-08, NSC-14, NSC-20, NSC-22, NSC-13
 */

import { describe, it, expect } from 'vitest'
import { calculateNSC, calculateNSCEvolution } from '@/utils/calculations'
import { nscSchema } from '@/components/calculators/NSCalculator/nscSchema'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import goldenCases from '../../tests/fixtures/golden/nsc.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('calculateNSC — golden fixtures', () => {
  it('NSC-14: golden calculation matches reference value (5 years, 7.7%)', () => {
    const row = findGolden('NSC-14')
    const { principal, rate, tenureYears } = row.inputs
    const maturity = calculateNSC(principal, rate / 100, tenureYears)

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(maturity - principal, row.expected.interestEarned, row.expected.tolerance)
    ).toBe(true)
  })

  it('NSC-03: post-tax amount at 30% slab on interest income', () => {
    const row = findGolden('NSC-03')
    const { principal, rate, tenureYears, incomeTaxSlab } = row.inputs
    const maturity = calculateNSC(principal, rate / 100, tenureYears)
    const interest = maturity - principal

    const tax = calculateTaxOnWithdrawal(maturity, 'nsc', tenureYears, {
      incomeTaxSlab,
      principal,
      returns: interest,
    })

    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('NSC-20: minimum ₹1,000 investment at fixed 5-year tenure', () => {
    const row = findGolden('NSC-20')
    const { principal, rate, tenureYears } = row.inputs
    const maturity = calculateNSC(principal, rate / 100, tenureYears)

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('NSC-22: interest paid at maturity — evolution sums to total interest', () => {
    const row = findGolden('NSC-22')
    const { principal, rate, tenureYears, incomeTaxSlab } = row.inputs
    const maturity = calculateNSC(principal, rate / 100, tenureYears)
    const interest = maturity - principal
    const evolution = calculateNSCEvolution(principal, rate / 100, tenureYears)
    const interestSum = evolution.reduce((sum, entry) => sum + entry.interest, 0)
    const year5 = evolution[evolution.length - 1]

    expect(evolution).toHaveLength(tenureYears)
    expect(withinTolerance(interestSum, row.expected.evolutionInterestSum, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(year5.closingBalance, row.expected.year5ClosingBalance, row.expected.tolerance)
    ).toBe(true)
    expect(withinTolerance(interest, row.expected.interestEarned, row.expected.tolerance)).toBe(
      true
    )

    const tax = calculateTaxOnWithdrawal(maturity, 'nsc', tenureYears, {
      incomeTaxSlab,
      principal,
      returns: interest,
    })
    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('NSC-13: extremely large principal handled without overflow', () => {
    const row = findGolden('NSC-13')
    const { principal, rate, tenureYears } = row.inputs
    const maturity = calculateNSC(principal, rate / 100, tenureYears)

    expect(Number.isFinite(maturity)).toBe(true)
    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })
})

describe('nscSchema — validation (NSC-08, NSC-11)', () => {
  it('NSC-08: principal below ₹1,000 fails validation', () => {
    const row = findGolden('NSC-08')
    const { error } = nscSchema.validate({ principal: row.inputs.principal, rate: 7.7 })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment amount/i)
  })

  it('NSC-11: negative principal fails validation', () => {
    const { error } = nscSchema.validate({ principal: -1000, rate: 7.7 })
    expect(error).toBeDefined()
  })

  it('NSC-20: minimum ₹1,000 passes validation', () => {
    const row = findGolden('NSC-20')
    const { error } = nscSchema.validate({ principal: row.inputs.principal, rate: row.inputs.rate })
    expect(error).toBeUndefined()
  })
})

describe('calculateNSCEvolution — adversarial (NSC-06)', () => {
  it('NSC-06: evolution table has 5 year rows for default tenure', () => {
    const row = findGolden('NSC-14')
    const evolution = calculateNSCEvolution(row.inputs.principal, row.inputs.rate / 100, 5)
    expect(evolution).toHaveLength(5)
    expect(evolution[0].year).toBe(1)
    expect(evolution[4].year).toBe(5)
  })
})

describe('calculateNSC — adversarial null/NaN inputs', () => {
  it('returns 0 for null principal (coerced by compound interest)', () => {
    expect(calculateNSC(null, 0.077, 5)).toBe(0)
  })

  it('returns 0 for zero principal', () => {
    expect(calculateNSC(0, 0.077, 5)).toBe(0)
  })
})
