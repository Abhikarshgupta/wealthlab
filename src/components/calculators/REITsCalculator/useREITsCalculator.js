import { useState, useEffect } from 'react'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { calculateTaxOnWithdrawal } from '@/utils/taxCalculations'

/**
 * Custom hook for REITs Calculator calculations
 * Handles dividend income and capital appreciation calculations
 * 
 * @param {number} investmentAmount - Initial investment amount
 * @param {number} numberOfUnits - Number of units (optional, calculated if not provided)
 * @param {number} dividendYield - Expected dividend yield percentage (e.g., 7 for 7%)
 * @param {number} capitalAppreciation - Expected capital appreciation percentage (e.g., 6 for 6%)
 * @param {number} tenure - Investment tenure in years
 * @returns {Object} Calculation results
 */
const useREITsCalculator = (
  investmentAmount,
  numberOfUnits,
  dividendYield,
  capitalAppreciation,
  tenure
) => {
  const [results, setResults] = useState(null)
  const { defaultInflationRate, adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const inflationRate = defaultInflationRate / 100 // Convert to decimal

  useEffect(() => {
    // Validate inputs
    if (!investmentAmount || investmentAmount < 1000 || !tenure || !dividendYield || !capitalAppreciation) {
      setResults(null)
      return
    }

    // Convert rates to decimals
    const dividendRate = dividendYield / 100
    const appreciationRate = capitalAppreciation / 100

    // Calculate unit price (if not provided, assume based on investment amount)
    // Default unit price assumption: ₹100 per unit (can be adjusted)
    const defaultUnitPrice = 100
    const calculatedUnits = numberOfUnits || Math.floor(investmentAmount / defaultUnitPrice)
    const unitPrice = numberOfUnits ? investmentAmount / numberOfUnits : defaultUnitPrice

    // Calculate year-wise evolution
    let currentValue = investmentAmount
    let totalDividendIncome = 0
    const evolution = []

    for (let year = 1; year <= tenure; year++) {
      // Calculate dividend income for this year (based on portfolio value at start of year)
      const annualDividend = currentValue * dividendRate
      totalDividendIncome += annualDividend

      // Calculate capital appreciation (applied to the portfolio value at start of year)
      const capitalGain = currentValue * appreciationRate
      
      // Update current value (capital appreciation + reinvested dividends)
      // Assumes dividends are reinvested
      currentValue = currentValue + capitalGain + annualDividend

      // Calculate cumulative capital gains (only on appreciation, not on reinvested dividends for tax purposes)
      // This is the capital appreciation on the original investment amount
      const cumulativeCapitalGain = investmentAmount * (Math.pow(1 + appreciationRate, year) - 1)

      evolution.push({
        year,
        investmentValue: Math.round(currentValue * 100) / 100,
        dividendIncome: Math.round(annualDividend * 100) / 100,
        capitalGain: Math.round(capitalGain * 100) / 100,
        cumulativeDividend: Math.round(totalDividendIncome * 100) / 100,
        cumulativeCapitalGain: Math.round(cumulativeCapitalGain * 100) / 100,
        totalReturn: Math.round((currentValue - investmentAmount) * 100) / 100,
      })
    }

    // Final values
    const finalValue = currentValue
    // Total capital gain is the appreciation portion of returns
    const totalCapitalGain = investmentAmount * (Math.pow(1 + appreciationRate, tenure) - 1)
    const totalReturns = finalValue - investmentAmount

    // Calculate overall return rate (CAGR)
    const cagr = investmentAmount > 0 
      ? (Math.pow(finalValue / investmentAmount, 1 / tenure) - 1) * 100
      : 0

    // Calculate tax on withdrawal (REITs: LTCG @ 10% above ₹1L exemption if held > 1 year, STCG @ 15% if < 1 year)
    // Note: Dividend income is taxable annually, but for withdrawal calculation, we calculate tax on capital gains
    // The dividend tax is already accounted for in annual tax payments
    const taxCalculation = calculateTaxOnWithdrawal(
      finalValue,
      'reits',
      tenure,
      {
        incomeTaxSlab,
        principal: investmentAmount,
        returns: totalReturns,
      }
    )

    const postTaxAmount = taxCalculation.postTaxCorpus
    const taxAmount = taxCalculation.taxAmount

    // Adjust for inflation if enabled
    let realFinalValue = finalValue
    let realTotalReturns = totalReturns
    let actualSpendingPower = null
    
    if (adjustInflation) {
      // Adjust the nominal final value for inflation over the tenure
      realFinalValue = finalValue / Math.pow(1 + inflationRate, tenure)
      
      // Real returns = real final value - principal
      realTotalReturns = realFinalValue - investmentAmount

      // Calculate actual spending power (post-tax, inflation-adjusted)
      actualSpendingPower = postTaxAmount / Math.pow(1 + inflationRate, tenure)
    }

    setResults({
      investmentAmount: Math.round(investmentAmount * 100) / 100,
      numberOfUnits: calculatedUnits,
      unitPrice: Math.round(unitPrice * 100) / 100,
      totalDividendIncome: Math.round(totalDividendIncome * 100) / 100,
      totalCapitalGain: Math.round(totalCapitalGain * 100) / 100,
      finalValue: Math.round(finalValue * 100) / 100,
      totalReturns: Math.round(totalReturns * 100) / 100,
      cagr: Math.round(cagr * 100) / 100,
      // Tax calculation results
      taxAmount: Math.round(taxAmount * 100) / 100,
      postTaxAmount: Math.round(postTaxAmount * 100) / 100,
      taxRate: taxCalculation.taxRate,
      actualTaxRate: taxCalculation.actualTaxRate,
      taxRateLabel: taxCalculation.taxRateLabel,
      taxRule: taxCalculation.taxRule,
      actualSpendingPower: actualSpendingPower !== null ? Math.round(actualSpendingPower * 100) / 100 : null,
      realFinalValue: adjustInflation ? Math.round(realFinalValue * 100) / 100 : null,
      realTotalReturns: adjustInflation ? Math.round(realTotalReturns * 100) / 100 : null,
      evolution,
    })
  }, [
    investmentAmount,
    numberOfUnits,
    dividendYield,
    capitalAppreciation,
    tenure,
    adjustInflation,
    inflationRate,
    incomeTaxSlab
  ])

  return results
}

export default useREITsCalculator

