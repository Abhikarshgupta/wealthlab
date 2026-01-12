import { useState, useEffect } from 'react'
import { 
  calculateSGB, 
  calculateSGBEvolution,
  calculateRealReturn,
  calculateCAGR
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { getGoldPricePerGram, getCachedGoldPrice, FALLBACK_GOLD_PRICE_PER_GRAM } from '@/utils/goldPriceService'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for SGB Calculator calculations
 * Handles real-time calculations with inflation adjustments
 * Fetches real-time gold price from API with fallback to constant value
 * 
 * @param {number} goldAmount - Gold amount in grams (1-1000)
 * @param {number} tenure - Tenure in years (5 or 8)
 * @param {number} goldAppreciationRate - Annual gold appreciation rate (as percentage, e.g., 8 for 8%)
 * @returns {Object} Calculation results
 */
const useSGBCalculator = (
  goldAmount,
  tenure,
  goldAppreciationRate
) => {
  const [results, setResults] = useState(null)
  const [goldPricePerGram, setGoldPricePerGram] = useState(getCachedGoldPrice())
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)
  const [isRealTimePrice, setIsRealTimePrice] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  // Initialize and fetch gold price on mount or when refresh is triggered
  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoadingPrice(true)
      try {
        // Force refresh if trigger is set
        const result = await getGoldPricePerGram(refreshTrigger > 0)
        setGoldPricePerGram(result.price)
        setIsRealTimePrice(result.isRealTime)
      } catch (error) {
        console.warn('Failed to fetch gold price:', error)
        setGoldPricePerGram(FALLBACK_GOLD_PRICE_PER_GRAM)
        setIsRealTimePrice(false)
      } finally {
        setIsLoadingPrice(false)
      }
    }

    fetchPrice()
  }, [refreshTrigger])

  // Expose refresh function via results (for external refresh trigger)
  // This will be called from the component

  // Calculate results when inputs or gold price change
  useEffect(() => {
    // Validate inputs
    // Use explicit null/undefined checks instead of falsy checks to allow goldAppreciationRate=0
    // Minimum goldAppreciationRate is 0.1% (as per schema requirement)
    if (!goldAmount || goldAmount < 1 || !tenure || goldAppreciationRate == null || goldAppreciationRate < 0.1 || !goldPricePerGram) {
      setResults(null)
      return
    }

    // Convert gold amount (grams) to principal (rupees)
    // Principal = Gold Amount × Gold Price per gram
    const principal = goldAmount * goldPricePerGram

    // Convert rates to decimals
    const goldRate = goldAppreciationRate / 100
    const fixedRate = 0.025 // 2.5% p.a. fixed rate

    // Calculate maturity amount
    const maturityAmount = calculateSGB(principal, goldRate, tenure, fixedRate)

    // Calculate components
    // Gold appreciation component
    const goldAppreciatedValue = principal * Math.pow(1 + goldRate, tenure)
    
    // Fixed interest component (compounded semi-annually)
    const fixedInterestAmount = principal * (Math.pow(1 + fixedRate / 2, tenure * 2) - 1)
    
    // Total returns earned
    const totalReturns = maturityAmount - principal

    // Calculate effective return percentage
    const effectiveReturn = principal > 0 
      ? ((maturityAmount - principal) / principal) * 100
      : 0

    // Calculate CAGR
    const cagr = principal > 0 
      ? calculateCAGR(principal, maturityAmount, tenure)
      : 0

    // Calculate tax on withdrawal (SGB: Capital gains exempt if held till maturity, interest taxable)
    // For SGB, if held till maturity (5/8 years), capital gains are exempt
    // Only the 2.5% interest portion is taxable annually (already taxed)
    // For withdrawal calculation, we calculate tax assuming held till maturity
    const taxCalculation = calculateTaxOnWithdrawal(
      maturityAmount,
      'sgb',
      tenure,
      {
        incomeTaxSlab,
        principal: principal,
        returns: totalReturns,
      }
    )

    const postTaxAmount = taxCalculation.postTaxCorpus
    const taxAmount = taxCalculation.taxAmount

    // Adjust for inflation if enabled
    let realMaturityAmount = maturityAmount
    let realTotalReturns = totalReturns
    let realReturnRate = 0
    let actualSpendingPower = null
    
    if (adjustInflation) {
      // Calculate combined return rate (approximation)
      const combinedReturnRate = (maturityAmount / principal) ** (1 / tenure) - 1
      
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(combinedReturnRate, inflationRate)
      
      // Adjust the nominal maturity amount for inflation over the tenure
      // Formula: Real Value = Nominal Value / (1 + inflation)^tenure
      realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, tenure)
      
      // Real returns = real maturity amount - principal
      realTotalReturns = realMaturityAmount - principal

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, tenure)
    }

    // Calculate evolution table
    const evolution = calculateSGBEvolution(principal, goldRate, tenure, fixedRate)

    setResults({
      principal: Math.round(principal * 100) / 100,
      goldAmount: Math.round(goldAmount * 100) / 100,
      goldPricePerGram: Math.round(goldPricePerGram * 100) / 100,
      maturityAmount: Math.round(maturityAmount * 100) / 100,
      goldAppreciatedValue: Math.round(goldAppreciatedValue * 100) / 100,
      fixedInterestAmount: Math.round(fixedInterestAmount * 100) / 100,
      totalReturns: Math.round(totalReturns * 100) / 100,
      effectiveReturn: Math.round(effectiveReturn * 100) / 100,
      cagr: cagr * 100, // Convert to percentage
      realReturnRate: adjustInflation ? realReturnRate * 100 : null, // Convert to percentage
      realMaturityAmount: adjustInflation ? Math.round(realMaturityAmount * 100) / 100 : null,
      realTotalReturns: adjustInflation ? Math.round(realTotalReturns * 100) / 100 : null,
      // Tax calculation results
      taxAmount: Math.round(taxAmount * 100) / 100,
      postTaxAmount: Math.round(postTaxAmount * 100) / 100,
      taxRate: taxCalculation.taxRate,
      actualTaxRate: taxCalculation.actualTaxRate,
      taxRateLabel: taxCalculation.taxRateLabel,
      taxRule: taxCalculation.taxRule,
      actualSpendingPower: actualSpendingPower !== null ? Math.round(actualSpendingPower * 100) / 100 : null,
      evolution,
      tenure, // Store tenure for table
      isLoadingPrice,
      isRealTimePrice,
      refreshGoldPrice: () => setRefreshTrigger(prev => prev + 1),
    })
  }, [
    goldAmount,
    tenure,
    goldAppreciationRate,
    adjustInflation,
    inflationRate,
    goldPricePerGram,
    isLoadingPrice,
    isRealTimePrice,
    incomeTaxSlab
  ])

  return results
}

export default useSGBCalculator

