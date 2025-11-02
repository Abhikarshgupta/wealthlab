/**
 * Corpus Simulation Utilities
 * Aggregates corpus from multiple investment instruments
 * Uses existing calculator functions from utils/calculations.js
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
import { convertYearsMonthsToYears, migrateFDData } from '@/utils/fdTenureUtils'

/**
 * Calculate future value of existing investment
 * @param {number} currentValue - Current investment value
 * @param {number} rate - Annual return rate (as decimal)
 * @param {number} remainingYears - Years until target date
 * @returns {number} Future value of existing investment
 */
const calculateExistingInvestmentFutureValue = (currentValue, rate, remainingYears) => {
  if (!currentValue || currentValue <= 0 || !remainingYears || remainingYears <= 0) {
    return currentValue || 0
  }
  return calculateCompoundInterest(currentValue, rate, remainingYears, 1)
}

/**
 * Calculate corpus for a single instrument based on its type and investment data
 * Supports both existing investments and future investments
 * @param {string} instrumentType - Type of instrument ('ppf', 'fd', 'sip', etc.)
 * @param {Object} investmentData - Investment parameters specific to the instrument
 * @param {number} timeHorizon - Total time horizon in years (for calculating existing investment growth)
 * @returns {Object} { investedAmount, maturityValue, returns, existingInvestmentValue, futureInvestmentValue }
 */
