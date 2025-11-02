import { useState, useEffect } from 'react'
import { 
  calculateRealReturn,
  calculateCAGR
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * Calculate POMIS maturity amount
 * POMIS provides monthly interest payments
 * Formula: Monthly Interest = (Principal × Annual Rate) / 12
 * Total Interest = Monthly Interest × Number of Months
 * Maturity Amount = Principal + Total Interest
 * 
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.074 for 7.4%)
 * @param {number} years - Tenure in years (fixed at 5 years)
 * @returns {Object} { maturityAmount, totalInterest, monthlyInterest, annualInterest }
 */
const calculatePOMIS = (principal, rate, years) => {
  // Use explicit null/undefined checks instead of falsy checks to allow rate=0
  // Minimum rate is 0.1% = 0.001 as decimal (as per schema requirement)
  if (!principal || rate == null || rate < 0.001 || !years) {
    return { maturityAmount: 0, totalInterest: 0, monthlyInterest: 0, annualInterest: 0 }
  }
  
  // Monthly interest payment
  const monthlyInterest = principal * (rate / 12)
  
  // Number of months
  const numberOfMonths = years * 12
  
  // Total interest earned over the tenure
  const totalInterest = monthlyInterest * numberOfMonths
  
  // Annual interest for display
  const annualInterest = monthlyInterest * 12
  
  // Maturity amount = Principal + Total Interest
  const maturityAmount = principal + totalInterest
  
  return {
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyInterest: Math.round(monthlyInterest * 100) / 100,
    annualInterest: Math.round(annualInterest * 100) / 100
  }
}

/**
 * Calculate year-wise evolution for POMIS
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Tenure in years (fixed at 5 years)
 * @returns {Array} Array of objects with year-wise breakdown
 */
const calculatePOMISEvolution = (principal, rate, years) => {
  const evolution = []
  let cumulativeInterest = 0
  
  for (let year = 1; year <= years; year++) {
    // Opening balance is always principal (since interest is paid out monthly, not reinvested)
    const openingBalance = year === 1 ? 0 : principal
    
    // Monthly interest for this year (12 months)
    const monthlyInterest = principal * (rate / 12)
    const yearInterest = monthlyInterest * 12
    
    cumulativeInterest += yearInterest
    // Closing balance shows principal + cumulative interest earned (for display purposes)
    // Note: In reality, interest is paid out monthly, so actual account balance remains at principal
    const closingBalance = principal + cumulativeInterest
    
    evolution.push({
      year,
      openingBalance: Math.round((year === 1 ? 0 : openingBalance) * 100) / 100,
      investment: Math.round((year === 1 ? principal : 0) * 100) / 100,
      interest: Math.round(yearInterest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
  }
  
  return evolution
}

/**
 * Custom hook for POMIS Calculator calculations
 * Handles real-time calculations with inflation adjustments
 * 
 * @param {number} principal - Principal investment amount
 * @param {boolean} isJointAccount - Whether it's a joint account (affects max limit)
 * @param {number} rate - Annual interest rate (as percentage, e.g., 7.4 for 7.4%)
 * @param {boolean} adjustInflation - Whether to adjust for inflation
 * @returns {Object} Calculation results
 */
const usePOMISCalculator = (
  principal,
  isJointAccount,
  rate,
  adjustInflation
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    const maxPrincipal = isJointAccount ? 1500000 : 900000
    // Use explicit null/undefined checks instead of falsy checks to allow rate=0
    // Minimum rate is 0.1% (as per schema requirement)
    if (!principal || principal < 1000 || principal > maxPrincipal || rate == null || rate < 0.1) {
      setResults(null)
      return
    }

    // Fixed tenure is 5 years for POMIS
    const tenure = 5

    // Convert rate to decimal
    const annualRate = rate / 100

    // Calculate POMIS maturity
    const pomisResult = calculatePOMIS(principal, annualRate, tenure)
    const { maturityAmount, totalInterest, monthlyInterest, annualInterest } = pomisResult

    // Calculate effective return rate (CAGR)
    const effectiveReturn = principal > 0 
      ? calculateCAGR(principal, maturityAmount, tenure)
      : 0

    // Adjust for inflation if enabled
    let realMaturityAmount = maturityAmount
    let realTotalInterest = totalInterest
    let realReturnRate = annualRate
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal maturity amount for inflation over the actual period
      realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, tenure)
      
      // Real interest = real maturity amount - principal
      realTotalInterest = realMaturityAmount - principal
    }

    // Calculate evolution table
    const evolution = calculatePOMISEvolution(principal, annualRate, tenure)

    setResults({
      principal: Math.round(principal * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      maturityAmount: Math.round(maturityAmount * 100) / 100,
      monthlyInterest: Math.round(monthlyInterest * 100) / 100,
      annualInterest: Math.round(annualInterest * 100) / 100,
      effectiveReturn: effectiveReturn * 100, // Convert to percentage
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realMaturityAmount: adjustInflation ? Math.round(realMaturityAmount * 100) / 100 : null,
      realTotalInterest: adjustInflation ? Math.round(realTotalInterest * 100) / 100 : null,
      evolution,
    })
  }, [
    principal,
    isJointAccount,
    rate,
    adjustInflation,
    inflationRate
  ])

  return results
}

export default usePOMISCalculator

