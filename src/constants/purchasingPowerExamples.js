/**
 * Purchasing Power Examples Database
 * Real-world pricing examples for different categories across Indian cities
 * Used for calculating purchasing power of corpus in future values
 */

// City tiers configuration
export const CITY_TIERS = {
  METRO: 'metro',
  TIER_1: 'tier1',
  TIER_2: 'tier2',
}

// City configuration with tier information
export const CITIES = {
  'new-delhi': {
    name: 'New Delhi',
    tier: CITY_TIERS.METRO,
  },
  mumbai: {
    name: 'Mumbai',
    tier: CITY_TIERS.METRO,
  },
  chennai: {
    name: 'Chennai',
    tier: CITY_TIERS.METRO,
  },
  kolkata: {
    name: 'Kolkata',
    tier: CITY_TIERS.METRO,
  },
  bangalore: {
    name: 'Bangalore',
    tier: CITY_TIERS.TIER_1,
  },
  pune: {
    name: 'Pune',
    tier: CITY_TIERS.TIER_1,
  },
  hyderabad: {
    name: 'Hyderabad',
    tier: CITY_TIERS.TIER_1,
  },
  ahmedabad: {
    name: 'Ahmedabad',
    tier: CITY_TIERS.TIER_1,
  },
  indore: {
    name: 'Indore',
    tier: CITY_TIERS.TIER_2,
  },
  guwahati: {
    name: 'Guwahati',
    tier: CITY_TIERS.TIER_2,
  },
}

// Pricing data by category and tier
export const PURCHASING_POWER_EXAMPLES = {
  // Education - City-specific pricing by tier
  education: {
    'school-fees-1year': {
      label: 'School Fees (1 Year)',
      [CITY_TIERS.METRO]: 500000, // ₹5L
      [CITY_TIERS.TIER_1]: 300000, // ₹3L
      [CITY_TIERS.TIER_2]: 200000, // ₹2L
      unit: 'per year',
    },
    'engineering-college-4years': {
      label: 'Engineering College (4 Years)',
      [CITY_TIERS.METRO]: 2000000, // ₹20L
      [CITY_TIERS.TIER_1]: 1500000, // ₹15L
      [CITY_TIERS.TIER_2]: 1000000, // ₹10L
      unit: 'total',
    },
    'mba-tuition': {
      label: 'MBA Tuition',
      [CITY_TIERS.METRO]: 2500000, // ₹25L
      [CITY_TIERS.TIER_1]: 2000000, // ₹20L
      [CITY_TIERS.TIER_2]: 1500000, // ₹15L
      unit: 'total',
    },
  },

  // Real Estate - City-specific pricing by tier
  realEstate: {
    '2bhk-apartment': {
      label: '2BHK Apartment',
      [CITY_TIERS.METRO]: 15000000, // ₹1.5Cr
      [CITY_TIERS.TIER_1]: 8000000, // ₹80L
      [CITY_TIERS.TIER_2]: 4000000, // ₹40L
      unit: 'per unit',
    },
    'plot-500sqyd': {
      label: 'Plot (500 sq yd)',
      [CITY_TIERS.METRO]: 10000000, // ₹1Cr
      [CITY_TIERS.TIER_1]: 5000000, // ₹50L
      [CITY_TIERS.TIER_2]: 2500000, // ₹25L
      unit: 'per plot',
    },
  },

  // Luxury Goods - Same across all cities
  luxuryGoods: {
    'bmw-m3': {
      label: 'BMW M3',
      price: 15000000, // ₹1.5Cr
      unit: 'per car',
    },
    'iphone-15-pro-max': {
      label: 'iPhone 15 Pro Max',
      price: 150000, // ₹1.5L
      unit: 'per phone',
    },
    'tv-55-oled': {
      label: '55" OLED TV',
      price: 150000, // ₹1.5L
      unit: 'per TV',
    },
  },

  // Healthcare - City-specific pricing by tier
  healthcare: {
    'health-insurance-annual': {
      label: 'Annual Health Insurance Premium',
      price: 50000, // ₹50K (same across cities)
      unit: 'per year',
    },
    'heart-surgery': {
      label: 'Heart Surgery',
      [CITY_TIERS.METRO]: 500000, // ₹5L
      [CITY_TIERS.TIER_1]: 350000, // ₹3.5L
      [CITY_TIERS.TIER_2]: 250000, // ₹2.5L
      unit: 'per surgery',
    },
    'icu-stay-1week': {
      label: 'ICU Stay (1 Week)',
      [CITY_TIERS.METRO]: 200000, // ₹2L
      [CITY_TIERS.TIER_1]: 150000, // ₹1.5L
      [CITY_TIERS.TIER_2]: 100000, // ₹1L
      unit: 'per week',
    },
  },

  // Consumer Goods - Same across all cities
  consumerGoods: {
    'monthly-grocery-family4': {
      label: 'Monthly Grocery (Family of 4)',
      price: 15000, // ₹15K
      unit: 'per month',
    },
    'petrol-per-liter': {
      label: 'Petrol (per Liter)',
      price: 100, // ₹100
      unit: 'per liter',
    },
    'gold-per-gram': {
      label: 'Gold (per Gram)',
      price: 13000, // ₹13K
      unit: 'per gram',
    },
  },
}

/**
 * Get price for a specific example in a given city
 * @param {string} category - Category name (education, realEstate, etc.)
 * @param {string} exampleKey - Example key (e.g., 'school-fees-1year')
 * @param {string} cityKey - City key (e.g., 'mumbai')
 * @returns {number|null} Current price or null if not found
 */
export const getExamplePrice = (category, exampleKey, cityKey) => {
  const categoryData = PURCHASING_POWER_EXAMPLES[category]
  if (!categoryData) return null

  const example = categoryData[exampleKey]
  if (!example) return null

  // For luxury goods and consumer goods, price is same across cities
  if (example.price !== undefined) {
    return example.price
  }

  // For city-specific pricing, get city tier
  const city = CITIES[cityKey]
  if (!city) return null

  const tier = city.tier
  return example[tier] || null
}

/**
 * Get all examples for a category
 * @param {string} category - Category name
 * @returns {Object} Examples object for the category
 */
export const getCategoryExamples = (category) => {
  return PURCHASING_POWER_EXAMPLES[category] || {}
}

/**
 * Get city information
 * @param {string} cityKey - City key
 * @returns {Object|null} City information or null if not found
 */
export const getCityInfo = (cityKey) => {
  return CITIES[cityKey] || null
}

/**
 * Get all available cities
 * @returns {Array} Array of city objects with key and info
 */
export const getAllCities = () => {
  return Object.entries(CITIES).map(([key, info]) => ({
    key,
    ...info,
  }))
}

/**
 * Get cities by tier
 * @param {string} tier - Tier name (METRO, TIER_1, TIER_2)
 * @returns {Array} Array of city objects in the specified tier
 */
export const getCitiesByTier = (tier) => {
  return Object.entries(CITIES)
    .filter(([_, info]) => info.tier === tier)
    .map(([key, info]) => ({
      key,
      ...info,
    }))
}

export default PURCHASING_POWER_EXAMPLES

