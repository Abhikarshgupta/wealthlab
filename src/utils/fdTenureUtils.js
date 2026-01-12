/**
 * FD Tenure Utility Functions
 * Handles conversion between years+months format and legacy tenure+tenureUnit format
 */

/**
 * Convert years + months to total years (decimal)
 * @param {number} years - Number of years
 * @param {number} months - Number of months (0-11)
 * @returns {number} Total years as decimal
 */
export const convertYearsMonthsToYears = (years, months) => {
  const yearsNum = parseInt(years) || 0
  const monthsNum = parseInt(months) || 0
  return yearsNum + (monthsNum / 12)
}

/**
 * Convert years + months to total months
 * @param {number} years - Number of years
 * @param {number} months - Number of months (0-11)
 * @returns {number} Total months
 */
export const convertYearsMonthsToMonths = (years, months) => {
  const yearsNum = parseInt(years) || 0
  const monthsNum = parseInt(months) || 0
  return (yearsNum * 12) + monthsNum
}

/**
 * Normalize months (if user enters 15 months, convert to 1 year 3 months)
 * @param {number} years - Number of years
 * @param {number} months - Number of months (may exceed 11)
 * @returns {Object} Normalized { years, months } where months is 0-11
 */
export const normalizeYearsMonths = (years, months) => {
  const yearsNum = parseInt(years) || 0
  const monthsNum = parseInt(months) || 0
  const totalMonths = (yearsNum * 12) + monthsNum
  const normalizedYears = Math.floor(totalMonths / 12)
  const normalizedMonths = totalMonths % 12
  return { years: normalizedYears, months: normalizedMonths }
}

/**
 * Convert legacy format (tenure + tenureUnit) to years + months
 * @param {number} tenure - Tenure value
 * @param {string} tenureUnit - 'years' or 'months'
 * @returns {Object} { years, months }
 */
export const convertLegacyToYearsMonths = (tenure, tenureUnit) => {
  if (!tenure || tenure <= 0) {
    return { years: 0, months: 0 }
  }

  if (tenureUnit === 'months') {
    const totalMonths = Math.round(tenure)
    return {
      years: Math.floor(totalMonths / 12),
      months: totalMonths % 12
    }
  }

  // tenureUnit === 'years' or default
  const tenureNum = parseFloat(tenure)
  const years = Math.floor(tenureNum)
  const months = Math.round((tenureNum % 1) * 12)
  
  return {
    years,
    months: months >= 12 ? 0 : months // Handle edge case where modulo returns 12
  }
}

/**
 * Migrate FD data from legacy format to new years+months format
 * @param {Object} instrumentData - Investment data object
 * @returns {Object} Migrated data with tenureYears and tenureMonths
 */
export const migrateFDData = (instrumentData) => {
  if (!instrumentData) {
    return {} // Return empty object - let defaults handle initial values
  }

  // If new format exists, normalize and use it
  if (instrumentData.tenureYears !== undefined || instrumentData.tenureMonths !== undefined) {
    const normalized = normalizeYearsMonths(
      instrumentData.tenureYears || 0,
      instrumentData.tenureMonths || 0
    )
    return {
      ...instrumentData,
      tenureYears: normalized.years,
      tenureMonths: normalized.months
    }
  }

  // If legacy format exists, convert it
  if (instrumentData.tenure !== undefined && instrumentData.tenureUnit) {
    const converted = convertLegacyToYearsMonths(
      instrumentData.tenure,
      instrumentData.tenureUnit
    )
    return {
      ...instrumentData,
      tenureYears: converted.years,
      tenureMonths: converted.months,
      // Keep legacy fields for backward compatibility (can be removed later)
      tenure: instrumentData.tenure,
      tenureUnit: instrumentData.tenureUnit
    }
  }

  // Return data as-is if no tenure information exists
  // Let defaults handle setting initial values (don't set to 0,0)
  return {
    ...instrumentData
    // tenureYears and tenureMonths remain undefined - defaults will set them
  }
}

/**
 * Format tenure for display (e.g., "1 year 3 months" or "15 months" or "2 years")
 * @param {number} years - Number of years
 * @param {number} months - Number of months
 * @returns {string} Formatted string
 */
export const formatTenureDisplay = (years, months) => {
  const yearsNum = parseInt(years) || 0
  const monthsNum = parseInt(months) || 0

  if (yearsNum === 0 && monthsNum === 0) {
    return '0 months'
  }

  if (yearsNum === 0) {
    return monthsNum === 1 ? '1 month' : `${monthsNum} months`
  }

  if (monthsNum === 0) {
    return yearsNum === 1 ? '1 year' : `${yearsNum} years`
  }

  const yearsStr = yearsNum === 1 ? '1 year' : `${yearsNum} years`
  const monthsStr = monthsNum === 1 ? '1 month' : `${monthsNum} months`
  return `${yearsStr} ${monthsStr}`
}

/**
 * Validate years and months input
 * @param {number} years - Number of years
 * @param {number} months - Number of months
 * @returns {Object} { isValid: boolean, error?: string }
 */
export const validateYearsMonths = (years, months) => {
  const yearsNum = parseInt(years) || 0
  const monthsNum = parseInt(months) || 0

  if (yearsNum < 0) {
    return { isValid: false, error: 'Years cannot be negative' }
  }

  if (monthsNum < 0) {
    return { isValid: false, error: 'Months cannot be negative' }
  }

  if (monthsNum >= 12) {
    return { isValid: false, error: 'Months must be between 0 and 11' }
  }

  if (yearsNum === 0 && monthsNum === 0) {
    return { isValid: false, error: 'Please enter at least 1 month' }
  }

  // Check maximum total tenure (e.g., 10 years = 120 months)
  const totalMonths = convertYearsMonthsToMonths(yearsNum, monthsNum)
  if (totalMonths > 120) {
    return { isValid: false, error: 'Maximum tenure is 10 years (120 months)' }
  }

  return { isValid: true }
}

