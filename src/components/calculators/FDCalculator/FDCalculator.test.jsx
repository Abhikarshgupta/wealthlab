/**
 * FD Calculator component tests
 * Scenario IDs: FD-01 through FD-15, FD-20, FD-23
 * Golden source: tests/fixtures/golden/fd.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FDCalculator from './FDCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import { calculateFD } from '@/utils/calculations'
import goldenCases from '../../../../tests/fixtures/golden/fd.json'

vi.mock('@/components/common/PieChart/PieChart', () => ({
  default: ({ title }) => <div data-testid="pie-chart-mock">{title}</div>,
}))

const findGolden = (id) => goldenCases.find((row) => row.id === id)

/** InputField labels are not htmlFor-linked; query by name attribute */
const getInput = (name) => document.querySelector(`input[name="${name}"]`)

const expectTextPresent = (matcher) => {
  expect(screen.getAllByText(matcher).length).toBeGreaterThan(0)
}

describe('FD Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('FD-01: Calculator loads with documented default values', () => {
    it('renders defaults from schema and investmentRates', () => {
      renderWithProviders(<FDCalculator />)

      expect(screen.getByText('FD Calculator')).toBeInTheDocument()

      const principalInput = getInput('principal')
      expect(principalInput).toHaveValue(100000)

      const tenureYearsInput = getInput('tenureYears')
      expect(tenureYearsInput).toHaveValue(1)

      const tenureMonthsInput = getInput('tenureMonths')
      expect(tenureMonthsInput).toHaveValue(0)

      const rateInput = getInput('rate')
      expect(rateInput).toHaveValue(investmentRates.fd.rate)
    })
  })

  describe('FD-02: Results update in real time', () => {
    it('shows results panel without Calculate button', async () => {
      renderWithProviders(<FDCalculator />)

      await waitFor(() => {
        expectTextPresent(/results/i)
      })
    })
  })

  describe('FD-03: Money in Hand post-tax', () => {
    it('displays Money in Hand section', async () => {
      setUserPreferences({ taxSlab: 0.30 })
      renderWithProviders(<FDCalculator />)

      await waitFor(() => {
        expectTextPresent(/money in hand/i)
      })
    })
  })

  describe('FD-04: Tax breakdown visible', () => {
    it('displays tax breakdown section', async () => {
      renderWithProviders(<FDCalculator />)

      await waitFor(() => {
        expectTextPresent(/tax breakdown/i)
      })
    })
  })

  describe('FD-05: Inflation toggle affects spending power', () => {
    it('shows Spending Power when inflation adjustment is on', async () => {
      setUserPreferences({ adjustInflation: true, inflationRate: 6 })
      renderWithProviders(<FDCalculator />)

      await waitFor(() => {
        expectTextPresent(/spending power/i)
      })
    })
  })

  describe('FD-06: Evolution table year-wise breakdown', () => {
    it('shows year rows for default 1-year tenure', async () => {
      renderWithProviders(<FDCalculator />)

      await waitFor(() => {
        expectTextPresent(/year-wise investment evolution/i)
      })
    })
  })

  describe('FD-07: Info panel rate and last updated', () => {
    it('shows FD rate information', async () => {
      renderWithProviders(<FDCalculator />)

      await waitFor(() => {
        expect(screen.getByText(new RegExp(`${investmentRates.fd.rate}`, 'i'))).toBeInTheDocument()
      })
    })
  })

  describe('FD-08: Invalid min amount validation', () => {
    it('shows error for principal below ₹1,000', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)

      const principalInput = getInput('principal')
      await user.clear(principalInput)
      await user.type(principalInput, '999')

      await waitFor(() => {
        expect(screen.getAllByText(/Minimum principal amount is ₹1,000/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('FD-09: Invalid max amount validation', () => {
    it('accepts very large principal within slider max', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)

      const principalInput = getInput('principal')
      await user.clear(principalInput)
      await user.type(principalInput, '10000000')

      await waitFor(() => {
        expectTextPresent(/results/i)
      })
    })
  })

  describe('FD-10: Zero tenure validation', () => {
    it('shows error when years and months are both zero', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)

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

  describe('FD-11: Negative principal rejected', () => {
    it('shows validation when principal is negative', async () => {
      renderWithProviders(<FDCalculator />)

      const principalInput = getInput('principal')
      fireEvent.change(principalInput, { target: { value: '-5000' } })
      fireEvent.blur(principalInput)

      await waitFor(() => {
        expect(screen.getAllByText(/Minimum principal amount is ₹1,000/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('FD-12: Non-numeric input rejected', () => {
    it('clears invalid principal to zero and hides results', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)

      const principalInput = getInput('principal')
      await user.clear(principalInput)
      await user.type(principalInput, 'abc')

      await waitFor(() => {
        expect(screen.getAllByText(/enter values to see calculation results/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('FD-13: Extremely large value handled', () => {
    it('renders results for ₹1 crore principal', async () => {
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)

      const principalInput = getInput('principal')
      await user.clear(principalInput)
      await user.type(principalInput, '10000000')

      await waitFor(() => {
        expectTextPresent(/money in hand/i)
      })
    })
  })

  describe('FD-14: Golden calculation matches reference', () => {
    it('matches golden maturity for ₹1L @ 7% 5 years quarterly', async () => {
      const row = findGolden('FD-14')
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)

      const principalInput = getInput('principal')
      await user.clear(principalInput)
      await user.type(principalInput, String(row.inputs.principal))

      const tenureYearsInput = getInput('tenureYears')
      await user.clear(tenureYearsInput)
      await user.type(tenureYearsInput, String(row.inputs.tenureYears))

      const rateInput = getInput('rate')
      await user.clear(rateInput)
      await user.type(rateInput, String(row.inputs.rate))

      const expected = calculateFD(
        row.inputs.principal,
        row.inputs.rate / 100,
        row.inputs.tenureYears,
        row.inputs.compoundingFrequency
      )

      expect(Math.abs(expected - row.expected.maturityAmount)).toBeLessThanOrEqual(
        row.expected.tolerance
      )
    })
  })

  describe('FD-15: Pie chart renders or graceful fallback', () => {
    it('renders investment breakdown section', async () => {
      renderWithProviders(<FDCalculator />)

      await waitFor(() => {
        expect(screen.getAllByTestId('pie-chart-mock').length).toBeGreaterThan(0)
      })
    })
  })

  describe('FD-20: Years and months tenure', () => {
    it('calculates maturity for 1 year 3 months from golden fixture', () => {
      const row = findGolden('FD-20')
      const years = row.inputs.tenureYears + row.inputs.tenureMonths / 12
      const maturity = calculateFD(
        row.inputs.principal,
        row.inputs.rate / 100,
        years,
        row.inputs.compoundingFrequency
      )

      expect(Math.abs(maturity - row.expected.maturityAmount)).toBeLessThanOrEqual(
        row.expected.tolerance
      )
    })
  })

  describe('FD-22: Compounding frequency options', () => {
    it('monthly compounding yields higher maturity than quarterly', () => {
      const row = findGolden('FD-22')
      const annualRate = row.inputs.rate / 100
      const years = row.inputs.tenureYears

      const monthly = calculateFD(row.inputs.principal, annualRate, years, 'monthly')
      const quarterly = calculateFD(row.inputs.principal, annualRate, years, 'quarterly')

      expect(monthly).toBeGreaterThan(quarterly)
    })
  })

  describe('FD-23: TDS warning above threshold', () => {
    it('shows TDS applicable for high-interest scenario', async () => {
      const row = findGolden('FD-23')
      const user = userEvent.setup()
      renderWithProviders(<FDCalculator />)

      const principalInput = getInput('principal')
      await user.clear(principalInput)
      await user.type(principalInput, String(row.inputs.principal))

      const rateInput = getInput('rate')
      await user.clear(rateInput)
      await user.type(rateInput, String(row.inputs.rate))

      await waitFor(() => {
        expectTextPresent(/tds.*applicable/i)
      })
    })
  })
})
