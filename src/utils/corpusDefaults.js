import { investmentRates } from '@/constants/investmentRates'

/**
 * Default value initialization utilities for Corpus Simulator
 * Provides functions to initialize default values for instruments
 */

/**
 * Check if an instrument needs default initialization based on required fields
 * @param {string} instrumentId - Instrument type ID
 * @param {Object} instrumentData - Current investment data
 * @returns {boolean} - True if defaults are needed
 */
export const needsDefaultInitialization = (instrumentId, instrumentData = {}) => {
  const data = instrumentData || {}
  
  switch (instrumentId) {
    case 'ppf':
    case 'ssy':
      return !data.yearlyInvestment || !data.tenure || !data.rate
    case 'fd': {
      // FD requires: principal, tenureYears+tenureMonths (or legacy tenure), rate
      const hasTenure = (data.tenureYears !== undefined || data.tenureMonths !== undefined) || 
                        (data.tenure && data.tenureUnit)
      return !data.principal || !hasTenure || !data.rate
    }
    case 'sip':
      return !data.monthlySIP || !data.tenure || !data.tenureUnit || !data.expectedReturn
    case 'nsc':
      return !data.principal || !data.tenure || !data.rate
    case 'scss':
      return !data.principal || !data.tenure || !data.rate
    case 'sgb':
      return !data.principal || !data.tenure || 
             (data.goldAppreciationRate === undefined || data.goldAppreciationRate === null)
    case 'rd': {
      const hasRDTenure = (data.tenureYears !== undefined || data.tenureMonths !== undefined) ||
                           (data.tenure && data.tenureUnit)
      return !data.monthlyDeposit || !hasRDTenure || !data.rate
    }
    case 'nps':
      return !data.monthlyContribution || !data.tenure || 
             !data.equityAllocation || !data.corporateBondsAllocation || 
             !data.governmentBondsAllocation || data.alternativeAllocation === undefined
    case 'equity':
    case 'elss':
      return !data.investmentType || !data.amount || !data.tenure || 
             (!data.expectedReturn && !data.expectedCAGR)
    case 'debtMutualFund':
      return !data.investmentType || !data.amount || !data.tenure || 
             !data.fundType || !data.expectedReturn
    case 'etf':
      return !data.investmentType || !data.amount || !data.tenure || 
             !data.etfType || !data.expectedCAGR
    case 'reits':
      return !data.investmentAmount || !data.tenure || 
             (data.dividendYield === undefined || data.dividendYield === null) ||
             (data.capitalAppreciation === undefined || data.capitalAppreciation === null)
    case 'bonds54EC':
      return !data.investmentAmount || !data.capitalGainAmount || 
             !data.tenure || !data.rate
    default:
      return false
  }
}

/**
 * Get default values for an instrument based on its type
 * @param {string} instrumentId - Instrument type ID
 * @param {Object} existingData - Existing investment data for this instrument
 * @returns {Object} - Object with default values to set
 */
