/**
 * Equity Calculator — unit tests (TASK-W2-EQUITY T3)
 * Golden IDs from tests/fixtures/golden/equity.json
 */

import { describe, it, expect } from 'vitest'
import {
  calculateSIPFutureValue,
  calculateStepUpSIP,
  calculateCompoundInterest,
} from '@/utils/calculations'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { equitySchema } from '@/components/calculators/EquityCalculator/equitySchema'
import goldenCases from '../../tests/fixtures/golden/equity.json'

const adversarialSchemaCases = [
  { id: 'ADV-NULL-01', payload: { investmentType: 'sip', amount: null, tenure: 5, expectedCAGR: 12 } },
  { id: 'ADV-EMPTY-01', payload: {} },
  { id: 'ADV-NAN-01', payload: { investmentType: 'sip', amount: 'not-a-number', tenure: 5, expectedCAGR: 12 } },
]

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const computeEquityOutputs = ({
  investmentType,
  amount,
  tenure,
  expectedCAGR,
  stepUpEnabled,
  stepUpPercentage,
  incomeTaxSlab = 0.30,
}) => {
  const annualRate = expectedCAGR / 100
  const months = tenure * 12
  const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

  let corpusValue = 0
  let totalInvested = 0

  if (investmentType === 'sip') {
    if (stepUpEnabled && stepUpRate > 0) {
      corpusValue = calculateStepUpSIP(amount, stepUpRate, tenure, annualRate)
      for (let year = 0; year < tenure; year++) {
        totalInvested += amount * Math.pow(1 + stepUpRate, year) * 12
      }
    } else {
      corpusValue = calculateSIPFutureValue(amount, annualRate, months)
      totalInvested = amount * months
    }
  } else {
    corpusValue = calculateCompoundInterest(amount, annualRate, tenure, 1)
    totalInvested = amount
  }

  const returnsEarned = corpusValue - totalInvested
  const tax = calculateTaxOnWithdrawal(corpusValue, 'equity', tenure, {
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

const withinTolerance = (actual, expected, tolerance) =>
  Math.abs(actual - expected) <= tolerance

describe('Equity calculations — golden fixtures', () => {
  const goldenIds = [
    'EQ-14',
    'EQ-20-SIP',
    'EQ-20-LUMPSUM',
    'EQ-21',
    'EQ-22',
    'EQ-22-STCG',
    'EQ-13',
    'EQ-BD-TENURE-50',
  ]

  goldenIds.forEach((id) => {
    it(`${id}: matches golden expected outputs`, () => {
      const golden = findGolden(id)
      expect(golden).toBeDefined()

      const actual = computeEquityOutputs(golden.inputs)
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

describe('Equity calculations — instrument-specific', () => {
  it('EQ-20: lumpsum corpus exceeds SIP for same total invested over 5 years', () => {
    const sip = computeEquityOutputs(findGolden('EQ-20-SIP').inputs)
    const lumpsum = computeEquityOutputs(findGolden('EQ-20-LUMPSUM').inputs)
    expect(lumpsum.corpusValue).toBeGreaterThan(sip.corpusValue)
    expect(lumpsum.totalInvested).toBe(300000)
    expect(sip.totalInvested).toBe(300000)
  })

  it('EQ-21: step-up corpus exceeds flat SIP for same initial amount', () => {
    const stepUp = findGolden('EQ-21')
    const flat = computeEquityOutputs({ ...stepUp.inputs, stepUpEnabled: false, stepUpPercentage: 0 })
    const stepped = computeEquityOutputs(stepUp.inputs)
    expect(stepped.corpusValue).toBeGreaterThan(flat.corpusValue)
    expect(stepped.totalInvested).toBeGreaterThan(flat.totalInvested)
  })

  it('EQ-22: LTCG tax applies 10% only above ₹1L exemption on returns', () => {
    const golden = findGolden('EQ-22')
    const result = computeEquityOutputs(golden.inputs)
    const taxableReturns = Math.max(0, result.returnsEarned - 100000)
    const expectedTax = Math.round(taxableReturns * 0.1 * 100) / 100
    expect(result.taxRateLabel).toBe('10% LTCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })

  it('EQ-22-STCG: STCG applies 15% on returns when tenure < 1 year', () => {
    const golden = findGolden('EQ-22-STCG')
    const result = computeEquityOutputs(golden.inputs)
    const expectedTax = Math.round(result.returnsEarned * 0.15 * 100) / 100
    expect(result.taxRateLabel).toBe('15% STCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })
})

describe('Equity calculations — adversarial & boundaries', () => {
  it('ADV-EQ-NULL: null amount returns 0 corpus', () => {
    expect(calculateSIPFutureValue(null, 0.12, 60)).toBe(0)
    expect(calculateStepUpSIP(null, 0.1, 5, 0.12)).toBe(0)
  })

  it('ADV-EQ-UNDEF: undefined inputs return 0 corpus', () => {
    expect(calculateSIPFutureValue(undefined, 0.12, 60)).toBe(0)
    expect(calculateCompoundInterest(undefined, 0.12, 5, 1)).toBe(0)
  })

  it('ADV-EQ-MIN: ₹500 is schema minimum', () => {
    const { error } = equitySchema.validate({
      investmentType: 'sip',
      amount: 500,
      tenure: 1,
      expectedCAGR: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-EQ-MIN-1: ₹499 fails schema validation', () => {
    const { error } = equitySchema.validate({
      investmentType: 'sip',
      amount: 499,
      tenure: 1,
      expectedCAGR: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment amount is ₹500/i)
  })

  it('ADV-EQ-TENURE-MIN: tenure 1 year is valid', () => {
    const { error } = equitySchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 1,
      expectedCAGR: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-EQ-TENURE-MAX: tenure 50 years is valid', () => {
    const { error } = equitySchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 50,
      expectedCAGR: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-EQ-TENURE-MAX+1: tenure 51 years fails validation', () => {
    const { error } = equitySchema.validate({
      investmentType: 'sip',
      amount: 5000,
      tenure: 51,
      expectedCAGR: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum tenure is 50 years/i)
  })

  it('ADV-EQ-LTCG-BOUNDARY: tenure 0.99 triggers STCG, 1.0 triggers LTCG', () => {
    const base = { investmentType: 'sip', amount: 10000, expectedCAGR: 12, stepUpEnabled: false, stepUpPercentage: 0 }
    const stcg = computeEquityOutputs({ ...base, tenure: 0.99 })
    const ltcg = computeEquityOutputs({ ...base, tenure: 1 })
    expect(stcg.taxRateLabel).toBe('15% STCG')
    expect(ltcg.taxRateLabel).toBe('10% LTCG')
  })

  it('EQ-08: schema rejects amount below minimum', () => {
    const golden = findGolden('EQ-08')
    const { error } = equitySchema.validate({ ...golden.inputs, stepUpEnabled: false })
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe(golden.expected.validationError)
  })

  it('EQ-10: schema rejects zero tenure', () => {
    const golden = findGolden('EQ-10')
    const { error } = equitySchema.validate({ ...golden.inputs, stepUpEnabled: false })
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe(golden.expected.validationError)
  })

  adversarialSchemaCases.forEach(({ id, payload }) => {
    it(`${id}: schema rejects or handles adversarial payload`, () => {
      const { error } = equitySchema.validate(payload)
      expect(error).toBeDefined()
    })
  })
})
