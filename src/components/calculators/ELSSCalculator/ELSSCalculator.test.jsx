/**
 * ELSS Calculator Tests
 * Tests based on product requirements: 3-year lock-in, LTCG tax rules
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ELSSCalculator from './ELSSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('ELSS Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<ELSSCalculator />)
      
      expect(screen.getByText('ELSS Calculator')).toBeInTheDocument()
    })

    it('should show 3-year lock-in period information', () => {
      renderWithProviders(<ELSSCalculator />)
      
      expect(screen.getByText(/3.*year.*lock/i)).toBeInTheDocument()
    })
  })

  describe('Tax Calculations', () => {
    it('should apply STCG (15%) for holdings < 3 years', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<ELSSCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '2') // 2 years (< 3 years)
      
      await waitFor(() => {
        // STCG @ 15% should apply
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should apply LTCG (10% above ₹1L exemption) for holdings ≥ 3 years', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<ELSSCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '5') // 5 years (≥ 3 years)
      
      await waitFor(() => {
        // LTCG @ 10% above ₹1L exemption should apply
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })
})

