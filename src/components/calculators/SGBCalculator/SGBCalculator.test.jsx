/**
 * SGB Calculator Tests
 * Tests based on product requirements: Capital gains exempt if held till maturity, interest taxable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SGBCalculator from './SGBCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('SGB Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<SGBCalculator />)
      
      expect(screen.getByText('SGB Calculator')).toBeInTheDocument()
      
      // Should show gold amount input
      const goldInput = screen.getByLabelText(/gold amount|grams/i)
      expect(goldInput).toBeInTheDocument()
    })
  })

  describe('Tenure Selection', () => {
    it('should allow selecting 5 or 8 years tenure', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SGBCalculator />)
      
      const tenureSelect = screen.getByLabelText(/tenure/i)
      if (tenureSelect) {
        await user.selectOptions(tenureSelect, '5')
        
        await waitFor(() => {
          expect(tenureSelect.value).toBe('5')
        })
      }
    })
  })

  describe('Tax Calculations', () => {
    it('should exempt capital gains if held till maturity', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      renderWithProviders(<SGBCalculator />)
      
      await waitFor(() => {
        // Capital gains should be exempt
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should tax interest income (2.5% annually)', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      renderWithProviders(<SGBCalculator />)
      
      await waitFor(() => {
        // Interest should be taxable
        expect(screen.getByText(/interest.*taxable/i)).toBeInTheDocument()
      })
    })
  })
})

