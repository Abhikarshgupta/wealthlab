/**
 * 54EC Bonds Calculator — unit tests (hook logic, schema, tax)
 * Golden source: tests/fixtures/golden/54ec.json
 * Scenario IDs: 54EC-03, 54EC-08, 54EC-09, 54EC-14, 54EC-20, 54EC-21, 54EC-22
 */

import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { calculateCompoundInterest } from '@/utils/calculations'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { bonds54ECSchema } from '@/components/calculators/54ECBondsCalculator/54ecBondsSchema'
import use54ECBondsCalculator from '@/components/calculators/54ECBondsCalculator/use54ECBondsCalculator'
import { resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../tests/fixtures/golden/54ec.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const TENURE = 5

const calculate54ECMaturity = (investmentAmount, ratePercent) => {
  const annualRate = ratePercent / 100
  return calculateCompoundInterest(investmentAmount, annualRate, TENURE, 1)
}

const calculate54ECTaxSaved = (investmentAmount, capitalGainAmount) => {
  const exempted = Math.min(
    investmentAmount,
    capitalGainAmount || investmentAmount,
    5000000
  )
  return exempted * 0.2
}

describe('54EC Bonds calculations — golden fixtures', () => {
  it('54EC-14: golden maturity and tax saved match reference value', () => {
    const row = findGolden('54EC-14')
    const { capitalGainAmount, investmentAmount, rate } = row.inputs
    const maturity = calculate54ECMaturity(investmentAmount, rate)
    const interest = maturity - investmentAmount
    const taxSaved = calculate54ECTaxSaved(investmentAmount, capitalGainAmount)

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(interest, row.expected.interestEarned, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(taxSaved, row.expected.taxSaved, row.expected.tolerance)).toBe(true)
  })

  it('54EC-03: post-tax amount at 30% slab on interest income only', () => {
    const row = findGolden('54EC-03')
    const { investmentAmount, rate, incomeTaxSlab } = row.inputs
    const maturity = calculate54ECMaturity(investmentAmount, rate)
    const interest = maturity - investmentAmount

    const tax = calculateTaxOnWithdrawal(maturity, 'bonds54EC', TENURE, {
      incomeTaxSlab,
      principal: investmentAmount,
      returns: interest,
    })

    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('54EC-20: minimum ₹1,000 investment at fixed 5-year tenure', () => {
    const row = findGolden('54EC-20')
    const { investmentAmount, rate } = row.inputs
    const maturity = calculate54ECMaturity(investmentAmount, rate)

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
  })

  it('54EC-21: capital gains exemption capped at ₹50L per FY', () => {
    const row = findGolden('54EC-21')
    const { capitalGainAmount, investmentAmount, rate } = row.inputs
    const maturity = calculate54ECMaturity(investmentAmount, rate)
    const exempted = Math.min(investmentAmount, capitalGainAmount, 5000000)
    const taxSaved = exempted * 0.2

    expect(withinTolerance(maturity, row.expected.maturityAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(exempted, row.expected.exemptedCapitalGain, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(taxSaved, row.expected.taxSaved, row.expected.tolerance)).toBe(true)
  })

  it('54EC-22: interest taxable at income slab — evolution spans 5 years', () => {
    const row = findGolden('54EC-22')
    const { investmentAmount, rate, incomeTaxSlab } = row.inputs
    const maturity = calculate54ECMaturity(investmentAmount, rate)
    const interest = maturity - investmentAmount

    const tax = calculateTaxOnWithdrawal(maturity, 'bonds54EC', TENURE, {
      incomeTaxSlab,
      principal: investmentAmount,
      returns: interest,
    })

    expect(withinTolerance(interest, row.expected.interestEarned, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
    expect(row.expected.evolutionYears).toBe(TENURE)
  })
})

describe('54EC Bonds schema validation', () => {
  it('54EC-08: investment below ₹1,000 is rejected', () => {
    const row = findGolden('54EC-08')
    const { error } = bonds54ECSchema.validate(row.inputs)

    expect(error).toBeDefined()
    expect(error.message).toContain('Minimum investment amount is ₹1,000')
  })

  it('54EC-09: investment exceeding capital gain is rejected', () => {
    const row = findGolden('54EC-09')
    const { error } = bonds54ECSchema.validate(row.inputs)

    expect(error).toBeDefined()
    expect(error.message).toContain('Investment amount cannot exceed capital gain amount')
  })

  it('54EC-20: minimum ₹1,000 investment is accepted', () => {
    const row = findGolden('54EC-20')
    const { capitalGainAmount, investmentAmount, rate } = row.inputs
    const { error, value } = bonds54ECSchema.validate({
      capitalGainAmount,
      investmentAmount,
      rate,
    })

    expect(error).toBeUndefined()
    expect(value.investmentAmount).toBe(1000)
  })
})

describe('use54ECBondsCalculator hook — golden integration', () => {
  it('54EC-14: hook results match golden maturity and tax saved', async () => {
    resetUserPreferences()
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const row = findGolden('54EC-14')
    const { capitalGainAmount, investmentAmount, rate } = row.inputs

    const { result } = renderHook(() =>
      use54ECBondsCalculator(capitalGainAmount, investmentAmount, rate)
    )

    await waitFor(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(result.current.taxSaved, row.expected.taxSaved, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(TENURE)
    })
  })

  it('54EC-03: hook post-tax amount matches golden at 30% slab', async () => {
    resetUserPreferences()
    const row = findGolden('54EC-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab, adjustInflation: false })
    const { capitalGainAmount, investmentAmount, rate } = row.inputs

    const { result } = renderHook(() =>
      use54ECBondsCalculator(capitalGainAmount, investmentAmount, rate)
    )

    await waitFor(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })
})

describe('54EC Bonds adversarial inputs', () => {
  it('returns null when investment is below minimum threshold', async () => {
    resetUserPreferences()
    const { result } = renderHook(() => use54ECBondsCalculator(1000000, 999, 5.75))

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('returns null when investment exceeds capital gain', async () => {
    resetUserPreferences()
    const { result } = renderHook(() => use54ECBondsCalculator(500000, 600000, 5.75))

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })
})
