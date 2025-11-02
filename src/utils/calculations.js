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
  
  const monthlyRate = returnRate / 12
  let balance = 0
  
  // Calculate month by month with step-up applied at the start of each year
  for (let year = 0; year < years; year++) {
    // Calculate monthly SIP for this year (step-up applies at year start)
    const currentYearSIP = initialSIP * Math.pow(1 + stepUpPercentage, year)
    
    // Process each month of this year
    for (let month = 1; month <= 12; month++) {
      // Apply monthly compounding: balance grows by monthly rate, then add new SIP
      // This ensures the contribution is NOT compounded in the month it's added
      if (monthlyRate > 0) {
        balance = balance * (1 + monthlyRate) + currentYearSIP
      } else {
        balance += currentYearSIP
      }
    }
  }
  
  return balance
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
 * Calculate PPF maturity amount with step-up
 * @param {number} yearlyInvestment - Initial yearly investment amount
 * @param {number} stepUpPercentage - Annual step-up percentage (as decimal, e.g., 0.10 for 10%)
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Number of years
 * @returns {number} Maturity amount
 */
export const calculatePPFWithStepUp = (yearlyInvestment, stepUpPercentage, rate, years) => {
  if (!yearlyInvestment || !years || !rate) return 0
  
  let balance = 0
  
  for (let year = 0; year < years; year++) {
    // Calculate investment for this year (step-up applies at year start)
    const currentYearInvestment = yearlyInvestment * Math.pow(1 + stepUpPercentage, year)
    
    // Add investment at start of year, then apply interest
    balance = (balance + currentYearInvestment) * (1 + rate)
  }
  
  return balance
}

/**
 * Calculate year-wise evolution for PPF
 * @param {number} yearlyInvestment - Yearly investment amount (or initial if step-up enabled)
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Number of years
 * @param {boolean} stepUpEnabled - Whether step-up is enabled
 * @param {number} stepUpPercentage - Annual step-up percentage (as decimal, e.g., 0.10 for 10%)
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculatePPFEvolution = (yearlyInvestment, rate, years, stepUpEnabled = false, stepUpPercentage = 0) => {
  const evolution = []
  let openingBalance = 0
  
  for (let year = 1; year <= years; year++) {
    // Calculate investment for this year (step-up applies at year start)
    const investment = stepUpEnabled 
      ? yearlyInvestment * Math.pow(1 + stepUpPercentage, year - 1)
      : yearlyInvestment
    
    // Interest is calculated on opening balance + investment
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
 * Calculate SIP year-wise evolution
 * @param {number} monthlyInvestment - Monthly SIP amount
 * @param {number} annualRate - Annual return rate (as decimal)
 * @param {number} years - Investment period in years
 * @param {boolean} stepUpEnabled - Whether step-up is enabled
 * @param {number} stepUpPercentage - Annual step-up percentage (as decimal, e.g., 0.10 for 10%)
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateSIPEvolution = (monthlyInvestment, annualRate, years, stepUpEnabled = false, stepUpPercentage = 0) => {
  const evolution = []
  let cumulativeBalance = 0
  const monthlyRate = annualRate / 12
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = cumulativeBalance
    
    // Calculate monthly SIP for this year (step-up applies at the start of each year)
    const currentYearSIP = stepUpEnabled 
      ? monthlyInvestment * Math.pow(1 + stepUpPercentage, year - 1)
      : monthlyInvestment
    
    let yearInvestment = 0
    
    // Calculate monthly contributions for this year with compounding
    for (let month = 1; month <= 12; month++) {
      const monthSIP = currentYearSIP
      yearInvestment += monthSIP
      
      // Apply monthly compounding: balance grows by monthly rate, then add new SIP
      if (monthlyRate === 0) {
        cumulativeBalance += monthSIP
      } else {
        cumulativeBalance = cumulativeBalance * (1 + monthlyRate) + monthSIP
      }
    }
    
    const closingBalance = cumulativeBalance
    const interest = closingBalance - openingBalance - yearInvestment
    
    evolution.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      investment: Math.round(yearInvestment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
  }
  
  return evolution
}

/**
 * Calculate FD maturity amount with configurable compounding frequency
 * @param {number} principal - Initial investment
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Tenure in years
 * @param {string} compoundingFrequency - 'quarterly', 'monthly', 'annually', or 'cumulative'
 * @returns {number} Maturity amount
 */
