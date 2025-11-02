import Joi from 'joi'
import { validateYearsMonths } from '@/utils/fdTenureUtils'

/**
 * FD Calculator Validation Schema
 * Validates all inputs for FD calculator
 * Supports both new format (tenureYears + tenureMonths) and legacy format (tenure + tenureUnit)
 */
export const fdSchema = Joi.object({
  principal: Joi.number()
    .min(1000)
    .required()
    .messages({
      'number.min': 'Minimum principal amount is ₹1,000',
      'number.base': 'Principal amount must be a number',
      'any.required': 'Principal amount is required'
    }),
  
  // New format: years + months
  tenureYears: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .optional()
    .messages({
      'number.min': 'Years cannot be negative',
      'number.max': 'Maximum tenure is 10 years',
      'number.base': 'Years must be a number',
      'number.integer': 'Years must be a whole number'
    }),
  
  tenureMonths: Joi.number()
    .integer()
    .min(0)
    .max(11)
    .optional()
    .messages({
      'number.min': 'Months cannot be negative',
      'number.max': 'Months must be between 0 and 11',
      'number.base': 'Months must be a number',
      'number.integer': 'Months must be a whole number'
    }),
  
  // Legacy format: tenure + tenureUnit (for backward compatibility)
  tenure: Joi.number()
    .min(1)
    .optional()
    .when('tenureYears', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required()
    })
    .messages({
      'number.min': 'Minimum tenure is 1',
      'number.base': 'Tenure must be a number',
      'any.required': 'Tenure is required (or use Years + Months)'
    }),
  
  tenureUnit: Joi.string()
    .valid('years', 'months')
    .optional()
    .when('tenure', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.optional()
    }),
  
  compoundingFrequency: Joi.string()
    .valid('quarterly', 'monthly', 'annually', 'cumulative')
    .default('quarterly'),
  
  rate: Joi.number()
    .min(0.1)
    .max(100)
    .default(6.5)
    .messages({
      'number.min': 'Interest rate must be at least 0.1%',
      'number.max': 'Interest rate cannot exceed 100%',
      'number.base': 'Interest rate must be a number'
    }),
  
  adjustInflation: Joi.boolean().default(false)
}).custom((value, helpers) => {
  // Custom validation: Ensure at least one tenure format is provided and valid
  const hasNewFormat = value.tenureYears !== undefined || value.tenureMonths !== undefined
  const hasLegacyFormat = value.tenure !== undefined && value.tenureUnit
  
  if (!hasNewFormat && !hasLegacyFormat) {
    return helpers.error('any.custom', {
      message: 'Please provide tenure (either Years + Months or Tenure + Unit)'
    })
  }
  
  // Validate new format if provided
  if (hasNewFormat) {
    const validation = validateYearsMonths(
      value.tenureYears || 0,
      value.tenureMonths || 0
    )
    if (!validation.isValid) {
      return helpers.error('any.custom', {
        message: validation.error
      })
    }
  }
  
  return value
})

export default fdSchema

