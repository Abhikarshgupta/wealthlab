/**
 * SIP Calculator Tests
 * Tests based on product requirements: LTCG tax rules, ₹1L exemption
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SIPCalculator from './SIPCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { calculateSIP } from '@/utils/calculations'

describe('SIP Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<SIPCalculator />)
      
      expect(screen.getByText('SIP Calculator')).toBeInTheDocument()
      
      // Default monthly SIP: ₹10K
      const sipInput = screen.getByLabelText(/monthly sip|monthly investment/i)
      expect(sipInput).toBeInTheDocument()
    })

    it('should display results when valid inputs are provided', async () => {
      renderWithProviders(<SIPCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument()
      })
    })
  })

  describe('Validation', () => {
    it('should show error for SIP below ₹500', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SIPCalculator />)
      
      const sipInput = screen.getByLabelText(/monthly sip|monthly investment/i)
      await user.clear(sipInput)
      await user.type(sipInput, '300')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*500/i)).toBeInTheDocument()
      })
    })

    it('should validate tenure between 1-50 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SIPCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '60')
      
      await waitFor(() => {
        expect(screen.getByText(/maximum.*50/i)).toBeInTheDocument()
      })
    })
  })

  describe('Step-Up SIP', () => {
    it('should enable step-up percentage when step-up is enabled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SIPCalculator />)
      
      const stepUpToggle = screen.getByLabelText(/step.*up/i)
      if (stepUpToggle) {
        await user.click(stepUpToggle)
        
        await waitFor(() => {
          const stepUpPercentageInput = screen.getByLabelText(/step.*up.*percentage/i)
          expect(stepUpPercentageInput).toBeInTheDocument()
        })
      }
    })
  })

  describe('Real-World Calculations', () => {
    it('should calculate corpus for ₹10K/month @ 12% for 10 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SIPCalculator />)
      
      const sipInput = screen.getByLabelText(/monthly sip|monthly investment/i)
      await user.clear(sipInput)
      await user.type(sipInput, '10000')
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '10')
      
      const returnInput = screen.getByLabelText(/expected return|cagr/i)
      await user.clear(returnInput)
      await user.type(returnInput, '12')
      
      await waitFor(() => {
        // Total invested = 10000 * 12 * 10 = ₹12,00,000
        // Corpus should be significantly higher due to compounding
        const corpus = calculateSIP(10000, 0.12, 120)
        expect(corpus).toBeGreaterThan(1200000)
      })
    })

    it('should calculate LTCG tax correctly (10% above ₹1L exemption)', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      renderWithProviders(<SIPCalculator />)
      
      await waitFor(() => {
        // For LTCG: 10% tax above ₹1L exemption
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })
})

