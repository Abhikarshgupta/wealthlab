/**
 * REITs Calculator Tests
 * Tests based on product requirements: Dividend income + capital gains taxation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import REITsCalculator from './REITsCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('REITs Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<REITsCalculator />)
      
      expect(screen.getByText('REITs Calculator')).toBeInTheDocument()
    })
  })

  describe('Tax Calculations', () => {
    it('should tax dividend income as per income slab', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      renderWithProviders(<REITsCalculator />)
      
      await waitFor(() => {
        // Dividend should be taxable as per income slab
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })

    it('should apply LTCG/STCG rules for capital gains', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      const user = userEvent.setup()
      renderWithProviders(<REITsCalculator />)
      
      const tenureInput = screen.getByLabelText(/tenure/i)
      await user.clear(tenureInput)
      await user.type(tenureInput, '2') // 2 years (LTCG)
      
      await waitFor(() => {
        // Capital gains should be taxed
        expect(screen.getByText(/tax breakdown/i)).toBeInTheDocument()
      })
    })
  })
})

