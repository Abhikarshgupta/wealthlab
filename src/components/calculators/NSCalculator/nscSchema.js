import Joi from 'joi'

/**
 * NSC Calculator Validation Schema
 * Validates all inputs for NSC calculator
 */
export const nscSchema = Joi.object({
  principal: Joi.number()
    .min(1000)
    .required()
    .messages({
      'number.min': 'Minimum investment amount is ₹1,000',
      'number.base': 'Investment amount must be a number',
      'any.required': 'Investment amount is required'
    }),
  
  rate: Joi.number()
    .min(0.1)
    .max(100)
    .default(7.7)
    .messages({
      'number.min': 'Interest rate must be at least 0.1%',
      'number.max': 'Interest rate cannot exceed 100%',
      'number.base': 'Interest rate must be a number'
    })
})

export default nscSchema

