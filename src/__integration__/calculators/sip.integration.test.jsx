/**
 * SIP Calculator — integration tests (TASK-W1-SIP T3)
 * Hook + DOM layers; golden IDs from tests/fixtures/golden/sip.json
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import SIPCalculator from '@/components/calculators/SIPCalculator/SIPCalculator'
import useSIPCalculator from '@/components/calculators/SIPCalculator/useSIPCalculator'
import { renderWithProviders, resetUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../tests/fixtures/golden/sip.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('SIP Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('SIP-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage }) =>
        useSIPCalculator(monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage),
      {
        initialProps: {
          monthlySIP: 5000,
          tenure: 5,
          tenureUnit: 'years',
          expectedReturn: 12,
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
      monthlySIP: 10000,
      tenure: 5,
      tenureUnit: 'years',
      expectedReturn: 12,
      stepUpEnabled: false,
      stepUpPercentage: 0,
    })

    await waitForHook(() => {
      expect(result.current.totalInvested).toBe(600000)
      expect(result.current.corpusValue).toBeGreaterThan(600000)
    })
  })

  it('SIP-03: hook post-tax amount matches golden fixture', async () => {
    const row = findGolden('SIP-14')
    const { monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage } = row.inputs

    const { result } = renderHook(() =>
      useSIPCalculator(monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<SIPCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('SIP-14: golden corpus matches reference via hook', async () => {
    const row = findGolden('SIP-14')
    const { monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage } = row.inputs

    const { result } = renderHook(() =>
      useSIPCalculator(monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage)
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

  it('SIP-22: LTCG tax breakdown for 10-year ₹10K/month SIP via hook', async () => {
    const row = findGolden('SIP-22')
    const { monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage } = row.inputs

    const { result } = renderHook(() =>
      useSIPCalculator(monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxRateLabel).toBe('12.5% LTCG')
      expect(
        withinTolerance(result.current.taxAmount, row.expected.taxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<SIPCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
    })
  })

  it('SIP-08: invalid min amount shows inline validation error in DOM', async () => {
    renderWithProviders(<SIPCalculator />)

    const sipInput = screen.getAllByPlaceholderText('5000')[0]
    fireEvent.change(sipInput, { target: { value: '499' } })
    fireEvent.blur(sipInput)

    await waitFor(() => {
      expect(screen.getAllByText(/minimum.*500/i).length).toBeGreaterThan(0)
    })
  })
})
