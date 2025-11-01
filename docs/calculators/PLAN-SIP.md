# SIP Calculator Implementation Plan

## Component Structure

```
SIPCalculator/
├── SIPCalculator.jsx
├── SIPCalculatorInfo.jsx
├── SIPCalculatorResults.jsx
├── SIPCalculatorTable.jsx
├── useSIPCalculator.js
├── sipSchema.js
└── SIPCalculator.stub.jsx
```

## Input Fields

1. **Monthly SIP Amount**
   - Range: ₹500+
   - Default: ₹5,000
   - Validation: Min ₹500, required

2. **Investment Period**
   - Type: Years or Months
   - Default: 5 years
   - Validation: Min 1 year, Max 50 years

3. **Expected Return Rate**
   - Default: 12% (from investmentRates.js)
   - Editable: Yes
   - Note: Market-linked, user input

4. **Step-up SIP**
   - Type: Toggle + Percentage
   - Default: Disabled
   - If enabled: Annual increase percentage

5. **Adjust for Inflation**
   - Type: Toggle
   - Default: Disabled

## Calculation Logic

### Formula
```javascript
FV = P × [(1 + r)^n - 1] / r × (1 + r)

Where:
P = Monthly investment amount
r = Monthly rate of return (annual rate / 12)
n = Number of months
```

### Step-up SIP
Use `calculateStepUpSIP()` from utils

## Output Values

1. **Total Invested**: Monthly SIP × Number of months
2. **Returns Earned**: Future Value - Total Invested
3. **Corpus Value**: Future Value
4. **XIRR %**: Effective return percentage
5. **Pie Chart**: Invested vs Returns

## Validation Schema

```javascript
import Joi from 'joi'

export const sipSchema = Joi.object({
  monthlySIP: Joi.number().min(500).required(),
  tenure: Joi.number().integer().min(1).max(50).required(),
  expectedReturn: Joi.number().min(0).max(100).default(12),
  stepUpEnabled: Joi.boolean().default(false),
  stepUpPercentage: Joi.when('stepUpEnabled', {
    is: true,
    then: Joi.number().min(0).max(100).required(),
    otherwise: Joi.optional()
  }),
  adjustInflation: Joi.boolean().default(false)
})
```

## Information Panel

- Expected Return: 12% (market-linked)
- Features: Rupee-cost averaging, disciplined investing
- Tax Benefits: Long-term capital gains after 1 year
- Eligibility: Any individual
- Lock-in: No lock-in (except ELSS)

## Dependencies

- Use `calculateSIPFutureValue()` and `calculateStepUpSIP()` from utils

## Test Cases

1. ₹5,000/month for 5 years at 12% should give ~₹4.07L corpus
2. Step-up SIP: 10% annual increase
3. Min amount: ₹500/month
4. Monthly vs yearly calculations
