/**
 * NSC Calculator component tests — TASK-W2-NSC (T3)
 * Scenario IDs aligned with tests/TRACEABILITY.md and golden nsc.json
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NSCalculator from './NSCalculator'
import { renderWithProviders, resetUserPreferences, setUserPreferences } from '@/test/utils/testHelpers'
import { investmentRates } from '@/constants/investmentRates'
import goldenCases from '../../../../tests/fixtures/golden/nsc.json'

vi.mock('@/components/common/PieChart/PieChart', () => ({
  default: ({ title }) => <div data-testid="pie-chart-mock">{title}</div>,
}))

const getGolden = (id) => {
  const row = goldenCases.find((c) => c.id === id)
  if (!row) throw new Error(`Golden case ${id} not found`)
  return row
}

const inputByName = (name) => document.querySelector(`input[name="${name}"]`)

describe('NSC Calculator', () => {
  beforeEach(() => {
    resetUserPreferences()
    vi.clearAllMocks()
  })

  describe('NSC-01 — Initial Calculator Load', () => {
    it('NSC-01: should render calculator with documented default values', () => {
      renderWithProviders(<NSCalculator />)

      expect(screen.getByText('NSC Calculator')).toBeInTheDocument()
      expect(inputByName('principal')).toHaveValue(100000)
      expect(inputByName('rate')).toHaveValue(investmentRates.nsc.rate)
      expect(screen.getAllByText(/5.*years.*fixed/i).length).toBeGreaterThan(0)
    })
  })

  describe('NSC-03 — Money in Hand', () => {
    it('NSC-03: should show Money in Hand section in results', async () => {
      setUserPreferences({ taxSlab: 0.3 })
      renderWithProviders(<NSCalculator />)

      await waitFor(() => {
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('NSC-06 — Evolution Table', () => {
    it('NSC-06: should display year-wise evolution table with 5 rows', async () => {
      renderWithProviders(<NSCalculator />)

      await waitFor(() => {
        expect(screen.getByText(/year-wise investment evolution/i)).toBeInTheDocument()
      })

      expect(document.querySelectorAll('tbody tr').length).toBe(5)
    })
  })

  describe('NSC-07 — Info Panel', () => {
    it('NSC-07: should show current NSC rate and last updated date', () => {
      renderWithProviders(<NSCalculator />)

      expect(screen.getByText(/current rate/i)).toBeInTheDocument()
      expect(screen.getAllByText(/last updated/i).length).toBeGreaterThan(0)
    })
  })

  describe('NSC-08 — Minimum Investment Validation', () => {
    it('NSC-08: should show error for principal below ₹1,000', async () => {
      const user = userEvent.setup()
      renderWithProviders(<NSCalculator />)

      const principalInput = inputByName('principal')
      await user.clear(principalInput)
      await user.type(principalInput, '999')

      await waitFor(() => {
        expect(screen.getAllByText(/minimum investment amount is/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('NSC-11 — Negative Input', () => {
    it('NSC-11: should reject negative principal', async () => {
      renderWithProviders(<NSCalculator />)

      const principalInput = inputByName('principal')
      fireEvent.change(principalInput, { target: { value: '-1000' } })
      fireEvent.blur(principalInput)

      await waitFor(() => {
        expect(screen.getAllByText(/minimum investment amount is/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('NSC-15 — Pie Chart', () => {
    it('NSC-15: should render investment breakdown chart', async () => {
      renderWithProviders(<NSCalculator />)

      await waitFor(() => {
        expect(screen.getAllByTestId('pie-chart-mock').length).toBeGreaterThan(0)
      })
    })
  })

  describe('NSC-21 — Section 80C Info', () => {
    it('NSC-21: info panel mentions Section 80C deduction', () => {
      renderWithProviders(<NSCalculator />)

      expect(screen.getAllByText(/Section 80C|80C/i).length).toBeGreaterThan(0)
    })
  })

  describe('NSC-20 — Minimum Valid Investment', () => {
    it('NSC-20: should accept minimum investment of ₹1,000', async () => {
      const user = userEvent.setup()
      const golden = getGolden('NSC-20')
      renderWithProviders(<NSCalculator />)

      const principalInput = inputByName('principal')
      await user.clear(principalInput)
      await user.type(principalInput, String(golden.inputs.principal))

      await waitFor(() => {
        expect(screen.queryByText(/minimum investment amount is/i)).not.toBeInTheDocument()
        expect(screen.getAllByText(/money in hand/i).length).toBeGreaterThan(0)
      })
    })
  })
})