export const calculateInstrumentCorpus = (instrumentType, investmentData, timeHorizon = 0) => {
  if (!instrumentType || !investmentData) {
    return { investedAmount: 0, maturityValue: 0, returns: 0, existingInvestmentValue: 0, futureInvestmentValue: 0 }
  }

  let investedAmount = 0
  let maturityValue = 0
  let existingInvestmentValue = 0
  let futureInvestmentValue = 0

  // Handle existing investment if present
  const hasExistingInvestment = investmentData.hasExistingInvestment && investmentData.existingInvestment?.currentValue > 0
  const planToInvestMore = investmentData.planToInvestMore !== false // Default to true for backward compatibility
  
  // Determine rate for projecting existing investment:
  // - If planning to invest more: use future investment's expected return (shared projection rate)
  //   This will be handled per instrument type below
  // - If NOT planning to invest more: use existing investment's expectedReturnRate
  if (hasExistingInvestment && timeHorizon > 0 && !planToInvestMore) {
    // Only calculate here if NOT planning to invest more
    // If planning to invest more, rate will be determined per instrument type below
    const currentValue = investmentData.existingInvestment.currentValue || 0
    const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
    const remainingYears = Math.max(0, timeHorizon - yearsInvested)
    
    // Get expected return rate from existing investment
    // For different instruments, this might be in different fields
    let expectedReturnRate = investmentData.existingInvestment?.expectedReturnRate || 
                             investmentData.existingInvestment?.currentReturnRate || 
                             investmentData.rate || 0
    
    // For SGB, handle both gold appreciation and fixed rate
    if (instrumentType === 'sgb' && hasExistingInvestment && !planToInvestMore) {
      const goldRate = investmentData.existingInvestment?.goldAppreciationRate || 
                       investmentData.goldAppreciationRate || 0
      const fixedRate = investmentData.existingInvestment?.fixedRate || 2.5
      const goldRateDecimal = goldRate / 100
      const fixedRateDecimal = fixedRate / 100
      
      const goldAppreciatedValue = currentValue * Math.pow(1 + goldRateDecimal, remainingYears)
      const fixedInterestAmount = currentValue * (Math.pow(1 + fixedRateDecimal / 2, remainingYears * 2) - 1)
      existingInvestmentValue = goldAppreciatedValue + fixedInterestAmount
    } else if (expectedReturnRate > 0) {
      existingInvestmentValue = calculateExistingInvestmentFutureValue(
        currentValue,
        expectedReturnRate / 100,
        remainingYears
      )
    }
  }

  // Calculate future investments (only if planToInvestMore is true)
  // Also update existing investment projection rate if planning to invest more
  switch (instrumentType) {
    case 'ppf':
    case 'ssy': {
      const { yearlyInvestment, tenure, rate, stepUpEnabled, stepUpPercentage } = investmentData
      const rateDecimal = (rate || 0) / 100
      const stepUpDecimal = stepUpPercentage ? stepUpPercentage / 100 : 0

      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          rateDecimal,
          remainingYears
        )
      }

      if (planToInvestMore && yearlyInvestment && yearlyInvestment > 0 && tenure && tenure > 0) {
        // Calculate total invested
        if (stepUpEnabled && stepUpDecimal > 0) {
          for (let year = 0; year < tenure; year++) {
            investedAmount += yearlyInvestment * Math.pow(1 + stepUpDecimal, year)
          }
        } else {
          investedAmount = yearlyInvestment * tenure
        }

        // Calculate maturity value
        if (stepUpEnabled && stepUpDecimal > 0) {
          futureInvestmentValue = calculatePPFWithStepUp(yearlyInvestment, stepUpDecimal, rateDecimal, tenure)
        } else {
          futureInvestmentValue = calculatePPF(yearlyInvestment, rateDecimal, tenure)
        }
      }
      break
    }

    case 'fd': {
      // Migrate legacy data format if needed
      const migratedData = migrateFDData(investmentData)
      const { principal, rate, compoundingFrequency, tenureYears, tenureMonths, tenure, tenureUnit } = migratedData
      const rateDecimal = (rate || 0) / 100
      
      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          rateDecimal,
          remainingYears
        )
      }
      
      // Convert years+months to total years for calculation
      let totalYears = 0
      if (tenureYears !== undefined || tenureMonths !== undefined) {
        totalYears = convertYearsMonthsToYears(tenureYears || 0, tenureMonths || 0)
      } else if (tenure && tenureUnit) {
        // Legacy format fallback
        totalYears = tenureUnit === 'months' ? tenure / 12 : tenure
      }
      
      if (planToInvestMore && principal && principal > 0 && totalYears > 0) {
        investedAmount = principal
        futureInvestmentValue = calculateFD(principal, rateDecimal, totalYears, compoundingFrequency || 'quarterly')
      }
      break
    }

    case 'sip': {
      const { monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage } = investmentData
      const rateDecimal = (expectedReturn || 0) / 100
      
      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          rateDecimal,
          remainingYears
        )
      }
      
      if (planToInvestMore && monthlySIP && monthlySIP > 0 && tenure && tenure > 0) {
        const years = tenureUnit === 'months' ? tenure / 12 : tenure
        const months = tenureUnit === 'months' ? tenure : years * 12
        const stepUpDecimal = stepUpPercentage ? stepUpPercentage / 100 : 0

        // Calculate total invested
        if (stepUpEnabled && stepUpDecimal > 0) {
          for (let year = 0; year < years; year++) {
            investedAmount += monthlySIP * Math.pow(1 + stepUpDecimal, year) * 12
          }
        } else {
          investedAmount = monthlySIP * months
        }

        // Calculate maturity value
        if (stepUpEnabled && stepUpDecimal > 0) {
          futureInvestmentValue = calculateStepUpSIP(monthlySIP, stepUpDecimal, years, rateDecimal)
        } else {
          futureInvestmentValue = calculateSIPFutureValue(monthlySIP, rateDecimal, months)
        }
      }
      break
    }

    case 'nsc': {
      const { principal, rate, tenure = 5 } = investmentData
      
      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        const rateDecimal = (rate || 0) / 100
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          rateDecimal,
          remainingYears
        )
      }
      
      if (planToInvestMore && principal && principal > 0) {
        const rateDecimal = (rate || 0) / 100
        investedAmount = principal
        futureInvestmentValue = calculateNSC(principal, rateDecimal, tenure)
      }
      break
    }

    case 'scss': {
      const { principal, rate, tenure } = investmentData
      
      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        const rateDecimal = (rate || 0) / 100
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          rateDecimal,
          remainingYears
        )
      }
      
      if (planToInvestMore && principal && principal > 0 && tenure && tenure > 0) {
        const rateDecimal = (rate || 0) / 100
        investedAmount = principal
        // SCSS: Quarterly interest = Principal × (Rate / 4)
        // Total interest = Quarterly Interest × Number of Quarters
        const quarterlyInterest = principal * (rateDecimal / 4)
        const numberOfQuarters = tenure * 4
        const totalInterest = quarterlyInterest * numberOfQuarters
        futureInvestmentValue = principal + totalInterest
      }
      break
    }

    case 'sgb': {
      const { principal, goldAppreciationRate, tenure, fixedRate = 2.5 } = investmentData
      
      // If planning to invest more, use future investment rates for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        const goldRateDecimal = (goldAppreciationRate || 0) / 100
        const fixedRateDecimal = fixedRate / 100
        
        // For SGB, project both gold appreciation and fixed interest
        const goldAppreciatedValue = currentValue * Math.pow(1 + goldRateDecimal, remainingYears)
        const fixedInterestAmount = currentValue * (Math.pow(1 + fixedRateDecimal / 2, remainingYears * 2) - 1)
        existingInvestmentValue = goldAppreciatedValue + fixedInterestAmount
      }
      
      if (planToInvestMore && principal && principal > 0 && tenure && tenure > 0) {
        const goldRateDecimal = (goldAppreciationRate || 0) / 100
        const fixedRateDecimal = fixedRate / 100

        investedAmount = principal

        // Gold appreciation component
        const goldAppreciatedValue = principal * Math.pow(1 + goldRateDecimal, tenure)

        // Fixed interest component: 2.5% p.a. paid semi-annually (compounds)
        const fixedInterestAmount = principal * (Math.pow(1 + fixedRateDecimal / 2, tenure * 2) - 1)

        futureInvestmentValue = goldAppreciatedValue + fixedInterestAmount
      }
      break
    }

    case 'nps': {
      const {
        monthlyContribution,
        tenure,
        equityAllocation,
        corporateBondsAllocation,
        governmentBondsAllocation,
        alternativeAllocation,
        equityReturn,
        corporateBondsReturn,
        governmentBondsReturn,
        alternativeReturn,
      } = investmentData

      // Calculate weighted return for projection
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

      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          weightedReturn,
          remainingYears
        )
      }

      if (planToInvestMore && monthlyContribution && monthlyContribution > 0 && tenure && tenure > 0) {
        investedAmount = monthlyContribution * 12 * tenure
        futureInvestmentValue = calculateNPSFutureValue(monthlyContribution, weightedReturn, tenure)
      }
      break
    }

    case 'equity': {
      const { investmentType, amount, tenure, expectedCAGR, stepUpEnabled, stepUpPercentage } = investmentData
      const rateDecimal = (expectedCAGR || 0) / 100
      
      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          rateDecimal,
          remainingYears
        )
      }
      
      if (planToInvestMore && amount && amount > 0 && tenure && tenure > 0) {
        if (investmentType === 'sip') {
          const years = tenure
          const months = years * 12
          const stepUpDecimal = stepUpPercentage ? stepUpPercentage / 100 : 0

          // Calculate total invested
          if (stepUpEnabled && stepUpDecimal > 0) {
            for (let year = 0; year < years; year++) {
              investedAmount += amount * Math.pow(1 + stepUpDecimal, year) * 12
            }
          } else {
            investedAmount = amount * months
          }

          // Calculate maturity value
          if (stepUpEnabled && stepUpDecimal > 0) {
            futureInvestmentValue = calculateStepUpSIP(amount, stepUpDecimal, years, rateDecimal)
          } else {
            futureInvestmentValue = calculateSIPFutureValue(amount, rateDecimal, months)
          }
        } else {
          // Lumpsum
          investedAmount = amount
          futureInvestmentValue = calculateCompoundInterest(amount, rateDecimal, tenure, 1)
        }
      }
      break
    }

    case 'elss': {
      const { investmentType, amount, tenure, expectedReturn } = investmentData
      const rateDecimal = (expectedReturn || 0) / 100

      // If planning to invest more, use future investment rate for existing projection too
      if (hasExistingInvestment && planToInvestMore && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
        const remainingYears = Math.max(0, timeHorizon - yearsInvested)
        
        existingInvestmentValue = calculateExistingInvestmentFutureValue(
          currentValue,
          rateDecimal,
          remainingYears
        )
      }

      if (planToInvestMore && amount && amount > 0 && tenure && tenure > 0) {
        if (investmentType === 'sip') {
          const years = tenure
          const months = years * 12

          investedAmount = amount * months
          futureInvestmentValue = calculateSIPFutureValue(amount, rateDecimal, months)
        } else {
          // Lumpsum
          investedAmount = amount
          futureInvestmentValue = calculateCompoundInterest(amount, rateDecimal, tenure, 1)
        }
      }
      break
    }

    default:
      return { 
        investedAmount: 0, 
        maturityValue: 0, 
        returns: 0, 
        existingInvestmentValue: 0, 
        futureInvestmentValue: 0 
      }
  }

  // Combine existing and future investments
  maturityValue = existingInvestmentValue + futureInvestmentValue
  const returns = maturityValue - investedAmount - (investmentData.existingInvestment?.currentValue || 0)

  return {
    investedAmount: Math.round(investedAmount * 100) / 100,
    maturityValue: Math.round(maturityValue * 100) / 100,
    returns: Math.round(returns * 100) / 100,
    existingInvestmentValue: Math.round(existingInvestmentValue * 100) / 100,
    futureInvestmentValue: Math.round(futureInvestmentValue * 100) / 100,
  }
}

