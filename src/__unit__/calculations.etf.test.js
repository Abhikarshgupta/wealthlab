/**
 * ETF Calculator — unit tests (TASK-W4-ETF T3)
 * Golden IDs from tests/fixtures/golden/etf.json
 */

import { describe, it, expect } from 'vitest'
import {
  calculateSIPFutureValue,
  calculateStepUpSIP,
  calculateCompoundInterest,
} from '@/utils/calculations'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { etfSchema } from '@/components/calculators/ETFCalculator/etfSchema'
import goldenCases from '../../tests/fixtures/golden/etf.json'

const adversarialSchemaCases = [
  { id: 'ADV-NULL-01', payload: { investmentType: 'sip', amount: null, etfType: 'equity', tenure: 5, expectedCAGR: 12, expenseRatio: 0.2 } },
  { id: 'ADV-EMPTY-01', payload: {} },
  { id: 'ADV-NAN-01', payload: { investmentType: 'sip', amount: 'not-a-number', etfType: 'equity', tenure: 5, expectedCAGR: 12, expenseRatio: 0.2 } },
]

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const computeETFOutputs = ({
  investmentType,
  amount,
  etfType = 'equity',
  tenure,
  expectedCAGR,
  expenseRatio = 0.2,
  stepUpEnabled,
  stepUpPercentage,
  incomeTaxSlab = 0.30,
}) => {
  const annualRate = expectedCAGR / 100
  const expenseRatioDecimal = expenseRatio / 100
  const netAnnualRate = annualRate - expenseRatioDecimal
  const months = tenure * 12
  const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

  let corpusValue = 0
  let totalInvested = 0

  if (investmentType === 'sip') {
    if (stepUpEnabled && stepUpRate > 0) {
      corpusValue = calculateStepUpSIP(amount, stepUpRate, tenure, netAnnualRate)
      for (let year = 0; year < tenure; year++) {
        totalInvested += amount * Math.pow(1 + stepUpRate, year) * 12
      }
    } else {
      corpusValue = calculateSIPFutureValue(amount, netAnnualRate, months)
      totalInvested = amount * months
    }
  } else {
    corpusValue = calculateCompoundInterest(amount, netAnnualRate, tenure, 1)
    totalInvested = amount
  }

  const returnsEarned = corpusValue - totalInvested
  const instrumentTypeForTax =
    etfType === 'equity' || etfType === 'international' ? 'equity' : 'debtMutualFund'
  const tax = calculateTaxOnWithdrawal(corpusValue, instrumentTypeForTax, tenure, {
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

describe('ETF calculations — golden fixtures', () => {
  const goldenIds = [
    'ETF-14',
    'ETF-20-SIP',
    'ETF-20-LUMPSUM',
    'ETF-21',
    'ETF-22',
    'ETF-22-STCG',
    'ETF-22-DEBT',
    'ETF-22-GOLD',
    'ETF-22-INTL',
    'ETF-23-EXPENSE',
    'ETF-23-EXPENSE-LOW',
    'ETF-13',
    'ETF-BD-TENURE-50',
  ]

  goldenIds.forEach((id) => {
    it(`${id}: matches golden expected outputs`, () => {
      const golden = findGolden(id)
      expect(golden).toBeDefined()

      const actual = computeETFOutputs(golden.inputs)
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

describe('ETF calculations — instrument-specific', () => {
  it('ETF-20: lumpsum corpus exceeds SIP for same total invested over 5 years', () => {
    const sip = computeETFOutputs(findGolden('ETF-20-SIP').inputs)
    const lumpsum = computeETFOutputs(findGolden('ETF-20-LUMPSUM').inputs)
    expect(lumpsum.corpusValue).toBeGreaterThan(sip.corpusValue)
    expect(lumpsum.totalInvested).toBe(300000)
    expect(sip.totalInvested).toBe(300000)
  })

  it('ETF-21: step-up corpus exceeds flat SIP for same initial amount', () => {
    const stepUp = findGolden('ETF-21')
    const flat = computeETFOutputs({ ...stepUp.inputs, stepUpEnabled: false, stepUpPercentage: 0 })
    const stepped = computeETFOutputs(stepUp.inputs)
    expect(stepped.corpusValue).toBeGreaterThan(flat.corpusValue)
    expect(stepped.totalInvested).toBeGreaterThan(flat.totalInvested)
  })

  it('ETF-22: expense ratio reduces net return and corpus vs zero expense', () => {
    const base = findGolden('ETF-14').inputs
    const withExpense = computeETFOutputs(base)
    const withoutExpense = computeETFOutputs({ ...base, expenseRatio: 0 })
    expect(withExpense.corpusValue).toBeLessThan(withoutExpense.corpusValue)
  })

  it('ETF-23-EXPENSE: higher expense ratio yields lower corpus than low expense', () => {
    const low = computeETFOutputs(findGolden('ETF-23-EXPENSE-LOW').inputs)
    const high = computeETFOutputs(findGolden('ETF-23-EXPENSE').inputs)
    expect(low.corpusValue).toBeGreaterThan(high.corpusValue)
  })

  it('ETF-22: LTCG tax applies 12.5% only above ₹1.25L exemption on returns', () => {
    const golden = findGolden('ETF-22')
    const result = computeETFOutputs(golden.inputs)
    const taxableReturns = Math.max(0, result.returnsEarned - 125000)
    const expectedTax = Math.round(taxableReturns * 0.125 * 100) / 100
    expect(result.taxRateLabel).toBe('12.5% LTCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })

  it('ETF-22-STCG: STCG applies 20% on returns when tenure < 1 year', () => {
    const golden = findGolden('ETF-22-STCG')
    const result = computeETFOutputs(golden.inputs)
    const expectedTax = Math.round(result.returnsEarned * 0.2 * 100) / 100
    expect(result.taxRateLabel).toBe('20% STCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })

  it('ETF-22-DEBT: debt ETF uses indexed LTCG tax rules', () => {
    const golden = findGolden('ETF-22-DEBT')
    const result = computeETFOutputs(golden.inputs)
    expect(result.taxRateLabel).toBe('20% LTCG (Indexed)')
  })

  it('ETF-22-GOLD: gold ETF uses indexed LTCG tax rules', () => {
    const golden = findGolden('ETF-22-GOLD')
    const result = computeETFOutputs(golden.inputs)
    expect(result.taxRateLabel).toBe('20% LTCG (Indexed)')
  })

  it('ETF-22-INTL: international ETF uses equity LTCG tax rules', () => {
    const golden = findGolden('ETF-22-INTL')
    const result = computeETFOutputs(golden.inputs)
    expect(result.taxRateLabel).toBe('12.5% LTCG')
  })
})

describe('ETF calculations — adversarial & boundaries', () => {
  it('ADV-ETF-NULL: null amount returns 0 corpus', () => {
    expect(calculateSIPFutureValue(null, 0.118, 60)).toBe(0)
    expect(calculateStepUpSIP(null, 0.1, 5, 0.118)).toBe(0)
  })

  it('ADV-ETF-UNDEF: undefined inputs return 0 corpus', () => {
    expect(calculateSIPFutureValue(undefined, 0.118, 60)).toBe(0)
    expect(calculateCompoundInterest(undefined, 0.118, 5, 1)).toBe(0)
  })

  it('ADV-ETF-MIN: ₹500 is schema minimum', () => {
    const { error } = etfSchema.validate({
      investmentType: 'sip',
      amount: 500,
      etfType: 'equity',
      tenure: 1,
      expectedCAGR: 12,
      expenseRatio: 0.2,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-ETF-MIN-1: ₹499 fails schema validation', () => {
    const { error } = etfSchema.validate({
      investmentType: 'sip',
      amount: 499,
      etfType: 'equity',
      tenure: 1,
      expectedCAGR: 12,
      expenseRatio: 0.2,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum investment amount is ₹500/i)
  })

  it('ADV-ETF-EXPENSE-MAX: expense ratio 2% is valid', () => {
    const { error } = etfSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      etfType: 'equity',
      tenure: 5,
      expectedCAGR: 12,
      expenseRatio: 2,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-ETF-EXPENSE-MAX+1: expense ratio above 2% fails validation', () => {
    const { error } = etfSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      etfType: 'equity',
      tenure: 5,
      expectedCAGR: 12,
      expenseRatio: 2.01,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/expense ratio cannot exceed 2%/i)
  })

  it('ADV-ETF-TENURE-MAX: tenure 50 years is valid', () => {
    const { error } = etfSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      etfType: 'equity',
      tenure: 50,
      expectedCAGR: 12,
      expenseRatio: 0.2,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-ETF-TENURE-MAX+1: tenure 51 years fails validation', () => {
    const { error } = etfSchema.validate({
      investmentType: 'sip',
      amount: 5000,
      etfType: 'equity',
      tenure: 51,
      expectedCAGR: 12,
      expenseRatio: 0.2,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum tenure is 50 years/i)
  })

  it('ADV-ETF-LTCG-BOUNDARY: tenure 0.99 triggers STCG, 1.0 triggers LTCG', () => {
    const base = {
      investmentType: 'sip',
      amount: 10000,
      etfType: 'equity',
      expectedCAGR: 12,
      expenseRatio: 0.2,
      stepUpEnabled: false,
      stepUpPercentage: 0,
    }
    const stcg = computeETFOutputs({ ...base, tenure: 0.99 })
    const ltcg = computeETFOutputs({ ...base, tenure: 1 })
    expect(stcg.taxRateLabel).toBe('20% STCG')
    expect(ltcg.taxRateLabel).toBe('12.5% LTCG')
  })

  it('ETF-08: schema rejects amount below minimum', () => {
    const golden = findGolden('ETF-08')
    const { error } = etfSchema.validate({ ...golden.inputs, stepUpEnabled: false })
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe(golden.expected.validationError)
  })

  it('ETF-10: schema rejects zero tenure', () => {
    const golden = findGolden('ETF-10')
    const { error } = etfSchema.validate({ ...golden.inputs, stepUpEnabled: false })
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe(golden.expected.validationError)
  })

  adversarialSchemaCases.forEach(({ id, payload }) => {
    it(`${id}: schema rejects or handles adversarial payload`, () => {
      const { error } = etfSchema.validate(payload)
      expect(error).toBeDefined()
    })
  })
})
