/**
 * ELSS Calculator — integration tests (TASK-W2-ELSS T3)
 * Hook + DOM layers; golden IDs from tests/fixtures/golden/elss.json
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import ELSSCalculator from '@/components/calculators/ELSSCalculator/ELSSCalculator'
import useELSSCalculator from '@/components/calculators/ELSSCalculator/useELSSCalculator'
import { renderWithProviders, resetUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../tests/fixtures/golden/elss.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('ELSS Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('ELSS-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ investmentType, amount, tenure, expectedReturn }) =>
        useELSSCalculator(investmentType, amount, tenure, expectedReturn),
      {
        initialProps: {
          investmentType: 'sip',
          amount: 5000,
          tenure: 5,
          expectedReturn: 14,
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
      expectedReturn: 14,
    })

    await waitForHook(() => {
      expect(result.current.totalInvested).toBe(600000)
      expect(result.current.corpusValue).toBeGreaterThan(600000)
    })
  })

  it('ELSS-03: hook post-tax amount matches golden fixture', async () => {
    const row = findGolden('ELSS-14')
    const { investmentType, amount, tenure, expectedReturn } = row.inputs

    const { result } = renderHook(() =>
      useELSSCalculator(investmentType, amount, tenure, expectedReturn)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<ELSSCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('ELSS-14: golden corpus matches reference via hook', async () => {
    const row = findGolden('ELSS-14')
    const { investmentType, amount, tenure, expectedReturn } = row.inputs

    const { result } = renderHook(() =>
      useELSSCalculator(investmentType, amount, tenure, expectedReturn)
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

  it('ELSS-22: LTCG tax breakdown for 10-year ₹10K/month ELSS via hook', async () => {
    const row = findGolden('ELSS-22')
    const { investmentType, amount, tenure, expectedReturn } = row.inputs

    const { result } = renderHook(() =>
      useELSSCalculator(investmentType, amount, tenure, expectedReturn)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('10% LTCG')
      expect(
        withinTolerance(result.current.taxAmount, row.expected.taxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<ELSSCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
    })
  })

  it('ELSS-08: invalid min amount shows inline validation error in DOM', async () => {
    renderWithProviders(<ELSSCalculator />)

    const amountInput = screen.getAllByPlaceholderText('5000')[0]
    fireEvent.change(amountInput, { target: { value: '499' } })
    fireEvent.blur(amountInput)

    await waitFor(() => {
      expect(screen.getAllByText(/minimum investment amount is ₹500/i).length).toBeGreaterThan(0)
    })
  })

  it('ELSS-20: 3-year lock-in minimum tenure enforced via hook', async () => {
    const row = findGolden('ELSS-20')
    const { investmentType, amount, tenure, expectedReturn } = row.inputs

    const { result } = renderHook(() =>
      useELSSCalculator(investmentType, amount, tenure, expectedReturn)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
    })

    const { result: belowLockIn } = renderHook(() =>
      useELSSCalculator('sip', 5000, 2, 14)
    )

    await waitForHook(() => {
      expect(belowLockIn.current).toBeNull()
    })
  })
})
