import { describe, it, expect } from 'vitest'
import { roundInflationPct } from '@/constants/inflationRates'

describe('roundInflationPct', () => {
  it('keeps the global inflation setting at one decimal', () => {
    expect(roundInflationPct(6.6461098299999986)).toBe(6.6)
    expect(roundInflationPct(6.7204)).toBe(6.7)
    expect(roundInflationPct(6)).toBe(6)
    expect(roundInflationPct('7.25')).toBe(7.3)
  })
})
