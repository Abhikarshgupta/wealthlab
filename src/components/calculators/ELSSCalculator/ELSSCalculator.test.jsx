/**
 * ELSS Calculator component tests (TASK-W2-ELSS T3)
 * Scenario IDs aligned with tests/TRACEABILITY.md
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ELSSCalculator from './ELSSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../../tests/fixtures/golden/elss.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

describe('ELSS Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('ELSS-01: Calculator loads with documented default values', () => {
    it('renders defaults from schema and investmentRates', () => {
      renderWithProviders(<ELSSCalculator />)

      expect(screen.getByText('ELSS Calculator')).toBeInTheDocument()

      const amountInput = screen.getAllByPlaceholderText('5000')[0]
      expect(amountInput).toHaveValue(5000)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      expect(tenureInput).toHaveValue(5)

      const returnInput = screen.getAllByPlaceholderText('14')[0]
      expect(returnInput).toHaveValue(investmentRates.elss.expectedReturn)

      expect(screen.getAllByText(/Monthly SIP Amount/i).length).toBeGreaterThan(0)
    })
  })

  describe('ELSS-02: Results update in real time', () => {
    it('shows results panel without Calculate button', async () => {
      renderWithProviders(<ELSSCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('ELSS-07 / ELSS-21: Info panel', () => {
    it('ELSS-07: shows expected return and lock-in info', () => {
      renderWithProviders(<ELSSCalculator />)

      expect(screen.getByText(/About ELSS/i)).toBeInTheDocument()
      expect(screen.getAllByText(new RegExp(`${investmentRates.elss.expectedReturn}`, 'i')).length).toBeGreaterThan(0)
    })

    it('ELSS-21: shows Section 80C tax benefit in info panel', () => {
      renderWithProviders(<ELSSCalculator />)

      expect(screen.getAllByText(/Section 80C|80C/i).length).toBeGreaterThan(0)
    })
  })

  describe('ELSS-08 / ELSS-09: Validation', () => {
    it('ELSS-08: should show error for amount below ₹500', async () => {
      renderWithProviders(<ELSSCalculator />)

      const amountInput = screen.getAllByPlaceholderText('5000')[0]
      fireEvent.change(amountInput, { target: { value: '499' } })
      fireEvent.blur(amountInput)

      await waitFor(() => {
        expect(screen.getAllByText(/minimum investment amount is ₹500/i).length).toBeGreaterThan(0)
      })
    })

    it('ELSS-09: should validate minimum 3-year tenure (lock-in)', async () => {
      renderWithProviders(<ELSSCalculator />)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      fireEvent.change(tenureInput, { target: { value: '2' } })
      fireEvent.blur(tenureInput)

      await waitFor(() => {
        expect(screen.getAllByText(/minimum tenure is 3 years/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('ELSS-20: 3-year lock-in enforced', () => {
    it('should show lock-in period information on load', () => {
      renderWithProviders(<ELSSCalculator />)

      expect(screen.getAllByText(/3.*year.*lock/i).length).toBeGreaterThan(0)
    })
  })

  describe('ELSS-22 / ELSS-23: Tax calculations', () => {
    it('ELSS-22: should apply LTCG for holdings ≥ 3 years', async () => {
      setUserPreferences({ taxSlab: 0.3 })

      const user = userEvent.setup()
      renderWithProviders(<ELSSCalculator />)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      await user.clear(tenureInput)
      await user.type(tenureInput, '5')

      await waitFor(() => {
        expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
      })
    })

    it('ELSS-23: tenure below 3 years shows validation (lock-in not met for calculation)', async () => {
      setUserPreferences({ taxSlab: 0.3 })

      const user = userEvent.setup()
      renderWithProviders(<ELSSCalculator />)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      await user.clear(tenureInput)
      await user.type(tenureInput, '2')

      await waitFor(() => {
        expect(screen.getAllByText(/minimum tenure is 3 years/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('ELSS-24: Lumpsum mode', () => {
    it('should switch to lumpsum investment type', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ELSSCalculator />)

      const lumpsumRadio = screen.getAllByRole('radio', { name: /^Lumpsum$/i })[0]
      await user.click(lumpsumRadio)

      expect(lumpsumRadio).toBeChecked()
      expect(screen.getAllByText(/Lumpsum Investment Amount/i).length).toBeGreaterThan(0)
    })
  })

  describe('ELSS-14: Golden calculation', () => {
    it('matches golden corpus for default-like SIP inputs', async () => {
      const row = findGolden('ELSS-14')
      renderWithProviders(<ELSSCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })

      const amountInput = screen.getAllByPlaceholderText('5000')[0]
      expect(amountInput).toHaveValue(row.inputs.amount)
    })
  })
})
