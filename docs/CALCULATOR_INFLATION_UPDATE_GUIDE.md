# Calculator Inflation Toggle Migration Guide

## Overview
This guide documents the migration from per-calculator inflation toggles to a global inflation toggle in the header.

## Status

### ✅ Completed Calculators:
1. PPFCalculator
2. SIPCalculator
3. FDCalculator
4. EquityCalculator
5. NPSCalculator
6. ELSSCalculator

### ⏳ Remaining Calculators (11):
1. RDCalculator
2. POMISCalculator
3. IPOCalculator
4. ETFCalculator
5. NSCalculator
6. DebtMutualFundCalculator
7. SCSSCalculator
8. SGBCalculator
9. SSYCalculator
10. REITsCalculator
11. 54ECBondsCalculator

---

## Update Pattern for Each Calculator

### Step 1: Update Hook File (`use[Calculator]Calculator.js`)

**Remove `adjustInflation` parameter:**
```javascript
// BEFORE:
const use[Calculator]Calculator = (
  param1,
  param2,
  ...
  adjustInflation
) => {
  const { defaultInflationRate } = useUserPreferencesStore()

// AFTER:
const use[Calculator]Calculator = (
  param1,
  param2,
  ...
) => {
  const { defaultInflationRate, adjustInflation } = useUserPreferencesStore()
```

**Remove JSDoc parameter:**
```javascript
// Remove this line:
// * @param {boolean} adjustInflation - Whether to adjust for inflation
```

---

### Step 2: Update Component File (`[Calculator]Calculator.jsx`)

**Remove from `defaultValues`:**
```javascript
// BEFORE:
defaultValues: {
  field1: value1,
  adjustInflation: false
}

// AFTER:
defaultValues: {
  field1: value1,
}
```

**Remove from `watch`:**
```javascript
// BEFORE:
const adjustInflation = watch('adjustInflation')

// AFTER:
// Remove this line entirely
```

**Remove from hook call:**
```javascript
// BEFORE:
const results = use[Calculator]Calculator(
  param1,
  param2,
  ...
  adjustInflation
)

// AFTER:
const results = use[Calculator]Calculator(
  param1,
  param2,
  ...
)
```

**Remove ToggleSwitch JSX:**
```javascript
// BEFORE:
{/* Inflation Adjustment Toggle */}
<ToggleSwitch
  label="Adjust for Inflation"
  checked={adjustInflation}
  onChange={(checked) => setValue('adjustInflation', checked, { shouldValidate: true })}
  description="Show real returns after accounting for inflation"
/>

// AFTER:
// Remove this entire block
```

**Update evolutionTable to pass tenure:**
```javascript
// BEFORE:
evolutionTable={
  <[Calculator]CalculatorTable evolution={results?.evolution} />
}

// AFTER:
evolutionTable={
  <[Calculator]CalculatorTable evolution={results?.evolution} tenure={tenureNum} />
}
// Note: tenureNum might be named differently (e.g., totalYears for FD)
```

**Remove ToggleSwitch import if unused:**
```javascript
// Check if ToggleSwitch is used elsewhere in the file
// If not, remove:
import ToggleSwitch from '@/components/common/ToggleSwitch'
```

---

### Step 3: Update Table File (`[Calculator]CalculatorTable.jsx`)

**Add tenure parameter:**
```javascript
// BEFORE:
/**
 * [Calculator] Calculator Evolution Table
 * 
 * @param {Array} evolution - Evolution data from use[Calculator]Calculator hook
 */
const [Calculator]CalculatorTable = ({ evolution }) => {

// AFTER:
/**
 * [Calculator] Calculator Evolution Table
 * 
 * @param {Array} evolution - Evolution data from use[Calculator]Calculator hook
 * @param {number} tenure - Investment tenure in years
 */
const [Calculator]CalculatorTable = ({ evolution, tenure }) => {
```

**Pass tenure to InvestmentTable:**
```javascript
// BEFORE:
<InvestmentTable
  data={evolution}
  title="Year-wise Investment Evolution"
/>

// AFTER:
<InvestmentTable
  data={evolution}
  title="Year-wise Investment Evolution"
  tenure={tenure}
/>
```

---

### Step 4: Update Schema File (`[calculator]Schema.js`)

**Remove `adjustInflation` field:**
```javascript
// BEFORE:
adjustInflation: Joi.boolean().default(false)

// AFTER:
// Remove this line entirely
```

---

## Special Cases

### FD Calculator
- Uses `totalYears` instead of `tenureNum`
- Update: `tenure={totalYears}`

### Calculators with Monthly Evolution
- Some calculators (like FD with tenure < 1 year) show monthly evolution
- Still pass tenure in years to InvestmentTable
- InvestmentTable handles the conversion internally

---

## Testing Checklist

After updating each calculator:

- [ ] Calculator loads without errors
- [ ] Toggle removed from input panel
- [ ] Calculations work correctly
- [ ] Inflation adjustment works when header toggle is ON
- [ ] Year-wise table shows inflation-adjusted column when toggle is ON
- [ ] Table tenure prop is passed correctly
- [ ] No console errors

---

## Quick Reference: Files to Update Per Calculator

1. `src/components/calculators/[Calculator]/use[Calculator]Calculator.js`
   - Remove `adjustInflation` parameter
   - Get `adjustInflation` from store

2. `src/components/calculators/[Calculator]/[Calculator]Calculator.jsx`
   - Remove from defaultValues
   - Remove from watch
   - Remove from hook call
   - Remove ToggleSwitch JSX
   - Update evolutionTable to pass tenure

3. `src/components/calculators/[Calculator]/[Calculator]CalculatorTable.jsx`
   - Add tenure parameter
   - Pass tenure to InvestmentTable

4. `src/components/calculators/[Calculator]/[calculator]Schema.js`
   - Remove adjustInflation field

---

## Example: Complete Update for RDCalculator

### 1. useRDCalculator.js
```javascript
// Remove adjustInflation from parameters
// Change:
const { defaultInflationRate } = useUserPreferencesStore()
// To:
const { defaultInflationRate, adjustInflation } = useUserPreferencesStore()
```

### 2. RDCalculator.jsx
```javascript
// Remove adjustInflation: false from defaultValues
// Remove const adjustInflation = watch('adjustInflation')
// Remove adjustInflation from useRDCalculator call
// Remove ToggleSwitch JSX block
// Update: <RDCalculatorTable evolution={results?.evolution} tenure={tenureNum} />
```

### 3. RDCalculatorTable.jsx
```javascript
// Add tenure parameter
// Pass tenure={tenure} to InvestmentTable
```

### 4. rdSchema.js
```javascript
// Remove: adjustInflation: Joi.boolean().default(false)
```

---

## Notes

- All calculators should now use global inflation toggle from header
- Inflation state is stored in `userPreferencesStore`
- InvestmentTable automatically shows/hides inflation column based on global toggle
- Tenure must be passed to table components for accurate inflation calculations

