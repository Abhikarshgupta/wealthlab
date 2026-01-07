/**
 * Corpus Simulator Storage Utility
 * Manages localStorage persistence for corpus simulator data
 */

const STORAGE_KEY = 'wealth-mngr-corpus-calculations'
const MAX_SAVED_CALCULATIONS = 20 // Limit number of saved calculations

/**
 * Get all saved corpus calculations
 * @returns {Array} Array of saved calculation objects
 */
export const getAllSavedCalculations = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    
    const data = JSON.parse(saved)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error loading saved calculations:', error)
    return []
  }
}

/**
 * Save a new corpus calculation
 * @param {Object} calculationData - Calculation data to save
 * @param {string} name - Optional name for the calculation
 * @returns {string} ID of saved calculation
 */
export const saveCalculation = (calculationData, name = null) => {
  try {
    const saved = getAllSavedCalculations()
    
    const newCalculation = {
      id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name || `Corpus Calculation ${new Date().toLocaleDateString()}`,
      timestamp: Date.now(),
      data: calculationData,
    }
    
    // Add to beginning (most recent first)
    saved.unshift(newCalculation)
    
    // Limit to MAX_SAVED_CALCULATIONS
    const limited = saved.slice(0, MAX_SAVED_CALCULATIONS)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
    return newCalculation.id
  } catch (error) {
    console.error('Error saving calculation:', error)
    throw error
  }
}

/**
 * Get a specific calculation by ID
 * @param {string} id - Calculation ID
 * @returns {Object|null} Calculation data or null if not found
 */
export const getCalculation = (id) => {
  try {
    const saved = getAllSavedCalculations()
    return saved.find((calc) => calc.id === id) || null
  } catch (error) {
    console.error('Error getting calculation:', error)
    return null
  }
}

/**
 * Update an existing calculation
 * @param {string} id - Calculation ID
 * @param {Object} updates - Updates to apply
 * @returns {boolean} Success status
 */
export const updateCalculation = (id, updates) => {
  try {
    const saved = getAllSavedCalculations()
    const index = saved.findIndex((calc) => calc.id === id)
    
    if (index === -1) return false
    
    saved[index] = {
      ...saved[index],
      ...updates,
      timestamp: Date.now(),
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    return true
  } catch (error) {
    console.error('Error updating calculation:', error)
    return false
  }
}

/**
 * Delete a calculation
 * @param {string} id - Calculation ID
 * @returns {boolean} Success status
 */
export const deleteCalculation = (id) => {
  try {
    const saved = getAllSavedCalculations()
    const filtered = saved.filter((calc) => calc.id !== id)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting calculation:', error)
    return false
  }
}

/**
 * Save current corpus calculator state
 * @param {Object} state - Current store state
 * @param {string} name - Optional name for the calculation
 * @returns {string} ID of saved calculation
 */
export const saveCurrentState = (state, name = null) => {
  const calculationData = {
    selectedInstruments: state.selectedInstruments || [],
    investments: state.investments || {},
    settings: state.settings || {},
    results: state.results || null,
    purchasingPower: state.purchasingPower || null,
    currentStep: state.currentStep || 1,
  }
  
  return saveCalculation(calculationData, name)
}

/**
 * Load a calculation into the store
 * @param {string} id - Calculation ID
 * @returns {Object|null} Calculation data ready for store restoration
 */
export const loadCalculationForStore = (id) => {
  const calculation = getCalculation(id)
  if (!calculation) return null
  
  return calculation.data
}

/**
 * Clear all saved calculations
 */
export const clearAllCalculations = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing calculations:', error)
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get storage usage info
 * @returns {Object} Storage usage information
 */
export const getStorageInfo = () => {
  try {
    const saved = getAllSavedCalculations()
    const dataSize = JSON.stringify(saved).length
    
    return {
      count: saved.length,
      maxCount: MAX_SAVED_CALCULATIONS,
      dataSize,
      dataSizeKB: (dataSize / 1024).toFixed(2),
    }
  } catch {
    return {
      count: 0,
      maxCount: MAX_SAVED_CALCULATIONS,
      dataSize: 0,
      dataSizeKB: '0',
    }
  }
}

export default {
  getAllSavedCalculations,
  saveCalculation,
  getCalculation,
  updateCalculation,
  deleteCalculation,
  saveCurrentState,
  loadCalculationForStore,
  clearAllCalculations,
  isStorageAvailable,
  getStorageInfo,
}

