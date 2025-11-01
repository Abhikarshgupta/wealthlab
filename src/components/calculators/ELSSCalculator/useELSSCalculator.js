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

/**
 * Custom hook for ELSS Calculator calculations
 * Handles both SIP and Lumpsum investment modes with inflation adjustments
 * 
 * @param {string} investmentType - 'sip' or 'lumpsum'
 * @param {number} amount - Investment amount (monthly SIP or lumpsum)
 * @param {number} tenure - Investment tenure in years (minimum 3 years)
 * @param {number} expectedReturn - Expected annual return rate (as percentage, e.g., 14 for 14%)
 * @param {boolean} adjustInflation - Whether to adjust for inflation
 * @returns {Object} Calculation results
 */
const useELSSCalculator = (
  investmentType,
  amount,
  tenure,
  expectedReturn,
  adjustInflation
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate } = useUserPreferencesStore()
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

    // Adjust for inflation if enabled
    let realFutureValue = futureValue
    let realReturns = returnsEarned
    let realReturnRate = annualRate
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal future value for inflation over the actual period
      realFutureValue = futureValue / Math.pow(1 + inflationRate, tenure)
      
      // Real returns = real future value - total invested
      realReturns = realFutureValue - totalInvested
    }

    setResults({
      totalInvested: Math.round(totalInvested * 100) / 100,
      returnsEarned: Math.round(returnsEarned * 100) / 100,
      corpusValue: Math.round(futureValue * 100) / 100,
      returnRate: returnRate * 100, // Convert to percentage
      realReturnRate: realReturnRate * 100, // Convert to percentage
      realCorpusValue: adjustInflation ? Math.round(realFutureValue * 100) / 100 : null,
      realReturns: adjustInflation ? Math.round(realReturns * 100) / 100 : null,
      evolution,
    })
  }, [
    investmentType,
    amount,
    tenure,
    expectedReturn,
    adjustInflation,
    inflationRate
  ])

  return results
}

export default useELSSCalculator

