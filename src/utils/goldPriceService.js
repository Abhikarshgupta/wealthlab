/**
 * Gold Price Service
 * Fetches real-time gold price from GoldAPI.io with fallback to constant value
 * Supports rate limiting: once per user per 24 hours via localStorage
 */

// Fallback gold price per gram (in INR) - updated periodically
// This is used when API fails or as initial value
// Update this value manually if API consistently fails
export const FALLBACK_GOLD_PRICE_PER_GRAM = 6500

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000

// Rate limit duration: 24 hours in milliseconds
const RATE_LIMIT_DURATION = 24 * 60 * 60 * 1000

// localStorage key for tracking API usage
const STORAGE_KEY_API_USAGE = 'goldapi_last_used'
const STORAGE_KEY_API_PRICE = 'goldapi_last_price'

// Cache storage
let cachedPrice = null
let cacheTimestamp = null
let cachedIsRealTime = false // Track if cached price is from API or fallback

/**
 * Get API key from environment variable
 * @returns {string|null} API key or null if not set
 */
const getApiKey = () => {
  // Vite uses VITE_ prefix for environment variables
  return import.meta.env.VITE_GOLDAPI_KEY || null
}

/**
 * Check if API can be called (rate limit check)
 * @returns {boolean} True if API can be called (within 24 hours), false otherwise
 */
const canCallAPI = () => {
  try {
    const lastUsed = localStorage.getItem(STORAGE_KEY_API_USAGE)
    if (!lastUsed) {
      return true // Never used before, allow call
    }

    const lastUsedTime = parseInt(lastUsed, 10)
    const now = Date.now()
    const timeSinceLastCall = now - lastUsedTime

    // Allow if 24 hours have passed
    return timeSinceLastCall >= RATE_LIMIT_DURATION
  } catch (error) {
    console.warn('Error checking rate limit:', error)
    return true // Allow call if localStorage fails
  }
}

/**
 * Mark API as used (store timestamp in localStorage)
 */
const markAPIAsUsed = () => {
  try {
    localStorage.setItem(STORAGE_KEY_API_USAGE, Date.now().toString())
  } catch (error) {
    console.warn('Error saving API usage timestamp:', error)
  }
}

/**
 * Get last API price from localStorage (if available)
 * @returns {Object|null} {price: number, timestamp: number} or null
 */
const getLastAPIPrice = () => {
  try {
    const lastPriceData = localStorage.getItem(STORAGE_KEY_API_PRICE)
    if (!lastPriceData) {
      return null
    }

    const parsed = JSON.parse(lastPriceData)
    const timeSinceLastCall = Date.now() - parsed.timestamp

    // Return if within cache duration (1 hour)
    if (timeSinceLastCall < CACHE_DURATION) {
      return parsed
    }

    return null
  } catch (error) {
    console.warn('Error reading last API price:', error)
    return null
  }
}

/**
 * Store API price in localStorage
 * @param {number} price - Price to store
 */
