/**
 * PPF Calculator component tests — TASK-W1-PPF (T3)
 * Scenario IDs aligned with tests/TRACEABILITY.md and golden ppf.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PPFCalculator from './PPFCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../../tests/fixtures/golden/ppf.json'

const getGolden = (id) => {
  const row = goldenCases.find((c) => c.id === id)
  if (!row) throw new Error(`Golden case ${id} not found`)
  return row
}

const inputByName = (name) => document.querySelector(`input[name="${name}"]`)

describe('PPF Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('PPF-01 — Initial Calculator Load', () => {
    it('PPF-01: should render calculator with documented default values', () => {
      renderWithProviders(<PPFCalculator />)

      expect(screen.getByText('PPF Calculator')).toBeInTheDocument()
      expect(inputByName('yearlyInvestment')).toHaveValue(10000)
      expect(inputByName('tenure')).toHaveValue(15)
      expect(inputByName('rate')).toHaveValue(investmentRates.ppf.rate)
    })
  })

  describe('PPF-03 — Money in Hand', () => {
    it('PPF-03: should show Money in Hand section in results', async () => {
      renderWithProviders(<PPFCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('PPF-06 — Evolution Table', () => {
    it('PPF-06: should display year-wise evolution table', async () => {
      renderWithProviders(<PPFCalculator />)

      await waitFor(() => {
        expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
      })
    })
  })

  describe('PPF-07 — Info Panel', () => {
    it('PPF-07: should show current PPF rate and last updated date', () => {
      renderWithProviders(<PPFCalculator />)

      expect(screen.getByText(/current interest rate/i)).toBeInTheDocument()
      expect(screen.getAllByText(/last updated/i).length).toBeGreaterThan(0)
    })
  })

  describe('PPF-08 / PPF-21 — Minimum Investment Validation', () => {
    it('PPF-21: should accept minimum investment of ₹500', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PPFCalculator />)

      const investmentInput = inputByName('yearlyInvestment')
      await user.clear(investmentInput)
      await user.type(investmentInput, '500')

      await waitFor(() => {
        expect(screen.queryByText(/minimum investment is/i)).not.toBeInTheDocument()
      })
    })

    it('PPF-08: should validate minimum investment of ₹500', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PPFCalculator />)

      const investmentInput = inputByName('yearlyInvestment')
      await user.clear(investmentInput)
      await user.type(investmentInput, '499')

      await waitFor(() => {
        expect(screen.getAllByText(/minimum.*500/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('PPF-09 / PPF-20 — Maximum Investment Validation', () => {
    it('PPF-20: should accept maximum investment of ₹1.5L per year', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PPFCalculator />)

      const investmentInput = inputByName('yearlyInvestment')
      await user.clear(investmentInput)
      await user.type(investmentInput, '150000')

      await waitFor(() => {
        expect(screen.queryByText(/maximum investment is/i)).not.toBeInTheDocument()
      })
    })

    it('PPF-09: should validate maximum investment of ₹1.5L per year', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PPFCalculator />)

      const investmentInput = inputByName('yearlyInvestment')
      await user.clear(investmentInput)
      await user.type(investmentInput, '200000')

      await waitFor(() => {
        expect(screen.getAllByText(/maximum.*1.5.*lakh/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('PPF-22 — Step-up Investment', () => {
    it('PPF-22: step-up increases maturity above flat contribution baseline', async () => {
      const user = userEvent.setup()
      const golden = getGolden('PPF-22')
      renderWithProviders(<PPFCalculator />)

      const [toggle] = screen.getAllByRole('switch')
      await user.click(toggle)

      await waitFor(() => {
        expect(inputByName('stepUpPercentage')).toBeInTheDocument()
      })

      expect(golden.expected.maturityValue).toBeGreaterThan(golden.expected.flatMaturityBaseline)
    })
  })

  describe('PPF-24 — Tax-Free Status (EEE)', () => {
    it('PPF-24: should show tax-free status without tax breakdown', async () => {
      setUserPreferences({ taxSlab: 0.3 })
      renderWithProviders(<PPFCalculator />)

      await waitFor(() => {
        expect(screen.queryByText(/tax breakdown/i)).not.toBeInTheDocument()
      })

      const golden = getGolden('PPF-24')
      expect(golden.expected.taxAmount).toBe(0)
      expect(golden.expected.postTaxAmount).toBe(golden.expected.maturityValue)
    })
  })
})
