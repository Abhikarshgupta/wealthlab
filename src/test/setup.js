import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Mock Highcharts (causes issues in jsdom environment)
vi.mock('highcharts', () => ({
  default: {
    chart: vi.fn(),
  },
}))

vi.mock('highcharts-react-official', () => ({
  default: () => null,
}))

// Cleanup after each test
afterEach(() => {
  cleanup()
})