const storeAPIPrice = (price) => {
  try {
    localStorage.setItem(STORAGE_KEY_API_PRICE, JSON.stringify({
      price,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.warn('Error storing API price:', error)
  }
}

/**
 * Fetch gold price from GoldAPI.io
 * @param {string} symbol - Metal symbol (XAU for gold, XAG for silver, etc.)
 * @param {string} currency - Currency code (USD, INR, etc.)
 * @returns {Promise<number|null>} Gold price per gram in specified currency, or null if API fails
 */
const fetchGoldPriceFromAPI = async (symbol = 'XAU', currency = 'USD') => {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    console.warn('GoldAPI.io API key not found. Set VITE_GOLDAPI_KEY in .env file')
    return null
  }

  // Check rate limit
  if (!canCallAPI()) {
    console.info('API rate limit: Already used within last 24 hours. Using cached/stored price.')
    const lastPrice = getLastAPIPrice()
    if (lastPrice) {
      return lastPrice.price
    }
    return null
  }

  try {
    // GoldAPI.io endpoint format: https://www.goldapi.io/api/:symbol/:currency
    const url = `https://www.goldapi.io/api/${symbol}/${currency}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-access-token': apiKey,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`GoldAPI.io request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // GoldAPI.io returns price per troy ounce
    // Check if price_gram fields are available (mentioned in docs but may vary)
    let pricePerOunce = null
    
    if (data.price) {
      pricePerOunce = data.price
    } else if (data.price_gram_24k) {
      // If API provides gram price directly
      return data.price_gram_24k
    } else {
      throw new Error('Invalid gold price data format')
    }
    
    if (!pricePerOunce || pricePerOunce <= 0) {
      throw new Error('Invalid gold price value')
    }

    // Convert troy ounce to gram
    // 1 troy ounce = 31.1035 grams
    const pricePerGram = pricePerOunce / 31.1035

    // Mark API as used
    markAPIAsUsed()
    
    // Store price in localStorage
    storeAPIPrice(pricePerGram)

    return pricePerGram
  } catch (error) {
    console.warn('Gold price API failed:', error)
    return null
  }
}

/**
 * Convert USD price to INR
 * @param {number} usdPrice - Price in USD
 * @returns {Promise<number|null>} Price in INR or null if conversion fails
 */
const convertUSDToINR = async (usdPrice) => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Exchange rate API failed')
    }

    const data = await response.json()
    const usdToInrRate = data.rates?.INR

    if (!usdToInrRate) {
      throw new Error('USD to INR rate not found')
    }

    return usdPrice * usdToInrRate
  } catch (error) {
    console.warn('Failed to convert USD to INR:', error)
    return null
  }
}

/**
 * Get current gold price per gram in INR
 * Uses cached value if available and fresh, otherwise fetches from API
 * Falls back to constant value if API fails
 * 
 * @param {boolean} forceRefresh - Force refresh even if cache is valid (still respects rate limit)
 * @returns {Promise<{price: number, isRealTime: boolean}>} Gold price per gram in INR and whether it's real-time
 */
export const getGoldPricePerGram = async (forceRefresh = false) => {
  // Return cached value if it's still valid and not forcing refresh
  if (!forceRefresh && cachedPrice && cacheTimestamp) {
    const cacheAge = Date.now() - cacheTimestamp
    if (cacheAge < CACHE_DURATION) {
      // Return cached price with its real-time status
      return { price: cachedPrice, isRealTime: cachedIsRealTime }
    }
  }

  // Check localStorage for recent API price (within cache duration)
  if (!forceRefresh) {
    const lastPrice = getLastAPIPrice()
    if (lastPrice) {
      cachedPrice = lastPrice.price
      cacheTimestamp = lastPrice.timestamp
      cachedIsRealTime = true
      return { price: cachedPrice, isRealTime: true }
    }
  }

  // Try fetching from API
  let price = await fetchGoldPriceFromAPI('XAU', 'USD')
  let isRealTime = false
  
  if (price && price > 0) {
    // Convert USD to INR
    const inrPrice = await convertUSDToINR(price)
    if (inrPrice && inrPrice > 0) {
      price = inrPrice
      isRealTime = true
      console.info('Gold price fetched successfully from API:', price)
    } else {
      // Conversion failed, use fallback
      price = FALLBACK_GOLD_PRICE_PER_GRAM
      isRealTime = false
      console.warn('USD to INR conversion failed, using fallback')
    }
  } else {
    // API failed, use fallback
    console.info('Using fallback gold price:', FALLBACK_GOLD_PRICE_PER_GRAM)
    price = FALLBACK_GOLD_PRICE_PER_GRAM
    isRealTime = false
  }

  // Update cache
  cachedPrice = price
  cacheTimestamp = Date.now()
  cachedIsRealTime = isRealTime

  return { price, isRealTime }
}

