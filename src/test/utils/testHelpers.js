/**
 * Test Helper Utilities
 * Common utilities for calculator tests
 */

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { ThemeProvider } from '@/contexts/ThemeContext'

/**
 * Render component with router, theme, and store context
 */
export const renderWithProviders = (ui) => {
  return render(ui, {
    wrapper: ({ children }) => 
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(ThemeProvider, null, children)
      ),
  })
}

/**
 * Reset user preferences store to defaults
 */
export const resetUserPreferences = () => {
  const store = useUserPreferencesStore.getState()
  store.setDefaultInflationRate(6)
  store.setAdjustInflation(false)
  store.setIncomeTaxSlab(0.30) // 30% default
}

/**
 * Set user preferences for testing
 */
export const setUserPreferences = ({ inflationRate = 6, adjustInflation = false, taxSlab = 0.30 } = {}) => {
  const store = useUserPreferencesStore.getState()
  if (inflationRate !== undefined) store.setDefaultInflationRate(inflationRate)
  if (adjustInflation !== undefined) store.setAdjustInflation(adjustInflation)
  if (taxSlab !== undefined) store.setIncomeTaxSlab(taxSlab)
}

/**
 * Wait for async updates
 */
export const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 100))

/**
 * Real-world calculation test cases
 * Based on product requirements and actual financial calculations
 */
export const REAL_WORLD_TEST_CASES = {
  FD: {
    // Test case: ₹1L FD @ 7% for 5 years, quarterly compounding
    standard: {
      principal: 100000,
      tenureYears: 5,
      tenureMonths: 0,
      rate: 7,
      compoundingFrequency: 'quarterly',
      expectedMaturity: 141478, // Approximate: P(1 + r/4)^(4*5) = 100000 * (1.0175)^20
      expectedInterest: 41478,
    },
    // Test case: ₹10L FD @ 6.5% for 2 years, monthly compounding
    highValue: {
      principal: 1000000,
      tenureYears: 2,
      tenureMonths: 0,
      rate: 6.5,
      compoundingFrequency: 'monthly',
      expectedMaturity: 1138000, // Approximate
      expectedInterest: 138000,
    },
  },
  RD: {
    // Test case: ₹5000/month RD @ 7% for 5 years, quarterly compounding
    standard: {
      monthlyDeposit: 5000,
      tenureYears: 5,
      tenureMonths: 0,
      rate: 7,
      compoundingFrequency: 'quarterly',
      expectedMaturity: 360000, // Approximate
      expectedInterest: 60000,
    },
  },
  SIP: {
    // Test case: ₹10K/month SIP @ 12% CAGR for 10 years
    standard: {
      monthlyInvestment: 10000,
      tenure: 10,
      expectedCAGR: 12,
      expectedCorpus: 2300000, // Approximate
    },
  },
}

