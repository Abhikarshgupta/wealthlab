/**
 * Equity Calculator — integration tests (TASK-W2-EQUITY T3)
 * Hook + DOM layers; golden IDs from tests/fixtures/golden/equity.json
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import EquityCalculator from '@/components/calculators/EquityCalculator/EquityCalculator'
import useEquityCalculator from '@/components/calculators/EquityCalculator/useEquityCalculator'
import { renderWithProviders, resetUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../tests/fixtures/golden/equity.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('Equity Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('EQ-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ investmentType, amount, tenure, expectedCAGR, stepUpEnabled, stepUpPercentage }) =>
        useEquityCalculator(
          investmentType,
          amount,
          tenure,
          expectedCAGR,
          stepUpEnabled,
          stepUpPercentage
        ),
      {
        initialProps: {
          investmentType: 'sip',
          amount: 5000,
          tenure: 5,
          expectedCAGR: 12,
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
      expectedCAGR: 12,
      stepUpEnabled: false,
      stepUpPercentage: 0,
    })

    await waitForHook(() => {
      expect(result.current.totalInvested).toBe(600000)
      expect(result.current.corpusValue).toBeGreaterThan(600000)
    })
  })

  it('EQ-03: hook post-tax amount matches golden fixture', async () => {
    const row = findGolden('EQ-14')
    const { investmentType, amount, tenure, expectedCAGR, stepUpEnabled, stepUpPercentage } = row.inputs

    const { result } = renderHook(() =>
      useEquityCalculator(
        investmentType,
        amount,
        tenure,
        expectedCAGR,
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

    renderWithProviders(<EquityCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('EQ-14: golden corpus matches reference via hook', async () => {
    const row = findGolden('EQ-14')
    const { investmentType, amount, tenure, expectedCAGR, stepUpEnabled, stepUpPercentage } = row.inputs

    const { result } = renderHook(() =>
      useEquityCalculator(
        investmentType,
        amount,
        tenure,
        expectedCAGR,
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
        withinTolerance(result.current.returnsEarned, row.expected.returnsEarned, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('EQ-20: lumpsum mode produces golden corpus via hook', async () => {
    const row = findGolden('EQ-20-LUMPSUM')
    const { investmentType, amount, tenure, expectedCAGR, stepUpEnabled, stepUpPercentage } = row.inputs

    const { result } = renderHook(() =>
      useEquityCalculator(
        investmentType,
        amount,
        tenure,
        expectedCAGR,
        stepUpEnabled,
        stepUpPercentage
      )
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.totalInvested).toBe(row.expected.totalInvested)
    })
  })

  it('EQ-22: LTCG tax breakdown for 10-year ₹10K/month SIP via hook', async () => {
    const row = findGolden('EQ-22')
    const { investmentType, amount, tenure, expectedCAGR, stepUpEnabled, stepUpPercentage } = row.inputs

    const { result } = renderHook(() =>
      useEquityCalculator(
        investmentType,
        amount,
        tenure,
        expectedCAGR,
        stepUpEnabled,
        stepUpPercentage
      )
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('12.5% LTCG')
      expect(
        withinTolerance(result.current.taxAmount, row.expected.taxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<EquityCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
    })
  })

  it('EQ-08: invalid min amount shows inline validation error in DOM', async () => {
    renderWithProviders(<EquityCalculator />)

    const amountInput = screen.getAllByPlaceholderText('5000')[0]
    fireEvent.change(amountInput, { target: { value: '499' } })
    fireEvent.blur(amountInput)

    await waitFor(() => {
      expect(screen.getAllByText(/minimum investment amount is ₹500/i).length).toBeGreaterThan(0)
    })
  })

  it('EQ-23: risk warning banner visible on load', async () => {
    renderWithProviders(<EquityCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/High Risk Investment Warning/i)).toBeInTheDocument()
      expect(screen.getByText(/subject to market risk/i)).toBeInTheDocument()
    })
  })
})
