/**
 * Purchasing Power Comparison Utilities
 * Calculates future prices and affordability based on corpus and inflation
 * Uses purchasing power examples from constants/purchasingPowerExamples.js
 */

import {
  getExamplePrice,
  getCategoryExamples,
  getCityInfo,
  PURCHASING_POWER_EXAMPLES,
} from '@/constants/purchasingPowerExamples'

/**
 * Calculate future price of an item based on inflation rate
 * @param {number} currentPrice - Current price of the item
 * @param {number} inflationRate - Annual inflation rate (as decimal, e.g., 0.10 for 10%)
 * @param {number} years - Number of years into the future
 * @returns {number} Future price after inflation
 */
export const calculateFuturePrice = (currentPrice, inflationRate, years) => {
  if (!currentPrice || currentPrice <= 0 || !inflationRate || !years) {
    return currentPrice || 0
  }

  return currentPrice * Math.pow(1 + inflationRate, years)
}

/**
 * Calculate affordability metrics for a corpus amount
 * @param {number} corpus - Available corpus amount
 * @param {number} futurePrice - Future price of the item
 * @returns {Object} { canAfford, unitsAffordable, percentageAffordable }
 */
export const calculateAffordability = (corpus, futurePrice) => {
  if (!corpus || corpus <= 0 || !futurePrice || futurePrice <= 0) {
    return {
      canAfford: false,
      unitsAffordable: 0,
      percentageAffordable: 0,
    }
  }

  const unitsAffordable = Math.floor(corpus / futurePrice)
  const percentageAffordable = Math.min(100, (corpus / futurePrice) * 100)

  return {
    canAfford: unitsAffordable > 0,
    unitsAffordable,
    percentageAffordable: Math.round(percentageAffordable * 100) / 100,
  }
}

/**
 * Calculate purchasing power for a corpus across multiple categories
 * @param {number} corpus - Available corpus amount
 * @param {Object} examples - Examples object (from purchasingPowerExamples)
 * @param {number} years - Number of years into the future
 * @param {string} cityKey - City key for city-specific pricing
 * @param {Object} inflationRates - Object with category-specific inflation rates (as decimals)
 * @returns {Object} Purchasing power analysis by category
 */
export const calculatePurchasingPower = (corpus, examples, years, cityKey, inflationRates = {}) => {
  if (!corpus || corpus <= 0 || !years || !cityKey) {
    return {}
  }

  const city = getCityInfo(cityKey)
  if (!city) {
    return {}
  }

  const results = {}

  // Default inflation rates (as decimals)
  const defaultRates = {
    education: 0.10, // 10%
    healthcare: 0.08, // 8%
    realEstate: 0.07, // 7%
    luxuryGoods: 0.06, // 6%
    consumerGoods: {
      wholesale: 0.04, // 4%
      retail: 0.05, // 5%
    },
    general: 0.06, // 6%
  }

  // Merge with provided rates
  const rates = {
    education: inflationRates.education || defaultRates.education,
    healthcare: inflationRates.healthcare || defaultRates.healthcare,
    realEstate: inflationRates.realEstate || defaultRates.realEstate,
    luxuryGoods: inflationRates.luxuryGoods || defaultRates.luxuryGoods,
    consumerGoodsWholesale: inflationRates.consumerGoodsWholesale || defaultRates.consumerGoods.wholesale,
    consumerGoodsRetail: inflationRates.consumerGoodsRetail || defaultRates.consumerGoods.retail,
    general: inflationRates.general || defaultRates.general,
  }

  // Process each category
  Object.keys(examples).forEach((category) => {
    const categoryExamples = examples[category]
    if (!categoryExamples) return

    results[category] = {
      category,
      examples: [],
    }

    // Process each example in the category
    Object.keys(categoryExamples).forEach((exampleKey) => {
      const example = categoryExamples[exampleKey]
      const currentPrice = getExamplePrice(category, exampleKey, cityKey)

      if (!currentPrice) return

      // Determine inflation rate for this category
      let categoryInflationRate = rates.general

      if (category === 'education') {
        categoryInflationRate = rates.education
      } else if (category === 'healthcare') {
        categoryInflationRate = rates.healthcare
      } else if (category === 'realEstate') {
        categoryInflationRate = rates.realEstate
      } else if (category === 'luxuryGoods') {
        categoryInflationRate = rates.luxuryGoods
      } else if (category === 'consumerGoods') {
        // Use retail rate for consumer goods
        categoryInflationRate = rates.consumerGoodsRetail
      }

      // Calculate future price
      const futurePrice = calculateFuturePrice(currentPrice, categoryInflationRate, years)

      // Calculate affordability
      const affordability = calculateAffordability(corpus, futurePrice)

      results[category].examples.push({
        key: exampleKey,
        label: example.label,
        unit: example.unit,
        currentPrice: Math.round(currentPrice * 100) / 100,
        futurePrice: Math.round(futurePrice * 100) / 100,
        inflationRate: Math.round((categoryInflationRate * 100) * 10) / 10, // Convert to percentage and round to 1 decimal place
        ...affordability,
      })
    })
  })

  return results
}

/**
 * Calculate purchasing power for specific categories
 * @param {number} corpus - Available corpus amount
 * @param {Array<string>} categories - Array of category names to analyze
 * @param {number} years - Number of years into the future
 * @param {string} cityKey - City key for city-specific pricing
 * @param {Object} inflationRates - Category-specific inflation rates
 * @returns {Object} Purchasing power analysis for specified categories
 */
export const calculatePurchasingPowerForCategories = (
  corpus,
  categories,
  years,
  cityKey,
  inflationRates = {}
) => {
  const allExamples = PURCHASING_POWER_EXAMPLES
  const filteredExamples = {}

  categories.forEach((category) => {
    if (allExamples[category]) {
      filteredExamples[category] = allExamples[category]
    }
  })

  return calculatePurchasingPower(corpus, filteredExamples, years, cityKey, inflationRates)
}

/**
 * Get summary of purchasing power
 * @param {Object} purchasingPowerResults - Results from calculatePurchasingPower
 * @returns {Object} Summary statistics
 */
export const getPurchasingPowerSummary = (purchasingPowerResults) => {
  if (!purchasingPowerResults || typeof purchasingPowerResults !== 'object') {
    return {
      totalExamples: 0,
      affordableExamples: 0,
      partiallyAffordableExamples: 0,
      unaffordableExamples: 0,
    }
  }

  let totalExamples = 0
  let affordableExamples = 0
  let partiallyAffordableExamples = 0
  let unaffordableExamples = 0

  Object.keys(purchasingPowerResults).forEach((category) => {
    const categoryData = purchasingPowerResults[category]
    if (!categoryData || !categoryData.examples) return

    categoryData.examples.forEach((example) => {
      totalExamples++

      if (example.canAfford && example.unitsAffordable >= 1) {
        affordableExamples++
      } else if (example.percentageAffordable > 0) {
        partiallyAffordableExamples++
      } else {
        unaffordableExamples++
      }
    })
  })

  return {
    totalExamples,
    affordableExamples,
    partiallyAffordableExamples,
    unaffordableExamples,
    affordabilityRate: totalExamples > 0 ? (affordableExamples / totalExamples) * 100 : 0,
  }
}

export default {
  calculateFuturePrice,
  calculateAffordability,
  calculatePurchasingPower,
  calculatePurchasingPowerForCategories,
  getPurchasingPowerSummary,
}

