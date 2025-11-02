import Joi from 'joi'
import { validateYearsMonths } from '@/utils/fdTenureUtils'

/**
 * RD Calculator Validation Schema
 * Validates all inputs for RD calculator
 * Supports tenure input in years + months format
 */
export const rdSchema = Joi.object({
  monthlyDeposit: Joi.number()
    .min(500)
    .required()
    .messages({
      'number.min': 'Minimum monthly deposit is ₹500',
      'number.base': 'Monthly deposit must be a number',
      'any.required': 'Monthly deposit is required'
    }),
  
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
  
  if (!hasNewFormat) {
    return helpers.error('any.custom', {
      message: 'Please provide tenure (Years + Months)'
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

export default rdSchema
