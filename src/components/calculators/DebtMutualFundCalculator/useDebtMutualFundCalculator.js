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
 * Custom hook for Debt Mutual Fund Calculator calculations
 * Handles both SIP and Lumpsum investment modes with inflation adjustments and step-up SIP
 * 
 * @param {string} investmentType - 'sip' or 'lumpsum'
 * @param {number} amount - Monthly SIP amount (for SIP) or one-time investment (for Lumpsum)
 * @param {number} tenure - Investment tenure in years
 * @param {string} fundType - Type of debt fund
 * @param {number} expectedReturn - Expected annual return rate (as percentage, e.g., 7.5 for 7.5%)
 * @param {boolean} stepUpEnabled - Whether step-up SIP is enabled (only for SIP mode)
 * @param {number} stepUpPercentage - Annual step-up percentage (as percentage, e.g., 10 for 10%)
 * @returns {Object} Calculation results
 */
const useDebtMutualFundCalculator = (
  investmentType,
  amount,
  tenure,
  fundType,
  expectedReturn,
  stepUpEnabled,
  stepUpPercentage
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (!amount || amount < 500 || !tenure || !expectedReturn) {
      setResults(null)
      return
    }

    // Convert rates to decimals
    const annualRate = expectedReturn / 100
    const months = tenure * 12
    const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

    let futureValue = 0
    let totalInvested = 0
    let evolution = []

    if (investmentType === 'sip') {
      // SIP Calculation
      if (stepUpEnabled && stepUpRate > 0) {
        // Use step-up SIP calculation
        futureValue = calculateStepUpSIP(amount, stepUpRate, tenure, annualRate)
        // Calculate total invested with step-up
        for (let year = 0; year < tenure; year++) {
          const currentYearSIP = amount * Math.pow(1 + stepUpRate, year)
          totalInvested += currentYearSIP * 12
        }
        evolution = calculateSIPEvolution(amount, annualRate, tenure, true, stepUpRate)
      } else {
        // Use regular SIP calculation
        futureValue = calculateSIPFutureValue(amount, annualRate, months)
        totalInvested = amount * months
        evolution = calculateSIPEvolution(amount, annualRate, tenure, false, 0)
      }
    } else {
      // Lumpsum Calculation
      futureValue = calculateCompoundInterest(amount, annualRate, tenure, 1) // Annual compounding
      totalInvested = amount
      evolution = calculateLumpsumEvolution(amount, annualRate, tenure)
    }

    // Calculate returns earned
    const returnsEarned = futureValue - totalInvested

    // Calculate CAGR/XIRR
    const xirr = totalInvested > 0 
      ? calculateCAGR(totalInvested, futureValue, tenure)
      : 0

    // Calculate tax on withdrawal (Debt MF uses indexation if held > 3 years)
    const taxCalculation = calculateTaxOnWithdrawal(
      futureValue,
      'debtMutualFund',
      tenure,
      {
        incomeTaxSlab,
        principal: totalInvested,
        returns: returnsEarned,
      }
    )

    const postTaxAmount = taxCalculation.postTaxCorpus
    const taxAmount = taxCalculation.taxAmount

    // Adjust for inflation if enabled
    let realFutureValue = futureValue
    let realReturns = returnsEarned
    let realReturnRate = annualRate
    let actualSpendingPower = null
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
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
      // Tax calculation results
      taxAmount: Math.round(taxAmount * 100) / 100,
      postTaxAmount: Math.round(postTaxAmount * 100) / 100,
      taxRate: taxCalculation.taxRate,
      actualTaxRate: taxCalculation.actualTaxRate,
      taxRateLabel: taxCalculation.taxRateLabel,
      taxRule: taxCalculation.taxRule,
      actualSpendingPower: actualSpendingPower !== null ? Math.round(actualSpendingPower * 100) / 100 : null,
      evolution,
      fundType,
      tenure, // Store tenure for indexation calculation
    })
  }, [
    investmentType,
    amount,
    tenure,
    fundType,
    expectedReturn,
    stepUpEnabled,
    stepUpPercentage,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useDebtMutualFundCalculator