export const getInstrumentDefaults = (instrumentId, existingData = {}) => {
  const defaults = {}
  // Handle null/undefined existingData
  const data = existingData || {}
  
  switch (instrumentId) {
    case 'ppf':
    case 'ssy':
      if (!data.yearlyInvestment) defaults.yearlyInvestment = 10000
      if (!data.tenure) defaults.tenure = instrumentId === 'ppf' ? 15 : 21
      if (!data.rate) defaults.rate = investmentRates[instrumentId]?.rate || 7.1
      break
    case 'fd':
      if (!data.principal) defaults.principal = 100000
      // Use new format: years + months (default: 1 year 0 months)
      // Only set if both are undefined AND legacy tenure doesn't exist
      if (data.tenureYears === undefined && data.tenureMonths === undefined) {
        if (!data.tenure || !data.tenureUnit) {
          defaults.tenureYears = 1
          defaults.tenureMonths = 0
        }
      }
      if (!data.rate) defaults.rate = investmentRates.fd?.rate || 6.5
      break
    case 'sip':
      if (!data.monthlySIP) defaults.monthlySIP = 5000
      if (!data.tenure) defaults.tenure = 10
      if (!data.tenureUnit) defaults.tenureUnit = 'years' // Default to years for SIP
      if (!data.expectedReturn) defaults.expectedReturn = investmentRates.sip?.expectedReturn || 12
      break
    case 'nsc':
      if (!data.principal) defaults.principal = 100000
      if (!data.tenure) defaults.tenure = 5 // NSC has fixed 5-year tenure
      if (!data.rate) defaults.rate = investmentRates.nsc?.rate || 7.7
      break
    case 'scss':
      if (!data.principal) defaults.principal = 3000000
      if (!data.tenure) defaults.tenure = 5
      if (!data.rate) defaults.rate = investmentRates.scss?.rate || 8.2
      break
    case 'sgb':
      if (!data.principal) defaults.principal = 100000
      if (!data.tenure) defaults.tenure = 5
      if (data.goldAppreciationRate === undefined || data.goldAppreciationRate === null) {
        defaults.goldAppreciationRate = investmentRates.sgb?.goldAppreciation || 8
      }
      break
    case 'rd':
      if (!data.monthlyDeposit) defaults.monthlyDeposit = 5000
      // Use new format: years + months (default: 1 year 0 months)
      if (data.tenureYears === undefined && data.tenureMonths === undefined) {
        if (!data.tenure || !data.tenureUnit) {
          defaults.tenureYears = 1
          defaults.tenureMonths = 0
        }
      }
      if (!data.rate) defaults.rate = investmentRates.rd?.rate || 6.5
      break
    case 'debtMutualFund':
      if (!data.investmentType) defaults.investmentType = 'sip'
      if (!data.amount) defaults.amount = 5000
      if (!data.tenure) defaults.tenure = 5
      if (!data.fundType) defaults.fundType = 'shortTerm'
      if (!data.expectedReturn) defaults.expectedReturn = investmentRates.debtMutualFund?.shortTerm || 7.5
      break
    case 'etf':
      if (!data.investmentType) defaults.investmentType = 'sip'
      if (!data.amount) defaults.amount = 5000
      if (!data.tenure) defaults.tenure = 10
      if (!data.etfType) defaults.etfType = 'equity'
      if (!data.expectedCAGR) {
        const etfRate = investmentRates.etf?.equity || 12
        defaults.expectedCAGR = etfRate
        defaults.expectedReturn = etfRate
      }
      break
    case 'reits':
      if (!data.investmentAmount) defaults.investmentAmount = 100000
      if (!data.tenure) defaults.tenure = 10
      if (data.dividendYield === undefined || data.dividendYield === null) {
        defaults.dividendYield = investmentRates.reits?.dividendYield || 7
      }
      if (data.capitalAppreciation === undefined || data.capitalAppreciation === null) {
        defaults.capitalAppreciation = investmentRates.reits?.capitalAppreciation || 6
      }
      break
    case 'bonds54EC':
      if (!data.investmentAmount) defaults.investmentAmount = 100000
      if (!data.capitalGainAmount) defaults.capitalGainAmount = 100000
      if (!data.tenure) defaults.tenure = 5 // 54EC Bonds have fixed 5-year lock-in
      if (!data.rate) defaults.rate = investmentRates.bonds54EC?.rate || 5.75
      break
    case 'nps':
      if (!data.monthlyContribution) defaults.monthlyContribution = 5000
      if (!data.tenure) defaults.tenure = 25
      if (!data.equityAllocation) defaults.equityAllocation = 50
      if (!data.corporateBondsAllocation) defaults.corporateBondsAllocation = 30
      if (!data.governmentBondsAllocation) defaults.governmentBondsAllocation = 20
      if (!data.alternativeAllocation) defaults.alternativeAllocation = 0
      break
    case 'equity':
    case 'elss':
      if (!data.investmentType) defaults.investmentType = 'sip'
      if (!data.amount) defaults.amount = 5000
      if (!data.tenure) defaults.tenure = instrumentId === 'elss' ? 3 : 10
      if (!data.expectedReturn && !data.expectedCAGR) {
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
    
    // Check if this instrument needs initialization
    if (needsDefaultInitialization(instrumentId, existingData)) {
      const defaults = getInstrumentDefaults(instrumentId, existingData)
      
      // Only update if we have defaults to set
      if (Object.keys(defaults).length > 0) {
        updateInvestment(instrumentId, {
          ...existingData,
          ...defaults,
        })
      }
    }
  })
}
