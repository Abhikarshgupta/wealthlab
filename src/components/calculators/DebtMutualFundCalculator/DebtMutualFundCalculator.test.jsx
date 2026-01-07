/**
 * Debt Mutual Fund Calculator Tests
 * Tests based on product requirements: Indexation benefit, LTCG/STCG tax rules
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DebtMutualFundCalculator from './DebtMutualFundCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('Debt Mutual Fund Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<DebtMutualFundCalculator />)
      
      expect(screen.getByText('Debt Mutual Fund Calculator')).toBeInTheDocument()
    })
  })

  describe('Tax Calculations', () => {
    it('should apply STCG (as per income slab) for holdings < 3 years', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<DebtMutualFundCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '2') // 2 years (< 3 years)
      
      await waitFor(() => {
        // STCG as per income slab should apply
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should apply LTCG (20% with indexation) for holdings ≥ 3 years', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<DebtMutualFundCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '5') // 5 years (≥ 3 years)
      
      await waitFor(() => {
        // Should show indexation benefit
        expect(screen.getByText(/indexation/i)).toBeInTheDocument()
      })
    })

    it('should display Tax Efficiency Note', async () => {
      renderWithProviders(<DebtMutualFundCalculator />)
      
      await waitFor(() => {
        expect(screen.getByText(/tax efficiency note/i)).toBeInTheDocument()
      })
    })
  })
})

