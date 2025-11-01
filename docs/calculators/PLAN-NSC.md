# NSC Calculator Implementation Plan

## Component Structure

```
NSCalculator/
├── NSCalculator.jsx
├── NSCalculatorInfo.jsx
├── NSCalculatorResults.jsx
├── NSCalculatorTable.jsx
├── useNSCalculator.js
├── nscSchema.js
└── NSCalculator.stub.jsx
```

## Input Fields

1. **Investment Amount**
   - Range: ₹1,000+
   - Default: ₹1,00,000
   - Validation: Min ₹1,000, required

2. **Tenure**
   - Fixed: 5 years (locked)
   - Display: "5 years (Fixed)"

3. **Rate of Interest**
   - Default: 7.7% (from investmentRates.js)
   - Editable: Yes
   - Compounding: Annual, paid at maturity

4. **Adjust for Inflation**
   - Type: Toggle
   - Default: Disabled

## Calculation Logic

### Formula
```javascript
A = P × (1 + r)^n

Where:
P = Principal amount
r = Annual interest rate
n = 5 years (fixed)
```

Interest is compounded annually but paid at maturity.

## Output Values

1. **Maturity Amount**
2. **Interest Earned**: Maturity Amount - Principal
3. **Effective Return %**: ((Maturity Amount - Principal) / Principal) × 100
4. **Pie Chart**: Principal vs Interest

## Validation Schema

```javascript
import Joi from 'joi'

export const nscSchema = Joi.object({
  principal: Joi.number().min(1000).required(),
  rate: Joi.number().min(0).max(100).default(7.7),
  adjustInflation: Joi.boolean().default(false)
})
```

## Information Panel

- Current Rate: 7.7%
- Features: Fixed interest rate, compounded annually, paid at maturity
- Tax Benefits: Deduction under Section 80C, interest taxable
- Eligibility: Any individual
- Lock-in: 5 years (fixed)

## Dependencies

- Use `calculateCompoundInterest()` from utils
- Fixed tenure: 5 years

## Test Cases

1. ₹1L for 5 years at 7.7% should give ~₹1.45L maturity
2. Tenure cannot be changed (fixed at 5 years)
3. Min investment: ₹1,000
