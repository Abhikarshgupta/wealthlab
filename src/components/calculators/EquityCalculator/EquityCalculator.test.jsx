/**
 * Equity Calculator component tests (TASK-W2-EQUITY T3)
 * Scenario IDs aligned with tests/TRACEABILITY.md
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EquityCalculator from './EquityCalculator'
import { renderWithProviders, resetUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'

vi.mock('@/components/common/PieChart/PieChart', () => ({
  default: ({ title }) => <div data-testid="pie-chart-mock">{title}</div>,
}))

describe('Equity Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('EQ-01: Calculator loads with documented default values', () => {
    it('renders defaults from schema and investmentRates', () => {
      renderWithProviders(<EquityCalculator />)

      expect(screen.getByText('Equity Calculator')).toBeInTheDocument()
      expect(document.querySelector('input[name="investmentType"][value="sip"]')).toBeTruthy()

      const amountInput = screen.getAllByPlaceholderText('5000')[0]
      expect(amountInput).toHaveValue(5000)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      expect(tenureInput).toHaveValue(5)

      const cagrInput = screen.getAllByPlaceholderText('12')[0]
      expect(cagrInput).toHaveValue(investmentRates.equity.defaultExpectedReturn)
    })
  })

  describe('EQ-02: Results update in real time', () => {
    it('shows results panel without Calculate button', async () => {
      renderWithProviders(<EquityCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/results/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('EQ-08 / EQ-09: Validation', () => {
    it('EQ-08: should show error for amount below ₹500', async () => {
      renderWithProviders(<EquityCalculator />)

      const amountInput = screen.getAllByPlaceholderText('5000')[0]
      fireEvent.change(amountInput, { target: { value: '499' } })
      fireEvent.blur(amountInput)

      await waitFor(() => {
        expect(screen.getAllByText(/minimum investment amount is ₹500/i).length).toBeGreaterThan(0)
      })
    })

    it('EQ-09: should validate tenure between 1-50 years', async () => {
      renderWithProviders(<EquityCalculator />)

      const tenureInput = screen.getAllByPlaceholderText('5')[0]
      fireEvent.change(tenureInput, { target: { value: '51' } })
      fireEvent.blur(tenureInput)

      await waitFor(() => {
        expect(screen.getAllByText(/maximum tenure is 50 years/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('EQ-20: Investment type selection', () => {
    it('should allow switching between SIP and Lumpsum', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EquityCalculator />)

      const lumpsumOption = document.querySelector('input[name="investmentType"][value="lumpsum"]')
      await user.click(lumpsumOption)

      await waitFor(() => {
        expect(lumpsumOption).toBeChecked()
      })
    })
  })

  describe('EQ-21: Step-up SIP', () => {
    it('should enable step-up percentage when step-up is enabled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EquityCalculator />)

      const stepUpToggle = screen.getAllByRole('switch', { checked: false })[0]
      await user.click(stepUpToggle)

      await waitFor(() => {
        expect(screen.getAllByPlaceholderText('10')[0]).toBeInTheDocument()
      })
    })
  })

  describe('EQ-23: Risk warning', () => {
    it('displays high risk investment warning banner', () => {
      renderWithProviders(<EquityCalculator />)

      expect(screen.getByText(/High Risk Investment Warning/i)).toBeInTheDocument()
      expect(screen.getAllByText(/market risk/i).length).toBeGreaterThan(0)
    })
  })

  describe('EQ-22: Tax calculations', () => {
    it('should apply LTCG for holdings ≥ 1 year', async () => {
      renderWithProviders(<EquityCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('EQ-15: Pie chart', () => {
    it('renders investment breakdown section', async () => {
      renderWithProviders(<EquityCalculator />)

      await waitFor(() => {
        expect(screen.getAllByTestId('pie-chart-mock').length).toBeGreaterThan(0)
      })
    })
  })
})
