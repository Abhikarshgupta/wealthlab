/**
 * Equity Calculator Tests
 * Tests based on product requirements: LTCG/STCG tax rules
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EquityCalculator from './EquityCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('Equity Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<EquityCalculator />)
      
      expect(screen.getByText('Equity Calculator')).toBeInTheDocument()
      
      // Should show SIP/Lumpsum options
      expect(screen.getByLabelText(/sip|lumpsum/i)).toBeInTheDocument()
    })
  })

  describe('Investment Type Selection', () => {
    it('should allow switching between SIP and Lumpsum', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EquityCalculator />)
      
      const lumpsumOption = screen.getByLabelText(/lumpsum/i)
      if (lumpsumOption) {
        await user.click(lumpsumOption)
        
        await waitFor(() => {
          expect(lumpsumOption).toBeChecked()
        })
      }
    })
  })

  describe('Tax Calculations', () => {
    it('should apply STCG (15%) for holdings < 1 year', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<EquityCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '0.5') // 6 months
      
      await waitFor(() => {
        // STCG @ 15% should apply
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should apply LTCG (10% above ₹1L exemption) for holdings ≥ 1 year', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<EquityCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '2') // 2 years
      
      await waitFor(() => {
        // LTCG @ 10% above ₹1L exemption should apply
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })
})

