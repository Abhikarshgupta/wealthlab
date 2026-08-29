/**
 * 54EC Bonds Calculator — integration tests (hook + UI wiring)
 * Gherkin: 54EC-01, 54EC-02, 54EC-03, 54EC-06, 54EC-14, 54EC-20
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import Bonds54ECCalculator from '@/components/calculators/54ECBondsCalculator/54ECBondsCalculator'
import use54ECBondsCalculator from '@/components/calculators/54ECBondsCalculator/use54ECBondsCalculator'
import {
  renderWithProviders,
  resetUserPreferences,
  setUserPreferences,
} from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../tests/fixtures/golden/54ec.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('54EC Bonds Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('54EC-01: loads with documented default values', async () => {
    renderWithProviders(<Bonds54ECCalculator />)

    expect(screen.getByText('54EC Bonds Calculator')).toBeInTheDocument()
    expect(getInput('capitalGainAmount')).toHaveValue(1000000)
    expect(getInput('investmentAmount')).toHaveValue(1000000)
    expect(getInput('rate')).toHaveValue(investmentRates.bonds54EC.rate)
    expect(screen.getAllByText(/5 years \(Fixed\)/i).length).toBeGreaterThan(0)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('54EC-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ capitalGain, investment, rate }) =>
        use54ECBondsCalculator(capitalGain, investment, rate),
      {
        initialProps: { capitalGain: 1000000, investment: 1000000, rate: 5.75 },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.maturityAmount).toBeGreaterThan(1000000)
    })

    rerender({ capitalGain: 1000000, investment: 500000, rate: 5.75 })

    await waitForHook(() => {
      expect(result.current.investmentAmount).toBe(500000)
      expect(result.current.maturityAmount).toBeGreaterThan(500000)
    })
  })

  it('54EC-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('54EC-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab, adjustInflation: false })

    const { capitalGainAmount, investmentAmount, rate } = row.inputs

    const { result } = renderHook(() =>
      use54ECBondsCalculator(capitalGainAmount, investmentAmount, rate)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<Bonds54ECCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('54EC-14: golden maturity appears in hook results', async () => {
    const row = findGolden('54EC-14')
    const { capitalGainAmount, investmentAmount, rate } = row.inputs

    const { result } = renderHook(() =>
      use54ECBondsCalculator(capitalGainAmount, investmentAmount, rate)
    )

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(5)
      expect(
        withinTolerance(result.current.taxSaved, row.expected.taxSaved, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('54EC-06: evolution table renders year-wise rows in DOM', async () => {
    renderWithProviders(<Bonds54ECCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
    })

    const rows = document.querySelectorAll('tbody tr')
    expect(rows.length).toBe(5)
  })

  it('54EC-20: minimum investment ₹1,000 accepted and calculated', async () => {
    const row = findGolden('54EC-20')
    const user = userEvent.setup()

    renderWithProviders(<Bonds54ECCalculator />)

    const capitalGainInput = getInput('capitalGainAmount')
    const investmentInput = getInput('investmentAmount')

    await user.clear(capitalGainInput)
    await user.type(capitalGainInput, String(row.inputs.capitalGainAmount))
    await user.clear(investmentInput)
    await user.type(investmentInput, String(row.inputs.investmentAmount))

    await waitFor(() => {
      expect(investmentInput).toHaveValue(row.inputs.investmentAmount)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })
})
