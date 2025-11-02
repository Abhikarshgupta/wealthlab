import Joi from 'joi'

/**
 * REITs Calculator Validation Schema
 * Validates all inputs for REITs calculator
 */
export const reitsSchema = Joi.object({
  investmentAmount: Joi.number()
    .min(1000)
    .required()
    .messages({
      'number.min': 'Minimum investment amount is ₹1,000',
      'number.base': 'Investment amount must be a number',
      'any.required': 'Investment amount is required'
    }),
  
  numberOfUnits: Joi.number()
    .min(1)
    .optional()
    .messages({
      'number.min': 'Number of units must be at least 1',
      'number.base': 'Number of units must be a number'
    }),
  
  dividendYield: Joi.number()
    .min(0)
    .max(50)
    .default(7)
    .messages({
      'number.min': 'Dividend yield cannot be negative',
      'number.max': 'Dividend yield cannot exceed 50%',
      'number.base': 'Dividend yield must be a number'
    }),
  
  capitalAppreciation: Joi.number()
    .min(0)
    .max(50)
    .default(6)
    .messages({
      'number.min': 'Capital appreciation cannot be negative',
      'number.max': 'Capital appreciation cannot exceed 50%',
      'number.base': 'Capital appreciation must be a number'
    }),
  
  tenure: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .required()
    .messages({
      'number.min': 'Minimum tenure is 1 year',
      'number.max': 'Maximum tenure is 50 years',
      'number.base': 'Tenure must be a number',
      'any.required': 'Tenure is required'
    }),
})

export default reitsSchema

