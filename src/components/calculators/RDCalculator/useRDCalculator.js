import { useState, useEffect } from 'react'
import { 
  calculateRD, 
  calculateRDEvolution,
  calculateRealReturn
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { convertYearsMonthsToYears, convertYearsMonthsToMonths } from '@/utils/fdTenureUtils'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for RD Calculator calculations
 * Handles real-time calculations with inflation adjustments
 * 
 * @param {number} monthlyDeposit - Monthly deposit amount
 * @param {number} tenureYears - Number of years (0 or positive integer)
 * @param {number} tenureMonths - Number of months (0-11)
 * @param {number} rate - Annual interest rate (as percentage, e.g., 6.5 for 6.5%)
 * @param {string} compoundingFrequency - 'quarterly', 'monthly', 'annually', or 'cumulative'
 * @returns {Object} Calculation results
 */
const useRDCalculator = (
  monthlyDeposit,
  tenureYears,
  tenureMonths,
  rate,
  compoundingFrequency
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (
      monthlyDeposit == null || monthlyDeposit < 500 || 
      tenureYears == null || tenureMonths == null ||
      (tenureYears === 0 && tenureMonths === 0) ||
      rate == null || rate < 0.1
    ) {
      setResults(null)
      return
    }

    // Convert years + months to total years (decimal) and total months
    const years = convertYearsMonthsToYears(tenureYears, tenureMonths)
    const totalMonths = convertYearsMonthsToMonths(tenureYears, tenureMonths)
    
    // For display purposes
    const tenureYearsDisplay = years

    // Convert rates to decimals
    const annualRate = rate / 100

    // Calculate maturity amount with specified compounding frequency
    const maturityAmount = calculateRD(monthlyDeposit, annualRate, totalMonths, compoundingFrequency)

    // Calculate total investment (all monthly deposits)
    const totalInvestment = monthlyDeposit * totalMonths

    // Calculate interest earned
    const interestEarned = maturityAmount - totalInvestment

    // Calculate effective return percentage
    const effectiveReturn = totalInvestment > 0 
      ? ((maturityAmount - totalInvestment) / totalInvestment) * 100
      : 0

    // Calculate tax on withdrawal
    const taxCalculation = calculateTaxOnWithdrawal(
      maturityAmount,
      'rd',
      years,
      {
        incomeTaxSlab,
        principal: totalInvestment,
        returns: interestEarned,
      }
    )

    const postTaxAmount = taxCalculation.postTaxCorpus
    const taxAmount = taxCalculation.taxAmount

    // Adjust for inflation if enabled
    let realMaturityAmount = maturityAmount
    let realInterestEarned = interestEarned
    let realReturnRate = annualRate
    let actualSpendingPower = null
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal maturity amount for inflation over the tenure
      // Formula: Real Value = Nominal Value / (1 + inflation)^years
      realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, years)
      
      // Real interest = real maturity amount - total investment
      realInterestEarned = realMaturityAmount - totalInvestment

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, years)
    }

    // Calculate evolution table (only if tenure is >= 1 year, otherwise show monthly breakdown)
    let evolution = []
    if (years >= 1) {
      evolution = calculateRDEvolution(monthlyDeposit, annualRate, Math.ceil(years), compoundingFrequency)
    } else {
      // For tenure < 1 year, show monthly breakdown
      evolution = calculateRDMonthlyEvolution(monthlyDeposit, annualRate, totalMonths, compoundingFrequency)
    }

    setResults({
      monthlyDeposit: Math.round(monthlyDeposit * 100) / 100,
      totalInvestment: Math.round(totalInvestment * 100) / 100,
      maturityAmount: Math.round(maturityAmount * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100,
      effectiveReturn: Math.round(effectiveReturn * 100) / 100,
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realMaturityAmount: adjustInflation ? Math.round(realMaturityAmount * 100) / 100 : null,
      realInterestEarned: adjustInflation ? Math.round(realInterestEarned * 100) / 100 : null,
      // Tax calculation results
      taxAmount: Math.round(taxAmount * 100) / 100,
      postTaxAmount: Math.round(postTaxAmount * 100) / 100,
      taxRate: taxCalculation.taxRate,
      taxRule: taxCalculation.taxRule,
      actualSpendingPower: actualSpendingPower !== null ? Math.round(actualSpendingPower * 100) / 100 : null,
      evolution,
      tenureYears: tenureYearsDisplay, // Store for display purposes
      tenureYearsInput: tenureYears,
      tenureMonthsInput: tenureMonths,
      totalMonths,
    })
  }, [
    monthlyDeposit,
    tenureYears,
    tenureMonths,
    rate,
    compoundingFrequency,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

/**
 * Calculate monthly evolution for RD when tenure < 1 year
 * @param {number} monthlyDeposit - Monthly deposit amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} months - Number of months
 * @param {string} compoundingFrequency - Compounding frequency
 * @returns {Array} Array of objects with month-wise breakdown
 */
const calculateRDMonthlyEvolution = (monthlyDeposit, rate, months, compoundingFrequency) => {
  const evolution = []
  let cumulativeBalance = 0
  
  // Calculate effective monthly rate (same as in calculateRD)
  let effectiveMonthlyRate = 0
  if (compoundingFrequency === 'monthly') {
    effectiveMonthlyRate = rate / 12
  } else if (compoundingFrequency === 'quarterly') {
    const quarterlyRate = rate / 4
    effectiveMonthlyRate = Math.pow(1 + quarterlyRate, 1/3) - 1
  } else if (compoundingFrequency === 'annually') {
    effectiveMonthlyRate = Math.pow(1 + rate, 1/12) - 1
  } else if (compoundingFrequency === 'cumulative') {
    effectiveMonthlyRate = rate / 12
  }
  
  for (let month = 1; month <= months; month++) {
    const openingBalance = cumulativeBalance
    cumulativeBalance = cumulativeBalance * (1 + effectiveMonthlyRate) + monthlyDeposit
    const interest = cumulativeBalance - openingBalance - monthlyDeposit
    
    evolution.push({
      year: month,
      label: `Month ${month}`,
      openingBalance: Math.round(openingBalance * 100) / 100,
      investment: Math.round(monthlyDeposit * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(cumulativeBalance * 100) / 100,
    })
  }
  
  return evolution
}

export default useRDCalculator