/**
 * Aggregate invested amounts across all instruments
 * @param {Array<string>} instruments - Array of instrument type strings
 * @param {Object} investments - Object mapping instrument types to their investment data
 * @returns {Object} Aggregated amounts per instrument and total
 */
export const aggregateInvestedAmounts = (instruments, investments) => {
  const aggregated = {
    byInstrument: {},
    total: 0,
  }

  if (!instruments || !Array.isArray(instruments) || !investments) {
    return aggregated
  }

  instruments.forEach((instrumentType) => {
    const investmentData = investments[instrumentType]
    if (!investmentData) return

    const corpus = calculateInstrumentCorpus(instrumentType, investmentData)
    aggregated.byInstrument[instrumentType] = corpus.investedAmount
    aggregated.total += corpus.investedAmount
  })

  aggregated.total = Math.round(aggregated.total * 100) / 100

  return aggregated
}

/**
 * Aggregate maturity values across all instruments
 * @param {Array<string>} instruments - Array of instrument type strings
 * @param {Object} investments - Object mapping instrument types to their investment data
 * @returns {Object} Aggregated maturity values per instrument and total
 */
export const aggregateMaturityValues = (instruments, investments) => {
  const aggregated = {
    byInstrument: {},
    total: 0,
  }

  if (!instruments || !Array.isArray(instruments) || !investments) {
    return aggregated
  }

  instruments.forEach((instrumentType) => {
    const investmentData = investments[instrumentType]
    if (!investmentData) return

    const corpus = calculateInstrumentCorpus(instrumentType, investmentData)
    aggregated.byInstrument[instrumentType] = corpus.maturityValue
    aggregated.total += corpus.maturityValue
  })

  aggregated.total = Math.round(aggregated.total * 100) / 100

  return aggregated
}

