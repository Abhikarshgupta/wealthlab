/**
 * NSC Calculator — integration tests (hook + Results DOM)
 * Gherkin: NSC-02, NSC-03, NSC-06, NSC-14, NSC-20
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import NSCalculator from '@/components/calculators/NSCalculator/NSCalculator'
import useNSCalculator from '@/components/calculators/NSCalculator/useNSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../tests/fixtures/golden/nsc.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('NSC Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('NSC-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ principal, rate }) => useNSCalculator(principal, rate),
      {
        initialProps: { principal: 100000, rate: 7.7 },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.maturityAmount).toBeGreaterThan(100000)
    })

    rerender({ principal: 500000, rate: 7.7 })

    await waitForHook(() => {
      expect(result.current.principal).toBe(500000)
      expect(result.current.maturityAmount).toBeGreaterThan(500000)
    })
  })

  it('NSC-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('NSC-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab })

    const { principal, rate } = row.inputs

    const { result } = renderHook(() => useNSCalculator(principal, rate))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<NSCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('NSC-14: golden maturity appears in hook results', async () => {
    const row = findGolden('NSC-14')
    const { principal, rate } = row.inputs

    const { result } = renderHook(() => useNSCalculator(principal, rate))

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(5)
    })
  })

  it('NSC-06: evolution table renders year-wise rows in DOM', async () => {
    renderWithProviders(<NSCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
    })

    const rows = document.querySelectorAll('tbody tr')
    expect(rows.length).toBe(5)
  })

  it('NSC-20: minimum investment ₹1,000 accepted and calculated', async () => {
    const row = findGolden('NSC-20')
    const user = userEvent.setup()

    renderWithProviders(<NSCalculator />)

    const principalInput = getInput('principal')
    await user.clear(principalInput)
    await user.type(principalInput, String(row.inputs.principal))

    await waitFor(() => {
      expect(principalInput).toHaveValue(row.inputs.principal)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('NSC-01: loads with documented default values', async () => {
    renderWithProviders(<NSCalculator />)

    expect(screen.getByText('NSC Calculator')).toBeInTheDocument()
    expect(getInput('principal')).toHaveValue(100000)
    expect(getInput('rate')).toHaveValue(investmentRates.nsc.rate)
    expect(screen.getAllByText(/5.*years.*fixed/i).length).toBeGreaterThan(0)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })
})
