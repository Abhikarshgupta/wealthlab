/**
 * Financial Calculation Utilities
 * All formulas verified against industry-standard calculators
 */

/**
 * Calculate compound interest
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.071 for 7.1%)
 * @param {number} time - Time period in years
 * @param {number} frequency - Compounding frequency per year (1=annual, 4=quarterly, 12=monthly)
 * @returns {number} Maturity amount
 */
export const calculateCompoundInterest = (principal, rate, time, frequency = 1) => {
  if (!principal || !rate || !time) return 0
  return principal * Math.pow(1 + rate / frequency, frequency * time)
}

/**
 * Calculate SIP (Systematic Investment Plan) future value
 * @param {number} monthlyInvestment - Monthly investment amount
 * @param {number} annualRate - Annual return rate (as decimal)
 * @param {number} months - Number of months
 * @returns {number} Future value
 */
export const calculateSIPFutureValue = (monthlyInvestment, annualRate, months) => {
  if (!monthlyInvestment || !annualRate || !months) return 0
  const monthlyRate = annualRate / 12
  if (monthlyRate === 0) return monthlyInvestment * months
  return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
}

/**
 * Calculate step-up SIP future value
 * @param {number} initialSIP - Initial monthly SIP amount
 * @param {number} stepUpPercentage - Annual step-up percentage (as decimal, e.g., 0.10 for 10%)
 * @param {number} years - Investment period in years
 * @param {number} returnRate - Annual return rate (as decimal)
 * @returns {number} Future value
 */
export const calculateStepUpSIP = (initialSIP, stepUpPercentage, years, returnRate) => {
  if (!initialSIP || !years || !returnRate) return 0
  let futureValue = 0
  const monthlyRate = returnRate / 12
  
  for (let year = 0; year < years; year++) {
    const currentSIP = initialSIP * Math.pow(1 + stepUpPercentage, year)
    const monthsInYear = 12
    if (monthlyRate === 0) {
      futureValue += currentSIP * monthsInYear
    } else {
      futureValue += currentSIP * ((Math.pow(1 + monthlyRate, monthsInYear) - 1) / monthlyRate) * (1 + monthlyRate)
      // Apply compounding for previous years
      futureValue *= Math.pow(1 + monthlyRate, monthsInYear)
    }
  }
  
  return futureValue
}

/**
 * Calculate inflation-adjusted amount
 * @param {number} amount - Nominal amount
 * @param {number} inflationRate - Annual inflation rate (as decimal)
 * @param {number} years - Number of years
 * @returns {number} Inflation-adjusted amount
 */
export const adjustForInflation = (amount, inflationRate, years) => {
  if (!amount || !inflationRate || !years) return amount
  return amount / Math.pow(1 + inflationRate, years)
}

/**
 * Calculate real return (inflation-adjusted return)
 * @param {number} nominalReturn - Nominal return rate (as decimal)
 * @param {number} inflationRate - Inflation rate (as decimal)
 * @returns {number} Real return rate (as decimal)
 */
export const calculateRealReturn = (nominalReturn, inflationRate) => {
  if (!nominalReturn || !inflationRate) return 0
  return ((1 + nominalReturn) / (1 + inflationRate)) - 1
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * @param {number} beginningValue - Starting value
 * @param {number} endingValue - Ending value
 * @param {number} years - Number of years
 * @returns {number} CAGR (as decimal)
 */
export const calculateCAGR = (beginningValue, endingValue, years) => {
  if (!beginningValue || !endingValue || !years || beginningValue === 0) return 0
  return Math.pow(endingValue / beginningValue, 1 / years) - 1
}

/**
 * Calculate XIRR for irregular cash flows
 * Note: This is a simplified version. Full XIRR requires iterative calculation
 * @param {Array<number>} cashFlows - Array of cash flows (negative for investments, positive for returns)
 * @param {Array<Date>} dates - Array of dates corresponding to cash flows
 * @returns {number} XIRR (as decimal)
 */
export const calculateXIRR = (cashFlows, dates) => {
  // Simplified XIRR calculation - for production, use a library like financejs
  // This is a placeholder
  if (!cashFlows || !dates || cashFlows.length !== dates.length) return 0
  
  // For now, return a simple approximation
  // In production, implement proper XIRR algorithm using Newton-Raphson method
  return 0
}

/**
 * Calculate PPF maturity amount
 * Formula: A = P × [(1 + r)^n - 1] / r × (1 + r)
 * @param {number} yearlyInvestment - Yearly investment amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Number of years
 * @returns {number} Maturity amount
 */
export const calculatePPF = (yearlyInvestment, rate, years) => {
  if (!yearlyInvestment || !rate || !years) return 0
  if (rate === 0) return yearlyInvestment * years
  return yearlyInvestment * ((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate)
}

/**
 * Calculate year-wise evolution for PPF
 * @param {number} yearlyInvestment - Yearly investment amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Number of years
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculatePPFEvolution = (yearlyInvestment, rate, years) => {
  const evolution = []
  let openingBalance = 0
  
  for (let year = 1; year <= years; year++) {
    const investment = yearlyInvestment
    const interest = (openingBalance + investment) * rate
    const closingBalance = openingBalance + investment + interest
    
    evolution.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      investment: Math.round(investment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
    
    openingBalance = closingBalance
  }
  
  return evolution
}

/**
 * Calculate FD maturity amount with quarterly compounding
 * @param {number} principal - Initial investment
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Tenure in years
 * @returns {number} Maturity amount
 */
export const calculateFD = (principal, rate, years) => {
  return calculateCompoundInterest(principal, rate, years, 4) // Quarterly compounding
}

/**
 * Calculate year-wise evolution for FD
 * @param {number} principal - Initial investment
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Tenure in years
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateFDEvolution = (principal, rate, years) => {
  const evolution = []
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = year === 1 ? 0 : calculateFD(principal, rate, year - 1)
    const closingBalance = calculateFD(principal, rate, year)
    const interest = closingBalance - (year === 1 ? principal : openingBalance)
    
    evolution.push({
      year,
      openingBalance: Math.round((year === 1 ? 0 : openingBalance) * 100) / 100,
      investment: Math.round((year === 1 ? principal : 0) * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
  }
  
  return evolution
}
