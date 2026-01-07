import { useState, useEffect } from 'react'
import { 
  calculateSIPFutureValue, 
  calculateStepUpSIP,
  calculateCompoundInterest,
  calculateLumpsumEvolution,
  calculateSIPEvolution,
  calculateRealReturn,
  calculateCAGR
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for ETF Calculator calculations
 * Handles both SIP and Lumpsum investment modes with ETF type-specific tax and expense ratio considerations
 * 
 * @param {string} investmentType - 'sip' or 'lumpsum'
 * @param {number} amount - Monthly SIP amount (for SIP) or one-time investment (for Lumpsum)
 * @param {string} etfType - ETF type: 'equity', 'debt', 'gold', 'international'
 * @param {number} tenure - Investment tenure in years
 * @param {number} expectedCAGR - Expected CAGR (as percentage, e.g., 12 for 12%)
 * @param {number} expenseRatio - Expense ratio (as percentage, e.g., 0.20 for 0.20%)
 * @param {boolean} stepUpEnabled - Whether step-up SIP is enabled (only for SIP mode)
 * @param {number} stepUpPercentage - Annual step-up percentage (as percentage, e.g., 10 for 10%)
 * @returns {Object} Calculation results
 */
const useETFCalculator = (
  investmentType,
  amount,
  etfType,
  tenure,
  expectedCAGR,
  expenseRatio,
  stepUpEnabled,
  stepUpPercentage
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (!amount || amount < 500 || !tenure || !expectedCAGR) {
      setResults(null)
      return
    }

    // Convert rates to decimals
    const annualRate = expectedCAGR / 100
    const expenseRatioDecimal = expenseRatio / 100
    
    // Net return after expense ratio: Reduce CAGR by expense ratio
    // Example: 12% CAGR with 0.20% expense ratio = 11.80% net return
    const netAnnualRate = annualRate - expenseRatioDecimal
    
    const months = tenure * 12
    const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

    let futureValue = 0
    let totalInvested = 0
    let evolution = []

    if (investmentType === 'sip') {
      // SIP Calculation
      if (stepUpEnabled && stepUpRate > 0) {
        // Use step-up SIP calculation
        futureValue = calculateStepUpSIP(amount, stepUpRate, tenure, netAnnualRate)
        // Calculate total invested with step-up
        for (let year = 0; year < tenure; year++) {
          const currentYearSIP = amount * Math.pow(1 + stepUpRate, year)
          totalInvested += currentYearSIP * 12
        }
        evolution = calculateSIPEvolution(amount, netAnnualRate, tenure, true, stepUpRate)
      } else {
        // Use regular SIP calculation
        futureValue = calculateSIPFutureValue(amount, netAnnualRate, months)
        totalInvested = amount * months
        evolution = calculateSIPEvolution(amount, netAnnualRate, tenure, false, 0)
      }
    } else {
      // Lumpsum Calculation
      futureValue = calculateCompoundInterest(amount, netAnnualRate, tenure, 1) // Annual compounding
      totalInvested = amount
      evolution = calculateLumpsumEvolution(amount, netAnnualRate, tenure)
    }

    // Calculate returns earned
    const returnsEarned = futureValue - totalInvested

    // Calculate CAGR/XIRR
    const xirr = totalInvested > 0 
      ? calculateCAGR(totalInvested, futureValue, tenure)
      : 0

    // Determine instrument type for tax calculation based on ETF type
    // Equity and International ETFs use equity tax rules
    // Debt and Gold ETFs use debt mutual fund tax rules (with indexation)
    const instrumentTypeForTax = (etfType === 'equity' || etfType === 'international') 
      ? 'equity' 
      : 'debtMutualFund'

    // Calculate tax on withdrawal
    const taxCalculation = calculateTaxOnWithdrawal(
      futureValue,
      instrumentTypeForTax,
      tenure,
      {
        incomeTaxSlab,
        principal: totalInvested,
        returns: returnsEarned,
      }
    )

    const postTaxAmount = taxCalculation.postTaxCorpus
    const taxAmount = taxCalculation.taxAmount

    // Calculate total expense paid over tenure
    let totalExpensePaid = 0
    if (investmentType === 'sip') {
      // For SIP, expense is deducted annually from the corpus
      let runningCorpus = totalInvested
      for (let year = 1; year <= tenure; year++) {
        const yearEndCorpus = evolution.find(e => e.year === year)?.closingBalance || futureValue
        const averageCorpus = (runningCorpus + yearEndCorpus) / 2
        const yearExpense = averageCorpus * expenseRatioDecimal
        totalExpensePaid += yearExpense
        runningCorpus = yearEndCorpus
      }
    } else {
      // For lumpsum, expense is deducted annually
      let runningCorpus = amount
      for (let year = 1; year <= tenure; year++) {
        const yearEndCorpus = evolution.find(e => e.year === year)?.closingBalance || futureValue
        const averageCorpus = (runningCorpus + yearEndCorpus) / 2
        const yearExpense = averageCorpus * expenseRatioDecimal
        totalExpensePaid += yearExpense
        runningCorpus = yearEndCorpus
      }
    }

    // Adjust for inflation if enabled
    let realFutureValue = futureValue
    let realReturns = returnsEarned
    let realReturnRate = netAnnualRate
    let actualSpendingPower = null
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(netAnnualRate, inflationRate)
      
      // Adjust the nominal future value for inflation over the actual period
      realFutureValue = futureValue / Math.pow(1 + inflationRate, tenure)
      
      // Real returns = real future value - total invested
      realReturns = realFutureValue - totalInvested

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, tenure)
    }

    setResults({
      totalInvested: Math.round(totalInvested * 100) / 100,
      returnsEarned: Math.round(returnsEarned * 100) / 100,
      corpusValue: Math.round(futureValue * 100) / 100,
      xirr: xirr * 100, // Convert to percentage
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realCorpusValue: adjustInflation ? Math.round(realFutureValue * 100) / 100 : null,
      realReturns: adjustInflation ? Math.round(realReturns * 100) / 100 : null,
      totalExpensePaid: Math.round(totalExpensePaid * 100) / 100,
      expenseRatio: expenseRatio,
      etfType: etfType,
      // Tax calculation results
      taxAmount: Math.round(taxAmount * 100) / 100,
      postTaxAmount: Math.round(postTaxAmount * 100) / 100,
      taxRate: taxCalculation.taxRate,
      taxRule: taxCalculation.taxRule,
      actualSpendingPower: actualSpendingPower !== null ? Math.round(actualSpendingPower * 100) / 100 : null,
      evolution,
    })
  }, [
    investmentType,
    amount,
    etfType,
    tenure,
    expectedCAGR,
    expenseRatio,
    stepUpEnabled,
    stepUpPercentage,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useETFCalculator

