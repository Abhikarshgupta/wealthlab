import Joi from 'joi'

/**
 * ETF Calculator Validation Schema
 * Validates all inputs for ETF calculator
 */
export const etfSchema = Joi.object({
  investmentType: Joi.string()
    .valid('sip', 'lumpsum')
    .default('sip')
    .messages({
      'any.only': 'Investment type must be either SIP or Lumpsum',
      'any.required': 'Investment type is required'
    }),
  
  amount: Joi.number()
    .min(500)
    .required()
    .messages({
      'number.min': 'Minimum investment amount is ₹500',
      'number.base': 'Investment amount must be a number',
      'any.required': 'Investment amount is required'
    }),
  
  etfType: Joi.string()
    .valid('equity', 'debt', 'gold', 'international')
    .default('equity')
    .messages({
      'any.only': 'ETF type must be Equity, Debt, Gold, or International',
      'any.required': 'ETF type is required'
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
  
  expectedCAGR: Joi.number()
    .min(0)
    .max(100)
    .default(12)
    .messages({
      'number.min': 'Expected CAGR cannot be negative',
      'number.max': 'Expected CAGR cannot exceed 100%',
      'number.base': 'Expected CAGR must be a number'
    }),
  
  expenseRatio: Joi.number()
    .min(0)
    .max(2)
    .default(0.20)
    .messages({
      'number.min': 'Expense ratio cannot be negative',
      'number.max': 'Expense ratio cannot exceed 2%',
      'number.base': 'Expense ratio must be a number'
    }),
  
  stepUpEnabled: Joi.boolean().default(false),
  
  stepUpPercentage: Joi.when('stepUpEnabled', {
    is: true,
    then: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        'number.min': 'Step-up percentage cannot be negative',
        'number.max': 'Step-up percentage cannot exceed 100%',
        'any.required': 'Step-up percentage is required when step-up is enabled'
      }),
    otherwise: Joi.optional()
  }),
  
  adjustInflation: Joi.boolean().default(false)
})

export default etfSchema

