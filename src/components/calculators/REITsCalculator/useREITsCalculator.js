import { useState, useEffect } from 'react'
import { calculateCompoundInterest } from '@/utils/calculations'

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

    setResults({
      investmentAmount: Math.round(investmentAmount * 100) / 100,
      numberOfUnits: calculatedUnits,
      unitPrice: Math.round(unitPrice * 100) / 100,
      totalDividendIncome: Math.round(totalDividendIncome * 100) / 100,
      totalCapitalGain: Math.round(totalCapitalGain * 100) / 100,
      finalValue: Math.round(finalValue * 100) / 100,
      totalReturns: Math.round(totalReturns * 100) / 100,
      cagr: Math.round(cagr * 100) / 100,
      evolution,
    })
  }, [
    investmentAmount,
    numberOfUnits,
    dividendYield,
    capitalAppreciation,
    tenure
  ])

  return results
}

export default useREITsCalculator

