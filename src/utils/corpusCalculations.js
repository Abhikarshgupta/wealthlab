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
    return {
      investedAmount: 0,
      maturityValue: 0,
      returns: 0,
      existingInvestmentValue: 0,
      futureInvestmentValue: 0,
      projectedInvestedAmount: 0,
      projectedFutureInvestmentValue: 0,
      isProjectedBeyondHorizon: false,
    }
  }

  let investedAmount = 0
  let maturityValue = 0
  let existingInvestmentValue = 0
  let futureInvestmentValue = 0
  let projectedInvestedAmount = 0
  let projectedFutureInvestmentValue = 0
  let isProjectedBeyondHorizon = false

  // Handle existing investment if present
  const hasExistingInvestment = investmentData.hasExistingInvestment && investmentData.existingInvestment?.currentValue > 0
  const planToInvestMore = investmentData.planToInvestMore !== false // Default to true for backward compatibility

  // Calculate effective tenure: cap tenure with timeHorizon
  // This ensures investments don't exceed the withdrawal horizon
  const getEffectiveTenure = (tenureValue) => {
    if (!tenureValue || tenureValue <= 0) return 0
    if (timeHorizon > 0) {
      return Math.min(tenureValue, timeHorizon)
    }
    return tenureValue
  }

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

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(tenure)

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          // Project existing investment for effectiveTenure period
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          // If NOT planning to invest more, use timeHorizon
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              remainingYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && yearlyInvestment && yearlyInvestment > 0 && effectiveTenure > 0) {
        // Calculate total invested using effectiveTenure
        if (stepUpEnabled && stepUpDecimal > 0) {
          for (let year = 0; year < effectiveTenure; year++) {
            investedAmount += yearlyInvestment * Math.pow(1 + stepUpDecimal, year)
          }
        } else {
          investedAmount = yearlyInvestment * effectiveTenure
        }

        // Calculate maturity value using effectiveTenure
        if (stepUpEnabled && stepUpDecimal > 0) {
          futureInvestmentValue = calculatePPFWithStepUp(yearlyInvestment, stepUpDecimal, rateDecimal, effectiveTenure)
        } else {
          futureInvestmentValue = calculatePPF(yearlyInvestment, rateDecimal, effectiveTenure)
        }
      }
      break
    }

    case 'fd': {
      // Migrate legacy data format if needed
      const migratedData = migrateFDData(investmentData)
      const { principal, rate, compoundingFrequency, tenureYears, tenureMonths, tenure, tenureUnit } = migratedData
      const rateDecimal = (rate || 0) / 100

      // Convert years+months to total years for calculation
      let totalYears = 0
      if (tenureYears !== undefined || tenureMonths !== undefined) {
        totalYears = convertYearsMonthsToYears(tenureYears || 0, tenureMonths || 0)
      } else if (tenure && tenureUnit) {
        // Legacy format fallback
        totalYears = tenureUnit === 'months' ? tenure / 12 : tenure
      }

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(totalYears)

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              remainingYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && principal && principal > 0 && effectiveTenure > 0) {
        investedAmount = principal
        futureInvestmentValue = calculateFD(principal, rateDecimal, effectiveTenure, compoundingFrequency || 'quarterly')
      }
      break
    }

    case 'sip': {
      const { monthlySIP, tenure, tenureUnit, expectedReturn, stepUpEnabled, stepUpPercentage } = investmentData
      const rateDecimal = (expectedReturn || 0) / 100

      // Convert tenure to years
      const years = tenureUnit === 'months' ? tenure / 12 : tenure

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(years)
      const effectiveMonths = effectiveTenure * 12

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              remainingYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && monthlySIP && monthlySIP > 0 && effectiveTenure > 0) {
        const stepUpDecimal = stepUpPercentage ? stepUpPercentage / 100 : 0

        // Calculate total invested using effectiveTenure
        if (stepUpEnabled && stepUpDecimal > 0) {
          for (let year = 0; year < effectiveTenure; year++) {
            investedAmount += monthlySIP * Math.pow(1 + stepUpDecimal, year) * 12
          }
        } else {
          investedAmount = monthlySIP * effectiveMonths
        }

        // Calculate maturity value using effectiveTenure
        if (stepUpEnabled && stepUpDecimal > 0) {
          futureInvestmentValue = calculateStepUpSIP(monthlySIP, stepUpDecimal, effectiveTenure, rateDecimal)
        } else {
          futureInvestmentValue = calculateSIPFutureValue(monthlySIP, rateDecimal, effectiveMonths)
        }
      }
      break
    }

    case 'nsc': {
      const { principal, rate, tenure = 5 } = investmentData
      const rateDecimal = (rate || 0) / 100

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(tenure)

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              remainingYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && principal && principal > 0 && effectiveTenure > 0) {
        investedAmount = principal
        futureInvestmentValue = calculateNSC(principal, rateDecimal, effectiveTenure)
      }
      break
    }

    case 'scss': {
      const { principal, rate, tenure } = investmentData
      const rateDecimal = (rate || 0) / 100

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(tenure)

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              remainingYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && principal && principal > 0 && effectiveTenure > 0) {
        investedAmount = principal
        // SCSS: Quarterly interest = Principal × (Rate / 4)
        // Total interest = Quarterly Interest × Number of Quarters
        const quarterlyInterest = principal * (rateDecimal / 4)
        const numberOfQuarters = effectiveTenure * 4
        const totalInterest = quarterlyInterest * numberOfQuarters
        futureInvestmentValue = principal + totalInterest
      }
      break
    }

    case 'sgb': {
      const { principal, goldAppreciationRate, tenure, fixedRate = 2.5 } = investmentData
      const goldRateDecimal = (goldAppreciationRate || 0) / 100
      const fixedRateDecimal = fixedRate / 100

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(tenure)

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            // For SGB, project both gold appreciation and fixed interest
            const goldAppreciatedValue = currentValue * Math.pow(1 + goldRateDecimal, projectionYears)
            const fixedInterestAmount = currentValue * (Math.pow(1 + fixedRateDecimal / 2, projectionYears * 2) - 1)
            existingInvestmentValue = goldAppreciatedValue + fixedInterestAmount
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            const goldAppreciatedValue = currentValue * Math.pow(1 + goldRateDecimal, remainingYears)
            const fixedInterestAmount = currentValue * (Math.pow(1 + fixedRateDecimal / 2, remainingYears * 2) - 1)
            existingInvestmentValue = goldAppreciatedValue + fixedInterestAmount
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && principal && principal > 0 && effectiveTenure > 0) {
        investedAmount = principal

        // Gold appreciation component using effectiveTenure
        const goldAppreciatedValue = principal * Math.pow(1 + goldRateDecimal, effectiveTenure)

        // Fixed interest component: 2.5% p.a. paid semi-annually (compounds)
        const fixedInterestAmount = principal * (Math.pow(1 + fixedRateDecimal / 2, effectiveTenure * 2) - 1)

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

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(tenure)

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          // Project existing investment for effectiveTenure period
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              weightedReturn,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          // If NOT planning to invest more, use timeHorizon
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            // Use existing investment's return rate
            const existingReturnRate = investmentData.existingInvestment?.expectedReturnRate ||
                                       investmentData.existingInvestment?.currentReturnRate || 0
            if (existingReturnRate > 0) {
              existingInvestmentValue = calculateExistingInvestmentFutureValue(
                currentValue,
                existingReturnRate / 100,
                remainingYears
              )
            } else {
              existingInvestmentValue = currentValue
            }
          } else {
            existingInvestmentValue = currentValue
          }
        }
      } else if (hasExistingInvestment) {
        existingInvestmentValue = investmentData.existingInvestment.currentValue || 0
      }

      // Calculate projected values at full tenure (for display with asterisk)
      // This shows what the investment would be worth if continued beyond withdrawal horizon
      isProjectedBeyondHorizon = timeHorizon > 0 && tenure > timeHorizon

      if (isProjectedBeyondHorizon && planToInvestMore && monthlyContribution && monthlyContribution > 0) {
        // Calculate what investment would be worth at full tenure (beyond horizon)
        projectedInvestedAmount = monthlyContribution * 12 * tenure
        projectedFutureInvestmentValue = calculateNPSFutureValue(monthlyContribution, weightedReturn, tenure)

        // Also project existing investment to full tenure
        if (hasExistingInvestment) {
          const currentValue = investmentData.existingInvestment.currentValue || 0
          const yearsInvested = investmentData.existingInvestment.yearsInvested || 0
          const remainingYears = Math.max(0, tenure - yearsInvested)
          if (remainingYears > 0) {
            // Calculate projected existing investment value at full tenure
            const projectedExistingValue = calculateExistingInvestmentFutureValue(
              currentValue,
              weightedReturn,
              remainingYears
            )
            // Add only the growth portion to projected future value
            projectedFutureInvestmentValue += projectedExistingValue - currentValue
          }
        }
      }

      // Handle future investments using effectiveTenure
      // This calculates net worth at timeHorizon (even if investments continue beyond)
      // If planToInvestMore is false, don't calculate future investments
      // If effectiveTenure is 0, calculate based on actual tenure (for net worth estimation)
      if (planToInvestMore && monthlyContribution && monthlyContribution > 0) {
        if (effectiveTenure > 0) {
          // Normal case: calculate future investments for effectiveTenure (net worth at timeHorizon)
          investedAmount = monthlyContribution * 12 * effectiveTenure
          futureInvestmentValue = calculateNPSFutureValue(monthlyContribution, weightedReturn, effectiveTenure)
        } else {
          // Edge case: effectiveTenure is 0 due to timeHorizon = 0 or tenure = 0
          // If timeHorizon = 0, use full tenure (no cap - estimate current net worth)
          if (timeHorizon === 0 && tenure > 0) {
            investedAmount = monthlyContribution * 12 * tenure
            futureInvestmentValue = calculateNPSFutureValue(monthlyContribution, weightedReturn, tenure)
          } else if (tenure > 0) {
            // tenure exists but effectiveTenure is 0 (edge case)
            // Still calculate for net worth estimation
            investedAmount = monthlyContribution * 12 * tenure
            futureInvestmentValue = calculateNPSFutureValue(monthlyContribution, weightedReturn, tenure)
          } else {
            // tenure is 0 or undefined - explicitly set to 0
            investedAmount = 0
            futureInvestmentValue = 0
          }
        }
      } else if (!planToInvestMore && hasExistingInvestment) {
        // If NOT planning to invest more, investedAmount should be 0 (only existing investment)
        investedAmount = 0
        futureInvestmentValue = 0
      }
      break
    }

    case 'equity': {
      const { investmentType, amount, tenure, expectedCAGR, stepUpEnabled, stepUpPercentage } = investmentData
      const rateDecimal = (expectedCAGR || 0) / 100

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(tenure)
      const effectiveMonths = effectiveTenure * 12

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              remainingYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && amount && amount > 0 && effectiveTenure > 0) {
        if (investmentType === 'sip') {
          const stepUpDecimal = stepUpPercentage ? stepUpPercentage / 100 : 0

          // Calculate total invested using effectiveTenure
          if (stepUpEnabled && stepUpDecimal > 0) {
            for (let year = 0; year < effectiveTenure; year++) {
              investedAmount += amount * Math.pow(1 + stepUpDecimal, year) * 12
            }
          } else {
            investedAmount = amount * effectiveMonths
          }

          // Calculate maturity value using effectiveTenure
          if (stepUpEnabled && stepUpDecimal > 0) {
            futureInvestmentValue = calculateStepUpSIP(amount, stepUpDecimal, effectiveTenure, rateDecimal)
          } else {
            futureInvestmentValue = calculateSIPFutureValue(amount, rateDecimal, effectiveMonths)
          }
        } else {
          // Lumpsum using effectiveTenure
          investedAmount = amount
          futureInvestmentValue = calculateCompoundInterest(amount, rateDecimal, effectiveTenure, 1)
        }
      }
      break
    }

    case 'elss': {
      const { investmentType, amount, tenure, expectedReturn } = investmentData
      const rateDecimal = (expectedReturn || 0) / 100

      // Calculate effective tenure (capped by timeHorizon)
      const effectiveTenure = getEffectiveTenure(tenure)
      const effectiveMonths = effectiveTenure * 12

      // Handle existing investment projection
      if (hasExistingInvestment && timeHorizon > 0) {
        const currentValue = investmentData.existingInvestment.currentValue || 0
        const yearsInvested = investmentData.existingInvestment.yearsInvested || 0

        if (planToInvestMore && effectiveTenure > 0) {
          const projectionYears = Math.max(0, Math.min(effectiveTenure, timeHorizon - yearsInvested))
          if (projectionYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              projectionYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        } else {
          const remainingYears = Math.max(0, timeHorizon - yearsInvested)
          if (remainingYears > 0) {
            existingInvestmentValue = calculateExistingInvestmentFutureValue(
              currentValue,
              rateDecimal,
              remainingYears
            )
          } else {
            existingInvestmentValue = currentValue
          }
        }
      }

      if (planToInvestMore && amount && amount > 0 && effectiveTenure > 0) {
        if (investmentType === 'sip') {
          investedAmount = amount * effectiveMonths
          futureInvestmentValue = calculateSIPFutureValue(amount, rateDecimal, effectiveMonths)
        } else {
          // Lumpsum using effectiveTenure
          investedAmount = amount
          futureInvestmentValue = calculateCompoundInterest(amount, rateDecimal, effectiveTenure, 1)
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
        futureInvestmentValue: 0,
        projectedInvestedAmount: 0,
        projectedFutureInvestmentValue: 0,
        isProjectedBeyondHorizon: false,
      }
  }

  // Combine existing and future investments
  maturityValue = existingInvestmentValue + futureInvestmentValue

  // Calculate returns correctly:
  // - For existing investments: returns = future value - current value (growth from now to future)
  // - For future investments: returns = future value - invested amount (growth from investment to maturity)
  // - Total returns = returns from existing + returns from future
  // CRITICAL: Only calculate returns from future investments if we actually invested
  const existingCurrentValue = investmentData.existingInvestment?.currentValue || 0
  const returnsFromExisting = existingInvestmentValue - existingCurrentValue

  // Only calculate returns from future if we actually have future investment
  // If investedAmount is 0 but futureInvestmentValue is also 0, returnsFromFuture should be 0 (not negative)
  // This ensures we never show negative returns incorrectly
  const returnsFromFuture = (investedAmount > 0 && futureInvestmentValue > 0)
    ? (futureInvestmentValue - investedAmount)
    : (investedAmount === 0 && futureInvestmentValue === 0 ? 0 : (futureInvestmentValue - investedAmount))

  const returns = returnsFromExisting + returnsFromFuture

  return {
    investedAmount: Math.round(investedAmount * 100) / 100,
    maturityValue: Math.round(maturityValue * 100) / 100,
    returns: Math.round(returns * 100) / 100,
    existingInvestmentValue: Math.round(existingInvestmentValue * 100) / 100,
    futureInvestmentValue: Math.round(futureInvestmentValue * 100) / 100,
    // Projected values beyond withdrawal horizon (for display with asterisk)
    projectedInvestedAmount: Math.round(projectedInvestedAmount * 100) / 100,
    projectedFutureInvestmentValue: Math.round(projectedFutureInvestmentValue * 100) / 100,
    isProjectedBeyondHorizon: isProjectedBeyondHorizon || false,
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

    // Calculate projected maturity value and returns if beyond horizon
    // Projected values show what the investment would be worth at full tenure
    const projectedMaturityValue = corpus.isProjectedBeyondHorizon && corpus.projectedFutureInvestmentValue > 0
      ? corpus.existingInvestmentValue + corpus.projectedFutureInvestmentValue
      : 0
    const projectedReturns = corpus.isProjectedBeyondHorizon && projectedMaturityValue > 0
      ? projectedMaturityValue - existingCurrentValue - (corpus.projectedInvestedAmount || 0)
      : 0

    byInstrument[instrumentType] = {
      investedAmount: corpus.investedAmount,
      maturityValue: corpus.maturityValue,
      returns: corpus.returns,
      existingInvestmentValue: corpus.existingInvestmentValue,
      futureInvestmentValue: corpus.futureInvestmentValue,
      existingCurrentValue: existingCurrentValue,
      percentage: 0, // Will be calculated after total is known
      // Projected values beyond withdrawal horizon (for display with asterisk)
      projectedInvestedAmount: corpus.projectedInvestedAmount || 0,
      projectedFutureInvestmentValue: corpus.projectedFutureInvestmentValue || 0,
      projectedMaturityValue: projectedMaturityValue,
      projectedReturns: projectedReturns,
      isProjectedBeyondHorizon: corpus.isProjectedBeyondHorizon || false,
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

  // Sum returns from all instruments (they're already calculated correctly per instrument)
  const totalReturns = Object.values(byInstrument).reduce((sum, instrument) => {
    return sum + (instrument.returns || 0)
  }, 0)

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

