import Joi from 'joi'

/**
 * Debt Mutual Fund Calculator Validation Schema
 * Validates all inputs for Debt Mutual Fund calculator
 */
export const debtMutualFundSchema = Joi.object({
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
  
  fundType: Joi.string()
    .valid('liquid', 'shortTerm', 'longTerm', 'gilt', 'corporateBond')
    .default('shortTerm')
    .messages({
      'any.only': 'Fund type must be one of the available options',
      'any.required': 'Fund type is required'
    }),
  
  expectedReturn: Joi.number()
    .min(0)
    .max(20)
    .default(7.5)
    .messages({
      'number.min': 'Expected return cannot be negative',
      'number.max': 'Expected return cannot exceed 20%',
      'number.base': 'Expected return must be a number'
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

export default debtMutualFundSchema

