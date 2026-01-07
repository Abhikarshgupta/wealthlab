/**
 * Cost Inflation Index (CII) Calculations
 * Based on CBDT published CII values
 * Used for indexation benefit in debt mutual funds and other instruments
 */

/**
 * CII values published by CBDT
 * Base year: 2001-02 = 100
 * Updated annually via CBDT notification
 */
const CII_VALUES = {
  2001: 100, // Base year
  2002: 105,
  2003: 109,
  2004: 113,
  2005: 117,
  2006: 122,
  2007: 129,
  2008: 137,
  2009: 148,
  2010: 167,
  2011: 184,
  2012: 200,
  2013: 220,
  2014: 240,
  2015: 254,
  2016: 264,
  2017: 272,
  2018: 280,
  2019: 289,
  2020: 301,
  2021: 317,
  2022: 331,
  2023: 348,
  2024: 363, // Estimated for FY 2024-25
  2025: 378, // Projected for FY 2025-26 (~4% increase)
  2026: 393, // Projected for FY 2026-27
}

/**
 * Get CII value for a given financial year
 * @param {number} financialYear - Financial year (e.g., 2024 for FY 2024-25)
 * @returns {number} CII value for that year
 */
export const getCIIForYear = (financialYear) => {
  if (CII_VALUES[financialYear]) {
    return CII_VALUES[financialYear]
  }

  // For future years, project based on ~4% annual increase
  const lastKnownYear = Math.max(...Object.keys(CII_VALUES).map(Number))
  const lastKnownCII = CII_VALUES[lastKnownYear]
  const yearsDiff = financialYear - lastKnownYear
  const projectedCII = lastKnownCII * Math.pow(1.04, yearsDiff)

  return Math.round(projectedCII)
}

/**
 * Get financial year from calendar year
 * @param {number} calendarYear - Calendar year
 * @returns {number} Financial year (e.g., 2024 for calendar year 2024 = FY 2024-25)
 */
export const getFinancialYear = (calendarYear) => {
  // Financial year runs from April to March
  // Calendar year 2024 = FY 2024-25
  return calendarYear
}

/**
 * Calculate indexed cost of acquisition
 * @param {number} originalCost - Original purchase cost
 * @param {number} purchaseYear - Purchase financial year
 * @param {number} saleYear - Sale financial year
 * @returns {Object} Indexation calculation details
 */
export const calculateIndexedCost = (originalCost, purchaseYear, saleYear) => {
  const purchaseCII = getCIIForYear(purchaseYear)
  const saleCII = getCIIForYear(saleYear)

  const indexationFactor = saleCII / purchaseCII
  const indexedCost = originalCost * indexationFactor

  return {
    purchaseCII,
    saleCII,
    indexationFactor: Math.round(indexationFactor * 10000) / 10000, // Round to 4 decimals
    indexedCost: Math.round(indexedCost * 100) / 100,
  }
}

/**
 * Calculate tax with indexation for debt mutual funds
 * @param {number} principal - Principal amount invested
 * @param {number} maturityAmount - Maturity/sale amount
 * @param {number} purchaseYear - Purchase financial year
 * @param {number} saleYear - Sale financial year
 * @returns {Object} Tax calculation with indexation details
 */
export const calculateTaxWithIndexation = (principal, maturityAmount, purchaseYear, saleYear) => {
  const indexation = calculateIndexedCost(principal, purchaseYear, saleYear)
  const taxableGains = Math.max(0, maturityAmount - indexation.indexedCost)
  const taxAmount = taxableGains * 0.20 // 20% LTCG tax with indexation

  // Calculate savings compared to flat 20% tax (without indexation)
  const gainsWithoutIndexation = Math.max(0, maturityAmount - principal)
  const taxWithoutIndexation = gainsWithoutIndexation * 0.20
  const savings = taxWithoutIndexation - taxAmount

  return {
    ...indexation,
    principal,
    maturityAmount,
    taxableGains: Math.round(taxableGains * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    savings: Math.round(savings * 100) / 100,
    taxWithoutIndexation: Math.round(taxWithoutIndexation * 100) / 100,
  }
}

/**
 * Get current financial year
 * @returns {number} Current financial year
 */
export const getCurrentFinancialYear = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 0-indexed, so +1

  // Financial year runs from April (month 4) to March
  // If month >= 4, we're in FY YYYY-YY+1
  // If month < 4, we're in FY YYYY-1-YY
  return month >= 4 ? year : year - 1
}

export default {
  getCIIForYear,
  getFinancialYear,
  calculateIndexedCost,
  calculateTaxWithIndexation,
  getCurrentFinancialYear,
}

