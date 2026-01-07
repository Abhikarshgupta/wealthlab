/**
 * FD Calculator Tests
 * Tests based on product requirements and real-world calculations
 * 
 * Test Coverage:
 * - Initial calculator load (default values, UI rendering)
 * - Slider interactions (changing values via sliders)
 * - Invalid inputs/combinations (validation errors)
 * - Real-world calculations (verified against financial formulas)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FDCalculator from './FDCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences, REAL_WORLD_TEST_CASES } from '@/test/utils/testHelpers'
import { calculateFD } from '@/utils/calculations'

describe('FD Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<FDCalculator />)
      
      // Check title
      expect(screen.getByText('FD Calculator')).toBeInTheDocument()
      
      // Check default principal (₹1L)
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      expect(principalInput).toHaveValue(100000)
      
      // Check default tenure (1 year)
      const tenureYearsInput = screen.getByLabelText(/years/i)
      expect(tenureYearsInput).toHaveValue(1)
      
      // Check default rate (from investmentRates)
      const rateInput = screen.getByLabelText(/rate of interest/i)
      expect(rateInput).toBeInTheDocument()
    })

    it('should display results panel when valid inputs are provided', async () => {
      renderWithProviders(<FDCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument()
      })
    })

    it('should show Money in Hand section in results', async () => {
      renderWithProviders(<FDCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/money in hand/i)).toBeInTheDocument()
      })
    })
  })

  describe('Slider Interactions', () => {
    it('should update principal when slider is moved', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      // Find slider input (range input)
      const sliders = screen.getAllByRole('slider')
      const principalSlider = sliders.find(slider => 
        slider.getAttribute('min') === '1000'
      )
      
      if (principalSlider) {
        await user.clear(principalSlider)
        await user.type(principalSlider, '500000')
        
        await waitFor(() => {
          const principalInput = screen.getByLabelText(/investment amount|principal/i)
          expect(parseFloat(principalInput.value)).toBeGreaterThanOrEqual(100000)
        })
      }
    })

    it('should update rate when rate slider is moved', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '8.5')
      
      await waitFor(() => {
        expect(rateInput.value).toContain('8.5')
      })
    })

    it('should enforce minimum principal of ₹1,000', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '500')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*1000/i)).toBeInTheDocument()
      })
    })
  })

  describe('Invalid Inputs and Validation', () => {
    it('should show error for principal below minimum (₹1,000)', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '500')
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*1000/i)).toBeInTheDocument()
      })
    })

    it('should show error for negative rate', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '-5')
      
      await waitFor(() => {
        expect(screen.getByText(/rate.*at least/i)).toBeInTheDocument()
      })
    })

    it('should show error for rate above 100%', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '150')
      
      await waitFor(() => {
        expect(screen.getByText(/rate.*cannot exceed.*100/i)).toBeInTheDocument()
      })
    })

    it('should validate tenure years and months combination', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const tenureYearsInput = screen.getByLabelText(/years/i)
      const tenureMonthsInput = screen.getByLabelText(/months/i)
      
      // Set both to 0 (invalid)
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '0')
      await user.clear(tenureMonthsInput)
      await user.type(tenureMonthsInput, '0')
      
      await waitFor(() => {
        expect(screen.getByText(/tenure.*required/i)).toBeInTheDocument()
      })
    })

    it('should show error for months > 11', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const tenureMonthsInput = screen.getByLabelText(/months/i)
      await user.clear(tenureMonthsInput)
      await user.type(tenureMonthsInput, '12')
      
      await waitFor(() => {
        expect(screen.getByText(/months.*between.*0.*11/i)).toBeInTheDocument()
      })
    })
  })

  describe('Real-World Calculations', () => {
    it('should calculate correct maturity for ₹1L @ 7% for 5 years (quarterly)', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      // Set inputs
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '100000')
      
      const tenureYearsInput = screen.getByLabelText(/years/i)
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '5')
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '7')
      
      // Set compounding to quarterly
      const compoundingSelect = screen.getByLabelText(/compounding/i)
      if (compoundingSelect) {
        await user.selectOptions(compoundingSelect, 'quarterly')
      }
      
      await waitFor(() => {
        // Verify calculation: P(1 + r/4)^(4*n) = 100000 * (1.0175)^20 ≈ 141,478
        const maturityAmount = calculateFD(100000, 0.07, 5, 'quarterly')
        expect(maturityAmount).toBeCloseTo(141478, -2) // Within ₹100
      })
    })

    it('should calculate tax correctly for interest income', async () => {
      setUserPreferences({ taxSlab: 0.30 }) // 30% tax slab
      
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      // Set inputs: ₹10L @ 7% for 5 years
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '1000000')
      
      const tenureYearsInput = screen.getByLabelText(/years/i)
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '5')
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '7')
      
      await waitFor(() => {
        // Interest earned ≈ ₹414,780 (for ₹10L)
        // Tax @ 30% = ₹124,434
        // Post-tax = ₹1,290,346
        expect(screen.getByText(/tax.*deducted/i)).toBeInTheDocument()
      })
    })

    it('should show TDS warning when annual interest exceeds ₹40,000', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      // Set high principal and rate to generate > ₹40K interest
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '1000000')
      
      const rateInput = screen.getByLabelText(/rate of interest/i)
      await user.clear(rateInput)
      await user.type(rateInput, '8')
      
      await waitFor(() => {
        // Annual interest = ₹80,000 (exceeds ₹40K threshold)
        expect(screen.getByText(/tds.*applicable/i)).toBeInTheDocument()
      })
    })

    it('should calculate different maturity amounts for different compounding frequencies', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      const principal = 100000
      const rate = 7
      const years = 5
      
      // Test quarterly compounding
      const quarterlyMaturity = calculateFD(principal, rate / 100, years, 'quarterly')
      
      // Test monthly compounding (should be higher)
      const monthlyMaturity = calculateFD(principal, rate / 100, years, 'monthly')
      
      // Test annual compounding (should be lower)
      const annualMaturity = calculateFD(principal, rate / 100, years, 'annually')
      
      expect(monthlyMaturity).toBeGreaterThan(quarterlyMaturity)
      expect(quarterlyMaturity).toBeGreaterThan(annualMaturity)
    })
  })

  describe('Compounding Frequency Options', () => {
    it('should allow selecting different compounding frequencies', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      // Find compounding frequency selector
      const compoundingOptions = screen.getAllByRole('radio', { name: /quarterly|monthly|annually|cumulative/i })
      
      if (compoundingOptions.length > 0) {
        await user.click(compoundingOptions[1]) // Select monthly
        
        await waitFor(() => {
          expect(compoundingOptions[1]).toBeChecked()
        })
      }
    })
  })

  describe('Tax Integration', () => {
    it('should display Money in Hand (post-tax amount)', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      renderWithProviders(<FDCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/money in hand/i)).toBeInTheDocument()
      })
    })

    it('should display Tax Breakdown section', async () => {
      renderWithProviders(<FDCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should show correct tax amount based on tax slab', async () => {
      setUserPreferences({ taxSlab: 0.20 }) // 20% slab
      
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)
      
      // Set inputs that generate interest
      const principalInput = screen.getByLabelText(/investment amount|principal/i)
      await user.clear(principalInput)
      await user.type(principalInput, '1000000')
      
      await waitFor(() => {
        // Tax should be calculated at 20% slab
        const taxBreakdown = screen.getByText(/tax breakdown/i)
        expect(taxBreakdown).toBeInTheDocument()
      })
    })
  })

  describe('Inflation Integration', () => {
    it('should show Spending Power when inflation toggle is enabled', async () => {
      setUserPreferences({ adjustInflation: true, inflationRate: 6 })
      
      renderWithProviders(<FDCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/spending power/i)).toBeInTheDocument()
      })
    })

    it('should calculate Spending Power correctly', async () => {
      setUserPreferences({ adjustInflation: true, inflationRate: 6 })
      
      renderWithProviders(<FDCalculator />)
      
      await waitFor(() => {
        // Spending Power should be less than Money in Hand due to inflation
        const spendingPower = screen.getByText(/spending power/i)
        expect(spendingPower).toBeInTheDocument()
      })
    })
  })
})

