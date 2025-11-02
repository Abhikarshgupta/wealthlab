/**
 * Utility to calculate current value of existing investments
 * Uses existing calculator functions for accuracy
 */

import {
  calculatePPF,
  calculatePPFWithStepUp,
  calculateFD,
  calculateSIPFutureValue,
  calculateStepUpSIP,
  calculateNSC,
  calculateSGB,
  calculateNPSFutureValue,
  calculateNPSWeightedReturn,
  calculateCompoundInterest,
} from '@/utils/calculations'
import { investmentRates } from '@/constants/investmentRates'

/**
 * Calculate current value of existing investment based on instrument type
 * This calculates what the investment would be worth today given initial investment and years invested
 * @param {string} instrumentType - Type of instrument
 * @param {Object} existingInvestmentData - { initialInvestment, yearsInvested, yearlyContribution, rate }
 * @returns {number} Current value of the investment
 */
export const calculateExistingInvestmentCurrentValue = (instrumentType, existingInvestmentData) => {
  if (!existingInvestmentData || !existingInvestmentData.yearsInvested || existingInvestmentData.yearsInvested <= 0) {
    return existingInvestmentData?.currentValue || 0
  }

  const { initialInvestment = 0, yearsInvested, yearlyContribution = 0, rate, stepUpEnabled, stepUpPercentage } = existingInvestmentData

  // If user provided currentValue directly, use it (most accurate)
  if (existingInvestmentData.currentValue && existingInvestmentData.currentValue > 0) {
    return existingInvestmentData.currentValue
  }

  // Calculate from initial investment + contributions
  const rateDecimal = (rate || 0) / 100

  switch (instrumentType) {
    case 'ppf':
    case 'ssy': {
      // For PPF/SSY, we need yearly contribution to calculate accurately
      // If not provided, estimate from current value and years invested
      if (yearlyContribution > 0 && yearsInvested > 0) {
        // Calculate as if started from scratch with yearly contributions
        const stepUpDecimal = stepUpPercentage ? stepUpPercentage / 100 : 0
        if (stepUpEnabled && stepUpDecimal > 0) {
          return calculatePPFWithStepUp(yearlyContribution, stepUpDecimal, rateDecimal, yearsInvested)
        } else {
          return calculatePPF(yearlyContribution, rateDecimal, yearsInvested)
        }
      } else if (initialInvestment > 0 && yearsInvested > 0) {
        // If we have initial investment and years, calculate compound growth
        return calculateCompoundInterest(initialInvestment, rateDecimal, yearsInvested, 1)
      }
      // If user provided currentValue directly, use it (most accurate)
      return existingInvestmentData.currentValue || initialInvestment || 0
    }

    case 'fd': {
      const { tenureUnit, compoundingFrequency } = existingInvestmentData
      const years = tenureUnit === 'months' ? yearsInvested / 12 : yearsInvested
      if (initialInvestment > 0) {
        return calculateFD(initialInvestment, rateDecimal, years, compoundingFrequency || 'quarterly')
      }
      return initialInvestment || 0
    }

    case 'sip': {
      const { monthlySIP, tenureUnit } = existingInvestmentData
      const years = tenureUnit === 'months' ? yearsInvested / 12 : yearsInvested
      const months = tenureUnit === 'months' ? yearsInvested : years * 12
      const stepUpDecimal = stepUpPercentage ? stepUpPercentage / 100 : 0

      if (monthlySIP > 0) {
        if (stepUpEnabled && stepUpDecimal > 0) {
          return calculateStepUpSIP(monthlySIP, stepUpDecimal, years, rateDecimal)
        } else {
          return calculateSIPFutureValue(monthlySIP, rateDecimal, months)
        }
      }
      return initialInvestment || 0
    }

    case 'nsc': {
      if (initialInvestment > 0) {
        return calculateNSC(initialInvestment, rateDecimal, Math.min(yearsInvested, 5))
      }
      return initialInvestment || 0
    }

    case 'scss': {
      if (initialInvestment > 0) {
        // SCSS: Quarterly interest
        const quarterlyInterest = initialInvestment * (rateDecimal / 4)
        const numberOfQuarters = Math.min(yearsInvested, 5) * 4
        const totalInterest = quarterlyInterest * numberOfQuarters
        return initialInvestment + totalInterest
      }
      return initialInvestment || 0
    }

    case 'sgb': {
      const { goldAppreciationRate, fixedRate = 2.5 } = existingInvestmentData
      const goldRateDecimal = (goldAppreciationRate || 0) / 100
      const fixedRateDecimal = fixedRate / 100

      if (initialInvestment > 0) {
        const goldAppreciatedValue = initialInvestment * Math.pow(1 + goldRateDecimal, yearsInvested)
        const fixedInterestAmount = initialInvestment * (Math.pow(1 + fixedRateDecimal / 2, yearsInvested * 2) - 1)
        return goldAppreciatedValue + fixedInterestAmount
      }
      return initialInvestment || 0
    }

    case 'nps': {
      const {
        monthlyContribution,
        equityAllocation,
        corporateBondsAllocation,
        governmentBondsAllocation,
        alternativeAllocation,
        equityReturn,
        corporateBondsReturn,
        governmentBondsReturn,
        alternativeReturn,
      } = existingInvestmentData

      if (monthlyContribution > 0 && yearsInvested > 0) {
        const equityAlloc = (equityAllocation || 0) / 100
        const corporateBondsAlloc = (corporateBondsAllocation || 0) / 100
        const governmentBondsAlloc = (governmentBondsAllocation || 0) / 100
        const alternativeAlloc = (alternativeAllocation || 0) / 100

        const equityRet = (equityReturn || 0) / 100
        const corporateBondsRet = (corporateBondsReturn || 0) / 100
        const governmentBondsRet = (governmentBondsReturn || 0) / 100
        const alternativeRet = (alternativeReturn || 0) / 100

        const weightedReturn = calculateNPSWeightedReturn(
          equityAlloc,
          equityRet,
          corporateBondsAlloc,
          corporateBondsRet,
          governmentBondsAlloc,
          governmentBondsRet,
          alternativeAlloc,
          alternativeRet
        )

        return calculateNPSFutureValue(monthlyContribution, weightedReturn, yearsInvested)
      }
      return initialInvestment || 0
    }

    case 'equity':
    case 'elss': {
      const { investmentType, amount } = existingInvestmentData
      if (investmentType === 'sip' && amount > 0) {
        const months = yearsInvested * 12
        return calculateSIPFutureValue(amount, rateDecimal, months)
      } else if (initialInvestment > 0 || amount > 0) {
        return calculateCompoundInterest(initialInvestment || amount, rateDecimal, yearsInvested, 1)
      }
      return initialInvestment || amount || 0
    }

    default:
      return existingInvestmentData?.currentValue || initialInvestment || 0
  }
}

