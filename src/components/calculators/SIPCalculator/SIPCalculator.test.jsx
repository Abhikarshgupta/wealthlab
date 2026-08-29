/**
 * SIP Calculator component tests (TASK-W1-SIP T3)
 * Scenario IDs aligned with tests/TRACEABILITY.md
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SIPCalculator from './SIPCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { calculateSIPFutureValue } from '@/utils/calculations'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../../tests/fixtures/golden/sip.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

describe('SIP Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('SIP-01: Calculator loads with documented default values', () => {
    it('renders defaults from schema and investmentRates', () => {
      renderWithProviders(<SIPCalculator />)

      expect(screen.getByText('SIP Calculator')).toBeInTheDocument()

      const sipInput = screen.getAllByPlaceholderText('5000')[0]
      expect(sipInput).toHaveValue(5000)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      expect(tenureInput).toHaveValue(5)

      const returnInput = screen.getAllByPlaceholderText('12')[0]
      expect(returnInput).toHaveValue(investmentRates.sip.expectedReturn)
    })
  })

  describe('SIP-02: Results update in real time', () => {
    it('shows results panel without Calculate button', async () => {
      renderWithProviders(<SIPCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/results/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('SIP-08 / SIP-09: Validation', () => {
    it('SIP-08: should show error for SIP below ₹500', async () => {
      renderWithProviders(<SIPCalculator />)

      const sipInput = screen.getAllByPlaceholderText('5000')[0]
      fireEvent.change(sipInput, { target: { value: '300' } })
      fireEvent.blur(sipInput)

      await waitFor(() => {
        expect(screen.getAllByText(/minimum.*500/i).length).toBeGreaterThan(0)
      })
    })

    it('SIP-09: should validate tenure between 1-50 years', async () => {
      renderWithProviders(<SIPCalculator />)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      fireEvent.change(tenureInput, { target: { value: '60' } })
      fireEvent.blur(tenureInput)

      await waitFor(() => {
        expect(screen.getAllByText(/maximum.*50/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('SIP-21: Step-Up SIP', () => {
    it('should enable step-up percentage when step-up is enabled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SIPCalculator />)

      const stepUpToggle = screen.getAllByRole('switch', { checked: false })[0]
      await user.click(stepUpToggle)

      await waitFor(() => {
        const stepUpPercentageInput = screen.getAllByPlaceholderText('10')[0]
        expect(stepUpPercentageInput).toBeInTheDocument()
      })
    })
  })

  describe('SIP-14 / SIP-22: Real-World Calculations', () => {
    it('SIP-14: should calculate corpus for ₹5K/month @ 12% for 5 years', () => {
      const golden = findGolden('SIP-14')
      const { inputs, expected } = golden
      const months = inputs.tenure * 12
      const corpus = calculateSIPFutureValue(
        inputs.monthlySIP,
        inputs.expectedReturn / 100,
        months
      )

      expect(Math.abs(corpus - expected.corpusValue)).toBeLessThanOrEqual(expected.tolerance)
    })

    it('SIP-22: should display tax breakdown for LTCG scenario', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      renderWithProviders(<SIPCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
      })
    })
  })
})
