import Joi from 'joi'

/**
 * ELSS Calculator Validation Schema
 * Validates all inputs for ELSS calculator
 * Includes minimum 3-year tenure requirement (lock-in period)
 */
export const elssSchema = Joi.object({
  investmentType: Joi.string()
    .valid('sip', 'lumpsum')
    .default('sip')
    .messages({
      'any.only': 'Investment type must be SIP or Lumpsum',
      'string.base': 'Investment type must be a string'
    }),
  
  amount: Joi.number()
    .min(500)
    .required()
    .messages({
      'number.min': 'Minimum investment amount is ₹500',
      'number.base': 'Investment amount must be a number',
      'any.required': 'Investment amount is required'
    }),
  
  tenure: Joi.number()
    .integer()
    .min(3)
    .max(50)
    .required()
    .messages({
      'number.min': 'Minimum tenure is 3 years (ELSS lock-in requirement)',
      'number.max': 'Maximum tenure is 50 years',
      'number.base': 'Tenure must be a number',
      'any.required': 'Tenure is required'
    }),
  
  expectedReturn: Joi.number()
    .min(0.1)
    .max(100)
    .default(14)
    .messages({
      'number.min': 'Expected return must be at least 0.1%',
      'number.max': 'Expected return cannot exceed 100%',
      'number.base': 'Expected return must be a number'
    }),
  
  adjustInflation: Joi.boolean().default(false)
})

export default elssSchema

