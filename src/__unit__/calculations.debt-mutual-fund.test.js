/**
 * Debt Mutual Fund calculation unit tests — TASK-W4-DMF (T3)
 * Golden source: tests/fixtures/golden/debt-mutual-fund.json
 */

import { describe, it, expect } from 'vitest'
import {
  calculateSIPFutureValue,
  calculateCompoundInterest,
} from '@/utils/calculations'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { debtMutualFundSchema } from '@/components/calculators/DebtMutualFundCalculator/debtMutualFundSchema'
import goldenCases from '../../tests/fixtures/golden/debt-mutual-fund.json'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

const computeDebtMFOutputs = ({
  investmentType,
  amount,
  tenure,
  expectedReturn,
  stepUpEnabled = false,
  stepUpPercentage = 0,
  incomeTaxSlab = 0.30,
}) => {
  const annualRate = expectedReturn / 100
  const months = tenure * 12
  const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

  let corpusValue = 0
  let totalInvested = 0

  if (investmentType === 'sip') {
    corpusValue = calculateSIPFutureValue(amount, annualRate, months)
    totalInvested = amount * months
  } else {
    corpusValue = calculateCompoundInterest(amount, annualRate, tenure, 1)
    totalInvested = amount
  }

  const returnsEarned = corpusValue - totalInvested
  const tax = calculateTaxOnWithdrawal(corpusValue, 'debtMutualFund', tenure, {
    incomeTaxSlab,
    principal: totalInvested,
    returns: returnsEarned,
  })

  return {
    corpusValue: Math.round(corpusValue * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    returnsEarned: Math.round(returnsEarned * 100) / 100,
    taxAmount: Math.round(tax.taxAmount * 100) / 100,
    postTaxAmount: Math.round(tax.postTaxCorpus * 100) / 100,
    taxRateLabel: tax.taxRateLabel,
  }
}

describe('Debt MF calculations — golden fixtures', () => {
  const goldenIds = [
    'DMF-14',
    'DMF-20',
    'DMF-21-STCG',
    'DMF-21-LTCG',
    'DMF-22-SIP',
    'DMF-22-LUMPSUM',
  ]

  goldenIds.forEach((id) => {
    it(`${id}: matches golden expected outputs`, () => {
      const golden = findGolden(id)
      expect(golden).toBeDefined()

      const actual = computeDebtMFOutputs(golden.inputs)
      const { expected } = golden
      const tolerance = expected.tolerance ?? 50

      expect(withinTolerance(actual.corpusValue, expected.corpusValue, tolerance)).toBe(true)
      if (expected.totalInvested != null) {
        expect(withinTolerance(actual.totalInvested, expected.totalInvested, tolerance)).toBe(true)
      }
      if (expected.returnsEarned != null) {
        expect(withinTolerance(actual.returnsEarned, expected.returnsEarned, tolerance)).toBe(true)
      }
      if (expected.taxAmount != null) {
        expect(withinTolerance(actual.taxAmount, expected.taxAmount, tolerance)).toBe(true)
      }
      if (expected.postTaxAmount != null) {
        expect(withinTolerance(actual.postTaxAmount, expected.postTaxAmount, tolerance)).toBe(true)
      }
      if (expected.taxRateLabel != null) {
        expect(actual.taxRateLabel).toBe(expected.taxRateLabel)
      }
    })
  })
})

describe('Debt MF calculations — 3-year LTCG boundary', () => {
  it('DMF-21-STCG: tenure 2 years uses income slab STCG', () => {
    const golden = findGolden('DMF-21-STCG')
    const actual = computeDebtMFOutputs(golden.inputs)
    expect(actual.taxRateLabel).toBe('30% slab')
    expect(actual.taxAmount).toBeGreaterThan(0)
  })

  it('DMF-21-LTCG: tenure exactly 3 years uses indexed LTCG', () => {
    const golden = findGolden('DMF-21-LTCG')
    const actual = computeDebtMFOutputs(golden.inputs)
    expect(actual.taxRateLabel).toBe('20% LTCG (Indexed)')
    expect(
      withinTolerance(actual.postTaxAmount, golden.expected.postTaxAmount, golden.expected.tolerance)
    ).toBe(true)
  })

  it('DMF-20: indexation reduces tax vs unindexed gains at 5 years', () => {
    const golden = findGolden('DMF-20')
    const actual = computeDebtMFOutputs(golden.inputs)
    const unindexedTax = actual.returnsEarned * 0.20
    expect(actual.taxAmount).toBeLessThan(unindexedTax)
    expect(actual.taxAmount).toBeGreaterThan(0)
  })
})

describe('Debt MF calculations — instrument-specific', () => {
  it('DMF-22: lumpsum corpus exceeds SIP for same total invested over 5 years', () => {
    const sip = computeDebtMFOutputs(findGolden('DMF-22-SIP').inputs)
    const lumpsum = computeDebtMFOutputs(findGolden('DMF-22-LUMPSUM').inputs)
    expect(lumpsum.corpusValue).toBeGreaterThan(sip.corpusValue)
    expect(lumpsum.totalInvested).toBe(sip.totalInvested)
  })
})

describe('Debt MF schema validation', () => {
  it('DMF-08: amount below ₹500 minimum is rejected', () => {
    const golden = findGolden('DMF-08')
    const { error } = debtMutualFundSchema.validate(golden.inputs)
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment amount is/i)
  })

  it('DMF-10: zero tenure is rejected', () => {
    const golden = findGolden('DMF-10')
    const { error } = debtMutualFundSchema.validate(golden.inputs)
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum tenure is 1 year/i)
  })

  it('DMF-09: tenure above 50 years is rejected', () => {
    const { error } = debtMutualFundSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 51,
      fundType: 'shortTerm',
      expectedReturn: 7.5,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum tenure is 50 years/i)
  })
})

describe('Debt MF adversarial inputs', () => {
  it('DMF-10: null amount fails schema validation', () => {
    const { error } = debtMutualFundSchema.validate({
      investmentType: 'sip',
      amount: null,
      tenure: 5,
      fundType: 'shortTerm',
      expectedReturn: 7.5,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
  })

  it('DMF-11: negative amount fails schema validation', () => {
    const { error } = debtMutualFundSchema.validate({
      investmentType: 'sip',
      amount: -1000,
      tenure: 5,
      fundType: 'shortTerm',
      expectedReturn: 7.5,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
  })

  it('DMF-13: large SIP at scale does not overflow', () => {
    const actual = computeDebtMFOutputs({
      investmentType: 'sip',
      amount: 100000,
      tenure: 10,
      expectedReturn: 7.5,
    })
    expect(actual.corpusValue).toBeGreaterThan(10000000)
    expect(Number.isFinite(actual.corpusValue)).toBe(true)
  })
})
