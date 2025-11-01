import Joi from 'joi'

/**
 * FD Calculator Validation Schema
 * Validates all inputs for FD calculator
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
  
  tenure: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.min': 'Minimum tenure is 1',
      'number.base': 'Tenure must be a number',
      'any.required': 'Tenure is required'
    }),
  
  tenureUnit: Joi.string()
    .valid('years', 'months')
    .default('years'),
  
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
})

export default fdSchema

