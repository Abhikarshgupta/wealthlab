import Joi from 'joi'

/**
 * 54EC Bonds Calculator Validation Schema
 * Validates all inputs for 54EC Bonds calculator
 */
export const bonds54ECSchema = Joi.object({
  capitalGainAmount: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Capital gain amount must be 0 or greater',
      'number.base': 'Capital gain amount must be a number',
      'any.required': 'Capital gain amount is required'
    }),
  
  investmentAmount: Joi.number()
    .min(1000)
    .max(50000000) // ₹50L per financial year limit
    .required()
    .messages({
      'number.min': 'Minimum investment amount is ₹1,000',
      'number.max': 'Maximum investment amount is ₹50 lakh per financial year',
      'number.base': 'Investment amount must be a number',
      'any.required': 'Investment amount is required'
    }),
  
  rate: Joi.number()
    .min(0.1)
    .max(100)
    .default(5.75)
    .messages({
      'number.min': 'Interest rate must be at least 0.1%',
      'number.max': 'Interest rate cannot exceed 100%',
      'number.base': 'Interest rate must be a number'
    })
})
  .custom((value, helpers) => {
    // Custom validation: investment amount cannot exceed capital gain amount
    if (value.investmentAmount > value.capitalGainAmount) {
      return helpers.error('custom.investmentExceedsCapitalGain', {
        message: 'Investment amount cannot exceed capital gain amount'
      })
    }
    return value
  })
  .messages({
    'custom.investmentExceedsCapitalGain': 'Investment amount cannot exceed capital gain amount'
  })

export default bonds54ECSchema

