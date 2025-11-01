# FD Calculator Implementation Plan

## Component Structure

```
FDCalculator/
├── FDCalculator.jsx
├── FDCalculatorInfo.jsx
├── FDCalculatorResults.jsx
├── FDCalculatorTable.jsx
├── useFDCalculator.js
├── fdSchema.js
└── FDCalculator.stub.jsx
```

## Input Fields

1. **Principal Amount**
   - Range: ₹1,000+
   - Default: ₹1,00,000
   - Validation: Min ₹1,000, required

2. **Tenure (Years)**
   - Range: 1 - 10 years
   - Default: 5 years
   - Validation: Min 1, Max 10, required

3. **Rate of Interest**
   - Default: 6.5% (from investmentRates.js)
   - Editable: Yes
   - Compounding: Quarterly

4. **Adjust for Inflation**
   - Type: Toggle
   - Default: Disabled

## Calculation Logic

### Formula
```javascript
A = P × (1 + r/n)^(nt)

Where:
P = Principal amount
r = Annual interest rate (as decimal)
n = Compounding frequency (4 for quarterly)
t = Time in years
```

## Output Values

1. **Maturity Amount**
2. **Interest Earned**: Maturity Amount - Principal
3. **Effective Return %**: ((Maturity Amount - Principal) / Principal) × 100
4. **Pie Chart**: Principal vs Interest

## Validation Schema

```javascript
import Joi from 'joi'

export const fdSchema = Joi.object({
  principal: Joi.number().min(1000).required(),
  tenure: Joi.number().integer().min(1).max(10).required(),
  rate: Joi.number().min(0).max(100).default(6.5),
  adjustInflation: Joi.boolean().default(false)
})
```

## Information Panel

- Current Rate: 6.5% (average, varies by bank)
- Features: Assured returns, DICGC coverage up to ₹5L
- Tax Benefits: Interest taxable as per income tax slab
- Eligibility: Any individual
- Lock-in: Depends on chosen tenure

## Dependencies

- Same as PPF Calculator
- Use `calculateFD()` and `calculateFDEvolution()` from utils

## Test Cases

1. ₹1L for 5 years at 6.5% quarterly compounding
2. Min amount: ₹1,000
3. Max tenure: 10 years
4. Quarterly compounding verification
