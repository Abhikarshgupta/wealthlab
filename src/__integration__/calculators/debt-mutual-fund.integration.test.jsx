/**
 * Debt Mutual Fund Calculator integration tests — TASK-W4-DMF (T3)
 * Hook + DOM layers; golden source: tests/fixtures/golden/debt-mutual-fund.json
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import DebtMutualFundCalculator from '@/components/calculators/DebtMutualFundCalculator/DebtMutualFundCalculator'
import useDebtMutualFundCalculator from '@/components/calculators/DebtMutualFundCalculator/useDebtMutualFundCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../tests/fixtures/golden/debt-mutual-fund.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('Debt MF Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('DMF-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ investmentType, amount, tenure, fundType, expectedReturn, stepUpEnabled, stepUpPercentage }) =>
        useDebtMutualFundCalculator(
          investmentType,
          amount,
          tenure,
          fundType,
          expectedReturn,
          stepUpEnabled,
          stepUpPercentage
        ),
      {
        initialProps: {
          investmentType: 'sip',
          amount: 5000,
          tenure: 5,
          fundType: 'shortTerm',
          expectedReturn: 7.5,
          stepUpEnabled: false,
          stepUpPercentage: 0,
        },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.corpusValue).toBeGreaterThan(300000)
    })

    rerender({
      investmentType: 'sip',
      amount: 10000,
      tenure: 5,
      fundType: 'shortTerm',
      expectedReturn: 7.5,
      stepUpEnabled: false,
      stepUpPercentage: 0,
    })

    await waitForHook(() => {
      expect(result.current.totalInvested).toBe(600000)
      expect(result.current.corpusValue).toBeGreaterThan(600000)
    })
  })

  it('DMF-03: hook post-tax amount matches golden fixture', async () => {
    const row = findGolden('DMF-14')
    const {
      investmentType,
      amount,
      tenure,
      fundType,
      expectedReturn,
      stepUpEnabled,
      stepUpPercentage,
    } = row.inputs

    const { result } = renderHook(() =>
      useDebtMutualFundCalculator(
        investmentType,
        amount,
        tenure,
        fundType,
        expectedReturn,
        stepUpEnabled,
        stepUpPercentage
      )
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<DebtMutualFundCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('DMF-14: golden corpus matches reference via hook', async () => {
    const row = findGolden('DMF-14')
    const {
      investmentType,
      amount,
      tenure,
      fundType,
      expectedReturn,
      stepUpEnabled,
      stepUpPercentage,
    } = row.inputs

    const { result } = renderHook(() =>
      useDebtMutualFundCalculator(
        investmentType,
        amount,
        tenure,
        fundType,
        expectedReturn,
        stepUpEnabled,
        stepUpPercentage
      )
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('DMF-20: indexation LTCG tax matches golden via hook', async () => {
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const row = findGolden('DMF-20')
    const {
      investmentType,
      amount,
      tenure,
      fundType,
      expectedReturn,
      stepUpEnabled,
      stepUpPercentage,
    } = row.inputs

    const { result } = renderHook(() =>
      useDebtMutualFundCalculator(
        investmentType,
        amount,
        tenure,
        fundType,
        expectedReturn,
        stepUpEnabled,
        stepUpPercentage
      )
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('20% LTCG (Indexed)')
      expect(
        withinTolerance(result.current.taxAmount, row.expected.taxAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('DMF-21-STCG: tenure 2 years applies income slab via hook', async () => {
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const row = findGolden('DMF-21-STCG')
    const {
      investmentType,
      amount,
      tenure,
      fundType,
      expectedReturn,
      stepUpEnabled,
      stepUpPercentage,
    } = row.inputs

    const { result } = renderHook(() =>
      useDebtMutualFundCalculator(
        investmentType,
        amount,
        tenure,
        fundType,
        expectedReturn,
        stepUpEnabled,
        stepUpPercentage
      )
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('30% slab')
      expect(
        withinTolerance(result.current.taxAmount, row.expected.taxAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('DMF-21-LTCG: tenure exactly 3 years uses indexed LTCG via hook', async () => {
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const row = findGolden('DMF-21-LTCG')
    const {
      investmentType,
      amount,
      tenure,
      fundType,
      expectedReturn,
      stepUpEnabled,
      stepUpPercentage,
    } = row.inputs

    const { result } = renderHook(() =>
      useDebtMutualFundCalculator(
        investmentType,
        amount,
        tenure,
        fundType,
        expectedReturn,
        stepUpEnabled,
        stepUpPercentage
      )
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('20% LTCG (Indexed)')
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })
})