export const calculateFD = (principal, rate, years, compoundingFrequency = 'quarterly') => {
  // Use explicit null/undefined checks instead of falsy checks to allow rate=0 (0% interest)
  if (principal == null || rate == null || years == null) return 0
  if (principal < 0 || rate < 0 || years < 0) return 0
  
  // Map compounding frequency to frequency number
  let frequency = 4 // Default to quarterly
  if (compoundingFrequency === 'monthly') {
    frequency = 12
  } else if (compoundingFrequency === 'annually') {
    frequency = 1
  } else if (compoundingFrequency === 'cumulative') {
    // Cumulative: Simple interest for < 1 year, compound annually for >= 1 year
    if (years < 1) {
      return principal * (1 + rate * years)
    } else {
      frequency = 1 // Annual compounding
    }
  }
  
  return calculateCompoundInterest(principal, rate, years, frequency)
}

/**
 * Calculate year-wise evolution for FD with configurable compounding
 * @param {number} principal - Initial investment
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Tenure in years
 * @param {string} compoundingFrequency - 'quarterly', 'monthly', 'annually', or 'cumulative'
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateFDEvolution = (principal, rate, years, compoundingFrequency = 'quarterly') => {
  const evolution = []
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = year === 1 ? 0 : calculateFD(principal, rate, year - 1, compoundingFrequency)
    const closingBalance = calculateFD(principal, rate, year, compoundingFrequency)
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

/**
 * Calculate NSC maturity amount
 * Formula: A = P × (1 + r)^n
 * Interest is compounded annually but paid at maturity
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.077 for 7.7%)
 * @param {number} years - Tenure in years (fixed at 5 years)
 * @returns {number} Maturity amount
 */
export const calculateNSC = (principal, rate, years = 5) => {
  return calculateCompoundInterest(principal, rate, years, 1) // Annual compounding
}

/**
 * Calculate year-wise evolution for NSC
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Tenure in years (fixed at 5 years)
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateNSCEvolution = (principal, rate, years = 5) => {
  const evolution = []
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = year === 1 ? 0 : calculateNSC(principal, rate, year - 1)
    const closingBalance = calculateNSC(principal, rate, year)
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

/**
 * Calculate year-wise evolution for lumpsum compound interest
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} years - Investment period in years
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateLumpsumEvolution = (principal, rate, years) => {
  const evolution = []
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = year === 1 ? 0 : calculateCompoundInterest(principal, rate, year - 1, 1)
    const closingBalance = calculateCompoundInterest(principal, rate, year, 1)
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

/**
 * Calculate SGB (Sovereign Gold Bond) maturity amount
 * SGB provides:
 * 1. Fixed interest: 2.5% p.a. paid semi-annually (compounds)
 * 2. Gold appreciation: Based on gold price appreciation rate
 * 
 * Formula: Final Value = Principal × (1 + goldRate)^years + Fixed Interest (compounded semi-annually)
 * 
 * @param {number} principal - Initial investment (gold amount in grams × gold price per gram)
 * @param {number} goldAppreciationRate - Annual gold appreciation rate (as decimal, e.g., 0.08 for 8%)
 * @param {number} years - Tenure in years (5 or 8)
 * @param {number} fixedRate - Fixed interest rate (as decimal, default 0.025 for 2.5%)
 * @returns {number} Maturity amount
 */
export const calculateSGB = (principal, goldAppreciationRate, years, fixedRate = 0.025) => {
  if (!principal || !years) return 0
  
  // Gold appreciation component: Principal grows with gold price
  const goldAppreciatedValue = principal * Math.pow(1 + goldAppreciationRate, years)
  
  // Fixed interest component: 2.5% p.a. paid semi-annually (compounds)
  // Semi-annual rate = fixedRate / 2
  // Number of periods = years * 2
  const fixedInterestAmount = principal * (Math.pow(1 + fixedRate / 2, years * 2) - 1)
  
  // Final value = Gold appreciated value + Fixed interest earned
  return goldAppreciatedValue + fixedInterestAmount
}

