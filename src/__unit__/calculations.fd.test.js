/**
 * FD Calculator — unit tests (calculateFD, schema, tenure utils)
 * Golden source: tests/fixtures/golden/fd.json
 * Scenario IDs: FD-08, FD-10, FD-14, FD-20, FD-21, FD-22, FD-23, FD-03
 */

import { describe, it, expect } from 'vitest'
import { calculateFD } from '@/utils/calculations'
import { fdSchema } from '@/components/calculators/FDCalculator/fdSchema'
import {
  convertLegacyToYearsMonths,
  convertYearsMonthsToYears,
  validateYearsMonths,
} from '@/utils/fdTenureUtils'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import goldenCases from '../../tests/fixtures/golden/fd.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('calculateFD — golden fixtures', () => {
  it('FD-14: golden calculation matches reference value (quarterly, 5 years)', () => {
    const row = findGolden('FD-14')
    const { principal, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const maturity = calculateFD(principal, rate / 100, years, compoundingFrequency)

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(maturity - principal, row.expected.interestEarned, row.expected.tolerance)
    ).toBe(true)
  })

  it('FD-20: years + months tenure (1 year 3 months)', () => {
    const row = findGolden('FD-20')
    const { principal, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)

    expect(years).toBeCloseTo(1.25, 5)

    const maturity = calculateFD(principal, rate / 100, years, compoundingFrequency)
    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('FD-21: legacy tenure format converts to equivalent maturity', () => {
    const row = findGolden('FD-21')
    const legacy = convertLegacyToYearsMonths(row.inputs.tenure, row.inputs.tenureUnit)

    expect(legacy.years).toBe(row.inputs.tenureYears)
    expect(legacy.months).toBe(row.inputs.tenureMonths)

    const years = convertYearsMonthsToYears(legacy.years, legacy.months)
    const maturity = calculateFD(
      row.inputs.principal,
      row.inputs.rate / 100,
      years,
      row.inputs.compoundingFrequency
    )

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('FD-22: compounding frequencies produce distinct maturity amounts', () => {
    const row = findGolden('FD-22')
    const { principal, tenureYears, tenureMonths, rate } = row.inputs
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const annualRate = rate / 100
    const tolerance = row.expected.tolerance

    const quarterly = calculateFD(principal, annualRate, years, 'quarterly')
    const monthly = calculateFD(principal, annualRate, years, 'monthly')
    const annually = calculateFD(principal, annualRate, years, 'annually')
    const cumulative = calculateFD(principal, annualRate, years, 'cumulative')

    expect(withinTolerance(monthly, row.expected.maturityAmount, tolerance)).toBe(true)
    expect(withinTolerance(quarterly, row.expected.maturityQuarterly, tolerance)).toBe(true)
    expect(withinTolerance(annually, row.expected.maturityAnnually, tolerance)).toBe(true)
    expect(withinTolerance(cumulative, row.expected.maturityCumulative, tolerance)).toBe(true)
    expect(monthly).toBeGreaterThan(quarterly)
    expect(quarterly).toBeGreaterThan(annually)
  })

  it('FD-03: post-tax amount at 30% slab on interest income', () => {
    const row = findGolden('FD-03')
    const { principal, tenureYears, tenureMonths, rate, compoundingFrequency, incomeTaxSlab } =
      row.inputs
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const maturity = calculateFD(principal, rate / 100, years, compoundingFrequency)
    const interest = maturity - principal

    const tax = calculateTaxOnWithdrawal(maturity, 'fd', years, {
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

  it('FD-23: TDS applicable when annual interest exceeds ₹50,000', () => {
    const row = findGolden('FD-23')
    const { principal, tenureYears, tenureMonths, rate, compoundingFrequency, incomeTaxSlab } =
      row.inputs
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const maturity = calculateFD(principal, rate / 100, years, compoundingFrequency)
    const interest = maturity - principal

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )

    const annualInterest = interest / years
    expect(annualInterest).toBeGreaterThan(row.expected.tdsThreshold)

    const tax = calculateTaxOnWithdrawal(maturity, 'fd', years, {
      incomeTaxSlab,
      principal,
      returns: interest,
    })

    expect(tax.tdsInfo?.applicable).toBe(row.expected.tdsApplicable)
    expect(tax.tdsInfo?.tdsThreshold).toBe(row.expected.tdsThreshold)
  })
})

describe('fdSchema — boundary validation (BD)', () => {
  it('FD-08: principal below ₹1,000 minimum rejected', () => {
    const row = findGolden('FD-08')
    const { error } = fdSchema.validate(row.inputs)

    expect(error).toBeDefined()
    expect(error.details.some((d) => d.message.includes('Minimum principal amount'))).toBe(true)
  })

  it('FD-10: zero years and zero months rejected', () => {
    const row = findGolden('FD-10')
    const validation = validateYearsMonths(row.inputs.tenureYears, row.inputs.tenureMonths)

    expect(validation.isValid).toBe(false)
    expect(validation.error).toBe(row.expected.validationError)
  })
})

describe('calculateFD — adversarial (DS-6)', () => {
  it('ADV-NULL-01: null principal returns safe default 0', () => {
    expect(calculateFD(null, 0.07, 5, 'quarterly')).toBe(0)
  })

  it('ADV-UNDEF-01: undefined rate returns safe default 0', () => {
    expect(calculateFD(100000, undefined, 5, 'quarterly')).toBe(0)
  })

  it('ADV-NAN-01: negative principal returns 0', () => {
    expect(calculateFD(-100000, 0.07, 5, 'quarterly')).toBe(0)
  })

  it('ADV-BOUNDARY-01: zero rate returns 0 due to compound-interest guard', () => {
    expect(calculateFD(100000, 0, 5, 'quarterly')).toBe(0)
  })

  it('ADV-BOUNDARY-02: cumulative simple interest for tenure under 1 year', () => {
    const maturity = calculateFD(100000, 0.07, 0.5, 'cumulative')
    expect(maturity).toBeCloseTo(103500, 0)
  })
})
