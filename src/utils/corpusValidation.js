import { investmentInfo } from '@/constants/investmentInfo'
import { migrateFDData, validateYearsMonths } from '@/utils/fdTenureUtils'

/**
 * Validation utilities for Corpus Simulator
 * Provides functions to validate form data at each step
 */

/**
 * Validate Step 1: Instrument Selection
 * @param {Array<string>} selectedInstruments - Array of selected instrument IDs
 * @returns {boolean} - True if valid
 */
export const isStep1Valid = (selectedInstruments) => {
  return selectedInstruments && selectedInstruments.length > 0
}

/**
 * Validate existing investment data
 * @param {Object} existing - Existing investment data
 * @param {boolean} planToInvestMore - Whether planning to invest more
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateExistingInvestment = (existing, planToInvestMore) => {
  const errors = []
  let isValid = true

  if (!existing.currentValue || existing.currentValue <= 0) {
    errors.push('Current Investment Value')
    isValid = false
  }
  if (!existing.yearsInvested || existing.yearsInvested < 0) {
    errors.push('Years Already Invested')
    isValid = false
  }
  if (!existing.currentReturnRate && !existing.rate) {
    errors.push('Current Return Rate')
    isValid = false
  }
  if (!planToInvestMore && !existing.expectedReturnRate && !existing.currentReturnRate && !existing.rate) {
    errors.push('Expected Return Rate (for projection)')
    isValid = false
  }

  return { isValid, errors }
}

/**
 * Validate future investment data for a specific instrument
 * @param {string} instrumentId - Instrument type ID
 * @param {Object} instrumentData - Instrument investment data
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateFutureInvestment = (instrumentId, instrumentData) => {
  const errors = []
  let isValid = true

  switch (instrumentId) {
    case 'ppf':
    case 'ssy':
      if (!instrumentData.yearlyInvestment || instrumentData.yearlyInvestment <= 0) {
        errors.push('Yearly Investment')
        isValid = false
      }
      if (!instrumentData.tenure || instrumentData.tenure <= 0) {
        errors.push('Tenure')
        isValid = false
      }
      if (!instrumentData.rate || instrumentData.rate <= 0) {
        errors.push('Interest Rate')
        isValid = false
      }
      break
    case 'fd': {
      if (!instrumentData.principal || instrumentData.principal <= 0) {
        errors.push('Principal Amount')
        isValid = false
      }
      // Check for new format (tenureYears + tenureMonths) or legacy format (tenure + tenureUnit)
      const migratedFD = migrateFDData(instrumentData)
      if (migratedFD.tenureYears !== undefined || migratedFD.tenureMonths !== undefined) {
        const validation = validateYearsMonths(
          migratedFD.tenureYears || 0,
          migratedFD.tenureMonths || 0
        )
        if (!validation.isValid) {
          errors.push('Tenure (Years and/or Months)')
          isValid = false
        }
      } else if (!instrumentData.tenure || instrumentData.tenure <= 0) {
        // Legacy format fallback
        errors.push('Tenure')
        isValid = false
      }
      if (!instrumentData.rate || instrumentData.rate <= 0) {
        errors.push('Interest Rate')
        isValid = false
      }
      break
    }
    case 'sip':
      if (!instrumentData.monthlySIP || instrumentData.monthlySIP <= 0) {
        errors.push('Monthly SIP Amount')
        isValid = false
      }
      if (!instrumentData.tenure || instrumentData.tenure <= 0) {
        errors.push('Tenure')
        isValid = false
      }
      if (!instrumentData.expectedReturn || instrumentData.expectedReturn <= 0) {
        errors.push('Expected Return')
        isValid = false
      }
      break
    case 'nsc':
      if (!instrumentData.principal || instrumentData.principal <= 0) {
        errors.push('Principal Amount')
        isValid = false
      }
      if (!instrumentData.rate || instrumentData.rate <= 0) {
        errors.push('Interest Rate')
        isValid = false
      }
      break
    case 'scss':
      if (!instrumentData.principal || instrumentData.principal <= 0) {
        errors.push('Principal Amount')
        isValid = false
      }
      if (!instrumentData.tenure || instrumentData.tenure <= 0) {
        errors.push('Tenure')
        isValid = false
      }
      if (!instrumentData.rate || instrumentData.rate <= 0) {
        errors.push('Interest Rate')
        isValid = false
      }
      break
    case 'sgb':
      if (!instrumentData.principal || instrumentData.principal <= 0) {
        errors.push('Investment Amount (Principal)')
        isValid = false
      }
      if (instrumentData.goldAppreciationRate === undefined || instrumentData.goldAppreciationRate === null || instrumentData.goldAppreciationRate < 0) {
        errors.push('Gold Appreciation Rate')
        isValid = false
      }
      break
    case 'nps': {
      if (!instrumentData.monthlyContribution || instrumentData.monthlyContribution <= 0) {
        errors.push('Monthly Contribution')
        isValid = false
      }
      if (!instrumentData.tenure || instrumentData.tenure <= 0) {
        errors.push('Tenure')
        isValid = false
      }
      // NPS allocations should sum to 100%
      const totalAllocation = (instrumentData.equityAllocation || 0) + 
                             (instrumentData.corporateBondsAllocation || 0) + 
                             (instrumentData.governmentBondsAllocation || 0) + 
                             (instrumentData.alternativeAllocation || 0)
      if (Math.abs(totalAllocation - 100) > 0.01) {
        errors.push('NPS Asset Allocation (must sum to 100%)')
        isValid = false
      }
      break
    }
    case 'equity':
    case 'elss': {
      const investmentType = instrumentData.investmentType || 'sip'
      if (investmentType === 'sip') {
        // SIP mode: form uses 'amount' field for SIP (not 'monthlySIP')
        if (!instrumentData.amount || instrumentData.amount <= 0) {
          errors.push('Monthly SIP Amount')
          isValid = false
        }
      } else {
        // Lumpsum mode: check amount
        if (!instrumentData.amount || instrumentData.amount <= 0) {
          errors.push('Investment Amount')
          isValid = false
        }
      }
      if (!instrumentData.tenure || instrumentData.tenure <= 0) {
        errors.push('Tenure')
        isValid = false
      }
      const expectedReturn = instrumentData.expectedReturn || instrumentData.expectedCAGR
      if (!expectedReturn || expectedReturn <= 0) {
        errors.push('Expected Return')
        isValid = false
      }
      break
    }
    default:
      // Unknown instrument type - consider invalid
      isValid = false
      errors.push('Unknown instrument type')
  }

  return { isValid, errors }
}

/**
 * Validate Step 2: Investment Details
 * @param {Array<string>} selectedInstruments - Array of selected instrument IDs
 * @param {Object} investments - Investment data by instrument ID
 * @returns {boolean} - True if valid
 */
