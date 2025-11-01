# PPF Calculator Implementation Plan

## Component Structure

```
PPFCalculator/
├── PPFCalculator.jsx          # Main component
├── PPFCalculatorInfo.jsx     # Information panel component
├── PPFCalculatorResults.jsx  # Results display component
├── PPFCalculatorTable.jsx    # Evolution table component
├── usePPFCalculator.js       # Custom hook for calculations
├── ppfSchema.js              # Joi validation schema
└── PPFCalculator.stub.jsx   # Stub file (handoff)
```

## Input Fields

### Required Fields
1. **Yearly Investment**
   - Type: Number
   - Range: ₹500 - ₹1,50,000
   - Default: ₹10,000
   - Validation: Min ₹500, Max ₹1.5L, required

2. **Time Period (Years)**
   - Type: Number
   - Range: 1 - 50 years
   - Default: 15 years
   - Validation: Min 1, Max 50, required

3. **Rate of Interest**
   - Type: Number (percentage)
   - Default: 7.1% (from investmentRates.js)
   - Editable: Yes (but pre-filled from constants)
   - Last Updated: Display timestamp from constants

### Optional Fields
4. **Step-up Investment**
   - Type: Toggle + Number (percentage)
   - Default: Disabled
   - If enabled: Annual increase percentage (e.g., 10%)

5. **Adjust for Inflation**
   - Type: Toggle
   - Default: Disabled
   - If enabled: Use default inflation rate (6%) from userPreferencesStore

## Calculation Logic

### Main Formula
```javascript
// Yearly contribution with compound interest
A = P × [(1 + r)^n - 1] / r × (1 + r)

Where:
P = Yearly investment amount
r = Annual interest rate (as decimal, e.g., 0.071)
n = Number of years
```

### Step-up Logic
If step-up enabled:
- Year 1: P
- Year 2: P × (1 + stepUpPercentage)
- Year 3: P × (1 + stepUpPercentage)^2
- And so on...

### Inflation Adjustment
If enabled:
- Real Return = [(1 + Nominal Return) / (1 + Inflation)] - 1
- Show both nominal and real values

## Output Values

### Results Panel
1. **Total Invested**: Sum of all yearly investments
2. **Total Interest**: Maturity value - Total invested
3. **Maturity Value**: Final corpus amount
4. **Cumulative Return %**: (Total Interest / Total Invested) × 100
5. **Pie Chart**: Total Invested vs Total Interest

### Evolution Table
Columns:
- Year
- Opening Balance
- Investment (yearly)
- Interest Earned
- Closing Balance

## Validation Schema (Joi)

```javascript
import Joi from 'joi'

export const ppfSchema = Joi.object({
  yearlyInvestment: Joi.number()
    .min(500)
    .max(150000)
    .required()
    .messages({
      'number.min': 'Minimum investment is ₹500',
      'number.max': 'Maximum investment is ₹1.5 lakh per year',
      'any.required': 'Yearly investment is required'
    }),
  
  tenure: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .required()
    .messages({
      'number.min': 'Minimum tenure is 1 year',
      'number.max': 'Maximum tenure is 50 years',
      'any.required': 'Tenure is required'
    }),
  
  rate: Joi.number()
    .min(0)
    .max(100)
    .default(7.1),
  
  stepUpEnabled: Joi.boolean().default(false),
  
  stepUpPercentage: Joi.when('stepUpEnabled', {
    is: true,
    then: Joi.number().min(0).max(100).required(),
    otherwise: Joi.optional()
  }),
  
  adjustInflation: Joi.boolean().default(false)
})
```

## Component Implementation

### usePPFCalculator Hook
```javascript
import { useState, useEffect } from 'react'
import { calculatePPF, calculatePPFEvolution, adjustForInflation } from '@/utils/calculations'

export const usePPFCalculator = (yearlyInvestment, tenure, rate, stepUpEnabled, stepUpPercentage, adjustInflation) => {
  const [results, setResults] = useState(null)
  const [evolution, setEvolution] = useState([])
  
  useEffect(() => {
    if (yearlyInvestment && tenure && rate) {
      // Calculate maturity value
      const maturityValue = calculatePPF(yearlyInvestment, rate / 100, tenure)
      const evolutionData = calculatePPFEvolution(yearlyInvestment, rate / 100, tenure)
      
      // Apply inflation if enabled
      // ... inflation logic
      
      setResults({
        totalInvested: yearlyInvestment * tenure,
        totalInterest: maturityValue - (yearlyInvestment * tenure),
        maturityValue,
        returnPercentage: ((maturityValue - yearlyInvestment * tenure) / (yearlyInvestment * tenure)) * 100
      })
      setEvolution(evolutionData)
    }
  }, [yearlyInvestment, tenure, rate, stepUpEnabled, stepUpPercentage, adjustInflation])
  
  return { results, evolution }
}
```

## Information Panel Content

- **Current Rate**: 7.1% (from investmentRates.js)
- **Last Updated**: November 2025
- **Features**: 
  - Tax-exempt interest and maturity (EEE status)
  - Sovereign guarantee
  - 15-year lock-in period
  - Can be extended in blocks of 5 years
- **Tax Benefits**: 
  - Deduction under Section 80C up to ₹1.5 lakh
  - Interest earned is tax-free
  - Maturity amount is tax-free
- **Eligibility**: 
  - Indian residents only
  - Individuals and HUFs
- **Lock-in Period**: 15 years
- **Min/Max Investment**: ₹500 per year / ₹1.5 lakh per year

## Dependencies

- `@/components/common/Layout/CalculatorLayout`
- `@/components/common` (InputField, Slider, ToggleSwitch, ResultCard, PieChart, InvestmentTable)
- `@/utils/calculations` (calculatePPF, calculatePPFEvolution, adjustForInflation)
- `@/utils/formatters` (formatCurrency, formatPercentage)
- `@/constants/investmentRates` (ppf rate)
- `@/constants/investmentInfo` (ppf info)
- `react-hook-form` + `joi` for validation

## Test Cases

1. **Basic Calculation**: ₹10,000/year for 15 years at 7.1% should give ~₹2.71L maturity
2. **Min Investment**: ₹500/year should work
3. **Max Investment**: ₹1.5L/year should work
4. **Step-up**: 10% step-up should increase yearly investment
5. **Inflation**: Toggle should show real vs nominal returns
6. **Validation**: Amounts < ₹500 or > ₹1.5L should show errors

## Reference Calculators

- Groww PPF Calculator
- ET Money PPF Calculator
- ClearTax PPF Calculator
