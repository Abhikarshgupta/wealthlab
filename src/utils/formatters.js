/**
 * Formatter Utilities
 * Format currency, percentages, dates, and numbers
 */

/**
 * Format currency in Indian format
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show ₹ symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) return showSymbol ? '₹0' : '0'
  
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount)
  
  return showSymbol ? `₹${formatted}` : formatted
}

/**
 * Format currency with abbreviations (L for lakhs, Cr for crores)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrencyCompact = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0'
  
  if (amount >= 10000000) {
    // Crores
    return `₹${(amount / 10000000).toFixed(2)}Cr`
  } else if (amount >= 100000) {
    // Lakhs
    return `₹${(amount / 100000).toFixed(2)}L`
  } else if (amount >= 1000) {
    // Thousands
    return `₹${(amount / 1000).toFixed(2)}K`
  }
  
  return formatCurrency(amount)
}

/**
 * Format percentage
 * @param {number} value - Percentage value (as decimal, e.g., 0.071 for 7.1%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format percentage from already percentage value
 * @param {number} value - Percentage value (e.g., 7.1 for 7.1%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentageValue = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

/**
 * Format date in DD-MM-YYYY format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  return `${day}-${month}-${year}`
}

/**
 * Format number with Indian number format
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0'
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value)
}

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string (e.g., "₹1,50,000")
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0
  const cleaned = currencyString.replace(/[₹,\s]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Parse percentage string to decimal
 * @param {string} percentageString - Percentage string (e.g., "7.1%")
 * @returns {number} Parsed decimal (e.g., 0.071)
 */
export const parsePercentage = (percentageString) => {
  if (!percentageString) return 0
  const cleaned = percentageString.replace(/[%\s]/g, '')
  return (parseFloat(cleaned) || 0) / 100
}