/**
 * Get metal price (generic function for other commodities)
 * @param {string} symbol - Metal symbol (XAU for gold, XAG for silver, XPT for platinum, XPD for palladium)
 * @param {string} currency - Currency code (USD, INR, etc.)
 * @returns {Promise<{price: number, isRealTime: boolean}>} Price per gram and whether it's real-time
 */
export const getMetalPricePerGram = async (symbol = 'XAU', currency = 'USD') => {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    console.warn('GoldAPI.io API key not found')
    return { price: null, isRealTime: false }
  }

  // Check rate limit
  if (!canCallAPI()) {
    console.info('API rate limit: Already used within last 24 hours')
    return { price: null, isRealTime: false }
  }

  try {
    const pricePerGram = await fetchGoldPriceFromAPI(symbol, currency)
    
    if (pricePerGram && pricePerGram > 0) {
      // If currency is not USD, convert if needed
      let finalPrice = pricePerGram
      if (currency !== 'USD' && currency !== 'INR') {
        // For other currencies, might need conversion
        // For now, return as-is
        finalPrice = pricePerGram
      }
      
      return { price: finalPrice, isRealTime: true }
    }
    
    return { price: null, isRealTime: false }
  } catch (error) {
    console.warn(`Failed to fetch ${symbol} price:`, error)
    return { price: null, isRealTime: false }
  }
}

/**
 * Get cached gold price (synchronous, returns cached value or fallback)
 * Use this for immediate access without async operations
 * 
 * @returns {number} Gold price per gram in INR
 */
export const getCachedGoldPrice = () => {
  return cachedPrice || FALLBACK_GOLD_PRICE_PER_GRAM
}

/**
 * Update fallback gold price with today's value
 * Call this when API fails to update the fallback constant
 * 
 * @param {number} newPrice - New fallback gold price per gram
 */
export const updateFallbackGoldPrice = (newPrice) => {
  if (newPrice > 0 && newPrice !== FALLBACK_GOLD_PRICE_PER_GRAM) {
    console.info('Fallback gold price updated to:', newPrice)
    // Note: This updates the cache, but the constant FALLBACK_GOLD_PRICE_PER_GRAM
    // should be updated manually in the source file for persistence
    cachedPrice = newPrice
    cacheTimestamp = Date.now()
  }
}

/**
 * Initialize gold price
 * Fetches price on initialization and updates fallback if needed
 */
export const initializeGoldPrice = async () => {
  try {
    const result = await getGoldPricePerGram(true) // Force refresh on init
    
    // If API succeeded and price is different from fallback, log it
    if (result.isRealTime && result.price !== FALLBACK_GOLD_PRICE_PER_GRAM) {
      console.info('Gold price fetched successfully:', result.price)
    }
  } catch (error) {
    console.warn('Failed to initialize gold price:', error)
  }
}

/**
 * Check if API can be called and get time until next allowed call
 * @returns {Object} {canCall: boolean, timeUntilNextCall: number|null} Time in milliseconds
 */
export const getRateLimitStatus = () => {
  try {
    const lastUsed = localStorage.getItem(STORAGE_KEY_API_USAGE)
    if (!lastUsed) {
      return { canCall: true, timeUntilNextCall: null }
    }

    const lastUsedTime = parseInt(lastUsed, 10)
    const now = Date.now()
    const timeSinceLastCall = now - lastUsedTime
    const timeUntilNextCall = RATE_LIMIT_DURATION - timeSinceLastCall

    return {
      canCall: timeSinceLastCall >= RATE_LIMIT_DURATION,
      timeUntilNextCall: timeUntilNextCall > 0 ? timeUntilNextCall : null
    }
  } catch (error) {
    console.warn('Error checking rate limit status:', error)
    return { canCall: true, timeUntilNextCall: null }
  }
}

export default {
  getGoldPricePerGram,
  getMetalPricePerGram,
  getCachedGoldPrice,
  updateFallbackGoldPrice,
  initializeGoldPrice,
  getRateLimitStatus,
  FALLBACK_GOLD_PRICE_PER_GRAM
}

