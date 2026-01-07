import Joi from 'joi'

/**
 * NPS Calculator Validation Schema
 * Validates all inputs for NPS calculator including asset allocation
 * 
 * Asset Allocation Rules (as per PFRDA - Updated October 1, 2025):
 * - Equity: Up to 100% for age ≤35, decreases by 2.5% annually after 35, reaches 75% at age 50, 
 *   then decreases by 2.5% annually after 50, reaching 50% at age 60+
 * - Corporate Bonds: Up to 100%
 * - Government Bonds: Up to 100%
 * - Alternative Investments: Up to 5%
 * - Total allocation must equal 100%
 * 
 * Reference: 
 * - PFRDA Guidelines: https://enps.nsdl.com/eNPS/getSchemeInfo.html
 * - New Rules Effective: October 1, 2025
 */
export const npsSchema = Joi.object({
  monthlyContribution: Joi.number()
    .min(500)
    .required()
    .messages({
      'number.min': 'Minimum contribution is ₹500',
      'number.base': 'Monthly contribution must be a number',
      'any.required': 'Monthly contribution is required'
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
  
  currentAge: Joi.number()
    .integer()
    .min(18)
    .max(59) // Capped at 59 to prevent calculator issues
    .optional()
    .default(35)
    .messages({
      'number.min': 'Minimum age is 18 years',
      'number.max': 'Maximum age is 59 years',
      'number.base': 'Age must be a number'
    }),
  
  // Asset allocation percentages (must sum to 100%)
  equityAllocation: Joi.number()
    .min(0)
    .max(100) // Updated: Maximum is now 100% for age ≤35
    .required()
    .messages({
      'number.min': 'Equity allocation cannot be negative',
      'number.max': 'Maximum equity allocation is 100% (for age ≤35)',
      'number.base': 'Equity allocation must be a number',
      'any.required': 'Equity allocation is required'
    }),
  
  corporateBondsAllocation: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.min': 'Corporate bonds allocation cannot be negative',
      'number.max': 'Maximum corporate bonds allocation is 100%',
      'number.base': 'Corporate bonds allocation must be a number',
      'any.required': 'Corporate bonds allocation is required'
    }),
  
  governmentBondsAllocation: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.min': 'Government bonds allocation cannot be negative',
      'number.max': 'Maximum government bonds allocation is 100%',
      'number.base': 'Government bonds allocation must be a number',
      'any.required': 'Government bonds allocation is required'
    }),
  
  alternativeAllocation: Joi.number()
    .min(0)
    .max(5)
    .optional()
    .default(0)
    .messages({
      'number.min': 'Alternative allocation cannot be negative',
      'number.max': 'Maximum alternative allocation is 5%',
      'number.base': 'Alternative allocation must be a number'
    }),
  
  // Expected returns per asset class
  equityReturn: Joi.number()
    .min(0.1)
    .max(100)
    .default(12)
    .messages({
      'number.min': 'Expected return must be at least 0.1%',
      'number.max': 'Expected return cannot exceed 100%',
      'number.base': 'Expected return must be a number'
    }),
  
  corporateBondsReturn: Joi.number()
    .min(0.1)
    .max(100)
    .default(9)
    .messages({
      'number.min': 'Expected return must be at least 0.1%',
      'number.max': 'Expected return cannot exceed 100%',
      'number.base': 'Expected return must be a number'
    }),
  
  governmentBondsReturn: Joi.number()
    .min(0.1)
    .max(100)
    .default(8)
    .messages({
      'number.min': 'Expected return must be at least 0.1%',
      'number.max': 'Expected return cannot exceed 100%',
      'number.base': 'Expected return must be a number'
    }),
  
  alternativeReturn: Joi.number()
    .min(0.1)
    .max(100)
    .optional()
    .default(7)
    .messages({
      'number.min': 'Expected return must be at least 0.1%',
      'number.max': 'Expected return cannot exceed 100%',
      'number.base': 'Expected return must be a number'
    }),
  
  useAgeBasedCaps: Joi.boolean().default(false),
  
  withdrawalPercentage: Joi.number()
    .valid(60, 80, 100)
    .default(80)
    .messages({
      'any.only': 'Withdrawal percentage must be 60%, 80%, or 100%',
      'number.base': 'Withdrawal percentage must be a number'
    }),
  
  adjustInflation: Joi.boolean().default(false)
}).custom((value, helpers) => {
  // Custom validation: Total allocation must equal 100%
  const total = 
    (value.equityAllocation || 0) +
    (value.corporateBondsAllocation || 0) +
    (value.governmentBondsAllocation || 0) +
    (value.alternativeAllocation || 0)
  
  if (Math.abs(total - 100) > 0.01) {
    return helpers.error('any.custom', {
      message: `Total asset allocation must equal 100%. Current total: ${total.toFixed(2)}%`
    })
  }
  
  return value
}, 'allocation validation')

export default npsSchema

