/**
 * Test Helper Utilities
 * Common utilities for calculator tests
 */

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { vi } from 'vitest'
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
 * In-memory localStorage for persistence tests (corpus, prefs)
 */
export const mockLocalStorage = () => {
  const store = new Map()
  const api = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() {
      return store.size
    },
    key: (index) => [...store.keys()][index] ?? null,
  }
  vi.stubGlobal('localStorage', api)
  return { store, restore: () => vi.unstubAllGlobals() }
}

/**
 * Stub fetch with a response map keyed by URL substring
 */
export const mockFetch = (responses = {}) => {
  const handler = vi.fn(async (input) => {
    const url = typeof input === 'string' ? input : input.url
    const entry = Object.entries(responses).find(([key]) => url.includes(key))
    if (!entry) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    }
    const [, body] = entry
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', handler)
  return { handler, restore: () => vi.unstubAllGlobals() }
}

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

