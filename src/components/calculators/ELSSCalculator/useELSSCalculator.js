import { useState, useEffect } from 'react'
import { 
  calculateSIPFutureValue, 
  calculateCompoundInterest,
  calculateSIPEvolution,
  calculateLumpsumEvolution,
  calculateRealReturn,
  calculateCAGR
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for ELSS Calculator calculations
 * Handles both SIP and Lumpsum investment modes with inflation adjustments
 * 
 * @param {string} investmentType - 'sip' or 'lumpsum'
 * @param {number} amount - Investment amount (monthly SIP or lumpsum)
 * @param {number} tenure - Investment tenure in years (minimum 3 years)
 * @param {number} expectedReturn - Expected annual return rate (as percentage, e.g., 14 for 14%)
 * @returns {Object} Calculation results
 */
const useELSSCalculator = (
  investmentType,
  amount,
  tenure,
  expectedReturn
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (!investmentType || !amount || amount < 500 || !tenure || tenure < 3 || !expectedReturn || expectedReturn < 0.1) {
      setResults(null)
      return
    }

    // Convert rates to decimals
    const annualRate = expectedReturn / 100

    let futureValue = 0
    let totalInvested = 0
    let evolution = []

    if (investmentType === 'sip') {
      // SIP mode: Monthly investments
      const months = tenure * 12
      futureValue = calculateSIPFutureValue(amount, annualRate, months)
      totalInvested = amount * months
      
      // Calculate evolution for SIP
      evolution = calculateSIPEvolution(
        amount,
        annualRate,
        tenure,
        false, // No step-up for ELSS
        0
      )
    } else {
      // Lumpsum mode: One-time investment
      futureValue = calculateCompoundInterest(amount, annualRate, tenure, 1) // Annual compounding
      totalInvested = amount
      
      // Calculate evolution for lumpsum
      evolution = calculateLumpsumEvolution(amount, annualRate, tenure)
    }

    // Calculate returns earned
    const returnsEarned = futureValue - totalInvested

    // Calculate return rate (XIRR for SIP, CAGR for Lumpsum)
    const returnRate = totalInvested > 0 
      ? calculateCAGR(totalInvested, futureValue, tenure)
      : 0

    // Calculate tax on withdrawal (ELSS has 3-year lock-in)
    const taxCalculation = calculateTaxOnWithdrawal(
      futureValue,
      'elss',
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
      returnRate: returnRate * 100, // Convert to percentage
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
    })
  }, [
    investmentType,
    amount,
    tenure,
    expectedReturn,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useELSSCalculator

