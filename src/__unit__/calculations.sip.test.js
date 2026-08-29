/**
 * SIP Calculator — unit tests (TASK-W1-SIP T3)
 * Golden IDs from tests/fixtures/golden/sip.json
 */

import { describe, it, expect } from 'vitest'
import {
  calculateSIPFutureValue,
  calculateStepUpSIP,
} from '@/utils/calculations'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { sipSchema } from '@/components/calculators/SIPCalculator/sipSchema'
import goldenCases from '../../tests/fixtures/golden/sip.json'

// Inline adversarial payloads — DS-6 file contains invalid JSON `undefined` literals
const adversarialSchemaCases = [
  { id: 'ADV-NULL-01', payload: { monthlySIP: null, tenure: 5, tenureUnit: 'years', expectedReturn: 12 } },
  { id: 'ADV-EMPTY-01', payload: {} },
  { id: 'ADV-NAN-01', payload: { monthlySIP: 'not-a-number', tenure: 5, tenureUnit: 'years', expectedReturn: 12 } },
]

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const computeSIPOutputs = ({
  monthlySIP,
  tenure,
  tenureUnit,
  expectedReturn,
  stepUpEnabled,
  stepUpPercentage,
}) => {
  const years = tenureUnit === 'months' ? tenure / 12 : tenure
  const months = tenureUnit === 'months' ? tenure : years * 12
  const annualRate = expectedReturn / 100
  const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

  let corpusValue = 0
  let totalInvested = 0

  if (stepUpEnabled && stepUpRate > 0) {
    corpusValue = calculateStepUpSIP(monthlySIP, stepUpRate, years, annualRate)
    for (let year = 0; year < years; year++) {
      totalInvested += monthlySIP * Math.pow(1 + stepUpRate, year) * 12
    }
  } else {
    corpusValue = calculateSIPFutureValue(monthlySIP, annualRate, months)
    totalInvested = monthlySIP * months
  }

  const returnsEarned = corpusValue - totalInvested
  const tax = calculateTaxOnWithdrawal(corpusValue, 'sip', years, {
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

describe('SIP calculations — golden fixtures', () => {
  const goldenIds = ['SIP-14', 'SIP-20', 'SIP-21', 'SIP-22', 'SIP-23', 'SIP-13', 'SIP-BD-TENURE-50']

  goldenIds.forEach((id) => {
    it(`${id}: matches golden expected outputs`, () => {
      const golden = findGolden(id)
      expect(golden).toBeDefined()

      const actual = computeSIPOutputs(golden.inputs)
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

describe('SIP calculations — instrument-specific', () => {
  it('SIP-20: minimum ₹500/month produces valid corpus', () => {
    const golden = findGolden('SIP-20')
    const result = computeSIPOutputs(golden.inputs)
    expect(result.corpusValue).toBeGreaterThan(golden.inputs.monthlySIP * 12)
  })

  it('SIP-21: step-up corpus exceeds flat SIP for same initial amount', () => {
    const stepUp = findGolden('SIP-21')
    const flat = computeSIPOutputs({ ...stepUp.inputs, stepUpEnabled: false, stepUpPercentage: 0 })
    const stepped = computeSIPOutputs(stepUp.inputs)
    expect(stepped.corpusValue).toBeGreaterThan(flat.corpusValue)
    expect(stepped.totalInvested).toBeGreaterThan(flat.totalInvested)
  })

  it('SIP-22: LTCG tax applies 12.5% only above ₹1.25L exemption on returns', () => {
    const golden = findGolden('SIP-22')
    const result = computeSIPOutputs(golden.inputs)
    const taxableReturns = Math.max(0, result.returnsEarned - 125000)
    const expectedTax = Math.round(taxableReturns * 0.125 * 100) / 100
    expect(result.taxRateLabel).toBe('12.5% LTCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })

  it('SIP-23: STCG applies 20% on returns when tenure < 1 year', () => {
    const golden = findGolden('SIP-23')
    const result = computeSIPOutputs(golden.inputs)
    const expectedTax = Math.round(result.returnsEarned * 0.2 * 100) / 100
    expect(result.taxRateLabel).toBe('20% STCG')
    expect(withinTolerance(result.taxAmount, expectedTax, golden.expected.tolerance)).toBe(true)
  })
})

describe('SIP calculations — adversarial & boundaries', () => {
  it('ADV-SIP-NULL: null monthly investment returns 0 corpus', () => {
    expect(calculateSIPFutureValue(null, 0.12, 60)).toBe(0)
    expect(calculateStepUpSIP(null, 0.1, 5, 0.12)).toBe(0)
  })

  it('ADV-SIP-UNDEF: undefined inputs return 0 corpus', () => {
    expect(calculateSIPFutureValue(undefined, 0.12, 60)).toBe(0)
    expect(calculateStepUpSIP(5000, 0.1, undefined, 0.12)).toBe(0)
  })

  it('ADV-SIP-MIN: ₹500 is schema minimum', () => {
    const { error } = sipSchema.validate({
      monthlySIP: 500,
      tenure: 1,
      tenureUnit: 'years',
      expectedReturn: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-SIP-MIN-1: ₹499 fails schema validation', () => {
    const { error } = sipSchema.validate({
      monthlySIP: 499,
      tenure: 1,
      tenureUnit: 'years',
      expectedReturn: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/minimum sip amount is ₹500/i)
  })

  it('ADV-SIP-TENURE-MIN: tenure 1 year is valid', () => {
    const { error } = sipSchema.validate({
      monthlySIP: 5000,
      tenure: 1,
      tenureUnit: 'years',
      expectedReturn: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-SIP-TENURE-MAX: tenure 50 years is valid', () => {
    const { error } = sipSchema.validate({
      monthlySIP: 5000,
      tenure: 50,
      tenureUnit: 'years',
      expectedReturn: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeUndefined()
  })

  it('ADV-SIP-TENURE-MAX+1: tenure 51 years fails validation', () => {
    const { error } = sipSchema.validate({
      monthlySIP: 5000,
      tenure: 51,
      tenureUnit: 'years',
      expectedReturn: 12,
      stepUpEnabled: false,
    })
    expect(error).toBeDefined()
    expect(error.details[0].message).toMatch(/maximum tenure is 50 years/i)
  })

  it('ADV-SIP-LTCG-BOUNDARY: 11 months triggers STCG, 13 months triggers LTCG', () => {
    const stcg = computeSIPOutputs({
      monthlySIP: 10000,
      tenure: 11,
      tenureUnit: 'months',
      expectedReturn: 12,
      stepUpEnabled: false,
      stepUpPercentage: 0,
    })
    const ltcg = computeSIPOutputs({
      monthlySIP: 10000,
      tenure: 13,
      tenureUnit: 'months',
      expectedReturn: 12,
      stepUpEnabled: false,
      stepUpPercentage: 0,
    })
    expect(stcg.taxRateLabel).toBe('20% STCG')
    expect(ltcg.taxRateLabel).toBe('12.5% LTCG')
  })

  adversarialSchemaCases.forEach(({ id, payload }) => {
    it(`${id}: schema rejects or handles adversarial payload`, () => {
      const { error } = sipSchema.validate(payload)
      expect(error).toBeDefined()
    })
  })
})
