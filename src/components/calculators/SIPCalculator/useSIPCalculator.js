import { useState, useEffect } from 'react'
import { 
  calculateSIPFutureValue, 
  calculateStepUpSIP, 
  calculateSIPEvolution,
  calculateRealReturn,
  calculateCAGR
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for SIP Calculator calculations
 * Handles real-time calculations with step-up and inflation adjustments
 * 
 * @param {number} monthlySIP - Monthly SIP amount
 * @param {number} tenure - Investment tenure
 * @param {string} tenureUnit - 'years' or 'months'
 * @param {number} expectedReturn - Expected annual return rate (as percentage, e.g., 12 for 12%)
 * @param {boolean} stepUpEnabled - Whether step-up SIP is enabled
 * @param {number} stepUpPercentage - Annual step-up percentage (as percentage, e.g., 10 for 10%)
 * @returns {Object} Calculation results
 */
const useSIPCalculator = (
  monthlySIP,
  tenure,
  tenureUnit,
  expectedReturn,
  stepUpEnabled,
  stepUpPercentage
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    // Use explicit null/undefined checks instead of falsy checks to allow expectedReturn=0
    // Minimum expectedReturn is 0.1% (as per schema requirement)
    if (!monthlySIP || monthlySIP < 500 || !tenure || expectedReturn == null || expectedReturn < 0.1) {
      setResults(null)
      return
    }

    // Convert tenure to years
    const years = tenureUnit === 'months' ? tenure / 12 : tenure
    const months = tenureUnit === 'months' ? tenure : years * 12
    
    // Convert rates to decimals
    const annualRate = expectedReturn / 100
    const stepUpRate = stepUpPercentage ? stepUpPercentage / 100 : 0

    // Calculate future value
    let futureValue = 0
    if (stepUpEnabled && stepUpRate > 0) {
      // Use step-up SIP calculation
      futureValue = calculateStepUpSIP(monthlySIP, stepUpRate, years, annualRate)
    } else {
      // Use regular SIP calculation
      futureValue = calculateSIPFutureValue(monthlySIP, annualRate, months)
    }

    // Calculate total invested
    let totalInvested = 0
    if (stepUpEnabled && stepUpRate > 0) {
      // Calculate total invested with step-up
      for (let year = 0; year < years; year++) {
        const currentYearSIP = monthlySIP * Math.pow(1 + stepUpRate, year)
        totalInvested += currentYearSIP * 12
      }
    } else {
      totalInvested = monthlySIP * months
    }

    // Calculate returns earned
    const returnsEarned = futureValue - totalInvested

    // Calculate XIRR (simplified - using CAGR approximation)
    const xirr = totalInvested > 0 
      ? calculateCAGR(totalInvested, futureValue, years)
      : 0

    // Calculate tax on withdrawal
    const taxCalculation = calculateTaxOnWithdrawal(
      futureValue,
      'sip',
      years,
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
      // Formula: Real Value = Nominal Value / (1 + inflation)^years
      // This properly accounts for the actual time period
      realFutureValue = futureValue / Math.pow(1 + inflationRate, years)
      
      // Real returns = real future value - total invested
      realReturns = realFutureValue - totalInvested

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, years)
    }

    // Calculate evolution table
    const evolution = calculateSIPEvolution(
      monthlySIP,
      annualRate,
      years,
      stepUpEnabled,
      stepUpRate
    )

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
      taxRule: taxCalculation.taxRule,
      actualSpendingPower: actualSpendingPower !== null ? Math.round(actualSpendingPower * 100) / 100 : null,
      evolution,
    })
  }, [
    monthlySIP,
    tenure,
    tenureUnit,
    expectedReturn,
    stepUpEnabled,
    stepUpPercentage,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useSIPCalculator

