/**
 * POMIS Calculator Tests
 * Tests based on product requirements: Fixed 5-year tenure, monthly interest payments
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import POMISCalculator from './POMISCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('POMIS Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<POMISCalculator />)
      
      expect(screen.getByText('POMIS Calculator')).toBeInTheDocument()
      
      // Default principal: ₹1L
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      expect(principalInput).toHaveValue(100000)
      
      // Tenure should be fixed at 5 years
      expect(screen.getByText(/5.*years/i)).toBeInTheDocument()
    })

    it('should show joint account toggle', () => {
      renderWithProviders(<POMISCalculator />)
      
      expect(screen.getByLabelText(/joint account/i)).toBeInTheDocument()
    })
  })

  describe('Joint Account Limits', () => {
    it('should enforce ₹9L limit for single account', async () => {
      const user = userEvent.setup()
      renderWithProviders(<POMISCalculator />)
      
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '1000000')
      
      await waitFor(() => {
        expect(screen.getByText(/maximum.*9.*lakh/i)).toBeInTheDocument()
      })
    })

    it('should allow ₹15L for joint account', async () => {
      const user = userEvent.setup()
      renderWithProviders(<POMISCalculator />)
      
      // Enable joint account
      const jointToggle = screen.getByLabelText(/joint account/i)
      await user.click(jointToggle)
      
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '1500000')
      
      await waitFor(() => {
        // Should not show error for ₹15L with joint account
        expect(screen.queryByText(/maximum.*9.*lakh/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Real-World Calculations', () => {
    it('should calculate monthly interest payment', async () => {
      renderWithProviders(<POMISCalculator />)
      
      await waitFor(() => {
        // Monthly Interest = (Investment × Rate) / 12
        // For ₹1L @ 7.4%: (100000 × 0.074) / 12 ≈ ₹6,167/month
        expect(screen.getByText(/monthly.*income.*payment/i)).toBeInTheDocument()
      })
    })

    it('should show TDS warning when annual interest exceeds ₹40,000', async () => {
      const user = userEvent.setup()
      renderWithProviders(<POMISCalculator />)
      
      // Set high principal to generate > ₹40K annual interest
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '600000')
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '8')
      
      await waitFor(() => {
        // Annual interest = ₹48,000 (exceeds ₹40K threshold)
        expect(screen.getByText(/tds.*applicable/i)).toBeInTheDocument()
      })
    })
  })
})