export const isStep2Valid = (selectedInstruments, investments) => {
  if (!selectedInstruments || selectedInstruments.length === 0) return false
  
  // Check that ALL selected instruments have valid data
  for (const instrumentId of selectedInstruments) {
    const instrumentData = investments[instrumentId] || {}
    const hasExistingInvestment = instrumentData.hasExistingInvestment || false
    const planToInvestMore = instrumentData.planToInvestMore !== false
    
    let isValid = true
    
    // If has existing investment, must have valid data
    if (hasExistingInvestment) {
      const existing = instrumentData.existingInvestment || {}
      const existingValidation = validateExistingInvestment(existing, planToInvestMore)
      if (!existingValidation.isValid) {
        isValid = false
      }
    }
    
    // If planning to invest more OR no existing investment, check future investment fields
    if (planToInvestMore || !hasExistingInvestment) {
      const futureValidation = validateFutureInvestment(instrumentId, instrumentData)
      if (!futureValidation.isValid) {
        isValid = false
      }
    }
    
    // If this instrument is invalid, return false immediately
    if (!isValid) {
      return false
    }
  }
  
  // All instruments passed validation
  return true
}

/**
 * Validate Step 3: Settings & Options
 * @param {Object} settings - Settings object
 * @returns {boolean} - True if valid
 */
export const isStep3Valid = (settings) => {
  // City is required
  if (!settings.selectedCity || settings.selectedCity.trim() === '') return false
  
  // Time horizon is required
  if (!settings.timeHorizon || settings.timeHorizon <= 0) return false
  
  // General inflation rate is required
  if (!settings.generalInflationRate || settings.generalInflationRate < 0) return false
  
  return true
}

/**
 * Validate current step based on step number
 * @param {number} currentStep - Current step number (1-4)
 * @param {Array<string>} selectedInstruments - Selected instruments
 * @param {Object} investments - Investment data
 * @param {Object} settings - Settings object
 * @returns {boolean} - True if current step is valid
 */
