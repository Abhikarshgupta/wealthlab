/**
 * POMIS Calculator — integration tests (hook + Results DOM)
 * Gherkin: POMIS-02, POMIS-03, POMIS-06, POMIS-14, POMIS-21, POMIS-TDS
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import POMISCalculator from '@/components/calculators/POMISCalculator/POMISCalculator'
import usePOMISCalculator from '@/components/calculators/POMISCalculator/usePOMISCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../tests/fixtures/golden/pomis.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const expectTextPresent = (matcher) => {
  expect(screen.getAllByText(matcher).length).toBeGreaterThan(0)
}

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('POMIS Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('POMIS-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ principal, isJointAccount, rate }) =>
        usePOMISCalculator(principal, isJointAccount, rate),
      {
        initialProps: {
          principal: 100000,
          isJointAccount: false,
          rate: 7.4,
        },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.maturityAmount).toBeGreaterThan(100000)
    })

    rerender({
      principal: 500000,
      isJointAccount: false,
      rate: 7.4,
    })

    await waitForHook(() => {
      expect(result.current.principal).toBe(500000)
      expect(result.current.maturityAmount).toBeGreaterThan(500000)
    })
  })

  it('POMIS-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('POMIS-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab })

    const { principal, isJointAccount, rate } = row.inputs

    const { result } = renderHook(() => usePOMISCalculator(principal, isJointAccount, rate))

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<POMISCalculator />)

    await waitFor(() => {
      expectTextPresent(/money in hand/i)
    })
  })

  it('POMIS-14: golden maturity and monthly interest in hook results', async () => {
    const row = findGolden('POMIS-14')
    const { principal, isJointAccount, rate } = row.inputs

    const { result } = renderHook(() => usePOMISCalculator(principal, isJointAccount, rate))

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(result.current.monthlyInterest, row.expected.monthlyInterest, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(5)
    })
  })

  it('POMIS-06: evolution table renders year-wise rows in DOM', async () => {
    const row = findGolden('POMIS-14')
    const user = userEvent.setup()

    renderWithProviders(<POMISCalculator />)

    const principalInput = getInput('principal')
    await user.clear(principalInput)
    await user.type(principalInput, String(row.inputs.principal))

    await waitFor(() => {
      expectTextPresent(/year-wise investment evolution/i)
      expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    })
  })

  it('POMIS-21: monthly income payment displayed in results', async () => {
    const row = findGolden('POMIS-21')
    const user = userEvent.setup()

    renderWithProviders(<POMISCalculator />)

    const principalInput = getInput('principal')
    await user.clear(principalInput)
    await user.type(principalInput, String(row.inputs.principal))

    await waitFor(() => {
      expectTextPresent(/monthly income payment/i)
    })

    const { result } = renderHook(() =>
      usePOMISCalculator(row.inputs.principal, row.inputs.isJointAccount, row.inputs.rate)
    )

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.monthlyInterest, row.expected.monthlyInterest, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('POMIS-TDS: TDS warning shown when annual interest exceeds threshold', async () => {
    const row = findGolden('POMIS-TDS')
    const user = userEvent.setup()

    renderWithProviders(<POMISCalculator />)

    const principalInput = getInput('principal')
    await user.clear(principalInput)
    await user.type(principalInput, String(row.inputs.principal))

    const rateInput = getInput('rate')
    await user.clear(rateInput)
    await user.type(rateInput, String(row.inputs.rate))

    const { result } = renderHook(() =>
      usePOMISCalculator(row.inputs.principal, row.inputs.isJointAccount, row.inputs.rate)
    )

    await waitForHook(() => {
      expect(result.current.annualInterest).toBeGreaterThan(row.expected.tdsThreshold)
    })

    await waitFor(() => {
      expectTextPresent(/tds.*applicable/i)
    })
  })
})