/**
 * Calculate total corpus from multiple instruments
 * @param {Array<string>} instruments - Array of instrument type strings
 * @param {Object} investments - Object mapping instrument types to their investment data
 * @param {number} timeHorizon - Total time horizon in years (for existing investments)
 * @returns {Object} Complete corpus calculation results
 */
export const calculateCorpusFromInstruments = (instruments, investments, timeHorizon = 0) => {
  if (!instruments || !Array.isArray(instruments) || instruments.length === 0) {
    return {
      totalInvested: 0,
      totalReturns: 0,
      nominalCorpus: 0,
      totalExistingValue: 0,
      totalFutureInvested: 0,
      byInstrument: {},
    }
  }

  if (!investments || typeof investments !== 'object') {
    return {
      totalInvested: 0,
      totalReturns: 0,
      nominalCorpus: 0,
      totalExistingValue: 0,
      totalFutureInvested: 0,
      byInstrument: {},
    }
  }

  const byInstrument = {}
  let totalInvested = 0
  let totalMaturityValue = 0
  let totalExistingValue = 0
  let totalFutureInvested = 0

  instruments.forEach((instrumentType) => {
    const investmentData = investments[instrumentType]
    if (!investmentData) return

    const corpus = calculateInstrumentCorpus(instrumentType, investmentData, timeHorizon)
    const existingCurrentValue = investmentData.existingInvestment?.currentValue || 0
    
    byInstrument[instrumentType] = {
      investedAmount: corpus.investedAmount,
      maturityValue: corpus.maturityValue,
      returns: corpus.returns,
      existingInvestmentValue: corpus.existingInvestmentValue,
      futureInvestmentValue: corpus.futureInvestmentValue,
      existingCurrentValue: existingCurrentValue,
      percentage: 0, // Will be calculated after total is known
    }

    totalInvested += corpus.investedAmount
    totalMaturityValue += corpus.maturityValue
    totalExistingValue += existingCurrentValue
    totalFutureInvested += corpus.investedAmount
  })

  // Calculate percentages
  Object.keys(byInstrument).forEach((instrumentType) => {
    if (totalMaturityValue > 0) {
      byInstrument[instrumentType].percentage =
        Math.round((byInstrument[instrumentType].maturityValue / totalMaturityValue) * 100 * 100) / 100
    }
  })

  const totalReturns = totalMaturityValue - totalInvested - totalExistingValue

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    nominalCorpus: Math.round(totalMaturityValue * 100) / 100,
    totalExistingValue: Math.round(totalExistingValue * 100) / 100,
    totalFutureInvested: Math.round(totalFutureInvested * 100) / 100,
    byInstrument,
  }
}

export default {
  calculateCorpusFromInstruments,
  aggregateInvestedAmounts,
  aggregateMaturityValues,
  calculateInstrumentCorpus,
}

