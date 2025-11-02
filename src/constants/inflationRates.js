/**
 * Inflation Rates Constants
 * Default category-specific inflation rates for purchasing power calculations
 * Based on RBI and sector-specific data
 */

/**
 * Default inflation rates by category (as percentages)
 */
export const DEFAULT_INFLATION_RATES = {
  education: 10, // 10% - Education costs typically outpace general inflation
  healthcare: 8, // 8% - Healthcare costs rise faster than general inflation
  realEstate: 7, // 7% - Real estate appreciation varies by location
  luxuryGoods: 6, // 6% - Luxury goods inflation
  consumerGoodsWholesale: 4, // 4% - Wholesale price index
  consumerGoodsRetail: 5, // 5% - Retail price index
  general: 6, // 6% - General inflation rate (RBI target)
}

/**
 * Get default inflation rate for a category
 * @param {string} category - Category name
 * @returns {number} Default inflation rate as percentage
 */
export const getDefaultInflationRate = (category) => {
  return DEFAULT_INFLATION_RATES[category] || DEFAULT_INFLATION_RATES.general
}

/**
 * Get all default inflation rates
 * @returns {Object} Object with all default inflation rates
 */
export const getAllDefaultInflationRates = () => {
  return { ...DEFAULT_INFLATION_RATES }
}

/**
 * Set custom inflation rate for a category
 * Note: This function returns a new object with updated rates
 * It doesn't mutate the original DEFAULT_INFLATION_RATES
 * @param {Object} currentRates - Current inflation rates object
 * @param {string} category - Category name
 * @param {number} rate - New inflation rate as percentage
 * @returns {Object} Updated inflation rates object
 */
export const setInflationRate = (currentRates, category, rate) => {
  return {
    ...currentRates,
    [category]: rate,
  }
}

/**
 * Validate inflation rate value
 * @param {number} rate - Inflation rate to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidInflationRate = (rate) => {
  return typeof rate === 'number' && rate >= 0 && rate <= 100
}

/**
 * Get inflation rate as decimal (for calculations)
 * @param {number} ratePercentage - Rate as percentage (e.g., 6 for 6%)
 * @returns {number} Rate as decimal (e.g., 0.06 for 6%)
 */
export const getInflationRateAsDecimal = (ratePercentage) => {
  return ratePercentage / 100
}

/**
 * Get inflation rate as percentage (for display)
 * @param {number} rateDecimal - Rate as decimal (e.g., 0.06 for 6%)
 * @returns {number} Rate as percentage (e.g., 6 for 6%)
 */
export const getInflationRateAsPercentage = (rateDecimal) => {
  return rateDecimal * 100
}

export default DEFAULT_INFLATION_RATES

