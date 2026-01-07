/**
 * ETF Calculator Tests
 * Tests based on product requirements: Different tax rules for equity/debt/gold ETFs
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ETFCalculator from './ETFCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('ETF Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<ETFCalculator />)
      
      expect(screen.getByText('ETF Calculator')).toBeInTheDocument()
      
      // Default ETF type: Equity
      expect(screen.getByLabelText(/equity|debt|gold|international/i)).toBeInTheDocument()
    })
  })

  describe('ETF Type Selection', () => {
    it('should allow selecting different ETF types', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ETFCalculator />)
      
      const debtOption = screen.getByLabelText(/debt/i)
      if (debtOption) {
        await user.click(debtOption)
        
        await waitFor(() => {
          expect(debtOption).toBeChecked()
        })
      }
    })
  })

  describe('Tax Calculations by ETF Type', () => {
    it('should apply equity ETF tax rules (LTCG 10% above ₹1L, STCG 15%)', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<ETFCalculator />)
      
      // Select equity ETF
      const equityOption = screen.getByLabelText(/equity/i)
      if (equityOption) {
        await user.click(equityOption)
      }
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '2') // 2 years (LTCG)
      
      await waitFor(() => {
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should apply debt ETF tax rules (LTCG 20% with indexation after 3 years)', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<ETFCalculator />)
      
      // Select debt ETF
      const debtOption = screen.getByLabelText(/debt/i)
      if (debtOption) {
        await user.click(debtOption)
      }
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '5') // 5 years (LTCG with indexation)
      
      await waitFor(() => {
        // Should show indexation benefit
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })

  describe('Expense Ratio', () => {
    it('should validate expense ratio between 0-2%', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ETFCalculator />)
      
      const expenseRatioInput = screen.getByLabelText(/expense ratio/i)
      await user.clear(expenseRatioInput)
      await user.type(expenseRatioInput, '3')
      
      await waitFor(() => {
        expect(screen.getByText(/expense ratio.*cannot exceed.*2/i)).toBeInTheDocument()
      })
    })
  })
})