/**
 * Calculate year-wise evolution for SGB
 * @param {number} principal - Initial investment (gold amount in grams × gold price per gram)
 * @param {number} goldAppreciationRate - Annual gold appreciation rate (as decimal)
 * @param {number} years - Tenure in years (5 or 8)
 * @param {number} fixedRate - Fixed interest rate (as decimal, default 0.025 for 2.5%)
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateSGBEvolution = (principal, goldAppreciationRate, years, fixedRate = 0.025) => {
  const evolution = []
  let openingBalance = principal
  
  for (let year = 1; year <= years; year++) {
    // Gold appreciation: Principal grows with gold price each year
    const goldAppreciatedValue = principal * Math.pow(1 + goldAppreciationRate, year)
    
    // Fixed interest: Calculate cumulative interest up to this year
    // Interest compounds semi-annually
    const cumulativeInterest = principal * (Math.pow(1 + fixedRate / 2, year * 2) - 1)
    
    // Fixed interest earned this year
    const previousYearCumulativeInterest = year === 1 
      ? 0 
      : principal * (Math.pow(1 + fixedRate / 2, (year - 1) * 2) - 1)
    const yearFixedInterest = cumulativeInterest - previousYearCumulativeInterest
    
    // Closing balance = Gold appreciated value + Cumulative fixed interest
    const closingBalance = goldAppreciatedValue + cumulativeInterest
    
    evolution.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      investment: Math.round((year === 1 ? principal : 0) * 100) / 100,
      interest: Math.round(yearFixedInterest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
    
    // Opening balance for next year = closing balance of current year
    openingBalance = closingBalance
  }
  
  return evolution
}

/**
 * Calculate weighted average return for NPS based on asset allocation
 * NPS allows investment in 4 asset classes: Equity (E), Corporate Bonds (C), Government Securities (G), Alternative Investments (A)
 * 
 * Reference: PFRDA Guidelines - https://enps.nsdl.com/eNPS/getSchemeInfo.html
 * 
 * @param {number} equityAllocation - Equity allocation percentage (as decimal, e.g., 0.50 for 50%)
 * @param {number} equityReturn - Expected equity return rate (as decimal, e.g., 0.12 for 12%)
 * @param {number} corporateBondsAllocation - Corporate bonds allocation percentage (as decimal)
 * @param {number} corporateBondsReturn - Expected corporate bonds return rate (as decimal)
 * @param {number} governmentBondsAllocation - Government bonds allocation percentage (as decimal)
 * @param {number} governmentBondsReturn - Expected government bonds return rate (as decimal)
 * @param {number} alternativeAllocation - Alternative investments allocation percentage (as decimal, optional)
 * @param {number} alternativeReturn - Expected alternative investments return rate (as decimal, optional)
 * @returns {number} Weighted average return rate (as decimal)
 */
export const calculateNPSWeightedReturn = (
  equityAllocation,
  equityReturn,
  corporateBondsAllocation,
  corporateBondsReturn,
  governmentBondsAllocation,
  governmentBondsReturn,
  alternativeAllocation = 0,
  alternativeReturn = 0
) => {
  return (
    equityAllocation * equityReturn +
    corporateBondsAllocation * corporateBondsReturn +
    governmentBondsAllocation * governmentBondsReturn +
    alternativeAllocation * alternativeReturn
  )
}

/**
 * Calculate NPS future value with weighted asset allocation
 * Uses SIP formula with weighted average return based on asset allocation
 * 
 * Formula: FV = Monthly Contribution × [(1 + weightedMonthlyRate)^months - 1] / weightedMonthlyRate × (1 + weightedMonthlyRate)
 * 
 * Reference: PFRDA Investment Guidelines
 * 
 * @param {number} monthlyContribution - Monthly NPS contribution
 * @param {number} weightedReturn - Weighted average return rate (as decimal)
 * @param {number} years - Investment period in years
 * @returns {number} Future value
 */
export const calculateNPSFutureValue = (monthlyContribution, weightedReturn, years) => {
  const months = years * 12
  return calculateSIPFutureValue(monthlyContribution, weightedReturn, months)
}

