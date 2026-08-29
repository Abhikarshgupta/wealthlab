/**
 * REITs Calculator — unit tests (TASK-W4-REIT T3)
 * Golden source: tests/fixtures/golden/reits.json
 * Scenario IDs: REIT-03, REIT-08, REIT-14, REIT-20, REIT-21-LTCG, REIT-21-STCG, REIT-13, REIT-BD-MIN
 */

import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { reitsSchema } from '@/components/calculators/REITsCalculator/reitsSchema'
import useREITsCalculator from '@/components/calculators/REITsCalculator/useREITsCalculator'
import { resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../tests/fixtures/golden/reits.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const calculateREITOutputs = ({
  investmentAmount,
  dividendYield,
  capitalAppreciation,
  tenure,
  incomeTaxSlab = 0.30,
}) => {
  const dividendRate = dividendYield / 100
  const appreciationRate = capitalAppreciation / 100
  let currentValue = investmentAmount
  let totalDividendIncome = 0

  for (let year = 1; year <= tenure; year++) {
    const annualDividend = currentValue * dividendRate
    totalDividendIncome += annualDividend
    const capitalGain = currentValue * appreciationRate
    currentValue = currentValue + capitalGain + annualDividend
  }

  const finalValue = currentValue
  const totalCapitalGain =
    investmentAmount * (Math.pow(1 + appreciationRate, tenure) - 1)
  const totalReturns = finalValue - investmentAmount

  const tax = calculateTaxOnWithdrawal(finalValue, 'reits', tenure, {
    incomeTaxSlab,
    principal: investmentAmount,
    returns: totalReturns,
  })

  return {
    finalValue: Math.round(finalValue * 100) / 100,
    totalDividendIncome: Math.round(totalDividendIncome * 100) / 100,
    totalCapitalGain: Math.round(totalCapitalGain * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    taxAmount: Math.round(tax.taxAmount * 100) / 100,
    postTaxAmount: Math.round(tax.postTaxCorpus * 100) / 100,
    taxRateLabel: tax.taxRateLabel,
  }
}

describe('REITs calculations — golden fixtures', () => {
  it('REIT-14: golden final value and post-tax amount match reference', () => {
    const row = findGolden('REIT-14')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure, incomeTaxSlab } =
      row.inputs
    const result = calculateREITOutputs({
      investmentAmount,
      dividendYield,
      capitalAppreciation,
      tenure,
      incomeTaxSlab,
    })

    expect(withinTolerance(result.finalValue, row.expected.finalValue, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(result.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
    expect(result.taxRateLabel).toBe(row.expected.taxRateLabel)
  })

  it('REIT-03: post-tax amount at 30% slab with LTCG on withdrawal', () => {
    const row = findGolden('REIT-03')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure, incomeTaxSlab } =
      row.inputs
    const result = calculateREITOutputs({
      investmentAmount,
      dividendYield,
      capitalAppreciation,
      tenure,
      incomeTaxSlab,
    })

    expect(withinTolerance(result.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(result.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('REIT-20: dividend income and capital appreciation tracked separately', () => {
    const row = findGolden('REIT-20')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs
    const result = calculateREITOutputs({
      investmentAmount,
      dividendYield,
      capitalAppreciation,
      tenure,
    })

    expect(
      withinTolerance(result.totalDividendIncome, row.expected.totalDividendIncome, row.expected.tolerance)
    ).toBe(true)
    expect(
      withinTolerance(result.totalCapitalGain, row.expected.totalCapitalGain, row.expected.tolerance)
    ).toBe(true)
    expect(withinTolerance(result.finalValue, row.expected.finalValue, row.expected.tolerance)).toBe(
      true
    )
  })

  it('REIT-21-LTCG: 12.5% tax above ₹1.25L exemption after 1+ year holding', () => {
    const row = findGolden('REIT-21-LTCG')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure, incomeTaxSlab } =
      row.inputs
    const result = calculateREITOutputs({
      investmentAmount,
      dividendYield,
      capitalAppreciation,
      tenure,
      incomeTaxSlab,
    })

    expect(withinTolerance(result.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(result.taxRateLabel).toBe(row.expected.taxRateLabel)
  })

  it('REIT-21-STCG: 20% on returns when tenure < 1 year', () => {
    const row = findGolden('REIT-21-STCG')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs

    const halfYearDividend = investmentAmount * (dividendYield / 100) * tenure
    const halfYearAppreciation = investmentAmount * (capitalAppreciation / 100) * tenure
    const finalValue = investmentAmount + halfYearDividend + halfYearAppreciation
    const totalReturns = finalValue - investmentAmount

    const tax = calculateTaxOnWithdrawal(finalValue, 'reits', tenure, {
      incomeTaxSlab: 0.30,
      principal: investmentAmount,
      returns: totalReturns,
    })

    expect(withinTolerance(finalValue, row.expected.finalValue, row.expected.tolerance)).toBe(true)
    expect(withinTolerance(tax.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(tax.postTaxCorpus, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
    expect(tax.taxRateLabel).toBe(row.expected.taxRateLabel)
  })

  it('REIT-13: large ₹1Cr investment for 10 years without overflow', () => {
    const row = findGolden('REIT-13')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs
    const result = calculateREITOutputs({
      investmentAmount,
      dividendYield,
      capitalAppreciation,
      tenure,
    })

    expect(withinTolerance(result.finalValue, row.expected.finalValue, row.expected.tolerance)).toBe(
      true
    )
    expect(
      withinTolerance(result.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
    ).toBe(true)
  })

  it('REIT-BD-MIN: minimum ₹1,000 investment at 1-year tenure', () => {
    const row = findGolden('REIT-BD-MIN')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs
    const result = calculateREITOutputs({
      investmentAmount,
      dividendYield,
      capitalAppreciation,
      tenure,
    })

    expect(withinTolerance(result.finalValue, row.expected.finalValue, row.expected.tolerance)).toBe(
      true
    )
    expect(withinTolerance(result.taxAmount, row.expected.taxAmount, row.expected.tolerance)).toBe(
      true
    )
  })
})

describe('REITs schema validation', () => {
  it('REIT-08: investment below ₹1,000 is rejected', () => {
    const row = findGolden('REIT-08')
    const { error } = reitsSchema.validate(row.inputs)

    expect(error).toBeDefined()
    expect(error.message).toContain('Minimum investment amount is ₹1,000')
  })

  it('REIT-09: tenure above 50 years is rejected', () => {
    const { error } = reitsSchema.validate({
      investmentAmount: 100000,
      dividendYield: 7,
      capitalAppreciation: 6,
      tenure: 51,
    })

    expect(error).toBeDefined()
    expect(error.message).toContain('Maximum tenure is 50 years')
  })

  it('REIT-BD-MIN: minimum ₹1,000 investment is accepted', () => {
    const row = findGolden('REIT-BD-MIN')
    const { error, value } = reitsSchema.validate(row.inputs)

    expect(error).toBeUndefined()
    expect(value.investmentAmount).toBe(1000)
  })
})

describe('useREITsCalculator hook — golden integration', () => {
  it('REIT-14: hook results match golden final value and post-tax amount', async () => {
    resetUserPreferences()
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const row = findGolden('REIT-14')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs

    const { result } = renderHook(() =>
      useREITsCalculator(investmentAmount, null, dividendYield, capitalAppreciation, tenure)
    )

    await waitFor(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.finalValue, row.expected.finalValue, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(tenure)
    })
  })

  it('REIT-20: hook tracks dividend and capital gain separately', async () => {
    resetUserPreferences()
    const row = findGolden('REIT-20')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs

    const { result } = renderHook(() =>
      useREITsCalculator(investmentAmount, null, dividendYield, capitalAppreciation, tenure)
    )

    await waitFor(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(
          result.current.totalDividendIncome,
          row.expected.totalDividendIncome,
          row.expected.tolerance
        )
      ).toBe(true)
      expect(
        withinTolerance(
          result.current.totalCapitalGain,
          row.expected.totalCapitalGain,
          row.expected.tolerance
        )
      ).toBe(true)
    })
  })

  it('REIT-21-LTCG: hook tax amount matches golden at 30% slab', async () => {
    resetUserPreferences()
    const row = findGolden('REIT-21-LTCG')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab, adjustInflation: false })
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs

    const { result } = renderHook(() =>
      useREITsCalculator(investmentAmount, null, dividendYield, capitalAppreciation, tenure)
    )

    await waitFor(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.taxAmount, row.expected.taxAmount, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.taxRateLabel).toBe(row.expected.taxRateLabel)
    })
  })
})

describe('REITs adversarial inputs', () => {
  it('returns null when investment is below minimum threshold', async () => {
    resetUserPreferences()
    const { result } = renderHook(() => useREITsCalculator(999, null, 7, 6, 5))

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('returns null when dividend yield is zero (falsy guard)', async () => {
    resetUserPreferences()
    const { result } = renderHook(() => useREITsCalculator(100000, null, 0, 6, 5))

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })
})
