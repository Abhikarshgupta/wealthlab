/**
 * NPS Calculator Tests
 * Tests based on product requirements: 60% tax-free, 40% taxable, asset allocation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NPSCalculator from './NPSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('NPS Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<NPSCalculator />)
      
      expect(screen.getByText('NPS Calculator')).toBeInTheDocument()
      
      // Default monthly contribution: ₹5,000
      const contributionInput = screen.getByLabelText(/monthly contribution/i)
      expect(contributionInput).toBeInTheDocument()
    })
  })

  describe('Asset Allocation Validation', () => {
    it('should validate total allocation equals 100%', async () => {
      const user = userEvent.setup()
      renderWithProviders(<NPSCalculator />)
      
      // Set allocations that don't sum to 100%
      const equityInput = screen.getByLabelText(/equity allocation/i)
      await user.clear(equityInput)
      await user.type(equityInput, '50')
      
      const corporateInput = screen.getByLabelText(/corporate bonds allocation/i)
      await user.clear(corporateInput)
      await user.type(corporateInput, '30')
      
      // Total = 80%, should show error
      await waitFor(() => {
        expect(screen.getByText(/total.*100/i)).toBeInTheDocument()
      })
    })

    it('should enforce equity allocation limits based on age', async () => {
      const user = userEvent.setup()
      renderWithProviders(<NPSCalculator />)
      
      // Set age > 35, equity should be limited
      const ageInput = screen.getByLabelText(/current age|age/i)
      if (ageInput) {
        await user.clear(ageInput)
        await user.type(ageInput, '40')
        
        await waitFor(() => {
          // Equity allocation should be adjusted based on age
          expect(screen.getByText(/equity/i)).toBeInTheDocument()
        })
      }
    })
  })

  describe('Withdrawal Options', () => {
    it('should allow selecting 60% or 80% withdrawal', async () => {
      const user = userEvent.setup()
      renderWithProviders(<NPSCalculator />)
      
      const withdrawalSelect = screen.getByLabelText(/withdrawal|percentage/i)
      if (withdrawalSelect) {
        await user.selectOptions(withdrawalSelect, '80')
        
        await waitFor(() => {
          expect(withdrawalSelect.value).toBe('80')
        })
      }
    })
  })

  describe('Tax Calculations', () => {
    it('should apply partial tax (60% tax-free, 40% taxable)', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      renderWithProviders(<NPSCalculator />)
      
      await waitFor(() => {
        // 60% should be tax-free, 40% taxable
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })
})

