import Joi from 'joi'

/**
 * SGB Calculator Validation Schema
 * Validates all inputs for SGB calculator
 */
export const sgbSchema = Joi.object({
  goldAmount: Joi.number()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'number.min': 'Minimum gold amount is 1 gram',
      'number.max': 'Maximum gold amount is 1000 grams',
      'number.base': 'Gold amount must be a number',
      'any.required': 'Gold amount is required'
    }),
  
  tenure: Joi.number()
    .integer()
    .valid(5, 8)
    .default(8)
    .messages({
      'any.only': 'Tenure must be either 5 or 8 years',
      'number.base': 'Tenure must be a number',
      'any.required': 'Tenure is required'
    }),
  
  goldAppreciationRate: Joi.number()
    .min(0.1)
    .max(100)
    .default(8)
    .messages({
      'number.min': 'Gold appreciation rate must be at least 0.1%',
      'number.max': 'Gold appreciation rate cannot exceed 100%',
      'number.base': 'Gold appreciation rate must be a number'
    })
})

export default sgbSchema

