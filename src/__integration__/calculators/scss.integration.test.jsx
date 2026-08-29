/**
 * SCSS Calculator — integration tests (hook + Results DOM)
 * Gherkin: SCSS-01, SCSS-02, SCSS-03, SCSS-06, SCSS-14, SCSS-20, SCSS-22
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import SCSSCalculator from '@/components/calculators/SCSSCalculator/SCSSCalculator'
import useSCSSCalculator from '@/components/calculators/SCSSCalculator/useSCSSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../tests/fixtures/golden/scss.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('SCSS Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('SCSS-01: loads with documented default values', async () => {
    renderWithProviders(<SCSSCalculator />)

    expect(screen.getByText('SCSS Calculator')).toBeInTheDocument()
    expect(getInput('principal')).toHaveValue(1000000)
    expect(getInput('tenure')).toHaveValue(5)
    expect(getInput('seniorsAge')).toHaveValue(65)
    expect(getInput('rate')).toHaveValue(investmentRates.scss.rate)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('SCSS-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ principal, tenure, seniorsAge, rate }) =>
        useSCSSCalculator(principal, tenure, seniorsAge, rate, false),
      {
        initialProps: { principal: 1000000, tenure: 5, seniorsAge: 65, rate: 8.2 },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.maturityAmount).toBeGreaterThan(1000000)
    })

    rerender({ principal: 500000, tenure: 5, seniorsAge: 65, rate: 8.2 })

    await waitForHook(() => {
      expect(result.current.principal).toBe(500000)
      expect(result.current.maturityAmount).toBeGreaterThan(500000)
    })
  })

  it('SCSS-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('SCSS-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab })

    const { principal, tenure, seniorsAge, rate } = row.inputs

    const { result } = renderHook(() =>
      useSCSSCalculator(principal, tenure, seniorsAge, rate, false)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<SCSSCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('SCSS-14: golden maturity appears in hook results', async () => {
    const row = findGolden('SCSS-14')
    const { principal, tenure, seniorsAge, rate } = row.inputs

    const { result } = renderHook(() =>
      useSCSSCalculator(principal, tenure, seniorsAge, rate, false)
    )

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(
          result.current.quarterlyInterest,
          row.expected.quarterlyInterest,
          row.expected.tolerance
        )
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(5)
    })
  })

  it('SCSS-06: evolution table renders year-wise rows in DOM', async () => {
    renderWithProviders(<SCSSCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
    })

    const rows = document.querySelectorAll('tbody tr')
    expect(rows.length).toBe(5)
  })

  it('SCSS-20: age below 60 suppresses hook results', async () => {
    const { result } = renderHook(() => useSCSSCalculator(1000000, 5, 59, 8.2, false))

    await waitForHook(() => {
      expect(result.current).toBeNull()
    })
  })

  it('SCSS-22: quarterly interest displayed in hook results', async () => {
    const row = findGolden('SCSS-22')
    const { principal, tenure, seniorsAge, rate } = row.inputs

    const { result } = renderHook(() =>
      useSCSSCalculator(principal, tenure, seniorsAge, rate, false)
    )

    await waitForHook(() => {
      expect(
        withinTolerance(
          result.current.quarterlyInterest,
          row.expected.quarterlyInterest,
          row.expected.tolerance
        )
      ).toBe(true)
    })

    renderWithProviders(<SCSSCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/Quarterly Interest Payment/i).length).toBeGreaterThan(0)
    })
  })

  it('SCSS-21: maximum ₹30L investment accepted in form', async () => {
    const row = findGolden('SCSS-21')
    const user = userEvent.setup()

    renderWithProviders(<SCSSCalculator />)

    const principalInput = getInput('principal')
    await user.clear(principalInput)
    await user.type(principalInput, String(row.inputs.principal))

    await waitFor(() => {
      expect(principalInput).toHaveValue(row.inputs.principal)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })
})
