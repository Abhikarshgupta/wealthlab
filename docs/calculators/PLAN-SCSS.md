# SCSS Calculator Implementation Plan

## Component Structure

```
SCSSCalculator/
├── SCSSCalculator.jsx
├── SCSSCalculatorInfo.jsx
├── SCSSCalculatorResults.jsx
├── SCSSCalculatorTable.jsx
├── useSCSSCalculator.js
├── scssSchema.js
└── SCSSCalculator.stub.jsx
```

## Input Fields

1. **Investment Amount**
   - Range: ₹1,000 - ₹30L
   - Default: ₹10,00,000
   - Validation: Min ₹1,000, Max ₹30L

2. **Tenure**
   - Range: 1 - 5 years (extendable)
   - Default: 5 years
   - Validation: Min 1, Max 5

3. **Senior's Age**
   - Range: 60+ years
   - Default: 65 years
   - Validation: Must be >= 60 years (critical)

4. **Rate of Interest**
   - Default: 8.2% (from investmentRates.js)
   - Compounding: Quarterly
   - Interest paid: Quarterly

5. **Adjust for Inflation**
   - Type: Toggle
   - Default: Disabled

## Calculation Logic

### Formula
Quarterly interest payments:
```javascript
Quarterly Interest = Principal × (Rate / 4)
Total Interest = Quarterly Interest × Number of Quarters
Maturity Amount = Principal + Total Interest
```

## Output Values

1. **Total Invested**: Principal amount
2. **Total Interest**: Sum of all quarterly interest payments
3. **Maturity Amount**: Principal + Total Interest
4. **Quarterly Interest**: Amount per quarter
5. **Pie Chart**: Principal vs Interest

## Validation Schema

```javascript
import Joi from 'joi'

export const scssSchema = Joi.object({
  principal: Joi.number().min(1000).max(3000000).required(),
  tenure: Joi.number().integer().min(1).max(5).required(),
  seniorsAge: Joi.number().integer().min(60).required()
    .messages({
      'number.min': 'Minimum age is 60 years (55 for retired defense personnel)'
    }),
  rate: Joi.number().min(0).max(100).default(8.2),
  adjustInflation: Joi.boolean().default(false)
})
```

## Information Panel

- Current Rate: 8.2%
- Features: Exclusively for senior citizens, quarterly interest payments
- Tax Benefits: Deduction under Section 80C, interest taxable
- Eligibility: Age 60+ (55+ for retired defense)
- Lock-in: 5 years (extendable)

## Dependencies

- Quarterly interest calculation
- Age validation is critical

## Test Cases

1. ₹10L for 5 years at 8.2% quarterly
2. Age validation: < 60 years should show error
3. Max investment: ₹30L
4. Quarterly interest display
