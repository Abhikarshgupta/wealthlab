import { investmentRates } from '@/constants/investmentRates'

/**
 * Default value initialization utilities for Corpus Simulator
 * Provides functions to initialize default values for instruments
 */

/**
 * Get default values for an instrument based on its type
 * @param {string} instrumentId - Instrument type ID
 * @param {Object} existingData - Existing investment data for this instrument
 * @returns {Object} - Object with default values to set
 */
export const getInstrumentDefaults = (instrumentId, existingData = {}) => {
  const defaults = {}
  
  switch (instrumentId) {
    case 'ppf':
    case 'ssy':
      if (!existingData.yearlyInvestment) defaults.yearlyInvestment = 10000
      if (!existingData.tenure) defaults.tenure = instrumentId === 'ppf' ? 15 : 21
      if (!existingData.rate) defaults.rate = investmentRates[instrumentId]?.rate || 7.1
      break
    case 'fd':
      if (!existingData.principal) defaults.principal = 100000
      // Use new format: years + months (default: 1 year 0 months)
      if (existingData.tenureYears === undefined && existingData.tenureMonths === undefined) {
        if (!existingData.tenure) {
          defaults.tenureYears = 1
          defaults.tenureMonths = 0
        }
      }
      if (!existingData.rate) defaults.rate = investmentRates.fd?.rate || 6.5
      break
    case 'sip':
      if (!existingData.monthlySIP) defaults.monthlySIP = 5000
      if (!existingData.tenure) defaults.tenure = 10
      if (!existingData.expectedReturn) defaults.expectedReturn = investmentRates.sip?.expectedReturn || 12
      break
    case 'nsc':
      if (!existingData.principal) defaults.principal = 100000
      if (!existingData.rate) defaults.rate = investmentRates.nsc?.rate || 7.7
      break
    case 'scss':
      if (!existingData.principal) defaults.principal = 3000000
      if (!existingData.tenure) defaults.tenure = 5
      if (!existingData.rate) defaults.rate = investmentRates.scss?.rate || 8.2
      break
    case 'sgb':
      if (!existingData.principal) defaults.principal = 100000
      if (!existingData.tenure) defaults.tenure = 5
      if (existingData.goldAppreciationRate === undefined || existingData.goldAppreciationRate === null) {
        defaults.goldAppreciationRate = investmentRates.sgb?.goldAppreciation || 8
      }
      break
    case 'nps':
      if (!existingData.monthlyContribution) defaults.monthlyContribution = 5000
      if (!existingData.tenure) defaults.tenure = 25
      if (!existingData.equityAllocation) defaults.equityAllocation = 50
      if (!existingData.corporateBondsAllocation) defaults.corporateBondsAllocation = 30
      if (!existingData.governmentBondsAllocation) defaults.governmentBondsAllocation = 20
      if (!existingData.alternativeAllocation) defaults.alternativeAllocation = 0
      break
    case 'equity':
    case 'elss':
      if (!existingData.investmentType) defaults.investmentType = 'sip'
      if (!existingData.amount) defaults.amount = 5000
      if (!existingData.tenure) defaults.tenure = instrumentId === 'elss' ? 3 : 10
      if (!existingData.expectedReturn && !existingData.expectedCAGR) {
        defaults.expectedReturn = instrumentId === 'elss' 
          ? investmentRates.elss?.expectedReturn || 14
          : investmentRates.equity?.defaultExpectedReturn || 12
        defaults.expectedCAGR = defaults.expectedReturn
      }
      break
  }
  
  return defaults
}

/**
 * Initialize defaults for multiple instruments
 * @param {Array<string>} instrumentIds - Array of instrument IDs
 * @param {Object} investments - Current investments object
 * @param {Function} updateInvestment - Function to update investment data
 */
export const initializeDefaultsForInstruments = (instrumentIds, investments, updateInvestment) => {
  if (!instrumentIds || instrumentIds.length === 0) return
  
  instrumentIds.forEach((instrumentId) => {
    const existingData = investments[instrumentId] || {}
    const defaults = getInstrumentDefaults(instrumentId, existingData)
    
    // Only update if we have defaults to set
    if (Object.keys(defaults).length > 0) {
      updateInvestment(instrumentId, {
        ...existingData,
        ...defaults,
      })
    }
  })
}
