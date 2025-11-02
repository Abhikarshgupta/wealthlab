import Joi from 'joi'

/**
 * POMIS Calculator Validation Schema
 * Validates all inputs for POMIS calculator
 */
export const pomisSchema = Joi.object({
  principal: Joi.number()
    .min(1000)
    .max(1500000)
    .required()
    .messages({
      'number.min': 'Minimum investment amount is ₹1,000',
      'number.max': 'Maximum investment amount is ₹15 lakh (₹9 lakh for single account)',
      'number.base': 'Investment amount must be a number',
      'any.required': 'Investment amount is required'
    }),
  
  isJointAccount: Joi.boolean().default(false),
  
  rate: Joi.number()
    .min(0.1)
    .max(100)
    .default(7.4)
    .messages({
      'number.min': 'Rate must be at least 0.1%',
      'number.max': 'Rate cannot exceed 100%',
      'number.base': 'Rate must be a number'
    }),
  
  adjustInflation: Joi.boolean().default(false)
})

export default pomisSchema

