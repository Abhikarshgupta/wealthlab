import { useState, useEffect } from 'react'
import { 
  calculateNPSWeightedReturn,
  calculateNPSFutureValue,
  calculateNPSEvolution,
  calculateRealReturn,
  calculateCAGR
} from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for NPS Calculator calculations
 * Handles real-time calculations with asset allocation and age-based caps
 * 
 * @param {number} monthlyContribution - Monthly NPS contribution
 * @param {number} tenure - Investment tenure in years
 * @param {number} currentAge - Current age of subscriber
 * @param {number} equityAllocation - Equity allocation percentage (0-75%)
 * @param {number} corporateBondsAllocation - Corporate bonds allocation percentage
 * @param {number} governmentBondsAllocation - Government bonds allocation percentage
 * @param {number} alternativeAllocation - Alternative investments allocation percentage (0-5%)
 * @param {number} equityReturn - Expected equity return rate (as percentage)
 * @param {number} corporateBondsReturn - Expected corporate bonds return rate (as percentage)
 * @param {number} governmentBondsReturn - Expected government bonds return rate (as percentage)
 * @param {number} alternativeReturn - Expected alternative investments return rate (as percentage)
 * @param {boolean} useAgeBasedCaps - Whether to apply age-based equity caps
 * @param {number} withdrawalPercentage - Withdrawal percentage (60, 80, or 100)
 * @returns {Object} Calculation results
 */
