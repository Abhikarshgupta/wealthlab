import Joi from 'joi'

/**
 * SCSS Calculator Validation Schema
 * Validates all inputs for SCSS calculator
 */
export const scssSchema = Joi.object({
  principal: Joi.number()
    .min(1000)
    .max(3000000)
    .required()
    .messages({
      'number.min': 'Minimum investment amount is ₹1,000',
      'number.max': 'Maximum investment amount is ₹30 lakh',
      'number.base': 'Investment amount must be a number',
      'any.required': 'Investment amount is required'
    }),
  
  tenure: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Minimum tenure is 1 year',
      'number.max': 'Maximum tenure is 5 years',
      'number.base': 'Tenure must be a number',
      'any.required': 'Tenure is required'
    }),
  
  isDefensePersonnel: Joi.boolean().default(false),
  
  seniorsAge: Joi.number()
    .integer()
    .when('isDefensePersonnel', {
      is: true,
      then: Joi.number().min(55).required(),
      otherwise: Joi.number().min(60).required()
    })
    .messages({
      'number.min': 'Minimum age is 60 years (55 years for retired defense personnel)',
      'number.base': 'Age must be a number',
      'any.required': 'Senior\'s age is required'
    }),
  
  rate: Joi.number()
    .min(0.1)
    .max(100)
    .default(8.2)
    .messages({
      'number.min': 'Rate must be at least 0.1%',
      'number.max': 'Rate cannot exceed 100%',
      'number.base': 'Rate must be a number'
    })
})

export default scssSchema
