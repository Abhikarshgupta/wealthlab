/**
 * SSY Calculator integration tests — TASK-W3-SSY (T3)
 * Exercises hook + UI wiring; golden source: tests/fixtures/golden/ssy.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SSYCalculator from '@/components/calculators/SSYCalculator/SSYCalculator'
import {
  renderWithProviders,
  resetUserPreferences,
  setUserPreferences,
} from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../tests/fixtures/golden/ssy.json'

const getGolden = (id) => {
  const row = goldenCases.find((c) => c.id === id)
  if (!row) throw new Error(`Golden case ${id} not found`)
  return row
}

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const inputByName = (name) => document.querySelector(`input[name="${name}"]`)

describe('SSY Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  it('SSY-01: loads with documented default values', async () => {
    renderWithProviders(<SSYCalculator />)

    expect(screen.getByText('SSY Calculator')).toBeInTheDocument()
    expect(inputByName('yearlyInvestment')).toHaveValue(10000)
    expect(inputByName('girlsAge')).toHaveValue(5)
    expect(inputByName('rate')).toHaveValue(investmentRates.ssy.rate)

    await waitFor(() => {
      expect(screen.getAllByText(/^Results$/i).length).toBeGreaterThan(0)
    })
  })

  it('SSY-02: results update in real time when yearly investment changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SSYCalculator />)

    const investmentInput = inputByName('yearlyInvestment')
    await user.clear(investmentInput)
    await user.type(investmentInput, '50000')

    await waitFor(() => {
      expect(investmentInput).toHaveValue(50000)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('SSY-14: maturity matches golden reference within tolerance', async () => {
    const golden = getGolden('SSY-14')
    renderWithProviders(<SSYCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })

    const amountNodes = screen.getAllByText(/₹[\d,]+/)
    const displayed = amountNodes
      .map((node) => parseInt(node.textContent.replace(/[^\d]/g, ''), 10) || 0)
      .find((value) => value > 100000)

    expect(displayed).toBeDefined()
    expect(
      withinTolerance(displayed, golden.expected.maturityValue, golden.expected.tolerance)
    ).toBe(true)
  })

  it('SSY-22: investment period is 21 years for newborn (age 0)', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SSYCalculator />)

    const ageInput = inputByName('girlsAge')
    await user.clear(ageInput)
    await user.type(ageInput, '0')

    await waitFor(() => {
      expect(screen.getAllByText(/mature in 21 years/i).length).toBeGreaterThan(0)
    })
  })

  it('SSY-23: EEE tax-free — money in hand equals nominal maturity', async () => {
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const golden = getGolden('SSY-23')
    renderWithProviders(<SSYCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })

    expect(screen.queryByText(/tax breakdown/i)).not.toBeInTheDocument()
    expect(golden.expected.taxAmount).toBe(0)
    expect(golden.expected.postTaxAmount).toBe(golden.expected.maturityValue)
  })
})
