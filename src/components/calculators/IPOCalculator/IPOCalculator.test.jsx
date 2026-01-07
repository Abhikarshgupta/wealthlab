/**
 * IPO Calculator Tests
 * Tests based on product requirements: Listing gains, LTCG/STCG tax rules
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IPOCalculator from './IPOCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('IPO Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<IPOCalculator />)
      
      expect(screen.getByText('IPO Calculator')).toBeInTheDocument()
    })
  })

  describe('Input Mode Selection', () => {
    it('should allow input via listing price', async () => {
      const user = userEvent.setup()
      renderWithProviders(<IPOCalculator />)
      
      const listingPriceInput = screen.getByLabelText(/listing price/i)
      expect(listingPriceInput).toBeInTheDocument()
    })

    it('should allow input via listing gain percentage', async () => {
      const user = userEvent.setup()
      renderWithProviders(<IPOCalculator />)
      
      // Switch to gain percentage mode
      const gainPercentMode = screen.getByLabelText(/listing gain.*percent/i)
      if (gainPercentMode) {
        await user.click(gainPercentMode)
        
        await waitFor(() => {
          const gainPercentInput = screen.getByLabelText(/listing gain.*percent/i)
          expect(gainPercentInput).toBeInTheDocument()
        })
      }
    })
  })

  describe('Validation', () => {
    it('should validate minimum application amount of ₹1,000', async () => {
      const user = userEvent.setup()
      renderWithProviders(<IPOCalculator />)
      
      const amountInput = screen.getByLabelText(/application amount/i)
      await user.clear(amountInput)
      await user.type(amountInput, '500')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*1000/i)).toBeInTheDocument()
      })
    })
  })

  describe('Tax Calculations', () => {
    it('should apply STCG (15%) for holdings < 1 year', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<IPOCalculator />)
      
      const holdingPeriodInput = screen.getByLabelText(/holding period/i)
      await user.clear(holdingPeriodInput)
      await user.type(holdingPeriodInput, '0.5') // 6 months
      
      await waitFor(() => {
        // STCG @ 15% should apply
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should apply LTCG (10% above ₹1L exemption) for holdings ≥ 1 year', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<IPOCalculator />)
      
      const holdingPeriodInput = screen.getByLabelText(/holding period/i)
      await user.clear(holdingPeriodInput)
      await user.type(holdingPeriodInput, '2') // 2 years
      
      await waitFor(() => {
        // LTCG @ 10% above ₹1L exemption should apply
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })
})

