import { useState, useEffect } from 'react'
import { 
  calculateCompoundInterest,
  calculateRealReturn
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for 54EC Bonds Calculator calculations
 * Handles real-time calculations with inflation adjustments and tax savings
 * 
 * @param {number} capitalGainAmount - Capital gain amount from property sale
 * @param {number} investmentAmount - Investment amount in 54EC Bonds (max: capitalGainAmount, max ₹50L per FY)
 * @param {number} rate - Annual interest rate (as percentage, e.g., 5.75 for 5.75%)
 * @returns {Object} Calculation results
 */
const use54ECBondsCalculator = (
  capitalGainAmount,
  investmentAmount,
  rate
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal
  const tenure = 5 // Fixed tenure for 54EC Bonds

  useEffect(() => {
    // Validate inputs
    if (!investmentAmount || investmentAmount < 1000 || rate == null || rate < 0.1) {
      setResults(null)
      return
    }

    // Validate investment amount doesn't exceed capital gain amount
    if (capitalGainAmount && investmentAmount > capitalGainAmount) {
      setResults(null)
      return
    }

    // Convert rate to decimal
    const annualRate = rate / 100

    // Calculate maturity amount using compound interest formula
    // Formula: A = P × (1 + r)^n
    const maturityAmount = calculateCompoundInterest(investmentAmount, annualRate, tenure, 1)

    // Calculate interest earned
    const interestEarned = maturityAmount - investmentAmount

    // Calculate effective return percentage
    const effectiveReturn = investmentAmount > 0 
      ? ((maturityAmount - investmentAmount) / investmentAmount) * 100
      : 0

    // Calculate tax savings (capital gains exemption)
    // 54EC Bonds exempt long-term capital gains tax up to ₹50L per financial year
    // Assume 20% capital gains tax rate (LTCG on property sale)
    const capitalGainsTaxRate = 0.20 // 20% LTCG tax on property sale
    const exemptedCapitalGain = Math.min(investmentAmount, capitalGainAmount || investmentAmount, 5000000) // Max ₹50L exemption
    const taxSaved = exemptedCapitalGain * capitalGainsTaxRate

    // Calculate tax on interest income (interest is taxable as per income tax slab)
    // Assume 30% income tax slab for calculation
    const incomeTaxSlab = 0.30
    const taxOnInterest = interestEarned * incomeTaxSlab

    // Net tax benefit = Tax saved on capital gains - Tax paid on interest
    const netTaxBenefit = taxSaved - taxOnInterest

    // Adjust for inflation if enabled
    let realMaturityAmount = maturityAmount
    let realInterestEarned = interestEarned
    let realReturnRate = annualRate
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal maturity amount for inflation over the tenure
      // Formula: Real Value = Nominal Value / (1 + inflation)^years
      realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, tenure)
      
      // Real interest = real maturity amount - principal
      realInterestEarned = realMaturityAmount - investmentAmount
    }

    // Calculate evolution table
    const evolution = []
    let openingBalance = 0
    
    for (let year = 1; year <= tenure; year++) {
      const previousBalance = year === 1 ? 0 : calculateCompoundInterest(investmentAmount, annualRate, year - 1, 1)
      const closingBalance = calculateCompoundInterest(investmentAmount, annualRate, year, 1)
      const interest = closingBalance - (year === 1 ? investmentAmount : previousBalance)
      
      evolution.push({
        year,
        openingBalance: Math.round((year === 1 ? 0 : previousBalance) * 100) / 100,
        investment: Math.round((year === 1 ? investmentAmount : 0) * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        closingBalance: Math.round(closingBalance * 100) / 100,
      })
    }

    setResults({
      capitalGainAmount: Math.round((capitalGainAmount || 0) * 100) / 100,
      investmentAmount: Math.round(investmentAmount * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100,
      maturityAmount: Math.round(maturityAmount * 100) / 100,
      effectiveReturn: Math.round(effectiveReturn * 100) / 100,
      taxSaved: Math.round(taxSaved * 100) / 100,
      taxOnInterest: Math.round(taxOnInterest * 100) / 100,
      netTaxBenefit: Math.round(netTaxBenefit * 100) / 100,
      exemptedCapitalGain: Math.round(exemptedCapitalGain * 100) / 100,
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realMaturityAmount: adjustInflation ? Math.round(realMaturityAmount * 100) / 100 : null,
      realInterestEarned: adjustInflation ? Math.round(realInterestEarned * 100) / 100 : null,
      evolution,
    })
  }, [
    capitalGainAmount,
    investmentAmount,
    rate,
    adjustInflation,
    inflationRate
  ])

  return results
}

export default use54ECBondsCalculator

