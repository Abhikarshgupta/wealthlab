/**
 * FD Calculator — integration tests (hook + Results DOM)
 * Gherkin: FD-02, FD-03, FD-06, FD-14, FD-23
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import FDCalculator from '@/components/calculators/FDCalculator/FDCalculator'
import useFDCalculator from '@/components/calculators/FDCalculator/useFDCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { convertYearsMonthsToYears } from '@/utils/fdTenureUtils'
import goldenCases from '../../../tests/fixtures/golden/fd.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const expectTextPresent = (matcher) => {
  expect(screen.getAllByText(matcher).length).toBeGreaterThan(0)
}

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('FD Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
  })

  it('FD-02: hook returns results in real time without Calculate button', async () => {
    const { result, rerender } = renderHook(
      ({ principal, tenureYears, tenureMonths, rate, compoundingFrequency }) =>
        useFDCalculator(principal, tenureYears, tenureMonths, rate, compoundingFrequency),
      {
        initialProps: {
          principal: 100000,
          tenureYears: 1,
          tenureMonths: 0,
          rate: 6.5,
          compoundingFrequency: 'quarterly',
        },
      }
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.maturityAmount).toBeGreaterThan(100000)
    })

    rerender({
      principal: 500000,
      tenureYears: 3,
      tenureMonths: 0,
      rate: 6.5,
      compoundingFrequency: 'quarterly',
    })

    await waitForHook(() => {
      expect(result.current.principal).toBe(500000)
      expect(result.current.maturityAmount).toBeGreaterThan(500000)
    })
  })

  it('FD-03: Results panel shows Money in Hand post-tax from golden fixture', async () => {
    const row = findGolden('FD-03')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab })

    const { principal, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs

    const { result } = renderHook(() =>
      useFDCalculator(principal, tenureYears, tenureMonths, rate, compoundingFrequency)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<FDCalculator />)

    await waitFor(() => {
      expectTextPresent(/money in hand/i)
    })
  })

  it('FD-14: golden maturity appears in hook results', async () => {
    const row = findGolden('FD-14')
    const { principal, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs

    const { result } = renderHook(() =>
      useFDCalculator(principal, tenureYears, tenureMonths, rate, compoundingFrequency)
    )

    await waitForHook(() => {
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(result.current.evolution).toHaveLength(tenureYears)
    })
  })

  it('FD-06: evolution table renders year-wise rows in DOM', async () => {
    const row = findGolden('FD-14')
    const user = userEvent.setup()

    renderWithProviders(<FDCalculator />)

    const principalInput = getInput('principal')
    await user.clear(principalInput)
    await user.type(principalInput, String(row.inputs.principal))

    const tenureYearsInput = getInput('tenureYears')
    await user.clear(tenureYearsInput)
    await user.type(tenureYearsInput, String(row.inputs.tenureYears))

    await waitFor(() => {
      expectTextPresent(/year-wise investment evolution/i)
      expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    })
  })

  it('FD-23: TDS warning shown when annual interest exceeds threshold', async () => {
    const row = findGolden('FD-23')
    const user = userEvent.setup()

    renderWithProviders(<FDCalculator />)

    const principalInput = getInput('principal')
    await user.clear(principalInput)
    await user.type(principalInput, String(row.inputs.principal))

    const rateInput = getInput('rate')
    await user.clear(rateInput)
    await user.type(rateInput, String(row.inputs.rate))

    const tenureYearsInput = getInput('tenureYears')
    await user.clear(tenureYearsInput)
    await user.type(tenureYearsInput, String(row.inputs.tenureYears))

    const years = convertYearsMonthsToYears(row.inputs.tenureYears, row.inputs.tenureMonths)

    const { result } = renderHook(() =>
      useFDCalculator(
        row.inputs.principal,
        row.inputs.tenureYears,
        row.inputs.tenureMonths,
        row.inputs.rate,
        row.inputs.compoundingFrequency
      )
    )

    await waitForHook(() => {
      const annualInterest = result.current.interestEarned / years
      expect(annualInterest).toBeGreaterThan(row.expected.tdsThreshold)
    })

    await waitFor(() => {
      expectTextPresent(/tds.*applicable/i)
    })
  })
})
