# SSY Calculator Implementation Plan

## Component Structure

```
SSYCalculator/
├── SSYCalculator.jsx
├── SSYCalculatorInfo.jsx
├── SSYCalculatorResults.jsx
├── SSYCalculatorTable.jsx
├── useSSYCalculator.js
├── ssySchema.js
└── SSYCalculator.stub.jsx
```

## Input Fields

1. **Yearly Investment**
   - Range: ₹250 - ₹1.5L
   - Default: ₹10,000
   - Validation: Min ₹250, Max ₹1.5L

2. **Girl's Age**
   - Range: 0 - 9 years
   - Default: 5 years
   - Validation: Must be < 10 years (critical)

3. **Start Period (Year)**
   - Default: Current year
   - Validation: Valid year

4. **Rate of Interest**
   - Default: 8.2% (from investmentRates.js)
   - Editable: Yes

5. **Adjust for Inflation**
   - Type: Toggle
   - Default: Disabled

## Calculation Logic

- Same formula as PPF (yearly contribution)
- Account matures when girl turns 21
- Calculate years till maturity: 21 - girl's age

## Output Values

1. **Total Invested**: Yearly investment × Number of years
2. **Total Interest**: Maturity value - Total invested
3. **Maturity Year**: Start year + (21 - girl's age)
4. **Maturity Value**: Final corpus when girl turns 21
5. **Pie Chart**: Principal vs Interest

## Validation Schema

```javascript
import Joi from 'joi'

export const ssySchema = Joi.object({
  yearlyInvestment: Joi.number().min(250).max(150000).required(),
  girlsAge: Joi.number().integer().min(0).max(9).required()
    .messages({
      'number.max': 'Girl must be below 10 years of age'
    }),
  startYear: Joi.number().integer().min(2000).max(2100).required(),
  rate: Joi.number().min(0).max(100).default(8.2),
  adjustInflation: Joi.boolean().default(false)
})
```

## Information Panel

- Current Rate: 8.2%
- Features: Exclusively for girl child, EEE tax status
- Tax Benefits: Full tax exemption (EEE)
- Eligibility: Girl child below 10 years
- Lock-in: Till girl child turns 21 years

## Dependencies

- Use `calculatePPF()` formula (same as PPF)
- Age validation is critical

## Test Cases

1. ₹10,000/year for girl aged 5 years → matures in 16 years
2. Age validation: 10+ years should show error
3. Min investment: ₹250/year
4. Max investment: ₹1.5L/year
