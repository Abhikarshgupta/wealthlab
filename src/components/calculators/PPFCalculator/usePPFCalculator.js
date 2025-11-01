import { useState, useEffect } from 'react'
import { 
  calculatePPF, 
  calculatePPFWithStepUp,
  calculatePPFEvolution,
  calculateRealReturn
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * Custom hook for PPF Calculator calculations
 * Handles real-time calculations with step-up and inflation adjustments
 * 
 * @param {number} yearlyInvestment - Yearly investment amount
 * @param {number} tenure - Investment tenure in years
 * @param {number} rate - Annual interest rate (as percentage, e.g., 7.1 for 7.1%)
 * @param {boolean} stepUpEnabled - Whether step-up is enabled
 * @param {number} stepUpPercentage - Annual step-up percentage (as percentage, e.g., 10 for 10%)
 * @param {boolean} adjustInflation - Whether to adjust for inflation
 * @returns {Object} Calculation results
 */
const usePPFCalculator = (
  yearlyInvestment,
  tenure,
  rate,
  stepUpEnabled,
  stepUpPercentage,
  adjustInflation
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    // Use explicit null/undefined checks instead of falsy checks to allow rate=0
    // Minimum rate is 0.1% (as per schema requirement)
    if (!yearlyInvestment || yearlyInvestment < 500 || !tenure || rate == null || rate < 0.1) {
      setResults(null)
      return
    }

    // Convert rates to decimals
    const annualRate = rate / 100
    const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

    // Calculate maturity value
    let maturityValue = 0
    if (stepUpEnabled && stepUpRate > 0) {
      maturityValue = calculatePPFWithStepUp(yearlyInvestment, stepUpRate, annualRate, tenure)
    } else {
      maturityValue = calculatePPF(yearlyInvestment, annualRate, tenure)
    }

    // Calculate total invested
    let totalInvested = 0
    if (stepUpEnabled && stepUpRate > 0) {
      // Calculate total invested with step-up
      for (let year = 0; year < tenure; year++) {
        const currentYearInvestment = yearlyInvestment * Math.pow(1 + stepUpRate, year)
        totalInvested += currentYearInvestment
      }
    } else {
      totalInvested = yearlyInvestment * tenure
    }

    // Calculate total interest earned
    const totalInterest = maturityValue - totalInvested

    // Calculate cumulative return percentage
    const returnPercentage = totalInvested > 0 
      ? (totalInterest / totalInvested) * 100
      : 0

    // Adjust for inflation if enabled
    let realMaturityValue = maturityValue
    let realTotalInterest = totalInterest
    let realReturnRate = annualRate
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal maturity value for inflation over the tenure
      // Formula: Real Value = Nominal Value / (1 + inflation)^years
      realMaturityValue = maturityValue / Math.pow(1 + inflationRate, tenure)
      
      // Real interest = real maturity value - total invested
      realTotalInterest = realMaturityValue - totalInvested
    }

    // Calculate evolution table
    const evolution = calculatePPFEvolution(
      yearlyInvestment,
      annualRate,
      tenure,
      stepUpEnabled,
      stepUpRate
    )

    setResults({
      totalInvested: Math.round(totalInvested * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      maturityValue: Math.round(maturityValue * 100) / 100,
      returnPercentage: Math.round(returnPercentage * 100) / 100,
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realMaturityValue: adjustInflation ? Math.round(realMaturityValue * 100) / 100 : null,
      realTotalInterest: adjustInflation ? Math.round(realTotalInterest * 100) / 100 : null,
      evolution,
    })
  }, [
    yearlyInvestment,
    tenure,
    rate,
    stepUpEnabled,
    stepUpPercentage,
    adjustInflation,
    inflationRate
  ])

  return results
}

export default usePPFCalculator

