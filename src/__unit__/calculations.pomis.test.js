/**
 * POMIS Calculator — unit tests (calculatePOMIS, schema, evolution)
 * Golden source: tests/fixtures/golden/pomis.json
 * Scenario IDs: POMIS-03, POMIS-08, POMIS-14, POMIS-20, POMIS-21, POMIS-22-SINGLE, POMIS-22-JOINT, POMIS-13, POMIS-TDS
 */

import { describe, it, expect } from 'vitest'
import {
  calculatePOMIS,
  calculatePOMISEvolution,
} from '@/components/calculators/POMISCalculator/usePOMISCalculator'
import { pomisSchema } from '@/components/calculators/POMISCalculator/pomisSchema'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import goldenCases from '../../tests/fixtures/golden/pomis.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const TENURE = 5

describe('calculatePOMIS — golden fixtures', () => {
  it('POMIS-14: golden calculation matches reference value (5 years, 7.4%, monthly payout)', () => {
    const row = findGolden('POMIS-14')
    const { principal, rate } = row.inputs
    const result = calculatePOMIS(principal, rate / 100, TENURE)

    expect(withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(result.totalInterest, row.expected.totalInterest, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(result.monthlyInterest, row.expected.monthlyInterest, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(result.annualInterest, row.expected.annualInterest, row.expected.tolerance)
    ).toBe(true)
  })

  it('POMIS-03: post-tax amount at 30% slab on interest income', () => {
    const row = findGolden('POMIS-03')
    const { principal, rate, incomeTaxSlab } = row.inputs
    const { maturityAmount, totalInterest } = calculatePOMIS(principal, rate / 100, TENURE)

    const tax = calculateTaxOnWithdrawal(maturityAmount, 'pomis', TENURE, {
      incomeTaxSlab,
      principal,
      returns: totalInterest,
    })

    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
    expect(tax.taxRule).toContain('income slab')
  })

  it('POMIS-21: monthly interest payout for ₹5L @ 7.4%', () => {
    const row = findGolden('POMIS-21')
    const { principal, rate } = row.inputs
    const result = calculatePOMIS(principal, rate / 100, TENURE)

    expect(
      withinTolerance(result.monthlyInterest, row.expected.monthlyInterest, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(result.annualInterest, row.expected.annualInterest, row.expected.tolerance)
    ).toBe(true)
    expect(withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('POMIS-22-SINGLE: max single account investment ₹9 lakh', () => {
    const row = findGolden('POMIS-22-SINGLE')
    const { principal, rate } = row.inputs
    const result = calculatePOMIS(principal, rate / 100, TENURE)

    expect(principal).toBe(row.expected.maxPrincipal)
    expect(withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(result.monthlyInterest, row.expected.monthlyInterest, row.expected.tolerance)
    ).toBe(true)
  })

  it('POMIS-22-JOINT: max joint account investment ₹15 lakh', () => {
    const row = findGolden('POMIS-22-JOINT')
    const { principal, rate } = row.inputs
    const result = calculatePOMIS(principal, rate / 100, TENURE)

    expect(principal).toBe(row.expected.maxPrincipal)
    expect(withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(result.annualInterest, row.expected.annualInterest, row.expected.tolerance)
    ).toBe(true)
  })

  it('POMIS-20: minimum ₹1,000 at fixed 5-year tenure', () => {
    const row = findGolden('POMIS-20')
    const { principal, rate } = row.inputs
    const result = calculatePOMIS(principal, rate / 100, row.expected.tenureYears)

    expect(withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(result.monthlyInterest, row.expected.monthlyInterest, row.expected.tolerance)
    ).toBe(true)
  })

  it('POMIS-13: extremely large joint investment without overflow', () => {
    const row = findGolden('POMIS-13')
    const { principal, rate } = row.inputs
    const result = calculatePOMIS(principal, rate / 100, TENURE)

    expect(Number.isFinite(result.maturityAmount)).toBe(true)
    expect(withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('POMIS-TDS: annual interest exceeds ₹50,000 threshold', () => {
    const row = findGolden('POMIS-TDS')
    const { principal, rate } = row.inputs
    const result = calculatePOMIS(principal, rate / 100, TENURE)

    expect(
      withinTolerance(result.annualInterest, row.expected.annualInterest, row.expected.tolerance)
    ).toBe(true)
    expect(result.annualInterest).toBeGreaterThan(row.expected.tdsThreshold)
  })
})

describe('calculatePOMISEvolution — POMIS-06', () => {
  it('POMIS-06: evolution table has 5 year rows', () => {
    const row = findGolden('POMIS-14')
    const evolution = calculatePOMISEvolution(row.inputs.principal, row.inputs.rate / 100, TENURE)

    expect(evolution).toHaveLength(5)
    expect(evolution[0].year).toBe(1)
    expect(evolution[4].year).toBe(5)
  })
})

describe('pomisSchema — boundary validation (BD)', () => {
  it('POMIS-08: principal below ₹1,000 minimum rejected', () => {
    const row = findGolden('POMIS-08')
    const { error } = pomisSchema.validate(row.inputs)

    expect(error).toBeDefined()
    expect(error.details.some((d) => d.message.includes('Minimum investment amount'))).toBe(true)
  })
})

describe('calculatePOMIS — adversarial null/NaN inputs', () => {
  it('ADV-NULL-01: null principal returns safe zeros', () => {
    const result = calculatePOMIS(null, 0.074, 5)
    expect(result.maturityAmount).toBe(0)
  })

  it('ADV-UNDEF-01: undefined rate returns safe zeros', () => {
    const result = calculatePOMIS(100000, undefined, 5)
    expect(result.maturityAmount).toBe(0)
  })

  it('ADV-NAN-01: zero principal returns safe zeros', () => {
    const result = calculatePOMIS(0, 0.074, 5)
    expect(result.maturityAmount).toBe(0)
  })

  it('ADV-BOUNDARY-01: rate below 0.1% returns safe zeros', () => {
    const result = calculatePOMIS(100000, 0.0005, 5)
    expect(result.maturityAmount).toBe(0)
  })
})
