/**
 * RD Calculator — unit tests (calculateRD, rdSchema, tenure utils)
 * Golden source: tests/fixtures/golden/rd.json
 * Scenario IDs: RD-08, RD-10, RD-14, RD-03, RD-20, RD-21, RD-22, RD-CMP, RD-13
 */

import { describe, it, expect } from 'vitest'
import { calculateRD } from '@/utils/calculations'
import { rdSchema } from '@/components/calculators/RDCalculator/rdSchema'
import {
  convertYearsMonthsToYears,
  convertYearsMonthsToMonths,
  validateYearsMonths,
} from '@/utils/fdTenureUtils'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import goldenCases from '../../tests/fixtures/golden/rd.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('calculateRD — golden fixtures', () => {
  it('RD-14: golden calculation matches reference value (quarterly, 5 years)', () => {
    const row = findGolden('RD-14')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    const maturity = calculateRD(monthlyDeposit, rate / 100, totalMonths, compoundingFrequency)

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(
        maturity - row.expected.totalInvestment,
        row.expected.interestEarned,
        row.expected.tolerance
      )
    ).toBe(true)
  })

  it('RD-20: minimum ₹500/month deposit for 1 year', () => {
    const row = findGolden('RD-20')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    const maturity = calculateRD(monthlyDeposit, rate / 100, totalMonths, compoundingFrequency)

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(monthlyDeposit).toBe(500)
  })

  it('RD-21: years + months tenure (1 year 3 months)', () => {
    const row = findGolden('RD-21')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)

    expect(totalMonths).toBe(15)

    const maturity = calculateRD(monthlyDeposit, rate / 100, totalMonths, compoundingFrequency)
    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('RD-CMP: compounding frequencies produce distinct maturity amounts', () => {
    const row = findGolden('RD-CMP')
    const { monthlyDeposit, tenureYears, tenureMonths, rate } = row.inputs
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    const annualRate = rate / 100
    const tolerance = row.expected.tolerance

    const quarterly = calculateRD(monthlyDeposit, annualRate, totalMonths, 'quarterly')
    const monthly = calculateRD(monthlyDeposit, annualRate, totalMonths, 'monthly')
    const annually = calculateRD(monthlyDeposit, annualRate, totalMonths, 'annually')
    const cumulative = calculateRD(monthlyDeposit, annualRate, totalMonths, 'cumulative')

    expect(withinTolerance(monthly, row.expected.maturityAmount, tolerance)).toBe(true)
    expect(withinTolerance(quarterly, row.expected.maturityQuarterly, tolerance)).toBe(true)
    expect(withinTolerance(annually, row.expected.maturityAnnually, tolerance)).toBe(true)
    expect(withinTolerance(cumulative, row.expected.maturityCumulative, tolerance)).toBe(true)
    expect(monthly).toBeGreaterThan(quarterly)
    expect(quarterly).toBeGreaterThan(annually)
  })

  it('RD-03: post-tax amount at 30% slab on interest income', () => {
    const row = findGolden('RD-03')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency, incomeTaxSlab } =
      row.inputs
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    const maturity = calculateRD(monthlyDeposit, rate / 100, totalMonths, compoundingFrequency)
    const totalInvestment = monthlyDeposit * totalMonths
    const interest = maturity - totalInvestment

    const tax = calculateTaxOnWithdrawal(maturity, 'rd', years, {
      incomeTaxSlab,
      principal: totalInvestment,
      returns: interest,
    })

    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
    expect(tax.taxRule).toBe(row.expected.taxRule)
  })

  it('RD-22: interest taxed per income slab at 30%', () => {
    const row = findGolden('RD-22')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency, incomeTaxSlab } =
      row.inputs
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    const maturity = calculateRD(monthlyDeposit, rate / 100, totalMonths, compoundingFrequency)
    const totalInvestment = monthlyDeposit * totalMonths
    const interest = maturity - totalInvestment

    const tax = calculateTaxOnWithdrawal(maturity, 'rd', years, {
      incomeTaxSlab,
      principal: totalInvestment,
      returns: interest,
    })

    expect(withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(tax.taxRule).toBe(row.expected.taxRule)
  })

  it('RD-13: extremely large monthly deposit handled without overflow', () => {
    const row = findGolden('RD-13')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    const maturity = calculateRD(monthlyDeposit, rate / 100, totalMonths, compoundingFrequency)

    expect(Number.isFinite(maturity)).toBe(true)
    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })
})

describe('rdSchema — boundary validation (BD)', () => {
  it('RD-08: monthly deposit below ₹500 minimum rejected', () => {
    const row = findGolden('RD-08')
    const { error } = rdSchema.validate(row.inputs)

    expect(error).toBeDefined()
    expect(error.details.some((d) => d.message.includes('Minimum monthly deposit'))).toBe(true)
  })

  it('RD-10: zero years and zero months rejected', () => {
    const row = findGolden('RD-10')
    const validation = validateYearsMonths(row.inputs.tenureYears, row.inputs.tenureMonths)

    expect(validation.isValid).toBe(false)
    expect(validation.error).toBe(row.expected.validationError)
  })
})

describe('calculateRD — adversarial (DS-6)', () => {
  it('ADV-NULL-01: null monthly deposit returns safe default 0', () => {
    expect(calculateRD(null, 0.07, 60, 'quarterly')).toBe(0)
  })

  it('ADV-UNDEF-01: undefined rate returns safe default 0', () => {
    expect(calculateRD(5000, undefined, 60, 'quarterly')).toBe(0)
  })

  it('ADV-NAN-01: negative monthly deposit returns 0', () => {
    expect(calculateRD(-5000, 0.07, 60, 'quarterly')).toBe(0)
  })

  it('ADV-BOUNDARY-01: zero rate returns simple sum of deposits', () => {
    expect(calculateRD(5000, 0, 12, 'quarterly')).toBe(60000)
  })

  it('ADV-BOUNDARY-02: zero months returns 0', () => {
    expect(calculateRD(5000, 0.07, 0, 'quarterly')).toBe(0)
  })
})
