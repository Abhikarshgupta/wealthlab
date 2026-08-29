/**
 * NPS Calculator — integration tests (hook + Results DOM)
 * Gherkin: NPS-01, NPS-02, NPS-03, NPS-06, NPS-14, NPS-20, NPS-21
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import NPSCalculator from '@/components/calculators/NPSCalculator/NPSCalculator'
import useNPSCalculator from '@/components/calculators/NPSCalculator/useNPSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../tests/fixtures/golden/nps.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const hookArgsFromGolden = (row) => {
  const { inputs } = row
  return [
    inputs.monthlyContribution,
    inputs.tenure,
    inputs.currentAge,
    inputs.equityAllocation,
    inputs.corporateBondsAllocation,
    inputs.governmentBondsAllocation,
    inputs.alternativeAllocation || 0,
    inputs.equityReturn,
    inputs.corporateBondsReturn,
    inputs.governmentBondsReturn,
    inputs.alternativeReturn || 0,
    inputs.useAgeBasedCaps || false,
    inputs.withdrawalPercentage || 80,
  ]
}

describe('NPS Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('NPS-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ monthly }) =>
        useNPSCalculator(monthly, 25, 35, 50, 30, 20, 0, 12, 9, 8, 7, false, 80),
      { initialProps: { monthly: 5000 } }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.corpusValue).toBeGreaterThan(0)
    })

    rerender({ monthly: 10000 })

    await waitForHook(() => {
      expect(result.current.corpusValue).toBeGreaterThan(7000000)
    })
  })

  it('NPS-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('NPS-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab })

    const { result } = renderHook(() => useNPSCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<NPSCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('NPS-14: golden corpus appears in hook results', async () => {
    const row = findGolden('NPS-14')

    const { result } = renderHook(() => useNPSCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(result.current.weightedReturn, row.expected.weightedReturn, 0.1)
      ).toBe(true)
    })
  })

  it('NPS-06: evolution table renders year-wise rows in DOM', async () => {
    renderWithProviders(<NPSCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
    })

    const rows = document.querySelectorAll('tbody tr')
    expect(rows.length).toBe(25)
  })

  it('NPS-20: minimum ₹500/month accepted with 100% allocation', async () => {
    const row = findGolden('NPS-20')
    const user = userEvent.setup()

    renderWithProviders(<NPSCalculator />)

    const contributionInput = getInput('monthlyContribution')
    await user.clear(contributionInput)
    await user.type(contributionInput, String(row.inputs.monthlyContribution))

    await waitFor(() => {
      expect(contributionInput).toHaveValue(row.inputs.monthlyContribution)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('NPS-21: weighted return allocation reflected in hook corpus', async () => {
    const row = findGolden('NPS-21')

    const { result } = renderHook(() => useNPSCalculator(...hookArgsFromGolden(row)))

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.weightedReturn, row.expected.weightedReturn, 0.1)
      ).toBe(true)
      expect(
        withinTolerance(result.current.corpusValue, row.expected.corpusValue, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('NPS-01: loads with documented default values', async () => {
    renderWithProviders(<NPSCalculator />)

    expect(screen.getByText('NPS Calculator')).toBeInTheDocument()
    expect(getInput('monthlyContribution')).toHaveValue(5000)
    expect(getInput('tenure')).toHaveValue(25)
    expect(getInput('currentAge')).toHaveValue(35)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })
})