const useNPSCalculator = (
  monthlyContribution,
  tenure,
  currentAge,
  equityAllocation,
  corporateBondsAllocation,
  governmentBondsAllocation,
  alternativeAllocation,
  equityReturn,
  corporateBondsReturn,
  governmentBondsReturn,
  alternativeReturn,
  useAgeBasedCaps,
  withdrawalPercentage = 80
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (!monthlyContribution || monthlyContribution < 500 || !tenure || !currentAge) {
      setResults(null)
      return
    }

    // Validate allocation sums to 100%
    const totalAllocation = 
      (equityAllocation || 0) +
      (corporateBondsAllocation || 0) +
      (governmentBondsAllocation || 0) +
      (alternativeAllocation || 0)
    
    if (Math.abs(totalAllocation - 100) > 0.01) {
      setResults(null)
      return
    }

    // Convert percentages to decimals
    const equityAlloc = (equityAllocation || 0) / 100
    const corporateBondsAlloc = (corporateBondsAllocation || 0) / 100
    const governmentBondsAlloc = (governmentBondsAllocation || 0) / 100
    const alternativeAlloc = (alternativeAllocation || 0) / 100
    
    const equityRet = (equityReturn || 0) / 100
    const corporateBondsRet = (corporateBondsReturn || 0) / 100
    const governmentBondsRet = (governmentBondsReturn || 0) / 100
    const alternativeRet = (alternativeReturn || 0) / 100

    // Always enforce current age-based equity cap (PFRDA regulation - Updated October 1, 2025)
    // NEW RULES (Effective October 1, 2025):
    // - Age ≤35: Up to 100% equity allowed
    // - Age 36-50: Decreases by 2.5% annually (97.5% at 36, 75% at 50)
    // - Age 51-59: Continues decreasing by 2.5% annually (reaches 52.5% at 59)
    // - Age 59: Maximum 53% equity (rounded up from 52.5%)
    let maxEquityForCurrentAgeDecimal = 1.0 // 100% for age ≤35
    if (currentAge > 35 && currentAge <= 50) {
      maxEquityForCurrentAgeDecimal = Math.max(0.75, 1.0 - (currentAge - 35) * 0.025)
    } else if (currentAge > 50) {
      maxEquityForCurrentAgeDecimal = Math.max(0.50, 0.75 - (currentAge - 50) * 0.025)
    }
    
    // Round up to allow reaching the calculated percentage (e.g., 52.5% rounds to 53%)
    const maxEquityForCurrentAge = Math.ceil(maxEquityForCurrentAgeDecimal * 100) / 100
    
    // Adjust allocation if equity exceeds current age-based cap
    let effectiveEquityAlloc = equityAlloc
    let effectiveCorporateBondsAlloc = corporateBondsAlloc
    let effectiveGovernmentBondsAlloc = governmentBondsAlloc
    let effectiveAlternativeAlloc = alternativeAlloc
    
    if (equityAlloc > maxEquityForCurrentAge) {
      const excess = equityAlloc - maxEquityForCurrentAge
      effectiveEquityAlloc = maxEquityForCurrentAge
      
      // Redistribute excess proportionally
      const totalOther = corporateBondsAlloc + governmentBondsAlloc + alternativeAlloc
      if (totalOther > 0) {
        effectiveCorporateBondsAlloc += excess * (corporateBondsAlloc / totalOther)
        effectiveGovernmentBondsAlloc += excess * (governmentBondsAlloc / totalOther)
        effectiveAlternativeAlloc += excess * (alternativeAlloc / totalOther)
      } else {
        effectiveGovernmentBondsAlloc += excess
      }
    }

    // Calculate weighted average return
    // If age-based caps toggle is enabled, calculate average weighted return accounting for gradual reduction over time
    let weightedReturn = 0
    
    if (useAgeBasedCaps) {
      // Calculate average weighted return accounting for age-based equity cap reductions over investment period
      // As age increases during investment, equity allocation cap decreases, reducing weighted return
      let totalWeightedReturn = 0
      let adjustedAllocation = {
        equity: effectiveEquityAlloc,
        corporateBonds: effectiveCorporateBondsAlloc,
        governmentBonds: effectiveGovernmentBondsAlloc,
        alternative: effectiveAlternativeAlloc
      }
      
      for (let year = 0; year < tenure; year++) {
        const ageThisYear = currentAge + year
        
        // Calculate max equity allocation for this year (NEW RULES - October 1, 2025)
        let maxEquityDecimal = 1.0 // 100% for age ≤35
        if (ageThisYear > 35 && ageThisYear <= 50) {
          maxEquityDecimal = Math.max(0.75, 1.0 - (ageThisYear - 35) * 0.025)
        } else if (ageThisYear > 50) {
          maxEquityDecimal = Math.max(0.50, 0.75 - (ageThisYear - 50) * 0.025)
        }
        
        // Round up to allow reaching the calculated percentage
        const maxEquity = Math.ceil(maxEquityDecimal * 100) / 100
        
        // Adjust allocation if equity exceeds cap for this year
        if (adjustedAllocation.equity > maxEquity) {
          const excess = adjustedAllocation.equity - maxEquity
          adjustedAllocation.equity = maxEquity
          
          // Redistribute excess proportionally
          const totalOther = adjustedAllocation.corporateBonds + adjustedAllocation.governmentBonds + adjustedAllocation.alternative
          if (totalOther > 0) {
            adjustedAllocation.corporateBonds += excess * (adjustedAllocation.corporateBonds / totalOther)
            adjustedAllocation.governmentBonds += excess * (adjustedAllocation.governmentBonds / totalOther)
            adjustedAllocation.alternative += excess * (adjustedAllocation.alternative / totalOther)
          } else {
            adjustedAllocation.governmentBonds += excess
          }
        }
        
        // Calculate weighted return for this year
        const yearWeightedReturn = calculateNPSWeightedReturn(
          adjustedAllocation.equity,
          equityRet,
          adjustedAllocation.corporateBonds,
          corporateBondsRet,
          adjustedAllocation.governmentBonds,
          governmentBondsRet,
          adjustedAllocation.alternative,
          alternativeRet
        )
        
        totalWeightedReturn += yearWeightedReturn
      }
      
      // Average weighted return over investment period
      weightedReturn = totalWeightedReturn / tenure
    } else {
      // Calculate weighted average return using current age-adjusted allocation
      // (Already enforced current age cap above)
      weightedReturn = calculateNPSWeightedReturn(
        effectiveEquityAlloc,
        equityRet,
        effectiveCorporateBondsAlloc,
        corporateBondsRet,
        effectiveGovernmentBondsAlloc,
        governmentBondsRet,
        effectiveAlternativeAlloc,
        alternativeRet
      )
    }

    // Calculate future value
    const futureValue = calculateNPSFutureValue(
      monthlyContribution,
      weightedReturn,
      tenure
    )

    // Calculate total invested
    const totalInvested = monthlyContribution * 12 * tenure

    // Calculate returns earned
    const returnsEarned = futureValue - totalInvested

    // Calculate CAGR/XIRR (simplified approximation)
    const xirr = totalInvested > 0 
      ? calculateCAGR(totalInvested, futureValue, tenure)
      : 0

    // Calculate tax on withdrawal (NPS: 60% tax-free, 40% taxable)
    const taxCalculation = calculateTaxOnWithdrawal(
      futureValue,
      'nps',
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
    let realReturnRate = weightedReturn
    let actualSpendingPower = null
    
    if (adjustInflation) {
      // Calculate real return rate (annualized)
      realReturnRate = calculateRealReturn(weightedReturn, inflationRate)
      
      // Adjust the nominal future value for inflation over the actual period
      realFutureValue = futureValue / Math.pow(1 + inflationRate, tenure)
      
      // Real returns = real future value - total invested
      realReturns = realFutureValue - totalInvested

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, tenure)
    }

    // Calculate withdrawal and annuity amounts based on withdrawal percentage
    // Updated NPS Rules (December 2025):
    // - Non-Government Subscribers: Can withdraw up to 80% of corpus as lump sum (increased from 60%)
    // - Remaining 20%: Must be used to purchase annuity
    // - Full Withdrawal: If total corpus ≤ ₹8 lakh, subscriber can withdraw 100% without annuity purchase
    const WITHDRAWAL_THRESHOLD = 800000 // ₹8 lakh
    const effectiveWithdrawalPercentage = futureValue <= WITHDRAWAL_THRESHOLD ? 100 : withdrawalPercentage
    
    const withdrawalAmount = futureValue * (effectiveWithdrawalPercentage / 100)
    const annuityAmount = futureValue - withdrawalAmount
    
    // Calculate post-tax withdrawal amount (proportional to post-tax corpus)
    // Tax is calculated on the full corpus (60% tax-free, 40% taxable)
    // Withdrawal amount gets proportional post-tax value
    const postTaxWithdrawalAmount = withdrawalAmount * (postTaxAmount / futureValue)
    const postTaxAnnuityAmount = postTaxAmount - postTaxWithdrawalAmount

    // Calculate evolution table
    const evolution = calculateNPSEvolution(
      monthlyContribution,
      weightedReturn,
      tenure,
      currentAge,
      useAgeBasedCaps,
      {
        equity: effectiveEquityAlloc,
        corporateBonds: effectiveCorporateBondsAlloc,
        governmentBonds: effectiveGovernmentBondsAlloc,
        alternative: effectiveAlternativeAlloc
      },
      {
        equity: equityRet,
        corporateBonds: corporateBondsRet,
        governmentBonds: governmentBondsRet,
        alternative: alternativeRet
      }
    )

    setResults({
      totalInvested: Math.round(totalInvested * 100) / 100,
      returnsEarned: Math.round(returnsEarned * 100) / 100,
      corpusValue: Math.round(futureValue * 100) / 100,
      weightedReturn: weightedReturn * 100, // Convert to percentage
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
      // Withdrawal and annuity amounts
      withdrawalPercentage: effectiveWithdrawalPercentage,
      withdrawalAmount: Math.round(withdrawalAmount * 100) / 100,
      annuityAmount: Math.round(annuityAmount * 100) / 100,
      postTaxWithdrawalAmount: Math.round(postTaxWithdrawalAmount * 100) / 100,
      postTaxAnnuityAmount: Math.round(postTaxAnnuityAmount * 100) / 100,
      evolution,
      allocation: {
        equity: Math.round(effectiveEquityAlloc * 100 * 10) / 10,
        corporateBonds: Math.round(effectiveCorporateBondsAlloc * 100 * 10) / 10,
        governmentBonds: Math.round(effectiveGovernmentBondsAlloc * 100 * 10) / 10,
        alternative: Math.round(effectiveAlternativeAlloc * 100 * 10) / 10
      },
      inputAllocation: {
        equity: equityAllocation,
        corporateBonds: corporateBondsAllocation,
        governmentBonds: governmentBondsAllocation,
        alternative: alternativeAllocation
      }
    })
  }, [
    monthlyContribution,
    tenure,
    currentAge,
    equityAllocation,
    corporateBondsAllocation,
    governmentBondsAllocation,
    alternativeAllocation,
    equityReturn,
    corporateBondsReturn,
    governmentBondsReturn,
    alternativeReturn,
    useAgeBasedCaps,
    withdrawalPercentage,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useNPSCalculator

