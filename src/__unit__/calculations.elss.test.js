/**
 * ELSS Calculator — unit tests (TASK-W2-ELSS T3)
 * Golden IDs from tests/fixtures/golden/elss.json
 */

import { describe, it, expect } from 'vitest'
import {
  calculateSIPFutureValue,
  calculateCompoundInterest,
} from '@/utils/calculations'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { elssSchema } from '@/components/calculators/ELSSCalculator/elssSchema'
import goldenCases from '../../tests/fixtures/golden/elss.json'

const adversarialSchemaCases = [
  { id: 'ADV-NULL-01', payload: { investmentType: 'sip', amount: null, tenure: 5, expectedReturn: 14 } },
  { id: 'ADV-EMPTY-01', payload: {} },
  { id: 'ADV-NAN-01', payload: { investmentType: 'sip', amount: 'not-a-number', tenure: 5, expectedReturn: 14 } },
]

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const computeELSSOutputs = ({ investmentType, amount, tenure, expectedReturn }) => {
  const annualRate = expectedReturn / 100
  let corpusValue = 0
  let totalInvested = 0

  if (investmentType === 'sip') {
    const months = tenure * 12
    corpusValue = calculateSIPFutureValue(amount, annualRate, months)
    totalInvested = amount * months
  } else {
    corpusValue = calculateCompoundInterest(amount, annualRate, tenure, 1)
    totalInvested = amount
  }

  const returnsEarned = corpusValue - totalInvested
  const tax = calculateTaxOnWithdrawal(corpusValue, 'elss', tenure, {
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

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('ELSS calculations — golden fixtures', () => {
  const goldenIds = [
    'ELSS-14',
    'ELSS-20',
    'ELSS-21',
    'ELSS-22',
    'ELSS-23',
    'ELSS-13',
    'ELSS-BD-TENURE-3',
    'ELSS-BD-TENURE-50',
  ]

  goldenIds.forEach((id) => {
    it(`${id}: matches golden expected outputs`, () => {
      const golden = findGolden(id)
      expect(golden).toBeDefined()

      const actual = computeELSSOutputs(golden.inputs)
      const { expected } = golden
      const tolerance = expected.tolerance ?? 50

      expect(withinTolerance(actual.corpusValue, expected.corpusValue, tolerance)).toBe(true)
      expect(withinTolerance(actual.totalInvested, expected.totalInvested, tolerance)).toBe(true)
      expect(withinTolerance(actual.returnsEarned, expected.returnsEarned, tolerance)).toBe(true)
      expect(withinTolerance(actual.taxAmount, expected.taxAmount, tolerance)).toBe(true)
      expect(withinTolerance(actual.postTaxAmount, expected.postTaxAmount, tolerance)).toBe(true)
      expect(actual.taxRateLabel).toBe(expected.taxRateLabel)
    })
  })
})

describe('ELSS calculations — instrument-specific', () => {
  it('ELSS-20: minimum ₹500/month at 3-year lock-in produces valid corpus', () => {
    const golden = findGolden('ELSS-20')
    const result = computeELSSOutputs(golden.inputs)
    expect(result.corpusValue).toBeGreaterThan(golden.inputs.amount * 36)
  })

  it('ELSS-21: lumpsum mode uses compound interest not SIP formula', () => {
    const golden = findGolden('ELSS-21')
    const result = computeELSSOutputs(golden.inputs)
    const sipEquivalent = computeELSSOutputs({
      ...golden.inputs,
      investmentType: 'sip',
      amount: golden.inputs.amount / 36,
    })
    expect(result.totalInvested).toBe(golden.inputs.amount)
    expect(result.corpusValue).not.toBe(sipEquivalent.corpusValue)
  })

  it('ELSS-22: LTCG tax applies 12.5% only above ₹1.25L exemption on returns', () => {
    const golden = findGolden('ELSS-22')
    const result = computeELSSOutputs(golden.inputs)
    const taxableReturns = Math.max(0, result.returnsEarned - 125000)
    const expectedTax = Math.round(taxableReturns * 0.125 * 100) / 100
    expect(result.taxRateLabel).toBe('12.5% LTCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })

  it('ELSS-23: STCG applies 20% on returns when tenure < 3 years', () => {
    const golden = findGolden('ELSS-23')
    const result = computeELSSOutputs(golden.inputs)
    const expectedTax = Math.round(result.returnsEarned * 0.2 * 100) / 100
    expect(result.taxRateLabel).toBe('20% STCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })
})

describe('ELSS calculations — adversarial & boundaries', () => {
  it('ADV-ELSS-NULL: null amount returns 0 corpus', () => {
    expect(calculateSIPFutureValue(null, 0.14, 60)).toBe(0)
    expect(calculateCompoundInterest(null, 0.14, 3, 1)).toBe(0)
  })

  it('ADV-ELSS-UNDEF: undefined inputs return 0 corpus', () => {
    expect(calculateSIPFutureValue(undefined, 0.14, 60)).toBe(0)
    expect(calculateCompoundInterest(150000, 0.14, undefined, 1)).toBe(0)
  })

  it('ADV-ELSS-MIN: ₹500 is schema minimum', () => {
    const { error } = elssSchema.validate({
      investmentType: 'sip',
      amount: 500,
      tenure: 3,
      expectedReturn: 14,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-ELSS-MIN-1: ₹499 fails schema validation', () => {
    const { error } = elssSchema.validate({
      investmentType: 'sip',
      amount: 499,
      tenure: 3,
      expectedReturn: 14,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment amount is ₹500/i)
  })

  it('ADV-ELSS-TENURE-MIN: tenure 3 years is valid (lock-in)', () => {
    const { error } = elssSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 3,
      expectedReturn: 14,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-ELSS-TENURE-MIN-1: tenure 2 years fails validation', () => {
    const { error } = elssSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 2,
      expectedReturn: 14,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum tenure is 3 years/i)
  })

  it('ADV-ELSS-TENURE-MAX: tenure 50 years is valid', () => {
    const { error } = elssSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 50,
      expectedReturn: 14,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-ELSS-TENURE-MAX+1: tenure 51 years fails validation', () => {
    const { error } = elssSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 51,
      expectedReturn: 14,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum tenure is 50 years/i)
  })

  it('ADV-ELSS-LTCG-BOUNDARY: 2 years triggers STCG, 3 years triggers LTCG', () => {
    const stcg = computeELSSOutputs({
      investmentType: 'sip',
      amount: 10000,
      tenure: 2,
      expectedReturn: 14,
    })
    const ltcg = computeELSSOutputs({
      investmentType: 'sip',
      amount: 10000,
      tenure: 3,
      expectedReturn: 14,
    })
    expect(stcg.taxRateLabel).toBe('20% STCG')
    expect(ltcg.taxRateLabel).toBe('12.5% LTCG')
  })

  adversarialSchemaCases.forEach(({ id, payload }) => {
    it(`${id}: schema rejects or handles adversarial payload`, () => {
      const { error } = elssSchema.validate(payload)
      expect(error).toBeDefined()
    })
  })
})
