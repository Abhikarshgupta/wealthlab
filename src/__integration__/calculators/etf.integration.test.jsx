/**
 * ETF Calculator — integration tests (TASK-W4-ETF T3)
 * Hook + DOM layers; golden IDs from tests/fixtures/golden/etf.json
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import ETFCalculator from '@/components/calculators/ETFCalculator/ETFCalculator'
import useETFCalculator from '@/components/calculators/ETFCalculator/useETFCalculator'
import { renderWithProviders, resetUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../tests/fixtures/golden/etf.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const hookArgsFromGolden = (row) => {
  const {
    investmentType,
    amount,
    etfType,
    tenure,
    expectedCAGR,
    expenseRatio,
    stepUpEnabled,
    stepUpPercentage,
  } = row.inputs
  return [
    investmentType,
    amount,
    etfType,
    tenure,
    expectedCAGR,
    expenseRatio,
    stepUpEnabled ?? false,
    stepUpPercentage ?? 0,
  ]
}

describe('ETF Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('ETF-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({
        investmentType,
        amount,
        etfType,
        tenure,
        expectedCAGR,
        expenseRatio,
        stepUpEnabled,
        stepUpPercentage,
      }) =>
        useETFCalculator(
          investmentType,
          amount,
          etfType,
          tenure,
          expectedCAGR,
          expenseRatio,
          stepUpEnabled,
          stepUpPercentage
        ),
      {
        initialProps: {
          investmentType: 'sip',
          amount: 5000,
          etfType: 'equity',
          tenure: 5,
          expectedCAGR: 12,
          expenseRatio: 0.2,
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
      etfType: 'equity',
      tenure: 5,
      expectedCAGR: 12,
      expenseRatio: 0.2,
      stepUpEnabled: false,
      stepUpPercentage: 0,
    })

    await waitForHook(() => {
      expect(result.current.totalInvested).toBe(600000)
      expect(result.current.corpusValue).toBeGreaterThan(600000)
    })
  })

  it('ETF-03: hook post-tax amount matches golden fixture', async () => {
    const row = findGolden('ETF-14')

    const { result } = renderHook(() => useETFCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<ETFCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('ETF-14: golden corpus matches reference via hook', async () => {
    const row = findGolden('ETF-14')

    const { result } = renderHook(() => useETFCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(result.current.returnsEarned, row.expected.returnsEarned, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('ETF-20: lumpsum mode produces golden corpus via hook', async () => {
    const row = findGolden('ETF-20-LUMPSUM')

    const { result } = renderHook(() => useETFCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.totalInvested).toBe(row.expected.totalInvested)
    })
  })

  it('ETF-22: expense ratio deducted from returns via hook', async () => {
    const lowExpense = findGolden('ETF-23-EXPENSE-LOW')
    const highExpense = findGolden('ETF-23-EXPENSE')

    const { result: lowResult } = renderHook(() => useETFCalculator(...hookArgsFromGolden(lowExpense)))
    const { result: highResult } = renderHook(() => useETFCalculator(...hookArgsFromGolden(highExpense)))

    await waitForHook(() => {
      expect(lowResult.current).not.toBeNull()
      expect(highResult.current).not.toBeNull()
      expect(lowResult.current.corpusValue).toBeGreaterThan(highResult.current.corpusValue)
    })
  })

  it('ETF-22-DEBT: debt ETF type uses indexed LTCG via hook', async () => {
    const row = findGolden('ETF-22-DEBT')

    const { result } = renderHook(() => useETFCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('20% LTCG (Indexed)')
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('ETF-23: LTCG tax breakdown for 10-year ₹10K/month SIP via hook', async () => {
    const row = findGolden('ETF-22')

    const { result } = renderHook(() => useETFCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('12.5% LTCG')
      expect(
        withinTolerance(result.current.taxAmount, row.expected.taxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<ETFCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
    })
  })

  it('ETF-08: invalid min amount shows inline validation error in DOM', async () => {
    renderWithProviders(<ETFCalculator />)

    const amountInput = screen.getAllByPlaceholderText('5000')[0]
    fireEvent.change(amountInput, { target: { value: '499' } })
    fireEvent.blur(amountInput)

    await waitFor(() => {
      expect(screen.getAllByText(/minimum investment amount is ₹500/i).length).toBeGreaterThan(0)
    })
  })

  it('ETF-23: market risk warning banner visible on load', async () => {
    renderWithProviders(<ETFCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/Market Risk Warning/i)).toBeInTheDocument()
      expect(screen.getByText(/subject to market risk/i)).toBeInTheDocument()
    })
  })
})
