import Joi from 'joi'

/**
 * IPO/FPO Calculator Validation Schema
 * Validates all inputs for IPO/FPO calculator
 */
export const ipoSchema = Joi.object({
  applicationAmount: Joi.number()
    .min(1000)
    .required()
    .messages({
      'number.min': 'Minimum application amount is ₹1,000',
      'number.base': 'Application amount must be a number',
      'any.required': 'Application amount is required'
    }),
  
  sharesAllotted: Joi.number()
    .min(1)
    .integer()
    .required()
    .messages({
      'number.min': 'Shares allotted must be at least 1',
      'number.base': 'Shares allotted must be a number',
      'number.integer': 'Shares allotted must be a whole number',
      'any.required': 'Shares allotted is required'
    }),
  
  issuePrice: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Issue price must be at least ₹1',
      'number.base': 'Issue price must be a number',
      'any.required': 'Issue price is required'
    }),
  
  inputMode: Joi.string()
    .valid('listingPrice', 'listingGainPercent')
    .default('listingPrice')
    .messages({
      'any.only': 'Input mode must be either listing price or listing gain percentage'
    }),
  
  listingPrice: Joi.when('inputMode', {
    is: 'listingPrice',
    then: Joi.number()
      .min(1)
      .required()
      .messages({
        'number.min': 'Listing price must be at least ₹1',
        'number.base': 'Listing price must be a number',
        'any.required': 'Listing price is required when input mode is listing price'
      }),
    otherwise: Joi.optional()
  }),
  
  listingGainPercent: Joi.when('inputMode', {
    is: 'listingGainPercent',
    then: Joi.number()
      .min(-100)
      .max(1000)
      .required()
      .messages({
        'number.min': 'Listing gain percentage cannot be less than -100%',
        'number.max': 'Listing gain percentage cannot exceed 1000%',
        'any.required': 'Listing gain percentage is required when input mode is listing gain percentage'
      }),
    otherwise: Joi.optional()
  }),
  
  holdingPeriod: Joi.number()
    .min(0)
    .max(30)
    .required()
    .messages({
      'number.min': 'Holding period cannot be negative',
      'number.max': 'Maximum holding period is 30 years',
      'number.base': 'Holding period must be a number',
      'any.required': 'Holding period is required'
    }),
  
  expectedCAGR: Joi.when('holdingPeriod', {
    is: Joi.number().greater(0),
    then: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        'number.min': 'Expected CAGR cannot be negative',
        'number.max': 'Expected CAGR cannot exceed 100%',
        'number.base': 'Expected CAGR must be a number',
        'any.required': 'Expected CAGR is required when holding period is greater than 0'
      }),
    otherwise: Joi.optional()
  })
})

export default ipoSchema

