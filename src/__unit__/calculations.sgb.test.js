/**
 * SGB Calculator — unit tests (calculateSGB, sgbSchema, tax)
 * Golden source: tests/fixtures/golden/sgb.json
 * Scenario IDs: SGB-08, SGB-09, SGB-14, SGB-14-5y, SGB-20, SGB-21, SGB-23, SGB-26
 */

import { describe, it, expect } from 'vitest'
import { calculateSGB, calculateSGBEvolution } from '@/utils/calculations'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { sgbSchema } from '@/components/calculators/SGBCalculator/sgbSchema'
import { FALLBACK_GOLD_PRICE_PER_GRAM } from '@/utils/goldPriceService'
import goldenCases from '../../tests/fixtures/golden/sgb.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const computeSGB = (row) => {
  const { goldAmount, tenure, goldAppreciationRate, goldPricePerGram } = row.inputs
  const principal = goldAmount * goldPricePerGram
  const goldRate = goldAppreciationRate / 100
  const maturityAmount = calculateSGB(principal, goldRate, tenure)
  const goldAppreciatedValue = principal * Math.pow(1 + goldRate, tenure)
  const fixedInterestAmount = principal * (Math.pow(1 + 0.025 / 2, tenure * 2) - 1)
  return {
    principal,
    maturityAmount,
    goldAppreciatedValue,
    fixedInterestAmount,
    totalReturns: maturityAmount - principal,
  }
}

describe('calculateSGB — golden fixtures', () => {
  it('SGB-14: standard 8-year tenure matches golden maturity', () => {
    const row = findGolden('SGB-14')
    const result = computeSGB(row)

    expect(
      withinTolerance(Math.round(result.maturityAmount), row.expected.maturityAmount, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(Math.round(result.goldAppreciatedValue), row.expected.goldAppreciatedValue, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(Math.round(result.fixedInterestAmount), row.expected.fixedInterestAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('SGB-14-5y: 5-year exit option matches golden maturity', () => {
    const row = findGolden('SGB-14-5y')
    const result = computeSGB(row)

    expect(
      withinTolerance(Math.round(result.maturityAmount), row.expected.maturityAmount, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(Math.round(result.fixedInterestAmount), row.expected.fixedInterestAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('SGB-20: 2.5% semi-annual fixed interest component matches golden', () => {
    const row = findGolden('SGB-20')
    const result = computeSGB(row)

    expect(
      withinTolerance(Math.round(result.fixedInterestAmount), row.expected.fixedInterestAmount, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(Math.round(result.maturityAmount), row.expected.maturityAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('SGB-21: user-adjustable 12% gold appreciation matches golden', () => {
    const row = findGolden('SGB-21')
    const result = computeSGB(row)

    expect(
      withinTolerance(Math.round(result.maturityAmount), row.expected.maturityAmount, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(Math.round(result.goldAppreciatedValue), row.expected.goldAppreciatedValue, row.expected.tolerance)
    ).toBe(true)
  })

  it('SGB-23: fallback gold price produces expected maturity', () => {
    const row = findGolden('SGB-23')
    expect(row.inputs.goldPricePerGram).toBe(FALLBACK_GOLD_PRICE_PER_GRAM)
    const result = computeSGB(row)

    expect(
      withinTolerance(Math.round(result.maturityAmount), row.expected.maturityAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('SGB-26: capital gains exempt at maturity — zero tax at 30% slab', () => {
    const row = findGolden('SGB-26')
    const result = computeSGB(row)
    const { incomeTaxSlab } = row.inputs

    const tax = calculateTaxOnWithdrawal(
      Math.round(result.maturityAmount),
      'sgb',
      row.inputs.tenure,
      {
        incomeTaxSlab,
        principal: result.principal,
        returns: result.totalReturns,
      }
    )

    expect(tax.taxAmount).toBe(row.expected.taxAmount)
    expect(tax.postTaxCorpus).toBe(Math.round(result.maturityAmount))
    expect(tax.taxRateLabel).toBe(row.expected.taxRateLabel)
  })
})

describe('calculateSGBEvolution', () => {
  it('SGB-14: evolution spans 8 years with closing balance growth', () => {
    const row = findGolden('SGB-14')
    const { goldAmount, tenure, goldAppreciationRate, goldPricePerGram } = row.inputs
    const principal = goldAmount * goldPricePerGram
    const evolution = calculateSGBEvolution(principal, goldAppreciationRate / 100, tenure)

    expect(evolution).toHaveLength(8)
    expect(evolution[0].year).toBe(1)
    expect(evolution[7].closingBalance).toBeGreaterThan(principal)
  })
})

describe('sgbSchema validation', () => {
  it('SGB-08: gold amount below 1 gram is rejected', () => {
    const { error } = sgbSchema.validate({
      goldAmount: 0,
      tenure: 8,
      goldAppreciationRate: 8,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum gold amount is/i)
  })

  it('SGB-09: gold amount above 1000 grams is rejected', () => {
    const { error } = sgbSchema.validate({
      goldAmount: 1001,
      tenure: 8,
      goldAppreciationRate: 8,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum gold amount is/i)
  })

  it('SGB-11: negative gold amount fails schema validation', () => {
    const { error } = sgbSchema.validate({
      goldAmount: -5,
      tenure: 8,
      goldAppreciationRate: 8,
    })

    expect(error).toBeDefined()
  })

  it('SGB-20: minimum gold appreciation rate 0.1% is accepted', () => {
    const golden = findGolden('SGB-20')
    const { error, value } = sgbSchema.validate({
      goldAmount: golden.inputs.goldAmount,
      tenure: golden.inputs.tenure,
      goldAppreciationRate: golden.inputs.goldAppreciationRate,
    })

    expect(error).toBeUndefined()
    expect(value.goldAppreciationRate).toBe(0.1)
  })

  it('SGB-21: tenure must be 5 or 8 years', () => {
    const { error } = sgbSchema.validate({
      goldAmount: 10,
      tenure: 6,
      goldAppreciationRate: 8,
    })

    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/tenure must be either 5 or 8/i)
  })
})

describe('SGB adversarial inputs', () => {
  it('SGB-10: null principal returns zero from calculateSGB', () => {
    expect(calculateSGB(null, 0.08, 8)).toBe(0)
  })

  it('SGB-10: zero years returns zero from calculateSGB', () => {
    expect(calculateSGB(65000, 0.08, 0)).toBe(0)
  })
})
