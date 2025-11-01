import { useState, useEffect } from 'react'
import { 
  calculatePPF, 
  calculateRealReturn
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * Custom hook for SSY Calculator calculations
 * Handles real-time calculations with step-up and inflation adjustments
 * Account matures when girl child turns 21 years
 * Step-up investments are capped at ₹1.5L per year
 * 
 * @param {number} yearlyInvestment - Yearly investment amount
 * @param {number} girlsAge - Girl child's current age (must be < 10)
 * @param {number} startYear - Start year of investment
 * @param {number} rate - Annual interest rate (as percentage, e.g., 8.2 for 8.2%)
 * @param {boolean} stepUpEnabled - Whether step-up is enabled
 * @param {number} stepUpPercentage - Annual step-up percentage (as percentage, e.g., 10 for 10%)
 * @param {boolean} adjustInflation - Whether to adjust for inflation
 * @returns {Object} Calculation results
 */
const useSSYCalculator = (
  yearlyInvestment,
  girlsAge,
  startYear,
  rate,
  stepUpEnabled,
  stepUpPercentage,
  adjustInflation
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal
  const MAX_YEARLY_INVESTMENT = 150000 // ₹1.5L cap per year

  useEffect(() => {
    // Validate inputs - allow age 0 (newborn)
    // Use explicit null/undefined checks instead of falsy checks to allow rate=0
    // Minimum rate is 0.1% (as per schema requirement)
    if (!yearlyInvestment || yearlyInvestment < 250 || girlsAge < 0 || girlsAge >= 10 || !startYear || rate == null || rate < 0.1) {
      setResults(null)
      return
    }

    // Calculate years till maturity: account matures when girl turns 21
    const yearsTillMaturity = 21 - girlsAge

    if (yearsTillMaturity <= 0 || yearsTillMaturity > 21) {
      setResults(null)
      return
    }

    // Convert rates to decimals
    const annualRate = rate / 100
    const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

    // Calculate maturity value with or without step-up
    let maturityValue = 0
    if (stepUpEnabled && stepUpRate > 0) {
      // Calculate step-up with cap at ₹1.5L per year
      let balance = 0
      for (let year = 0; year < yearsTillMaturity; year++) {
        // Calculate investment for this year (step-up applies at year start)
        let currentYearInvestment = yearlyInvestment * Math.pow(1 + stepUpRate, year)
        // Cap at ₹1.5L per year
        currentYearInvestment = Math.min(currentYearInvestment, MAX_YEARLY_INVESTMENT)
        // Add investment at start of year, then apply interest
        balance = (balance + currentYearInvestment) * (1 + annualRate)
      }
      maturityValue = balance
    } else {
      maturityValue = calculatePPF(yearlyInvestment, annualRate, yearsTillMaturity)
    }

    // Calculate total invested
    let totalInvested = 0
    if (stepUpEnabled && stepUpRate > 0) {
      // Calculate total invested with step-up (capped at ₹1.5L per year)
      for (let year = 0; year < yearsTillMaturity; year++) {
        const currentYearInvestment = Math.min(
          yearlyInvestment * Math.pow(1 + stepUpRate, year),
          MAX_YEARLY_INVESTMENT
        )
        totalInvested += currentYearInvestment
      }
    } else {
      totalInvested = yearlyInvestment * yearsTillMaturity
    }

    // Calculate total interest earned
    const totalInterest = maturityValue - totalInvested

    // Calculate cumulative return percentage
    const returnPercentage = totalInvested > 0 
      ? (totalInterest / totalInvested) * 100
      : 0

    // Calculate maturity year
    const maturityYear = startYear + yearsTillMaturity

    // Adjust for inflation if enabled
    let realMaturityValue = maturityValue
    let realTotalInterest = totalInterest
    let realReturnRate = annualRate
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal maturity value for inflation over the tenure
      // Formula: Real Value = Nominal Value / (1 + inflation)^years
      realMaturityValue = maturityValue / Math.pow(1 + inflationRate, yearsTillMaturity)
      
      // Real interest = real maturity value - total invested
      realTotalInterest = realMaturityValue - totalInvested
    }

    // Calculate evolution table with step-up support
    const evolution = []
    let openingBalance = 0
    
    for (let year = 1; year <= yearsTillMaturity; year++) {
      // Calculate investment for this year (step-up applies at year start)
      let investment = yearlyInvestment
      if (stepUpEnabled && stepUpRate > 0) {
        investment = Math.min(
          yearlyInvestment * Math.pow(1 + stepUpRate, year - 1),
          MAX_YEARLY_INVESTMENT
        )
      }
      
      // Interest is calculated on opening balance + investment
      const interest = (openingBalance + investment) * annualRate
      const closingBalance = openingBalance + investment + interest
      
      evolution.push({
        year,
        openingBalance: Math.round(openingBalance * 100) / 100,
        investment: Math.round(investment * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        closingBalance: Math.round(closingBalance * 100) / 100,
      })
      
      openingBalance = closingBalance
    }

    setResults({
      totalInvested: Math.round(totalInvested * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      maturityValue: Math.round(maturityValue * 100) / 100,
      maturityYear,
      yearsTillMaturity,
      returnPercentage: Math.round(returnPercentage * 100) / 100,
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realMaturityValue: adjustInflation ? Math.round(realMaturityValue * 100) / 100 : null,
      realTotalInterest: adjustInflation ? Math.round(realTotalInterest * 100) / 100 : null,
      evolution,
    })
  }, [
    yearlyInvestment,
    girlsAge,
    startYear,
    rate,
    stepUpEnabled,
    stepUpPercentage,
    adjustInflation,
    inflationRate
  ])

  return results
}

export default useSSYCalculator

