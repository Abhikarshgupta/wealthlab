/**
 * SCSS Calculator Tests
 * Tests based on product requirements: Senior citizen scheme, quarterly interest payments
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SCSSCalculator from './SCSSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('SCSS Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<SCSSCalculator />)
      
      expect(screen.getByText('SCSS Calculator')).toBeInTheDocument()
      
      // Should require senior's age
      const ageInput = screen.getByLabelText(/age|senior/i)
      expect(ageInput).toBeInTheDocument()
    })

    it('should validate minimum age of 60 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SCSSCalculator />)
      
      const ageInput = screen.getByLabelText(/age|senior/i)
      await user.clear(ageInput)
      await user.type(ageInput, '55')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*60/i)).toBeInTheDocument()
      })
    })

    it('should allow age 55 for defense personnel', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SCSSCalculator />)
      
      // Enable defense personnel toggle
      const defenseToggle = screen.getByLabelText(/defense/i)
      if (defenseToggle) {
        await user.click(defenseToggle)
      }
      
      const ageInput = screen.getByLabelText(/age|senior/i)
      await user.clear(ageInput)
      await user.type(ageInput, '55')
      
      await waitFor(() => {
        // Should not show error for 55 if defense personnel
        expect(screen.queryByText(/minimum.*60/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Validation', () => {
    it('should validate tenure between 1-5 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SCSSCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '6')
      
      await waitFor(() => {
        expect(screen.getByText(/maximum.*5/i)).toBeInTheDocument()
      })
    })

    it('should validate maximum investment of ₹30 lakh', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SCSSCalculator />)
      
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '3500000')
      
      await waitFor(() => {
        expect(screen.getByText(/maximum.*30.*lakh/i)).toBeInTheDocument()
      })
    })
  })

  describe('Real-World Calculations', () => {
    it('should calculate quarterly interest payment', async () => {
      renderWithProviders(<SCSSCalculator />)
      
      await waitFor(() => {
        // Should show quarterly interest payment section
        expect(screen.getByText(/quarterly.*interest/i)).toBeInTheDocument()
      })
    })

    it('should show TDS warning when annual interest exceeds ₹50,000 (senior citizen threshold)', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SCSSCalculator />)
      
      // Set high principal to generate > ₹50K annual interest
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '1000000')
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '8')
      
      await waitFor(() => {
        // Annual interest = ₹80,000 (exceeds ₹50K threshold for senior citizens)
        expect(screen.getByText(/tds.*applicable/i)).toBeInTheDocument()
      })
    })
  })
})

