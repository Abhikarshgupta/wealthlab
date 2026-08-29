/**
 * SCSS Calculator — unit tests (calculateSCSS formula, scssSchema, TDS)
 * Golden source: tests/fixtures/golden/scss.json
 * Scenario IDs: SCSS-03, SCSS-08, SCSS-14, SCSS-14-max, SCSS-20, SCSS-21, SCSS-22, SCSS-23
 */

import { describe, it, expect } from 'vitest'
import { scssSchema } from '@/components/calculators/SCSSCalculator/scssSchema'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import goldenCases from '../../tests/fixtures/golden/scss.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

/** Mirrors useSCSSCalculator.calculateSCSS — golden source of truth for formula */
const calculateSCSS = (principal, rate, years) => {
  if (!principal || rate == null || rate < 0.001 || !years) {
    return { maturityAmount: 0, totalInterest: 0, quarterlyInterest: 0 }
  }
  const quarterlyInterest = principal * (rate / 4)
  const numberOfQuarters = years * 4
  const totalInterest = quarterlyInterest * numberOfQuarters
  const maturityAmount = principal + totalInterest
  return {
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    quarterlyInterest: Math.round(quarterlyInterest * 100) / 100,
  }
}

/** Mirrors useSCSSCalculator.calculateSCSSEvolution */
const calculateSCSSEvolution = (principal, rate, years) => {
  const evolution = []
  let cumulativeInterest = 0

  for (let year = 1; year <= years; year++) {
    const quarterlyInterest = principal * (rate / 4)
    const yearInterest = quarterlyInterest * 4
    cumulativeInterest += yearInterest
    const closingBalance = principal + cumulativeInterest

    evolution.push({
      year,
      openingBalance: Math.round((year === 1 ? 0 : principal) * 100) / 100,
      investment: Math.round((year === 1 ? principal : 0) * 100) / 100,
      interest: Math.round(yearInterest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
  }

  return evolution
}

describe('calculateSCSS — golden fixtures', () => {
  it('SCSS-14: golden calculation matches reference value (5 years, 8.2%)', () => {
    const row = findGolden('SCSS-14')
    const { principal, rate, tenure } = row.inputs
    const result = calculateSCSS(principal, rate / 100, tenure)

    expect(
      withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(result.totalInterest, row.expected.totalInterest, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(result.quarterlyInterest, row.expected.quarterlyInterest, row.expected.tolerance)
    ).toBe(true)
  })

  it('SCSS-14-max: maximum ₹30L principal matches golden maturity', () => {
    const row = findGolden('SCSS-14-max')
    const { principal, rate, tenure } = row.inputs
    const result = calculateSCSS(principal, rate / 100, tenure)

    expect(
      withinTolerance(result.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(result.quarterlyInterest, row.expected.quarterlyInterest, row.expected.tolerance)
    ).toBe(true)
  })

  it('SCSS-03: post-tax amount at 30% slab on interest income', () => {
    const row = findGolden('SCSS-03')
    const { principal, rate, tenure, incomeTaxSlab } = row.inputs
    const { maturityAmount, totalInterest } = calculateSCSS(principal, rate / 100, tenure)

    const tax = calculateTaxOnWithdrawal(maturityAmount, 'scss', tenure, {
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
  })

  it('SCSS-22: quarterly interest payout — evolution sums to total interest', () => {
    const row = findGolden('SCSS-22')
    const { principal, rate, tenure } = row.inputs
    const result = calculateSCSS(principal, rate / 100, tenure)
    const evolution = calculateSCSSEvolution(principal, rate / 100, tenure)
    const interestSum = evolution.reduce((sum, entry) => sum + entry.interest, 0)

    expect(evolution).toHaveLength(row.expected.evolutionYearCount)
    expect(
      withinTolerance(result.quarterlyInterest, row.expected.quarterlyInterest, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(evolution[0].interest, row.expected.yearlyInterest, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(interestSum, row.expected.evolutionInterestSum, row.expected.tolerance)
    ).toBe(true)
  })

  it('SCSS-23: TDS applicable when annual interest exceeds ₹1,00,000 senior threshold', () => {
    const row = findGolden('SCSS-23')
    const { principal, rate, tenure, incomeTaxSlab } = row.inputs
    const { maturityAmount, totalInterest } = calculateSCSS(principal, rate / 100, tenure)
    const annualInterest = totalInterest / tenure

    expect(annualInterest).toBeGreaterThan(row.expected.tdsThreshold)

    const tax = calculateTaxOnWithdrawal(maturityAmount, 'scss', tenure, {
      incomeTaxSlab,
      principal,
      returns: totalInterest,
    })

    expect(tax.tdsInfo?.applicable).toBe(row.expected.tdsApplicable)
    expect(tax.tdsInfo?.tdsThreshold).toBe(row.expected.tdsThreshold)
    expect(
      withinTolerance(tax.tdsInfo?.totalTDS, row.expected.totalTDS, row.expected.tolerance)
    ).toBe(true)
  })
})

describe('scssSchema — validation (SCSS-08, SCSS-20, SCSS-21)', () => {
  it('SCSS-08: principal below ₹1,000 fails validation', () => {
    const row = findGolden('SCSS-08')
    const { error } = scssSchema.validate({
      principal: row.inputs.principal,
      tenure: 5,
      seniorsAge: 65,
      rate: 8.2,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment amount/i)
  })

  it('SCSS-20: age 59 rejected for non-defense personnel', () => {
    const row = findGolden('SCSS-20')
    const { error } = scssSchema.validate({
      principal: row.inputs.principal,
      tenure: row.inputs.tenure,
      seniorsAge: row.inputs.invalidAge,
      rate: row.inputs.rate,
      isDefensePersonnel: false,
    })
    expect(error).toBeDefined()
    expect(error.details.some((d) => d.message.includes('Minimum age is 60 years'))).toBe(true)
  })

  it('SCSS-20: age 60 accepted for standard senior citizen', () => {
    const row = findGolden('SCSS-20')
    const { error } = scssSchema.validate({
      principal: row.inputs.principal,
      tenure: row.inputs.tenure,
      seniorsAge: row.inputs.seniorsAge,
      rate: row.inputs.rate,
      isDefensePersonnel: false,
    })
    expect(error).toBeUndefined()
  })

  it('SCSS-20: age 55 accepted for retired defense personnel', () => {
    const { error } = scssSchema.validate({
      principal: 1000000,
      tenure: 5,
      seniorsAge: 55,
      rate: 8.2,
      isDefensePersonnel: true,
    })
    expect(error).toBeUndefined()
  })

  it('SCSS-21: maximum ₹30L principal passes validation', () => {
    const row = findGolden('SCSS-21')
    const { error } = scssSchema.validate({
      principal: row.inputs.principal,
      tenure: row.inputs.tenure,
      seniorsAge: row.inputs.seniorsAge,
      rate: row.inputs.rate,
    })
    expect(error).toBeUndefined()
  })

  it('SCSS-21: principal ₹30,00,001 fails validation', () => {
    const row = findGolden('SCSS-21')
    const { error } = scssSchema.validate({
      principal: row.inputs.invalidPrincipal,
      tenure: row.inputs.tenure,
      seniorsAge: row.inputs.seniorsAge,
      rate: row.inputs.rate,
    })
    expect(error).toBeDefined()
    expect(error.details.some((d) => d.message.includes('Maximum investment amount'))).toBe(true)
  })
})

describe('calculateSCSS — adversarial null/NaN inputs', () => {
  it('returns zero maturity for null principal', () => {
    const result = calculateSCSS(null, 0.082, 5)
    expect(result.maturityAmount).toBe(0)
  })

  it('returns zero maturity for zero tenure', () => {
    const result = calculateSCSS(1000000, 0.082, 0)
    expect(result.maturityAmount).toBe(0)
  })
})
