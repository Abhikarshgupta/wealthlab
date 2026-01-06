import Joi from 'joi'

/**
 * SSY Calculator Validation Schema
 * Validates all inputs for SSY calculator including critical age validation
 */
export const ssySchema = Joi.object({
  yearlyInvestment: Joi.number()
    .min(250)
    .max(150000)
    .required()
    .messages({
      'number.min': 'Minimum investment is ₹250',
      'number.max': 'Maximum investment is ₹1.5 lakh per year',
      'number.base': 'Yearly investment must be a number',
      'any.required': 'Yearly investment is required'
    }),
  
  girlsAge: Joi.number()
    .integer()
    .min(0)
    .max(9)
    .required()
    .messages({
      'number.min': 'Girl\'s age must be 0 or above',
      'number.max': 'Girl must be below 10 years of age',
      'number.base': 'Girl\'s age must be a number',
      'any.required': 'Girl\'s age is required'
    }),
  
  startYear: Joi.number()
    .integer()
    .min(2000)
    .max(2100)
    .required()
    .messages({
      'number.min': 'Start year must be 2000 or later',
      'number.max': 'Start year cannot exceed 2100',
      'number.base': 'Start year must be a number',
      'any.required': 'Start year is required'
    }),
  
  rate: Joi.number()
    .min(0.1)
    .max(100)
    .default(8.2)
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
  })
})

export default ssySchema

