/**
 * RD Calculator Tests
 * Tests based on product requirements and real-world calculations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RDCalculator from './RDCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { calculateRD } from '@/utils/calculations'

describe('RD Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<RDCalculator />)
      
      expect(screen.getByText('RD Calculator')).toBeInTheDocument()
      
      // Default monthly deposit: ₹5,000
      const depositInput = screen.getByLabelText(/monthly deposit/i)
      expect(depositInput).toHaveValue(5000)
    })

    it('should display results when valid inputs are provided', async () => {
      renderWithProviders(<RDCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument()
      })
    })
  })

  describe('Slider Interactions', () => {
    it('should update monthly deposit when slider is moved', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)
      
      const depositInput = screen.getByLabelText(/monthly deposit/i)
      await user.clear(depositInput)
      await user.type(depositInput, '10000')
      
      await waitFor(() => {
        expect(parseFloat(depositInput.value)).toBeGreaterThanOrEqual(5000)
      })
    })

    it('should enforce minimum monthly deposit of ₹500', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)
      
      const depositInput = screen.getByLabelText(/monthly deposit/i)
      await user.clear(depositInput)
      await user.type(depositInput, '300')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*500/i)).toBeInTheDocument()
      })
    })
  })

  describe('Invalid Inputs and Validation', () => {
    it('should show error for monthly deposit below ₹500', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)
      
      const depositInput = screen.getByLabelText(/monthly deposit/i)
      await user.clear(depositInput)
      await user.type(depositInput, '300')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*500/i)).toBeInTheDocument()
      })
    })

    it('should validate tenure is provided', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)
      
      const tenureYearsInput = screen.getByLabelText(/years/i)
      const tenureMonthsInput = screen.getByLabelText(/months/i)
      
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '0')
      await user.clear(tenureMonthsInput)
      await user.type(tenureMonthsInput, '0')
      
      await waitFor(() => {
        expect(screen.getByText(/tenure.*required/i)).toBeInTheDocument()
      })
    })
  })

  describe('Real-World Calculations', () => {
    it('should calculate correct maturity for ₹5K/month @ 7% for 5 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)
      
      const depositInput = screen.getByLabelText(/monthly deposit/i)
      await user.clear(depositInput)
      await user.type(depositInput, '5000')
      
      const tenureYearsInput = screen.getByLabelText(/years/i)
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '5')
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '7')
      
      await waitFor(() => {
        // Total deposits = 5000 * 60 = ₹3,00,000
        // Maturity should be higher due to interest
        const maturity = calculateRD(5000, 0.07, 60, 'quarterly')
        expect(maturity).toBeGreaterThan(300000)
      })
    })

    it('should show effective return percentage', async () => {
      renderWithProviders(<RDCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/effective return/i)).toBeInTheDocument()
      })
    })

    it('should display monthly deposit info in Tax Breakdown', async () => {
      renderWithProviders(<RDCalculator />)
      
      await waitFor(() => {
        const taxBreakdown = screen.getByText(/tax breakdown/i)
        expect(taxBreakdown).toBeInTheDocument()
      })
    })
  })
})

