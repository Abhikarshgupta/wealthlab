import { useState, useEffect } from 'react'
import { 
  calculateNSC,
  calculateNSCEvolution,
  calculateRealReturn
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for NSC Calculator calculations
 * Handles real-time calculations with inflation adjustments
 * 
 * @param {number} principal - Principal investment amount
 * @param {number} rate - Annual interest rate (as percentage, e.g., 7.7 for 7.7%)
 * @returns {Object} Calculation results
 */
const useNSCalculator = (
  principal,
  rate
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal
  const tenure = 5 // Fixed tenure for NSC

  useEffect(() => {
    // Validate inputs
    // Use explicit null/undefined checks instead of falsy checks to allow rate=0
    // Minimum rate is 0.1% (as per schema requirement)
    if (!principal || principal < 1000 || rate == null || rate < 0.1) {
      setResults(null)
      return
    }

    // Convert rate to decimal
    const annualRate = rate / 100

    // Calculate maturity amount using compound interest formula
    // Formula: A = P × (1 + r)^n
    const maturityAmount = calculateNSC(principal, annualRate, tenure)

    // Calculate interest earned
    const interestEarned = maturityAmount - principal

    // Calculate effective return percentage
    const effectiveReturn = principal > 0 
      ? ((maturityAmount - principal) / principal) * 100
      : 0

    // Calculate tax on withdrawal
    const taxCalculation = calculateTaxOnWithdrawal(
      maturityAmount,
      'nsc',
      tenure,
      {
        incomeTaxSlab,
        principal,
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
      realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, tenure)
      
      // Real interest = real maturity amount - principal
      realInterestEarned = realMaturityAmount - principal

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, tenure)
    }

    // Calculate evolution table
    const evolution = calculateNSCEvolution(principal, annualRate, tenure)

    setResults({
      principal: Math.round(principal * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100,
      maturityAmount: Math.round(maturityAmount * 100) / 100,
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
    })
  }, [
    principal,
    rate,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useNSCalculator

