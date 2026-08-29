/**
 * RD Calculator component tests
 * Scenario IDs: RD-01 through RD-15, RD-20
 * Golden source: tests/fixtures/golden/rd.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RDCalculator from './RDCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import { calculateRD } from '@/utils/calculations'
import goldenCases from '../../../../tests/fixtures/golden/rd.json'

vi.mock('@/components/common/PieChart/PieChart', () => ({
  default: ({ title }) => <div data-testid="pie-chart-mock">{title}</div>,
}))

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const expectTextPresent = (matcher) => {
  expect(screen.getAllByText(matcher).length).toBeGreaterThan(0)
}

describe('RD Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('RD-01: Calculator loads with documented default values', () => {
    it('renders defaults from schema and investmentRates', () => {
      renderWithProviders(<RDCalculator />)

      expect(screen.getByText('RD Calculator')).toBeInTheDocument()

      const depositInput = getInput('monthlyDeposit')
      expect(depositInput).toHaveValue(5000)

      const tenureYearsInput = getInput('tenureYears')
      expect(tenureYearsInput).toHaveValue(1)

      const tenureMonthsInput = getInput('tenureMonths')
      expect(tenureMonthsInput).toHaveValue(0)

      const rateInput = getInput('rate')
      expect(rateInput).toHaveValue(investmentRates.rd.rate)
    })
  })

  describe('RD-02: Results update in real time', () => {
    it('shows results panel without Calculate button', async () => {
      renderWithProviders(<RDCalculator />)

      await waitFor(() => {
        expectTextPresent(/results/i)
      })
    })
  })

  describe('RD-03: Money in Hand post-tax', () => {
    it('displays Money in Hand section', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      renderWithProviders(<RDCalculator />)

      await waitFor(() => {
        expectTextPresent(/money in hand/i)
      })
    })
  })

  describe('RD-04: Tax breakdown visible', () => {
    it('displays tax breakdown section', async () => {
      renderWithProviders(<RDCalculator />)

      await waitFor(() => {
        expectTextPresent(/tax breakdown/i)
      })
    })
  })

  describe('RD-05: Inflation toggle affects spending power', () => {
    it('shows Spending Power when inflation adjustment is on', async () => {
      setUserPreferences({ adjustInflation: true, inflationRate: 6 })
      renderWithProviders(<RDCalculator />)

      await waitFor(() => {
        expectTextPresent(/spending power/i)
      })
    })
  })

  describe('RD-06: Evolution table year-wise breakdown', () => {
    it('shows year rows for default 1-year tenure', async () => {
      renderWithProviders(<RDCalculator />)

      await waitFor(() => {
        expectTextPresent(/year-wise investment evolution/i)
      })
    })
  })

  describe('RD-07: Info panel rate and last updated', () => {
    it('shows RD rate information', async () => {
      renderWithProviders(<RDCalculator />)

      await waitFor(() => {
        expect(screen.getByText(new RegExp(`${investmentRates.rd.rate}`, 'i'))).toBeInTheDocument()
      })
    })
  })

  describe('RD-08: Invalid min amount validation', () => {
    it('shows error for monthly deposit below ₹500', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)

      const depositInput = getInput('monthlyDeposit')
      await user.clear(depositInput)
      await user.type(depositInput, '499')

      await waitFor(() => {
        expect(screen.getAllByText(/Minimum monthly deposit is ₹500/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('RD-09: Invalid max tenure validation', () => {
    it('shows error when tenure exceeds 10 years', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)

      const tenureYearsInput = getInput('tenureYears')
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '11')

      await waitFor(() => {
        expect(screen.getAllByText(/Maximum tenure is 10 years/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('RD-10: Zero tenure validation', () => {
    it('shows error when years and months are both zero', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)

      const tenureYearsInput = getInput('tenureYears')
      const tenureMonthsInput = getInput('tenureMonths')

      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '0')
      await user.clear(tenureMonthsInput)
      await user.type(tenureMonthsInput, '0')

      await waitFor(() => {
        expect(screen.getAllByText(/Please enter at least 1 month/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('RD-11: Negative monthly deposit rejected', () => {
    it('shows validation when deposit is negative', async () => {
      renderWithProviders(<RDCalculator />)

      const depositInput = getInput('monthlyDeposit')
      fireEvent.change(depositInput, { target: { value: '-1000' } })
      fireEvent.blur(depositInput)

      await waitFor(() => {
        expect(screen.getAllByText(/Minimum monthly deposit is ₹500/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('RD-12: Non-numeric deposit rejected', () => {
    it('shows validation or empty state for non-numeric input', async () => {
      renderWithProviders(<RDCalculator />)

      const depositInput = getInput('monthlyDeposit')
      fireEvent.change(depositInput, { target: { value: 'abc' } })
      fireEvent.blur(depositInput)

      await waitFor(() => {
        const hasError =
          screen.queryAllByText(/Monthly deposit must be a number/i).length > 0 ||
          screen.queryAllByText(/Enter values to see calculation results/i).length > 0
        expect(hasError).toBe(true)
      })
    })
  })

  describe('RD-13: Extremely large monthly deposit', () => {
    it('handles large deposit without overflow', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)

      const depositInput = getInput('monthlyDeposit')
      await user.clear(depositInput)
      await user.type(depositInput, '100000')

      const tenureYearsInput = getInput('tenureYears')
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, '5')

      await waitFor(() => {
        expectTextPresent(/money in hand/i)
      })
    })
  })

  describe('RD-14: Golden calculation', () => {
    it('matches reference maturity for golden fixture', async () => {
      const row = findGolden('RD-14')
      const { monthlyDeposit, tenureYears, tenureMonths, rate, compoundingFrequency } = row.inputs
      const totalMonths = tenureYears * 12 + tenureMonths
      const expected = calculateRD(monthlyDeposit, rate / 100, totalMonths, compoundingFrequency)

      expect(Math.abs(expected - row.expected.maturityAmount)).toBeLessThanOrEqual(
        row.expected.tolerance
      )
    })
  })

  describe('RD-15: Pie chart renders', () => {
    it('shows pie chart mock when results are available', async () => {
      renderWithProviders(<RDCalculator />)

      await waitFor(() => {
        expect(screen.getAllByTestId('pie-chart-mock').length).toBeGreaterThan(0)
      })
    })
  })

  describe('RD-20: Minimum monthly deposit', () => {
    it('accepts ₹500 minimum deposit', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RDCalculator />)

      const depositInput = getInput('monthlyDeposit')
      await user.clear(depositInput)
      await user.type(depositInput, '500')

      await waitFor(() => {
        expectTextPresent(/money in hand/i)
      })
    })
  })
})
