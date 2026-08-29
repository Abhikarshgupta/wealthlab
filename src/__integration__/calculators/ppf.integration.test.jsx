/**
 * PPF Calculator integration tests — TASK-W1-PPF (T3)
 * Exercises hook + UI wiring; golden source: tests/fixtures/golden/ppf.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PPFCalculator from '@/components/calculators/PPFCalculator/PPFCalculator'
import {
  renderWithProviders,
  resetUserPreferences,
  setUserPreferences,
} from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../tests/fixtures/golden/ppf.json'

const getGolden = (id) => {
  const row = goldenCases.find((c) => c.id === id)
  if (!row) throw new Error(`Golden case ${id} not found`)
  return row
}

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const inputByName = (name) => document.querySelector(`input[name="${name}"]`)

describe('PPF Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  it('PPF-01: loads with documented default values', async () => {
    renderWithProviders(<PPFCalculator />)

    expect(screen.getByText('PPF Calculator')).toBeInTheDocument()
    expect(inputByName('yearlyInvestment')).toHaveValue(10000)
    expect(inputByName('tenure')).toHaveValue(15)
    expect(inputByName('rate')).toHaveValue(investmentRates.ppf.rate)

    await waitFor(() => {
      expect(screen.getAllByText(/^Results$/i).length).toBeGreaterThan(0)
    })
  })

  it('PPF-02: results update in real time when yearly investment changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PPFCalculator />)

    const investmentInput = inputByName('yearlyInvestment')
    await user.clear(investmentInput)
    await user.type(investmentInput, '50000')

    await waitFor(() => {
      expect(investmentInput).toHaveValue(50000)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('PPF-14: maturity matches golden reference within tolerance', async () => {
    const golden = getGolden('PPF-14')
    renderWithProviders(<PPFCalculator />)

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

  it('PPF-24: EEE tax-free — money in hand equals nominal maturity', async () => {
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const golden = getGolden('PPF-24')
    renderWithProviders(<PPFCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })

    expect(screen.queryByText(/tax breakdown/i)).not.toBeInTheDocument()
    expect(golden.expected.taxAmount).toBe(0)
    expect(golden.expected.postTaxAmount).toBe(golden.expected.maturityValue)
  })

  it('PPF-23: default tenure is 15 years (lock-in period)', () => {
    renderWithProviders(<PPFCalculator />)

    expect(inputByName('tenure')).toHaveValue(15)
    expect(screen.getAllByText(/lock-in period/i).length).toBeGreaterThan(0)
  })
})
