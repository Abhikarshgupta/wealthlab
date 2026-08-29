/**
 * REITs Calculator — integration tests (hook + UI wiring)
 * Gherkin: REIT-01, REIT-02, REIT-03, REIT-06, REIT-14, REIT-20
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import REITsCalculator from '@/components/calculators/REITsCalculator/REITsCalculator'
import useREITsCalculator from '@/components/calculators/REITsCalculator/useREITsCalculator'
import {
  renderWithProviders,
  resetUserPreferences,
  setUserPreferences,
} from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../tests/fixtures/golden/reits.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('REITs Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('REIT-01: loads with documented default values', async () => {
    renderWithProviders(<REITsCalculator />)

    expect(screen.getByText('REITs Calculator')).toBeInTheDocument()
    expect(getInput('investmentAmount')).toHaveValue(100000)
    expect(getInput('dividendYield')).toHaveValue(investmentRates.reits.dividendYield)
    expect(getInput('capitalAppreciation')).toHaveValue(investmentRates.reits.capitalAppreciation)
    expect(getInput('tenure')).toHaveValue(5)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('REIT-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ amount, dividend, appreciation, tenure }) =>
        useREITsCalculator(amount, null, dividend, appreciation, tenure),
      {
        initialProps: { amount: 100000, dividend: 7, appreciation: 6, tenure: 5 },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.finalValue).toBeGreaterThan(100000)
    })

    rerender({ amount: 200000, dividend: 7, appreciation: 6, tenure: 5 })

    await waitForHook(() => {
      expect(result.current.investmentAmount).toBe(200000)
      expect(result.current.finalValue).toBeGreaterThan(200000)
    })
  })

  it('REIT-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('REIT-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab, adjustInflation: false })

    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs

    const { result } = renderHook(() =>
      useREITsCalculator(investmentAmount, null, dividendYield, capitalAppreciation, tenure)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<REITsCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('REIT-14: golden final value appears in hook results', async () => {
    const row = findGolden('REIT-14')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs

    const { result } = renderHook(() =>
      useREITsCalculator(investmentAmount, null, dividendYield, capitalAppreciation, tenure)
    )

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.finalValue, row.expected.finalValue, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(5)
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('REIT-06: evolution table renders year-wise rows in DOM', async () => {
    renderWithProviders(<REITsCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
    })

    const rows = document.querySelectorAll('tbody tr')
    expect(rows.length).toBe(5)
  })

  it('REIT-20: dividend and capital gain from golden fixture in hook', async () => {
    const row = findGolden('REIT-20')
    const { investmentAmount, dividendYield, capitalAppreciation, tenure } = row.inputs

    const { result } = renderHook(() =>
      useREITsCalculator(investmentAmount, null, dividendYield, capitalAppreciation, tenure)
    )

    await waitForHook(() => {
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

  it('REIT-BD-MIN: minimum investment ₹1,000 accepted and calculated', async () => {
    const row = findGolden('REIT-BD-MIN')
    const user = userEvent.setup()

    renderWithProviders(<REITsCalculator />)

    const investmentInput = getInput('investmentAmount')
    const tenureInput = getInput('tenure')

    await user.clear(investmentInput)
    await user.type(investmentInput, String(row.inputs.investmentAmount))
    await user.clear(tenureInput)
    await user.type(tenureInput, String(row.inputs.tenure))

    await waitFor(() => {
      expect(investmentInput).toHaveValue(row.inputs.investmentAmount)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })
})