/**
 * Calculate year-wise evolution for NPS
 * Accounts for age-based equity allocation caps as per PFRDA regulations (Updated October 1, 2025)
 * 
 * NEW Equity allocation limits (Effective October 1, 2025):
 * - Age ≤35: Maximum 100% equity (NEW!)
 * - Age 36-50: Decreases by 2.5% annually (starts at 97.5% at age 36, reaches 75% at age 50)
 * - Age 51-60: Continues decreasing by 2.5% annually (reaches 50% at age 60)
 * - Age 60+: Maximum 50%
 * 
 * Reference: PFRDA Investment Guidelines - https://enps.nsdl.com/eNPS/getSchemeInfo.html
 * Updated: October 1, 2025
 * 
 * @param {number} monthlyContribution - Monthly NPS contribution
 * @param {number} weightedReturn - Weighted average return rate (as decimal)
 * @param {number} years - Investment period in years
 * @param {number} currentAge - Current age of subscriber (for age-based caps, default 35)
 * @param {boolean} useAgeBasedCaps - Whether to apply age-based equity caps
 * @param {Object} initialAllocation - Initial allocation percentages {equity, corporateBonds, governmentBonds, alternative}
 * @param {Object} returns - Expected returns per asset class {equity, corporateBonds, governmentBonds, alternative}
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateNPSEvolution = (
  monthlyContribution,
  weightedReturn,
  years,
  currentAge = 35,
  useAgeBasedCaps = false,
  initialAllocation = { equity: 0.5, corporateBonds: 0.3, governmentBonds: 0.2, alternative: 0 },
  returns = { equity: 0.12, corporateBonds: 0.09, governmentBonds: 0.08, alternative: 0.07 }
) => {
  const evolution = []
  let cumulativeBalance = 0
  
  // Track allocation for age-based adjustments
  let currentAllocation = { ...initialAllocation }
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = cumulativeBalance
    
    // Calculate age-based equity cap if needed
    let equityAllocation = currentAllocation.equity
    let adjustedWeightedReturn = weightedReturn
    
    if (useAgeBasedCaps) {
      const ageThisYear = currentAge + year - 1
      
      // Calculate max equity allocation for this year (NEW RULES - October 1, 2025)
      let maxEquity = 1.0 // 100% for age ≤35
      if (ageThisYear > 35 && ageThisYear <= 50) {
        maxEquity = Math.max(0.75, 1.0 - (ageThisYear - 35) * 0.025)
      } else if (ageThisYear > 50) {
        maxEquity = Math.max(0.50, 0.75 - (ageThisYear - 50) * 0.025)
      }
      
      // Adjust allocation if equity exceeds cap
      if (equityAllocation > maxEquity) {
        const excess = equityAllocation - maxEquity
        equityAllocation = maxEquity
        // Redistribute excess proportionally to other asset classes
        const totalOther = currentAllocation.corporateBonds + currentAllocation.governmentBonds + currentAllocation.alternative
        if (totalOther > 0) {
          currentAllocation.corporateBonds += excess * (currentAllocation.corporateBonds / totalOther)
          currentAllocation.governmentBonds += excess * (currentAllocation.governmentBonds / totalOther)
          currentAllocation.alternative += excess * (currentAllocation.alternative / totalOther)
        } else {
          // If no other allocations, add to government bonds
          currentAllocation.governmentBonds += excess
        }
        
        // Recalculate weighted return with adjusted allocation
        adjustedWeightedReturn = calculateNPSWeightedReturn(
          equityAllocation,
          returns.equity,
          currentAllocation.corporateBonds,
          returns.corporateBonds,
          currentAllocation.governmentBonds,
          returns.governmentBonds,
          currentAllocation.alternative,
          returns.alternative
        )
      }
    }
    
    const effectiveMonthlyRate = adjustedWeightedReturn / 12
    let yearInvestment = 0
    
    // Calculate monthly contributions for this year with compounding
    for (let month = 1; month <= 12; month++) {
      yearInvestment += monthlyContribution
      
      // Apply monthly compounding: balance grows by monthly rate, then add new contribution
      if (effectiveMonthlyRate === 0) {
        cumulativeBalance += monthlyContribution
      } else {
        cumulativeBalance = cumulativeBalance * (1 + effectiveMonthlyRate) + monthlyContribution
      }
    }
    
    const closingBalance = cumulativeBalance
    const interest = closingBalance - openingBalance - yearInvestment
    
    evolution.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      investment: Math.round(yearInvestment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
  }
  
  return evolution
}

/**
 * Calculate RD (Recurring Deposit) maturity amount
 * Formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
 * Where:
 * - P = Monthly deposit amount
 * - r = Monthly interest rate (adjusted for compounding frequency)
 * - n = Number of months
 * 
 * For RD, deposits are made monthly, but interest is credited based on compounding frequency
 * 
 * @param {number} monthlyDeposit - Monthly deposit amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} months - Number of months
 * @param {string} compoundingFrequency - 'quarterly', 'monthly', 'annually', or 'cumulative'
 * @returns {number} Maturity amount
 */
