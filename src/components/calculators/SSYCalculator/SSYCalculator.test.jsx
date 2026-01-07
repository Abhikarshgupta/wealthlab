/**
 * SSY Calculator Tests
 * Tests based on product requirements: Tax-free (EEE), girl must be < 10 years
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SSYCalculator from './SSYCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('SSY Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<SSYCalculator />)
      
      expect(screen.getByText('SSY Calculator')).toBeInTheDocument()
      
      // Should require girl's age
      const ageInput = screen.getByLabelText(/girl.*age|age/i)
      expect(ageInput).toBeInTheDocument()
    })
  })

  describe('Age Validation', () => {
    it('should validate girl must be below 10 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)
      
      const ageInput = screen.getByLabelText(/girl.*age|age/i)
      await user.clear(ageInput)
      await user.type(ageInput, '10')
      
      await waitFor(() => {
        expect(screen.getByText(/below.*10.*years/i)).toBeInTheDocument()
      })
    })
  })

  describe('Validation', () => {
    it('should validate minimum investment of ₹250', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)
      
      const investmentInput = screen.getByLabelText(/yearly investment|investment/i)
      await user.clear(investmentInput)
      await user.type(investmentInput, '100')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*250/i)).toBeInTheDocument()
      })
    })

    it('should validate maximum investment of ₹1.5L per year', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SSYCalculator />)
      
      const investmentInput = screen.getByLabelText(/yearly investment|investment/i)
      await user.clear(investmentInput)
      await user.type(investmentInput, '200000')
      
      await waitFor(() => {
        expect(screen.getByText(/maximum.*1.5.*lakh/i)).toBeInTheDocument()
      })
    })
  })

  describe('Tax-Free Status', () => {
    it('should show tax-free status (EEE)', async () => {
      renderWithProviders(<SSYCalculator />)
      
      await waitFor(() => {
        // SSY is tax-free, should not show tax breakdown
        expect(screen.queryByText(/tax breakdown/i)).not.toBeInTheDocument()
      })
    })
  })
})

