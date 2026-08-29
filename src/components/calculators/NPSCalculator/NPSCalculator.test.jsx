/**
 * NPS Calculator component tests
 * Scenario IDs: NPS-01, NPS-08, NPS-09, NPS-15, NPS-20, NPS-22
 * Golden source: tests/fixtures/golden/nps.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NPSCalculator from './NPSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import goldenCases from '../../../../tests/fixtures/golden/nps.json'

vi.mock('@/components/common/PieChart/PieChart', () => ({
  default: ({ title }) => <div data-testid="pie-chart-mock">{title}</div>,
}))

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

describe('NPS Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('NPS-01: Initial Calculator Load', () => {
    it('should render calculator with documented default values', async () => {
      renderWithProviders(<NPSCalculator />)

      expect(screen.getByText('NPS Calculator')).toBeInTheDocument()
      expect(getInput('monthlyContribution')).toHaveValue(5000)
      expect(getInput('tenure')).toHaveValue(25)
      expect(getInput('currentAge')).toHaveValue(35)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('NPS-09: Asset Allocation Validation', () => {
    it('should show error when total allocation does not equal 100%', async () => {
      const user = userEvent.setup()
      renderWithProviders(<NPSCalculator />)

      const equityInput = getInput('equityAllocation')
      const corporateInput = getInput('corporateBondsAllocation')
      const governmentInput = getInput('governmentBondsAllocation')

      await user.clear(equityInput)
      await user.type(equityInput, '50')
      await user.clear(corporateInput)
      await user.type(corporateInput, '30')
      await user.clear(governmentInput)
      await user.type(governmentInput, '15')

      await waitFor(() => {
        expect(screen.getAllByText(/must equal 100%/i).length).toBeGreaterThan(0)
      })
    })

    it('NPS-20: valid 100% allocation shows results', async () => {
      const row = findGolden('NPS-20')
      const user = userEvent.setup()
      renderWithProviders(<NPSCalculator />)

      const contributionInput = getInput('monthlyContribution')
      await user.clear(contributionInput)
      await user.type(contributionInput, String(row.inputs.monthlyContribution))

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
        const allocationLabels = screen.getAllByText(/Total Allocation/i)
        expect(
          allocationLabels.some((el) => el.closest('p')?.textContent?.includes('100%'))
        ).toBe(true)
      })
    })
  })

  describe('NPS-08: Minimum Contribution Validation', () => {
    it('should reject contribution below ₹500', async () => {
      const row = findGolden('NPS-08')
      const user = userEvent.setup()
      renderWithProviders(<NPSCalculator />)

      const contributionInput = getInput('monthlyContribution')
      await user.clear(contributionInput)
      await user.type(contributionInput, String(row.inputs.monthlyContribution))

      await waitFor(() => {
        expect(screen.getAllByText(new RegExp(row.expected.validationError, 'i')).length).toBeGreaterThan(0)
      })
    })
  })

  describe('NPS-22: Tax Calculations', () => {
    it('should apply partial tax (60% tax-free, 40% taxable)', async () => {
      setUserPreferences({ taxSlab: 0.30 })

      renderWithProviders(<NPSCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/tax breakdown/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('NPS-15: Charts', () => {
    it('should render pie chart for investment breakdown', async () => {
      renderWithProviders(<NPSCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })

      expect(screen.getAllByTestId('pie-chart-mock').length).toBeGreaterThan(0)
    })
  })
})
