/**
 * Raise vs inflation. After-tax hike applies this year's marginal slab
 * to extra CTC — not a full return (no cess, surcharge, or deductions).
 */

export const RAISE_TAX_SLABS = [
  { value: 0, label: '0%' },
  { value: 0.05, label: '5%' },
  { value: 0.1, label: '10%' },
  { value: 0.15, label: '15%' },
  { value: 0.2, label: '20%' },
  { value: 0.3, label: '30%' },
]

export const round1 = (n) => Math.round(n * 10) / 10

export const signed1 = (n) => {
  const v = round1(n)
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}`
}

export const afterTaxHikePct = (hikePct, thisYearSlab) => {
  if (hikePct == null || thisYearSlab == null) return null
  return hikePct * (1 - thisYearSlab)
}

export const realRaisePct = (payIncreasePct, inflationPct) => {
  if (payIncreasePct == null || inflationPct == null) return null
  return payIncreasePct - inflationPct
}

export const realRaiseCopy = (realChange) => {
  const abs = Math.abs(round1(realChange)).toFixed(1)
  const v = round1(realChange)
  if (v > 0) {
    let outcome = "You can keep last year's lifestyle and still have a little left."
    if (v > 15) outcome = 'This should feel like a good year, not a calculator.'
    else if (v > 5) outcome = 'You did not just keep up. You pulled ahead.'
    return {
      outcome,
      gap: `Raise bigger than your inflation by ${abs}%`,
    }
  }
  if (v < 0) {
    return {
      outcome: 'The letter went up. The month still got tighter.',
      gap: `Prices rose more than CTC by ${abs}%`,
    }
  }
  return {
    outcome: "Last year's lifestyle, about the same.",
    gap: 'Raise matched your inflation',
  }
}

export const afterTaxMath = ({ hikePct, thisYearSlab, inflationPct }) => {
  const inHand = afterTaxHikePct(hikePct, thisYearSlab)
  const real = realRaisePct(inHand, inflationPct)
  if (inHand == null || real == null) return null

  const slabPct = Math.round(thisYearSlab * 100)
  const hike1 = round1(hikePct).toFixed(1)
  const inHand1 = round1(inHand).toFixed(1)
  const infl1 = round1(inflationPct).toFixed(1)

  const lines = [
    `Extra CTC is taxed at the ${slabPct}% slab.`,
    `In-hand hike ≈ ${hike1}% × (1 − ${slabPct}%) = ${inHand1}%`,
    `Then ${inHand1}% − ${infl1}% inflation = ${signed1(real)}%`,
    'Ignores cess, surcharge, and deductions. Not tax advice.',
  ]

  return { inHand, real, lines, slabPct }
}
