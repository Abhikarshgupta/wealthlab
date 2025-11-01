import Joi from 'joi'

/**
 * SIP Calculator Validation Schema
 * Validates all inputs for SIP calculator
 */
export const sipSchema = Joi.object({
  monthlySIP: Joi.number()
    .min(500)
    .required()
    .messages({
      'number.min': 'Minimum SIP amount is ₹500',
      'number.base': 'Monthly SIP amount must be a number',
      'any.required': 'Monthly SIP amount is required'
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
  
  tenureUnit: Joi.string()
    .valid('years', 'months')
    .default('years'),
  
  expectedReturn: Joi.number()
    .min(0.1)
    .max(100)
    .default(12)
    .messages({
      'number.min': 'Expected return must be at least 0.1%',
      'number.max': 'Expected return cannot exceed 100%',
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

export default sipSchema

