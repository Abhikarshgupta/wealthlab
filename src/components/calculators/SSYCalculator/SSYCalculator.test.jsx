/**
 * SSY Calculator component tests — TASK-W3-SSY (T3)
 * Scenario IDs aligned with tests/TRACEABILITY.md and golden ssy.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SSYCalculator from './SSYCalculator'
import { renderWithProviders, resetUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../../tests/fixtures/golden/ssy.json'

const getGolden = (id) => {
  const row = goldenCases.find((c) => c.id === id)
  if (!row) throw new Error(`Golden case ${id} not found`)
  return row
}

const inputByName = (name) => document.querySelector(`input[name="${name}"]`)

describe('SSY Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('SSY-01 — Initial Calculator Load', () => {
    it('SSY-01: should render calculator with documented default values', () => {
      renderWithProviders(<SSYCalculator />)

      expect(screen.getByText('SSY Calculator')).toBeInTheDocument()
      expect(inputByName('yearlyInvestment')).toHaveValue(10000)
      expect(inputByName('girlsAge')).toHaveValue(5)
      expect(inputByName('rate')).toHaveValue(investmentRates.ssy.rate)
    })
  })

  describe('SSY-03 — Money in Hand', () => {
    it('SSY-03: should show Money in Hand section in results', async () => {
      renderWithProviders(<SSYCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('SSY-06 — Evolution Table', () => {
    it('SSY-06: should display year-wise evolution table', async () => {
      renderWithProviders(<SSYCalculator />)

      await waitFor(() => {
        expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
      })
    })
  })

  describe('SSY-07 — Info Panel', () => {
    it('SSY-07: should show current SSY rate and last updated date', () => {
      renderWithProviders(<SSYCalculator />)

      expect(screen.getByText(/current interest rate/i)).toBeInTheDocument()
      expect(screen.getAllByText(/last updated/i).length).toBeGreaterThan(0)
    })
  })

  describe('SSY-08 — Minimum Investment Validation', () => {
    it('SSY-08: should validate minimum investment of ₹250', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)

      const investmentInput = inputByName('yearlyInvestment')
      await user.clear(investmentInput)
      await user.type(investmentInput, '100')

      await waitFor(() => {
        expect(screen.getAllByText(/minimum investment is ₹250/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('SSY-09 / SSY-21 — Maximum Investment Validation', () => {
    it('SSY-21: should accept maximum investment of ₹1.5L per year', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)

      const investmentInput = inputByName('yearlyInvestment')
      await user.clear(investmentInput)
      await user.type(investmentInput, '150000')

      await waitFor(() => {
        expect(screen.queryByText(/maximum investment is/i)).not.toBeInTheDocument()
      })
    })

    it('SSY-09: should validate maximum investment of ₹1.5L per year', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)

      const investmentInput = inputByName('yearlyInvestment')
      await user.clear(investmentInput)
      await user.type(investmentInput, '200000')

      await waitFor(() => {
        expect(screen.getAllByText(/maximum investment is/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('SSY-20 — Age Validation', () => {
    it('SSY-20: should accept girl child age 9 (below 10)', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)

      const ageInput = inputByName('girlsAge')
      await user.clear(ageInput)
      await user.type(ageInput, '9')

      await waitFor(() => {
        expect(document.querySelectorAll('#girlsAge-error').length).toBe(0)
      })
    })

    it('SSY-20: should validate girl must be below 10 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)

      const ageInput = inputByName('girlsAge')
      await user.clear(ageInput)
      await user.type(ageInput, '10')

      await waitFor(() => {
        expect(screen.getAllByText(/below 10 years/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('SSY-22 — Maturity Period', () => {
    it('SSY-22: should show 21-year period for newborn (age 0)', async () => {
      const user = userEvent.setup()
      const golden = getGolden('SSY-22')
      renderWithProviders(<SSYCalculator />)

      const ageInput = inputByName('girlsAge')
      await user.clear(ageInput)
      await user.type(ageInput, '0')

      await waitFor(() => {
        expect(
          screen.getAllByText(
            new RegExp(`mature in ${golden.expected.yearsTillMaturity} year`, 'i')
          ).length
        ).toBeGreaterThan(0)
      })
    })
  })

  describe('SSY-23 — Tax-Free Status', () => {
    it('SSY-23: should show tax-free status (EEE)', async () => {
      renderWithProviders(<SSYCalculator />)

      await waitFor(() => {
        expect(screen.queryByText(/tax breakdown/i)).not.toBeInTheDocument()
      })

      const golden = getGolden('SSY-23')
      expect(golden.expected.taxAmount).toBe(0)
      expect(golden.expected.postTaxAmount).toBe(golden.expected.maturityValue)
    })
  })
})