/**
 * Get realistic default values for existing investments based on instrument type
 * @param {string} instrumentType - Type of instrument
 * @returns {Object} Default values { currentValue, yearsInvested, rate }
 */
export const getExistingInvestmentDefaults = (instrumentType) => {
  const defaults = {
    ppf: {
      currentValue: 30000,
      yearsInvested: 5,
      rate: 7.5,
    },
    ssy: {
      currentValue: 25000,
      yearsInvested: 3,
      rate: 7.6,
    },
    fd: {
      currentValue: 50000,
      yearsInvested: 2,
      rate: 6.5,
    },
    sip: {
      currentValue: 75000,
      yearsInvested: 3,
      rate: 12,
    },
    nsc: {
      currentValue: 35000,
      yearsInvested: 2,
      rate: 6.8,
    },
    scss: {
      currentValue: 100000,
      yearsInvested: 1,
      rate: 7.4,
    },
    sgb: {
      currentValue: 45000,
      yearsInvested: 2,
      rate: 10, // Gold appreciation
    },
    nps: {
      currentValue: 120000,
      yearsInvested: 5,
      rate: 10, // Weighted return
    },
    equity: {
      currentValue: 100000,
      yearsInvested: 3,
      rate: 14,
    },
    elss: {
      currentValue: 80000,
      yearsInvested: 2,
      rate: 13,
    },
  }

  return defaults[instrumentType] || {
    currentValue: 50000,
    yearsInvested: 3,
    rate: 7,
  }
}

/**
 * Get maximum tenure for fixed-term investments
 * @param {string} instrumentType - Type of instrument
 * @returns {number|null} Maximum tenure in years, or null if no limit
 */
export const getMaxTenureForInstrument = (instrumentType) => {
  const maxTenures = {
    ppf: 15, // PPF has 15-year lock-in, but can be extended
    ssy: null, // SSY matures when girl child turns 21
    nsc: 5, // NSC has fixed 5-year tenure
    scss: 5, // SCSS maximum 5 years
  }

  return maxTenures[instrumentType] || null
}

/**
 * Check if existing investment exceeds maximum tenure
 * @param {string} instrumentType - Type of instrument
 * @param {number} yearsInvested - Years already invested
 * @returns {Object} { exceeds: boolean, maxTenure: number|null, message: string }
 */
export const checkTenureLimit = (instrumentType, yearsInvested) => {
  const maxTenure = getMaxTenureForInstrument(instrumentType)
  
  if (maxTenure === null) {
    return { exceeds: false, maxTenure: null, message: null }
  }

  if (yearsInvested >= maxTenure) {
    const instrumentNames = {
      ppf: 'PPF',
      ssy: 'SSY',
      nsc: 'NSC',
      scss: 'SCSS',
    }
    const name = instrumentNames[instrumentType] || instrumentType.toUpperCase()
    
    let message = `Maximum tenure of ${maxTenure} years reached for ${name}.`
    
    if (instrumentType === 'ppf') {
      message += ' You can extend PPF in blocks of 5 years after maturity.'
    } else if (instrumentType === 'nsc') {
      message += ' NSC has a fixed 5-year tenure.'
    } else if (instrumentType === 'scss') {
      message += ' SCSS maximum tenure is 5 years.'
    }

    return { exceeds: true, maxTenure, message }
  }

  return { exceeds: false, maxTenure, message: null }
}

/**
 * Get smart default for planToInvestMore based on instrument type
 * One-time investments (SGB, NSC, SCSS) default to false
 * Recurring investments (PPF, SSY, SIP, NPS) default to true
 * @param {string} instrumentId - The ID of the instrument
 * @returns {boolean} Default value for planToInvestMore
 */
export const getDefaultPlanToInvestMore = (instrumentId) => {
  // One-time investments (typically bought once, value fluctuates)
  const oneTimeInvestments = ['sgb', 'nsc', 'scss']
  
  // If it's a one-time investment, default to false
  if (oneTimeInvestments.includes(instrumentId)) {
    return false
  }
  
  // For recurring investments, default to true
  return true
}

export default {
  calculateExistingInvestmentCurrentValue,
  getExistingInvestmentDefaults,
  getMaxTenureForInstrument,
  checkTenureLimit,
}

