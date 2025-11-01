import Joi from 'joi'

/**
 * PPF Calculator Validation Schema
 * Validates all inputs for PPF calculator
 */
export const ppfSchema = Joi.object({
  yearlyInvestment: Joi.number()
    .min(500)
    .max(150000)
    .required()
    .messages({
      'number.min': 'Minimum investment is ₹500',
      'number.max': 'Maximum investment is ₹1.5 lakh per year',
      'number.base': 'Yearly investment must be a number',
      'any.required': 'Yearly investment is required'
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
  
  rate: Joi.number()
    .min(0.1)
    .max(100)
    .default(7.1)
    .messages({
      'number.min': 'Interest rate must be at least 0.1%',
      'number.max': 'Interest rate cannot exceed 100%',
      'number.base': 'Interest rate must be a number'
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

export default ppfSchema

