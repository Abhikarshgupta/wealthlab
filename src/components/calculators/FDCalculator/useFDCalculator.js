import { useState, useEffect } from 'react'
import { 
  calculateFD, 
  calculateFDEvolution,
  calculateRealReturn
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { convertYearsMonthsToYears, convertYearsMonthsToMonths } from '@/utils/fdTenureUtils'

/**
 * Custom hook for FD Calculator calculations
 * Handles real-time calculations with inflation adjustments
 * 
 * @param {number} principal - Principal investment amount
 * @param {number} tenureYears - Number of years (0 or positive integer)
 * @param {number} tenureMonths - Number of months (0-11)
 * @param {number} rate - Annual interest rate (as percentage, e.g., 6.5 for 6.5%)
 * @param {string} compoundingFrequency - 'quarterly', 'monthly', 'annually', or 'cumulative'
 * @param {boolean} adjustInflation - Whether to adjust for inflation
 * @returns {Object} Calculation results
 */
const useFDCalculator = (
  principal,
  tenureYears,
  tenureMonths,
  rate,
  compoundingFrequency,
  adjustInflation
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (
      principal == null || principal < 1000 || 
      tenureYears == null || tenureMonths == null ||
      (tenureYears === 0 && tenureMonths === 0) ||
      rate == null || rate < 0.1
    ) {
      setResults(null)
      return
    }

    // Convert years + months to total years (decimal)
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    
    // For display purposes
    const tenureYearsDisplay = years

    // Convert rates to decimals
    const annualRate = rate / 100

    // Calculate maturity amount with specified compounding frequency
    const maturityAmount = calculateFD(principal, annualRate, years, compoundingFrequency)

    // Calculate interest earned
    const interestEarned = maturityAmount - principal

    // Calculate effective return percentage
    const effectiveReturn = principal > 0 
      ? ((maturityAmount - principal) / principal) * 100
      : 0

    // Adjust for inflation if enabled
    let realMaturityAmount = maturityAmount
    let realInterestEarned = interestEarned
    let realReturnRate = annualRate
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal maturity amount for inflation over the tenure
      // Formula: Real Value = Nominal Value / (1 + inflation)^years
      realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, years)
      
      // Real interest = real maturity amount - principal
      realInterestEarned = realMaturityAmount - principal
    }

    // Calculate evolution table (only if tenure is >= 1 year, otherwise show monthly breakdown)
    let evolution = []
    if (years >= 1) {
      evolution = calculateFDEvolution(principal, annualRate, Math.ceil(years), compoundingFrequency)
    } else {
      // For tenure < 1 year, show monthly breakdown
      evolution = calculateFDMonthlyEvolution(principal, annualRate, totalMonths, compoundingFrequency)
    }

    setResults({
      principal: Math.round(principal * 100) / 100,
      maturityAmount: Math.round(maturityAmount * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100,
      effectiveReturn: Math.round(effectiveReturn * 100) / 100,
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realMaturityAmount: adjustInflation ? Math.round(realMaturityAmount * 100) / 100 : null,
      realInterestEarned: adjustInflation ? Math.round(realInterestEarned * 100) / 100 : null,
      evolution,
      tenureYears: tenureYearsDisplay, // Store for display purposes
      tenureYearsInput: tenureYears,
      tenureMonthsInput: tenureMonths,
    })
  }, [
    principal,
    tenureYears,
    tenureMonths,
    rate,
    compoundingFrequency,
    adjustInflation,
    inflationRate
  ])

  return results
}

/**
 * Calculate monthly evolution for FD when tenure < 1 year
 * @param {number} principal - Initial investment
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} months - Number of months
 * @param {string} compoundingFrequency - Compounding frequency
 * @returns {Array} Array of objects with month-wise breakdown
 */
const calculateFDMonthlyEvolution = (principal, rate, months, compoundingFrequency) => {
  const evolution = []
  
  for (let month = 1; month <= months; month++) {
    const monthYears = month / 12
    const openingBalance = month === 1 ? 0 : calculateFD(principal, rate, (month - 1) / 12, compoundingFrequency)
    const closingBalance = calculateFD(principal, rate, monthYears, compoundingFrequency)
    const interest = closingBalance - (month === 1 ? principal : openingBalance)
    
    evolution.push({
      year: month,
      label: `Month ${month}`,
      openingBalance: Math.round((month === 1 ? 0 : openingBalance) * 100) / 100,
      investment: Math.round((month === 1 ? principal : 0) * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
  }
  
  return evolution
}

export default useFDCalculator

