import { useState, useEffect } from 'react'
import { calculateCompoundInterest, calculateCAGR, calculateRealReturn } from '@/utils/calculations'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * Custom hook for IPO/FPO Calculator calculations
 * Handles IPO investment calculations including listing gains and holding period returns
 * 
 * @param {number} applicationAmount - Amount applied for IPO
 * @param {number} sharesAllotted - Number of shares allotted
 * @param {number} issuePrice - Issue price per share
 * @param {number} listingPrice - Listing price per share (or null to calculate from listingGainPercent)
 * @param {number} listingGainPercent - Expected listing gain percentage (if listingPrice not provided)
 * @param {number} holdingPeriod - Holding period in years
 * @param {number} expectedCAGR - Expected CAGR for post-listing period (as percentage)
 * @param {boolean} adjustInflation - Whether to adjust for inflation
 * @returns {Object} Calculation results
 */
const useIPOCalculator = (
  applicationAmount,
  sharesAllotted,
  issuePrice,
  listingPrice,
  listingGainPercent,
  holdingPeriod,
  expectedCAGR,
  adjustInflation
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (!applicationAmount || applicationAmount <= 0 || 
        !sharesAllotted || sharesAllotted <= 0 ||
        !issuePrice || issuePrice <= 0 ||
        !holdingPeriod || holdingPeriod <= 0) {
      setResults(null)
      return
    }

    // Calculate listing price if not provided
    let actualListingPrice = listingPrice
    if (!actualListingPrice && listingGainPercent !== null && listingGainPercent !== undefined) {
      actualListingPrice = issuePrice * (1 + listingGainPercent / 100)
    }

    if (!actualListingPrice || actualListingPrice <= 0) {
      setResults(null)
      return
    }

    // Initial investment value (at issue price)
    const initialInvestment = sharesAllotted * issuePrice
    
    // Listing value (at listing price)
    const listingValue = sharesAllotted * actualListingPrice
    
    // Listing gain/loss
    const listingGain = listingValue - initialInvestment
    const listingGainPercentage = ((listingValue - initialInvestment) / initialInvestment) * 100

    // Post-listing growth (if holding period > 0 and expectedCAGR provided)
    let finalValue = listingValue
    let postListingReturns = 0
    let evolution = []

    if (holdingPeriod > 0 && expectedCAGR !== null && expectedCAGR !== undefined && expectedCAGR > 0) {
      const annualRate = expectedCAGR / 100
      
      // Calculate final value after holding period
      finalValue = calculateCompoundInterest(listingValue, annualRate, holdingPeriod, 1)
      
      // Post-listing returns
      postListingReturns = finalValue - listingValue
      
      // Calculate evolution table
      evolution = []
      for (let year = 0; year <= holdingPeriod; year++) {
        const yearValue = year === 0 
          ? listingValue 
          : calculateCompoundInterest(listingValue, annualRate, year, 1)
        const totalGain = yearValue - initialInvestment
        const yearGain = year === 0 ? listingGain : (yearValue - (evolution[year - 1]?.value || listingValue))
        
        evolution.push({
          year: year === 0 ? 'Listing' : year,
          openingValue: year === 0 ? initialInvestment : (evolution[year - 1]?.value || listingValue),
          value: yearValue,
          gain: yearGain,
          totalGain: totalGain,
          returnPercent: year === 0 ? listingGainPercentage : ((yearValue / initialInvestment - 1) * 100)
        })
      }
    } else {
      // No holding period - just listing gains
      evolution = [{
        year: 'Listing',
        openingValue: initialInvestment,
        value: listingValue,
        gain: listingGain,
        totalGain: listingGain,
        returnPercent: listingGainPercentage
      }]
    }

    // Total returns
    const totalReturns = finalValue - initialInvestment
    const totalReturnPercentage = ((finalValue - initialInvestment) / initialInvestment) * 100

    // Calculate overall CAGR (from application to final value)
    const overallCAGR = initialInvestment > 0 && holdingPeriod > 0
      ? calculateCAGR(initialInvestment, finalValue, holdingPeriod) * 100
      : listingGainPercentage

    // Tax calculations
    const isLongTerm = holdingPeriod >= 1
    const ltcgExemptionLimit = 100000 // ₹1L exemption
    const taxableGains = Math.max(0, totalReturns - ltcgExemptionLimit)
    
    let taxAmount = 0
    if (isLongTerm) {
      // LTCG: 10% above ₹1L exemption
      taxAmount = taxableGains * 0.10
    } else {
      // STCG: 15% on all gains
      taxAmount = totalReturns * 0.15
    }

    const postTaxValue = finalValue - taxAmount
    const postTaxReturns = totalReturns - taxAmount

    // Adjust for inflation if enabled
    let realFinalValue = finalValue
    let realReturns = totalReturns
    let realReturnRate = overallCAGR / 100
    
    if (adjustInflation && holdingPeriod > 0) {
      // Calculate real return rate (annualized)
      const annualRate = expectedCAGR / 100
      realReturnRate = calculateRealReturn(annualRate, inflationRate)
      
      // Adjust the nominal final value for inflation over the holding period
      realFinalValue = finalValue / Math.pow(1 + inflationRate, holdingPeriod)
      
      // Real returns = real final value - initial investment
      realReturns = realFinalValue - initialInvestment
    }

    setResults({
      initialInvestment: Math.round(initialInvestment * 100) / 100,
      listingValue: Math.round(listingValue * 100) / 100,
      listingGain: Math.round(listingGain * 100) / 100,
      listingGainPercentage: Math.round(listingGainPercentage * 100) / 100,
      finalValue: Math.round(finalValue * 100) / 100,
      postListingReturns: Math.round(postListingReturns * 100) / 100,
      totalReturns: Math.round(totalReturns * 100) / 100,
      totalReturnPercentage: Math.round(totalReturnPercentage * 100) / 100,
      overallCAGR: Math.round(overallCAGR * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      postTaxValue: Math.round(postTaxValue * 100) / 100,
      postTaxReturns: Math.round(postTaxReturns * 100) / 100,
      isLongTerm,
      realReturnRate: adjustInflation ? Math.round(realReturnRate * 100 * 100) / 100 : null,
      realFinalValue: adjustInflation ? Math.round(realFinalValue * 100) / 100 : null,
      realReturns: adjustInflation ? Math.round(realReturns * 100) / 100 : null,
      evolution,
    })
  }, [
    applicationAmount,
    sharesAllotted,
    issuePrice,
    listingPrice,
    listingGainPercent,
    holdingPeriod,
    expectedCAGR,
    adjustInflation,
    inflationRate
  ])

  return results
}

export default useIPOCalculator

