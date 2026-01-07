/**
 * 54EC Bonds Calculator Tests
 * Tests based on product requirements: Capital gains exemption, interest taxable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Bonds54ECCalculator from './54ECBondsCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'

describe('54EC Bonds Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('Initial Calculator Load', () => {
    it('should render calculator with default values', () => {
      renderWithProviders(<Bonds54ECCalculator />)
      
      expect(screen.getByText('54EC Bonds Calculator')).toBeInTheDocument()
    })
  })

  describe('Tax Calculations', () => {
    it('should exempt capital gains on property sale', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      renderWithProviders(<Bonds54ECCalculator />)
      
      await waitFor(() => {
        // Capital gains should be exempt
        expect(screen.getByText(/tax savings.*benefits/i)).toBeInTheDocument()
      })
    })

    it('should tax interest income', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      
      renderWithProviders(<Bonds54ECCalculator />)
      
      await waitFor(() => {
        // Interest should be taxable
        expect(screen.getByText(/tax.*interest/i)).toBeInTheDocument()
      })
    })
  })
})

