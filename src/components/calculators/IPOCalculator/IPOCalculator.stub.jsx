/**
 * IPO Calculator Component
 * 
 * @handoff: Ready for implementation
 * 
 * Requirements:
 * - Use CalculatorLayout for responsive layout
 * - Input panel: Application amount, shares allotted, issue price, listing price/gain %, holding period, expected CAGR
 * - Results panel: Listing gains, final value, total returns, tax calculations, pie chart
 * - Info panel: IPO process explained, tax implications, risk warnings
 * - Evolution table: Year-wise breakdown showing listing gains and post-listing growth
 * 
 * Formulas: See @/utils/calculations.js - calculateCompoundInterest, calculateCAGR
 * Validation: Create ipoSchema.js using Joi
 * 
 * Reference: docs/INSTRUMENT_EXPANSION_PLAN.md
 */

import IPOCalculator from './IPOCalculator'

export default IPOCalculator

