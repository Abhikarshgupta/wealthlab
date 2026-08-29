/**
 * RD Calculator — integration tests (hook + Results DOM)
 * Gherkin: RD-02, RD-03, RD-06, RD-14, RD-20
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import RDCalculator from '@/components/calculators/RDCalculator/RDCalculator'
import useRDCalculator from '@/components/calculators/RDCalculator/useRDCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { convertYearsMonthsToMonths } from '@/utils/fdTenureUtils'
import goldenCases from '../../../tests/fixtures/golden/rd.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const expectTextPresent = (matcher) => {
  expect(screen.getAllByText(matcher).length).toBeGreaterThan(0)
}

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('RD Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('RD-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency }) =>
        useRDCalculator(monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency),
      {
        initialProps: {
          monthlyDeposit: 5000,
          tenureYears: 1,
          tenureMonths: 0,
          rate: 6.5,
          compoundingFrequency: 'quarterly',
        },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.maturityAmount).toBeGreaterThan(60000)
    })

    rerender({
      monthlyDeposit: 10000,
      tenureYears: 3,
      tenureMonths: 0,
      rate: 6.5,
      compoundingFrequency: 'quarterly',
    })

    await waitForHook(() => {
      expect(result.current.monthlyDeposit).toBe(10000)
      expect(result.current.maturityAmount).toBeGreaterThan(360000)
    })
  })

  it('RD-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('RD-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab })

    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs

    const { result } = renderHook(() =>
      useRDCalculator(monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<RDCalculator />)

    await waitFor(() => {
      expectTextPresent(/money in hand/i)
    })
  })

  it('RD-14: golden maturity appears in hook results', async () => {
    const row = findGolden('RD-14')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs

    const { result } = renderHook(() =>
      useRDCalculator(monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency)
    )

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(tenureYears)
    })
  })

  it('RD-06: evolution table renders year-wise rows in DOM', async () => {
    const row = findGolden('RD-14')
    const user = userEvent.setup()

    renderWithProviders(<RDCalculator />)

    const depositInput = getInput('monthlyDeposit')
    await user.clear(depositInput)
    await user.type(depositInput, String(row.inputs.monthlyDeposit))

    const tenureYearsInput = getInput('tenureYears')
    await user.clear(tenureYearsInput)
    await user.type(tenureYearsInput, String(row.inputs.tenureYears))

    await waitFor(() => {
      expectTextPresent(/year-wise investment evolution/i)
      expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    })
  })

  it('RD-20: minimum monthly deposit golden maturity in hook', async () => {
    const row = findGolden('RD-20')
    const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)

    const { result } = renderHook(() =>
      useRDCalculator(monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency)
    )

    await waitForHook(() => {
      expect(result.current.totalInvestment).toBe(monthlyDeposit * totalMonths)
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })
})
