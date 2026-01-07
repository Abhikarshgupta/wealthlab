/**
 * PPF Calculator Tests
 * Tests based on product requirements: Tax-free (EEE), ₹1.5L annual limit
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PPFCalculator from './PPFCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('PPF Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<PPFCalculator />)
      
      expect(screen.getByText('PPF Calculator')).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('should validate minimum investment of ₹500', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PPFCalculator />)
      
      const investmentInput = screen.getByLabelText(/yearly investment|investment/i)
      await user.clear(investmentInput)
      await user.type(investmentInput, '300')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*500/i)).toBeInTheDocument()
      })
    })

    it('should validate maximum investment of ₹1.5L per year', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PPFCalculator />)
      
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
      renderWithProviders(<PPFCalculator />)
      
      await waitFor(() => {
        // PPF is tax-free, should not show tax breakdown
        expect(screen.queryByText(/tax breakdown/i)).not.toBeInTheDocument()
      })
    })
  })
})

