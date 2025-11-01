/**
 * Validation Utilities
 * Joi validation helpers and common validation functions
 */

/**
 * Validate investment amount
 * @param {number} amount - Investment amount
 * @param {number} min - Minimum allowed amount
 * @param {number} max - Maximum allowed amount (null for no limit)
 * @returns {boolean} Whether amount is valid
 */
export const validateInvestmentAmount = (amount, min, max = null) => {
  if (!amount || isNaN(amount) || amount < min) return false
  if (max !== null && amount > max) return false
  return true
}

/**
 * Validate tenure
 * @param {number} years - Tenure in years
 * @param {number} min - Minimum tenure
 * @param {number} max - Maximum tenure (null for no limit)
 * @returns {boolean} Whether tenure is valid
 */
export const validateTenure = (years, min, max = null) => {
  if (!years || isNaN(years) || years < min) return false
  if (max !== null && years > max) return false
  return true
}

/**
 * Validate age
 * @param {number} age - Age in years
 * @param {number} min - Minimum age
 * @param {number} max - Maximum age (null for no limit)
 * @returns {boolean} Whether age is valid
 */
export const validateAge = (age, min, max = null) => {
  if (!age || isNaN(age) || age < min) return false
  if (max !== null && age > max) return false
  return true
}

/**
 * Validate interest rate
 * @param {number} rate - Interest rate (as decimal)
 * @param {number} min - Minimum rate
 * @param {number} max - Maximum rate
 * @returns {boolean} Whether rate is valid
 */
export const validateInterestRate = (rate, min = 0, max = 1) => {
  if (rate === null || rate === undefined || isNaN(rate)) return false
  if (rate < min || rate > max) return false
  return true
}