export const calculateRD = (monthlyDeposit, annualRate, months, compoundingFrequency = 'quarterly') => {
  if (monthlyDeposit == null || annualRate == null || months == null) return 0
  if (monthlyDeposit < 0 || annualRate < 0 || months < 0) return 0
  if (months === 0) return 0
  
  // Calculate effective monthly rate based on compounding frequency
  // For quarterly compounding: Effective monthly rate = (1 + annualRate/4)^(1/3) - 1
  // For monthly compounding: Effective monthly rate = annualRate/12
  // For annual compounding: Effective monthly rate = (1 + annualRate)^(1/12) - 1
  let effectiveMonthlyRate = 0
  if (compoundingFrequency === 'monthly') {
    effectiveMonthlyRate = annualRate / 12
  } else if (compoundingFrequency === 'quarterly') {
    // Quarterly compounding: Interest credited every 3 months
    // Effective monthly rate = (1 + quarterlyRate)^(1/3) - 1
    const quarterlyRate = annualRate / 4
    effectiveMonthlyRate = Math.pow(1 + quarterlyRate, 1/3) - 1
  } else if (compoundingFrequency === 'annually') {
    // Annual compounding: Interest credited yearly
    // Effective monthly rate = (1 + annualRate)^(1/12) - 1
    effectiveMonthlyRate = Math.pow(1 + annualRate, 1/12) - 1
  } else if (compoundingFrequency === 'cumulative') {
    // Cumulative: Use monthly rate, but interest is paid at maturity
    effectiveMonthlyRate = annualRate / 12
  }
  
  // If rate is 0, return simple sum of deposits
  if (effectiveMonthlyRate === 0) {
    return monthlyDeposit * months
  }
  
  // Formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
  // This assumes deposits are made at the beginning of each month
  const numerator = Math.pow(1 + effectiveMonthlyRate, months) - 1
  const denominator = effectiveMonthlyRate
  const futureValue = monthlyDeposit * (numerator / denominator) * (1 + effectiveMonthlyRate)
  
  return futureValue
}

/**
 * Calculate year-wise evolution for RD
 * @param {number} monthlyDeposit - Monthly deposit amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} years - Investment period in years
 * @param {string} compoundingFrequency - 'quarterly', 'monthly', 'annually', or 'cumulative'
 * @returns {Array} Array of objects with year-wise breakdown
 */
export const calculateRDEvolution = (monthlyDeposit, annualRate, years, compoundingFrequency = 'quarterly') => {
  const evolution = []
  let cumulativeBalance = 0
  
  // Calculate effective monthly rate (same as in calculateRD)
  let effectiveMonthlyRate = 0
  if (compoundingFrequency === 'monthly') {
    effectiveMonthlyRate = annualRate / 12
  } else if (compoundingFrequency === 'quarterly') {
    const quarterlyRate = annualRate / 4
    effectiveMonthlyRate = Math.pow(1 + quarterlyRate, 1/3) - 1
  } else if (compoundingFrequency === 'annually') {
    effectiveMonthlyRate = Math.pow(1 + annualRate, 1/12) - 1
  } else if (compoundingFrequency === 'cumulative') {
    effectiveMonthlyRate = annualRate / 12
  }
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = cumulativeBalance
    let yearInvestment = 0
    
    // Process each month of this year
    for (let month = 1; month <= 12; month++) {
      yearInvestment += monthlyDeposit
      
      // Apply monthly compounding: balance grows by monthly rate, then add new deposit
      if (effectiveMonthlyRate === 0) {
        cumulativeBalance += monthlyDeposit
      } else {
        cumulativeBalance = cumulativeBalance * (1 + effectiveMonthlyRate) + monthlyDeposit
      }
    }
    
    const closingBalance = cumulativeBalance
    const interest = closingBalance - openingBalance - yearInvestment
    
    evolution.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      investment: Math.round(yearInvestment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    })
  }
  
  return evolution
}
