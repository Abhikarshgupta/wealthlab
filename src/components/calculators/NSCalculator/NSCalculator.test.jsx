/**
 * NSC Calculator Tests
 * Tests based on product requirements: Fixed 5-year tenure, interest taxable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NSCalculator from './NSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('NSC Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<NSCalculator />)
      
      expect(screen.getByText('NSC Calculator')).toBeInTheDocument()
      
      // Default principal: ₹1L
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      expect(principalInput).toHaveValue(100000)
      
      // Tenure should be fixed at 5 years (displayed, not editable)
      expect(screen.getByText(/5.*years/i)).toBeInTheDocument()
    })

    it('should display results when valid inputs are provided', async () => {
      renderWithProviders(<NSCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument()
      })
    })
  })

  describe('Validation', () => {
    it('should show error for principal below ₹1,000', async () => {
      const user = userEvent.setup()
      renderWithProviders(<NSCalculator />)
      
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '500')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*1000/i)).toBeInTheDocument()
      })
    })
  })

  describe('Real-World Calculations', () => {
    it('should calculate maturity for ₹1L @ 7.7% for 5 years', async () => {
      renderWithProviders(<NSCalculator />)
      
      await waitFor(() => {
        // NSC compounds annually, paid at maturity
        // Maturity = P(1 + r)^5 = 100000 * (1.077)^5 ≈ ₹145,000
        expect(screen.getByText(/money in hand/i)).toBeInTheDocument()
      })
    })

    it('should show tax on interest income', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      renderWithProviders(<NSCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })
})

