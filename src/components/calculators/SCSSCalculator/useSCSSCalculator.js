import { useState, useEffect } from 'react'
import { 
  calculateRealReturn,
  calculateCAGR
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Calculate SCSS maturity amount
 * SCSS provides quarterly interest payments
 * Formula: Quarterly Interest = Principal × (Rate / 4)
 * Total Interest = Quarterly Interest × Number of Quarters
 * Maturity Amount = Principal + Total Interest
 * 
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.082 for 8.2%)
 * @param {number} years - Tenure in years (1-5)
 * @returns {Object} { maturityAmount, totalInterest, quarterlyInterest }
 */
const calculateSCSS = (principal, rate, years) => {
  // Use explicit null/undefined checks instead of falsy checks to allow rate=0
  // Minimum rate is 0.1% = 0.001 as decimal (as per schema requirement)
  if (!principal || rate == null || rate < 0.001 || !years) {
    return { maturityAmount: 0, totalInterest: 0, quarterlyInterest: 0 }
  }
  
  // Quarterly interest payment
  const quarterlyInterest = principal * (rate / 4)
  
  // Number of quarters
  const numberOfQuarters = years * 4
  
  // Total interest earned over the tenure
  const totalInterest = quarterlyInterest * numberOfQuarters
  
  // Maturity amount = Principal + Total Interest
  const maturityAmount = principal + totalInterest
  
  return {
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    quarterlyInterest: Math.round(quarterlyInterest * 100) / 100
  }
}

/**
 * Calculate year-wise evolution for SCSS
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Tenure in years (1-5)
 * @returns {Array} Array of objects with year-wise breakdown
 */
const calculateSCSSEvolution = (principal, rate, years) => {
  const evolution = []
  let cumulativeInterest = 0
  
  for (let year = 1; year <= years; year++) {
    // Opening balance is always principal (since interest is paid out quarterly, not reinvested)
    const openingBalance = year === 1 ? 0 : principal
    
    // Quarterly interest for this year (4 quarters)
    const quarterlyInterest = principal * (rate / 4)
    const yearInterest = quarterlyInterest * 4
    
    cumulativeInterest += yearInterest
    // Closing balance shows principal + cumulative interest earned (for display purposes)
    // Note: In reality, interest is paid out quarterly, so actual account balance remains at principal
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
 * Custom hook for SCSS Calculator calculations
 * Handles real-time calculations with inflation adjustments
 * 
 * @param {number} principal - Principal investment amount
 * @param {number} tenure - Investment tenure in years (1-5)
 * @param {number} seniorsAge - Senior citizen's age (must be >= 60, or >= 55 for defense personnel)
 * @param {number} rate - Annual interest rate (as percentage, e.g., 8.2 for 8.2%)
 * @param {boolean} isDefensePersonnel - Whether user is retired defense personnel (eligible at 55+)
 * @returns {Object} Calculation results
 */
const useSCSSCalculator = (
  principal,
  tenure,
  seniorsAge,
  rate,
  isDefensePersonnel = false
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs - minimum age is 55 for defense personnel, 60 otherwise
    const minAge = isDefensePersonnel ? 55 : 60
    // Use explicit null/undefined checks instead of falsy checks to allow rate=0
    // Minimum rate is 0.1% (as per schema requirement)
    if (!principal || principal < 1000 || !tenure || rate == null || rate < 0.1 || !seniorsAge || seniorsAge < minAge) {
      setResults(null)
      return
    }

    // Convert rate to decimal
    const annualRate = rate / 100

    // Calculate SCSS maturity
    const scssResult = calculateSCSS(principal, annualRate, tenure)
    const { maturityAmount, totalInterest, quarterlyInterest } = scssResult

    // Calculate effective return rate (CAGR)
    const effectiveReturn = principal > 0 
      ? calculateCAGR(principal, maturityAmount, tenure)
      : 0

    // Calculate tax on withdrawal
    const taxCalculation = calculateTaxOnWithdrawal(
      maturityAmount,
      'scss',
      tenure,
      {
        incomeTaxSlab,
        principal,
        returns: totalInterest,
      }
    )

    const postTaxAmount = taxCalculation.postTaxCorpus
    const taxAmount = taxCalculation.taxAmount

    // Adjust for inflation if enabled
    let realMaturityAmount = maturityAmount
    let realTotalInterest = totalInterest
    let realReturnRate = annualRate
    let actualSpendingPower = null
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal maturity amount for inflation over the actual period
      realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, tenure)
      
      // Real interest = real maturity amount - principal
      realTotalInterest = realMaturityAmount - principal

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, tenure)
    }

    // Calculate evolution table
    const evolution = calculateSCSSEvolution(principal, annualRate, tenure)

    setResults({
      principal: Math.round(principal * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      maturityAmount: Math.round(maturityAmount * 100) / 100,
      quarterlyInterest: Math.round(quarterlyInterest * 100) / 100,
      effectiveReturn: effectiveReturn * 100, // Convert to percentage
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realMaturityAmount: adjustInflation ? Math.round(realMaturityAmount * 100) / 100 : null,
      realTotalInterest: adjustInflation ? Math.round(realTotalInterest * 100) / 100 : null,
      // Tax calculation results
      taxAmount: Math.round(taxAmount * 100) / 100,
      postTaxAmount: Math.round(postTaxAmount * 100) / 100,
      taxRate: taxCalculation.taxRate,
      taxRule: taxCalculation.taxRule,
      tdsInfo: taxCalculation.tdsInfo,
      actualSpendingPower: actualSpendingPower !== null ? Math.round(actualSpendingPower * 100) / 100 : null,
      evolution,
    })
  }, [
    principal,
    tenure,
    seniorsAge,
    rate,
    adjustInflation,
    isDefensePersonnel,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useSCSSCalculator

