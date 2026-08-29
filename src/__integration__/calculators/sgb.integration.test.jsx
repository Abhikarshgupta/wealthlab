/**
 * SGB Calculator — integration tests (hook + UI wiring)
 * Golden source: tests/fixtures/golden/sgb.json
 * Scenario IDs: SGB-01, SGB-02, SGB-03, SGB-14, SGB-20, SGB-23, SGB-26
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, waitFor as waitForHook } from '@testing-library/react'
import SGBCalculator from '@/components/calculators/SGBCalculator/SGBCalculator'
import useSGBCalculator from '@/components/calculators/SGBCalculator/useSGBCalculator'
import {
  renderWithProviders,
  resetUserPreferences,
  setUserPreferences,
} from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../tests/fixtures/golden/sgb.json'

vi.mock('@/utils/goldPriceService', async () => {
  const actual = await vi.importActual('@/utils/goldPriceService')
  return {
    ...actual,
    getGoldPricePerGram: vi.fn().mockResolvedValue({ price: 6500, isRealTime: false }),
    getCachedGoldPrice: vi.fn().mockReturnValue(6500),
  }
})

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

describe('SGB Calculator integration', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  it('SGB-01: loads with documented default values', async () => {
    renderWithProviders(<SGBCalculator />)

    expect(screen.getByText('SGB Calculator')).toBeInTheDocument()
    expect(getInput('goldAmount')).toHaveValue(10)
    expect(getInput('goldAppreciationRate')).toHaveValue(investmentRates.sgb.goldAppreciation)

    await waitFor(() => {
      const tenure8 = document.querySelector('input[name="tenure"][value="8"]')
      expect(tenure8).toHaveAttribute('checked')
    })

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('SGB-02: results update in real time when gold amount changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SGBCalculator />)

    const goldInput = getInput('goldAmount')
    await user.clear(goldInput)
    await user.type(goldInput, '50')

    await waitFor(() => {
      expect(goldInput).toHaveValue(50)
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })

  it('SGB-03: hook returns post-tax money in hand from golden fixture', async () => {
    const row = findGolden('SGB-14')
    setUserPreferences({ taxSlab: 0.3, adjustInflation: false })
    const { goldAmount, tenure, goldAppreciationRate } = row.inputs

    const { result } = renderHook(() =>
      useSGBCalculator(goldAmount, tenure, goldAppreciationRate)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('SGB-14: golden maturity matches hook results within tolerance', async () => {
    const row = findGolden('SGB-14')
    const { goldAmount, tenure, goldAppreciationRate } = row.inputs

    const { result } = renderHook(() =>
      useSGBCalculator(goldAmount, tenure, goldAppreciationRate)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
      expect(
        withinTolerance(result.current.principal, row.expected.principal, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('SGB-20: fixed interest component matches golden in hook', async () => {
    const row = findGolden('SGB-20')
    const { goldAmount, tenure, goldAppreciationRate } = row.inputs

    const { result } = renderHook(() =>
      useSGBCalculator(goldAmount, tenure, goldAppreciationRate)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(
        withinTolerance(result.current.fixedInterestAmount, row.expected.fixedInterestAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('SGB-23: fallback gold price used when API returns non-real-time price', async () => {
    const row = findGolden('SGB-23')
    const { goldAmount, tenure, goldAppreciationRate } = row.inputs

    const { result } = renderHook(() =>
      useSGBCalculator(goldAmount, tenure, goldAppreciationRate)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.isRealTimePrice).toBe(false)
      expect(result.current.goldPricePerGram).toBe(row.expected.goldPricePerGram)
      expect(
        withinTolerance(result.current.maturityAmount, row.expected.maturityAmount, row.expected.tolerance)
      ).toBe(true)
    })
  })

  it('SGB-26: tax-free at maturity — post-tax equals nominal', async () => {
    const row = findGolden('SGB-26')
    setUserPreferences({ taxSlab: row.inputs.incomeTaxSlab, adjustInflation: false })
    const { goldAmount, tenure, goldAppreciationRate } = row.inputs

    const { result } = renderHook(() =>
      useSGBCalculator(goldAmount, tenure, goldAppreciationRate)
    )

    await waitForHook(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.taxAmount).toBe(row.expected.taxAmount)
      expect(
        withinTolerance(result.current.postTaxAmount, row.expected.postTaxAmount, row.expected.tolerance)
      ).toBe(true)
    })

    renderWithProviders(<SGBCalculator />)

    await waitFor(() => {
      expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
    })
  })
})
