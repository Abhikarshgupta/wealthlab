import { describe, it, expect } from 'vitest'
import {
  afterTaxHikePct,
  afterTaxMath,
  realRaiseCopy,
  realRaisePct,
  signed1,
} from '@/utils/personalInflationRaise'

describe('personalInflationRaise', () => {
  it('real raise is hike minus inflation', () => {
    expect(realRaisePct(12, 6.2)).toBeCloseTo(5.8, 5)
    expect(signed1(5.8)).toBe('+5.8')
    expect(realRaiseCopy(3.3).outcome).toBe(
      "You can keep last year's lifestyle and still have a little left."
    )
    expect(realRaiseCopy(5).outcome).toBe(
      "You can keep last year's lifestyle and still have a little left."
    )
    expect(realRaiseCopy(5.8)).toEqual({
      outcome: 'You did not just keep up. You pulled ahead.',
      gap: 'Raise bigger than your inflation by 5.8%',
    })
    expect(realRaiseCopy(15).outcome).toBe('You did not just keep up. You pulled ahead.')
    expect(realRaiseCopy(15.1).outcome).toBe('This should feel like a good year, not a calculator.')
    expect(realRaiseCopy(-2.6)).toEqual({
      outcome: 'The letter went up. The month still got tighter.',
      gap: 'Prices rose more than CTC by 2.6%',
    })
    expect(realRaiseCopy(0)).toEqual({
      outcome: "Last year's lifestyle, about the same.",
      gap: 'Raise matched your inflation',
    })
  })

  it('in-hand hike applies this year’s slab to extra CTC', () => {
    expect(afterTaxHikePct(12, 0.3)).toBeCloseTo(8.4, 5)
    expect(afterTaxHikePct(12, 0.2)).toBeCloseTo(9.6, 5)
    expect(afterTaxHikePct(12, null)).toBeNull()
  })

  it('after-tax real raise is in-hand hike minus inflation', () => {
    const math = afterTaxMath({
      hikePct: 12,
      thisYearSlab: 0.3,
      inflationPct: 6.7,
    })
    expect(math.inHand).toBeCloseTo(8.4, 5)
    expect(math.real).toBeCloseTo(1.7, 5)
    expect(math.lines[1]).toContain('12.0% × (1 − 30%) = 8.4%')
    expect(math.lines[2]).toContain('8.4% − 6.7% inflation = +1.7%')
    expect(math.lines.join(' ')).not.toMatch(/last year/)
  })
})