export const isCurrentStepValid = (currentStep, selectedInstruments, investments, settings) => {
  switch (currentStep) {
    case 1:
      return isStep1Valid(selectedInstruments)
    case 2:
      return isStep2Valid(selectedInstruments, investments)
    case 3:
      return isStep3Valid(settings)
    default:
      return true
  }
}

/**
 * Get validation errors for the current step
 * @param {number} currentStep - Current step number
 * @param {Array<string>} selectedInstruments - Selected instruments
 * @param {Object} investments - Investment data
 * @param {Object} settings - Settings object
 * @returns {string[]} - Array of error messages
 */
export const getValidationErrors = (currentStep, selectedInstruments, investments, settings) => {
  const errors = []

  switch (currentStep) {
    case 1:
      if (selectedInstruments.length === 0) {
        errors.push('Please select at least one investment instrument')
      }
      break

    case 2:
      if (selectedInstruments.length === 0) {
        errors.push('Please select at least one investment instrument')
        break
      }

      for (const instrumentId of selectedInstruments) {
        const instrumentData = investments[instrumentId] || {}
        const hasExistingInvestment = instrumentData.hasExistingInvestment || false
        const planToInvestMore = instrumentData.planToInvestMore !== false
        const instrumentName = investmentInfo[instrumentId]?.name || instrumentId.toUpperCase()
        const instrumentErrors = []

        // Check existing investment fields
        if (hasExistingInvestment) {
          const existing = instrumentData.existingInvestment || {}
          const existingValidation = validateExistingInvestment(existing, planToInvestMore)
          instrumentErrors.push(...existingValidation.errors)
        }

        // Check future investment fields
        if (planToInvestMore || !hasExistingInvestment) {
          const futureValidation = validateFutureInvestment(instrumentId, instrumentData)
          instrumentErrors.push(...futureValidation.errors)
        }

        if (instrumentErrors.length > 0) {
          errors.push(`${instrumentName}: ${instrumentErrors.join(', ')}`)
        }
      }
      break

    case 3:
      if (!settings.selectedCity || settings.selectedCity.trim() === '') {
        errors.push('Select City for Purchasing Power Analysis')
      }
      if (!settings.timeHorizon || settings.timeHorizon <= 0) {
        errors.push('Time Horizon (Years until corpus withdrawal)')
      }
      if (!settings.generalInflationRate || settings.generalInflationRate < 0) {
        errors.push('General Inflation Rate')
      }
      break

    default:
      break
  }

  return errors
}

/**
 * Get validation errors for all steps up to and including the target step
 * @param {number} targetStep - The step number to check up to
 * @param {Array<string>} selectedInstruments - Selected instruments
 * @param {Object} investments - Investment data
 * @param {Object} settings - Settings object
 * @returns {string[]} - Array of error messages
 */
export const getAllStepsValidationErrors = (targetStep, selectedInstruments, investments, settings) => {
  const allErrors = []
  
  // Check Step 1
  if (targetStep >= 1) {
    if (selectedInstruments.length === 0) {
      allErrors.push('Step 1: Please select at least one investment instrument')
    }
  }
  
  // Check Step 2
  if (targetStep >= 2) {
    const step2Errors = getValidationErrors(2, selectedInstruments, investments, settings)
    if (step2Errors.length > 0) {
      allErrors.push(`Step 2: ${step2Errors.join('; ')}`)
    }
  }
  
  // Check Step 3
  if (targetStep >= 3) {
    const step3Errors = getValidationErrors(3, selectedInstruments, investments, settings)
    if (step3Errors.length > 0) {
      allErrors.push(`Step 3: ${step3Errors.join(', ')}`)
    }
  }
  
  return allErrors
}

/**
 * Check if all steps up to and including the target step are valid
 * @param {number} targetStep - The step number to check up to
 * @param {Array<string>} selectedInstruments - Selected instruments
 * @param {Object} investments - Investment data
 * @param {Object} settings - Settings object
 * @returns {boolean} - True if all steps are valid
 */
export const areAllStepsValidUpTo = (targetStep, selectedInstruments, investments, settings) => {
  // Step 1 must always be valid to proceed
  if (targetStep >= 1 && !isStep1Valid(selectedInstruments)) return false
  // Step 2 must be valid if target is step 2 or beyond
  if (targetStep >= 2 && !isStep2Valid(selectedInstruments, investments)) return false
  // Step 3 must be valid if target is step 3 or beyond
  if (targetStep >= 3 && !isStep3Valid(settings)) return false
  // Step 4 (Results) doesn't need validation, it's calculated
  return true
}

