# Multi-Agent Handoff Guide

## Overview
This document describes the multi-agent workflow for parallel development of calculators in the WealthLab platform.

## Current Status
- ✅ Core infrastructure complete
- ✅ Common components ready (InputField, Slider, ToggleSwitch, ResultCard, PieChart, InvestmentTable)
- ✅ Layout components ready (CalculatorLayout, Header, Footer)
- ✅ Calculation utilities ready (calculations.js)
- ✅ Formatters ready (formatters.js)
- ✅ **All 10 Calculators** - COMPLETE
  - ✅ FD Calculator
  - ✅ SIP Calculator (Reference implementation)
  - ✅ NSC Calculator
  - ✅ SGB Calculator
  - ✅ NPS Calculator
  - ✅ PPF Calculator
  - ✅ SSY Calculator
  - ✅ SCSS Calculator
  - ✅ Equity Calculator (with step-up SIP support)
  - ✅ ELSS Calculator
- ✅ Calculator index page with card-based navigation
- 📋 Remaining: Goal Planning Page, Corpus Calculator Page

## Stub Files Structure
Each calculator has a `.stub.jsx` file located in:
```
src/components/calculators/{CalculatorName}/{CalculatorName}.stub.jsx
```

### Stub File Contents
Each stub file contains:
- Component structure outline
- Implementation status note
- Import examples
- Basic component skeleton

## Available Stub Files

| Calculator | Status |
|------------|--------|
| PPF | ✅ **COMPLETE** |
| FD | ✅ **COMPLETE** |
| SIP | ✅ **COMPLETE** |
| SSY | ✅ **COMPLETE** |
| NSC | ✅ **COMPLETE** |
| SCSS | ✅ **COMPLETE** |
| SGB | ✅ **COMPLETE** |
| Equity | ✅ **COMPLETE** |
| ELSS | ✅ **COMPLETE** |
| NPS | ✅ **COMPLETE** |

## Handoff Process

### Step 1: Reference Existing Calculators
1. All calculators are complete - use as reference implementations
2. Review calculator implementations for patterns
3. Check HANDOFF.md for detailed implementation notes

### Step 2: Read Documentation
1. Review `docs/architecture.md` for architecture guidelines
2. Review `docs/PLAN.md` for overall project plan
3. Check existing calculator implementations for reference (all calculators are complete)

### Step 3: Implement Calculator
1. Copy stub file to main component file:
   ```bash
   cp src/components/calculators/{CalculatorName}/{CalculatorName}.stub.jsx \
      src/components/calculators/{CalculatorName}/{CalculatorName}.jsx
   ```
2. Follow the structure of existing calculators (e.g., FDCalculator, SIPCalculator)
3. Use common components from `@/components/common`
4. Implement calculations using utilities from `@/utils/calculations.js`
5. Add validation using Joi schemas
6. Ensure responsive design (desktop: side-by-side, mobile: stacked)

### Step 4: Update CalculatorPage
1. Update `src/pages/calculators/CalculatorPage.jsx` to import your calculator
2. Replace placeholder with actual component

### Step 5: Create Feature Branch
1. Create feature branch:
   ```bash
   git checkout -b feature/{calculator-name}-calculator
   ```
2. Commit changes:
   ```bash
   git add .
   git commit -m "feat: implement {CalculatorName} calculator"
   ```

### Step 6: Update Status
1. Update PLAN.md to mark calculator as complete
2. Update this document's status table
3. Create PR/merge request (if using remote repo)

## Git Worktree Setup (Optional)

For parallel development using git worktrees:

```bash
# Create worktree for PPF Calculator
git worktree add ../wealthlab-ppf -b feature/ppf-calculator

# Create worktree for FD Calculator
git worktree add ../wealthlab-fd -b feature/fd-calculator

# Create worktree for SIP Calculator
git worktree add ../wealthlab-sip -b feature/sip-calculator

# List all worktrees
git worktree list

# Remove worktree (after merging)
git worktree remove ../wealthlab-ppf
```

## Branching Strategy

### Main Branches
- `main`: Production-ready code
- `develop`: Integration branch for features

### Feature Branches
- `feature/ppf-calculator`
- `feature/fd-calculator`
- `feature/sip-calculator`
- `feature/ssy-calculator`
- `feature/nsc-calculator`
- `feature/scss-calculator`
- `feature/sgb-calculator`
- `feature/equity-calculator`
- `feature/elss-calculator`
- `feature/nps-calculator`

## Implementation Checklist

For each calculator, ensure:

- [ ] All input fields implemented with validation
- [ ] Real-time calculations (no "Calculate" button)
- [ ] Results panel with all required metrics
- [ ] Pie chart showing invested vs returns
- [ ] Evolution table with year-wise breakdown
- [ ] Information panel with current rates and features
- [ ] Responsive design (desktop + mobile)
- [ ] Dark mode support
- [ ] Inflation adjustment toggle working
- [ ] Step-up option (if applicable)
- [ ] Error handling and validation
- [ ] Component tests (if applicable)
- [ ] Documentation updated

## Common Components Reference

### Input Components
- `InputField`: Text input with currency prefix support
- `Slider`: Range slider with real-time value display
- `ToggleSwitch`: Toggle switch for boolean options

### Display Components
- `ResultCard`: Display calculated results with icons
- `PieChart`: Highcharts-based donut chart
- `InvestmentTable`: Year-wise breakdown table

### Layout Components
- `CalculatorLayout`: Responsive layout wrapper
- `MainLayout`: App-wide layout with header/footer

## Calculation Utilities

Located in `src/utils/calculations.js`:
- `calculateCompoundInterest()`: Basic compound interest
- `calculateSIPFutureValue()`: SIP calculations
- `calculatePPFFutureValue()`: PPF-specific calculations
- `calculateFD()`: FD calculations with configurable compounding frequency
- `calculateFDEvolution()`: FD year-wise evolution
- `calculateNSC()`: NSC-specific calculations
- `calculateNSCEvolution()`: NSC year-wise evolution
- `calculateRealReturn()`: Inflation-adjusted returns
- `calculateCAGR()`: Compound Annual Growth Rate

## Validation Schemas

Create validation schemas in component folder:
- `ppfSchema.js`
- `fdSchema.js` ✅
- `sipSchema.js`
- `nscSchema.js`
- etc.

Use Joi for validation, integrated with React Hook Form.

## Testing Guidelines

1. Test with minimum values
2. Test with maximum values
3. Test edge cases (boundary values)
4. Test inflation toggle
5. Test step-up (if applicable)
6. Test responsive design
7. Test dark mode
8. Verify calculations match expected formulas

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure using absolute imports (`@/components/common`)
2. **Calculation errors**: Check formula implementation in `utils/calculations.js`
3. **Styling issues**: Verify Tailwind classes and dark mode variants
4. **Routing issues**: Ensure calculator route is added in `AppRoutes.jsx`

## Agent Communication

- Update status in this document
- Comment PRs with implementation notes
- Reference existing calculator implementations for patterns

## Next Steps

All calculators are complete. Future development focuses on:
1. Goal Planning Page implementation
2. Corpus Calculator Page implementation
3. Testing and polish
4. Performance optimizations

---

**Last Updated**: All calculators completed
**Status**: 10 calculators complete (FD, SIP, NSC, SGB, NPS, PPF, SSY, SCSS, Equity, ELSS) - All calculators implemented

## Completed Calculators

### ✅ FD Calculator
**Status**: Complete and Production Ready
**Implementation Date**: Current
**Files Created**:
- `src/components/calculators/FDCalculator/FDCalculator.jsx`
- `src/components/calculators/FDCalculator/FDCalculatorResults.jsx`
- `src/components/calculators/FDCalculator/FDCalculatorInfo.jsx`
- `src/components/calculators/FDCalculator/FDCalculatorTable.jsx`
- `src/components/calculators/FDCalculator/useFDCalculator.js`
- `src/components/calculators/FDCalculator/fdSchema.js`

**Features Implemented**:
- ✅ Principal amount input (₹1,000+)
- ✅ Tenure input with years/months toggle (1-10 years or 1-120 months)
- ✅ Interest rate input (default 6.5%, minimum 0.1%)
- ✅ Compounding frequency options (Quarterly, Monthly, Annually, Cumulative)
- ✅ Inflation adjustment toggle
- ✅ Real-time calculations
- ✅ Results panel (Principal, Maturity Amount, Interest Earned, Effective Return %)
- ✅ Pie chart (Principal vs Interest)
- ✅ Year-wise/Month-wise evolution table (adapts based on tenure)
- ✅ Information panel with FD details
- ✅ Responsive design (desktop + mobile)
- ✅ Dark mode support
- ✅ Form validation with Joi
- ✅ Proper inflation indexation logic
- ✅ Currency values rounded up (no decimals)
- ✅ Explicit null/undefined checks in validation (allows rate=0 calculation)

**Calculation Functions Added**:
- `calculateFD()` in `utils/calculations.js` - Configurable compounding frequency
- `calculateFDEvolution()` in `utils/calculations.js` - Year-wise breakdown with configurable compounding
- Monthly evolution calculation for tenures < 1 year

**Key Features**:
- Flexible tenure options (years/months) similar to ICICI Bank and IDFC Bank FD calculators
- Multiple compounding frequency options (Quarterly, Monthly, Annually, Cumulative)
- Cumulative option: Simple interest for < 1 year, compound annually for ≥ 1 year
- Accurate calculations matching industry-standard FD calculators
- Input validation prevents values below 0.1% rate
- Currency formatting rounds up to nearest whole number (no decimals)

**Key Learnings**:
- Explicit null/undefined checks (`== null`) instead of falsy checks (`!rate`) prevent rate=0 from being treated as invalid
- Monthly evolution table for tenures < 1 year provides better granularity
- InvestmentTable component updated to support both yearly and monthly breakdowns
- Currency formatter updated to round up and remove decimals for cleaner display

### ✅ NSC Calculator
**Status**: Complete and Production Ready
**Implementation Date**: Current
**Files Created**:
- `src/components/calculators/NSCalculator/NSCalculator.jsx`
- `src/components/calculators/NSCalculator/NSCalculatorResults.jsx`
- `src/components/calculators/NSCalculator/NSCalculatorInfo.jsx`
- `src/components/calculators/NSCalculator/NSCalculatorTable.jsx`
- `src/components/calculators/NSCalculator/useNSCalculator.js`
- `src/components/calculators/NSCalculator/nscSchema.js`

**Features Implemented**:
- ✅ Investment amount input (₹1,000+)
- ✅ Fixed tenure display: 5 years (locked)
- ✅ Rate of interest input (default 7.7%, editable)
- ✅ Inflation adjustment toggle
- ✅ Real-time calculations
- ✅ Results panel (Maturity Amount, Interest Earned, Effective Return %)
- ✅ Pie chart (Principal vs Interest)
- ✅ Year-wise evolution table
- ✅ Information panel with NSC details
- ✅ Responsive design (desktop + mobile)
- ✅ Dark mode support
- ✅ Form validation with Joi
- ✅ Proper inflation indexation logic

**Calculation Functions Added**:
- `calculateNSC()` in `utils/calculations.js` - Compound interest formula: A = P × (1 + r)^n
- `calculateNSCEvolution()` in `utils/calculations.js` - Year-wise breakdown

**Key Features**:
- Fixed 5-year tenure (non-editable, displayed as locked)
- Annual compounding with interest paid at maturity
- Accurate calculations matching industry-standard NSC calculators
- Test case verified: ₹1L for 5 years at 7.7% ≈ ₹1.45L maturity

### ✅ SIP Calculator
**Status**: Complete and Production Ready
**Implementation Date**: Current
**Files Created**:
- `src/components/calculators/SIPCalculator/SIPCalculator.jsx`
- `src/components/calculators/SIPCalculator/SIPCalculatorResults.jsx`
- `src/components/calculators/SIPCalculator/SIPCalculatorInfo.jsx`
- `src/components/calculators/SIPCalculator/SIPCalculatorTable.jsx`
- `src/components/calculators/SIPCalculator/useSIPCalculator.js`
- `src/components/calculators/SIPCalculator/sipSchema.js`

**Features Implemented**:
- ✅ Monthly SIP amount input (₹500+)
- ✅ Investment period (years/months toggle)
- ✅ Expected return rate input
- ✅ Step-up SIP option with annual increase percentage
- ✅ Inflation adjustment toggle
- ✅ Real-time calculations
- ✅ Results panel (Total Invested, Returns, Corpus, XIRR)
- ✅ Pie chart (updates in real-time)
- ✅ Year-wise evolution table
- ✅ Information panel with SIP details
- ✅ Responsive design (desktop + mobile)
- ✅ Dark mode support
- ✅ Form validation with Joi
- ✅ Keyboard input support
- ✅ Proper inflation indexation logic

**Calculation Functions Added**:
- `calculateSIPEvolution()` in `utils/calculations.js`
- Fixed `calculateStepUpSIP()` implementation

**Key Learnings**:
- Real corpus value will always be less than nominal corpus when inflation is positive (even with positive real returns)
- Chart updates require `useMemo` and `key` prop for proper re-rendering
- React Hook Form radio buttons need proper registration without conflicting `checked` attributes
- InputField padding needs adjustment for currency symbol (pl-10 instead of pl-8)

### ✅ Equity Calculator
**Status**: Complete and Production Ready
**Implementation Date**: Current
**Files Created**:
- `src/components/calculators/EquityCalculator/EquityCalculator.jsx`
- `src/components/calculators/EquityCalculator/EquityCalculatorResults.jsx`
- `src/components/calculators/EquityCalculator/EquityCalculatorInfo.jsx`
- `src/components/calculators/EquityCalculator/EquityCalculatorTable.jsx`
- `src/components/calculators/EquityCalculator/useEquityCalculator.js`
- `src/components/calculators/EquityCalculator/equitySchema.js`
- `src/components/calculators/EquityCalculator/EquityCalculator.stub.jsx`

**Features Implemented**:
- ✅ Investment type selection (SIP or Lumpsum)
- ✅ Investment amount input (₹500+)
- ✅ Tenure input (years, 1-50)
- ✅ Expected CAGR input (default 12%, user-defined)
- ✅ Step-up SIP option with annual increase percentage (SIP mode only)
- ✅ Inflation adjustment toggle
- ✅ Real-time calculations
- ✅ Results panel (Total Invested, Returns, Corpus, Expected CAGR)
- ✅ Pie chart (Invested vs Returns)
- ✅ Year-wise evolution table
- ✅ Information panel with comprehensive risk warnings
- ✅ Responsive design (desktop + mobile)
- ✅ Dark mode support
- ✅ Form validation with Joi
- ✅ Proper inflation indexation logic
- ✅ Enhanced warning explanations for negative real returns

**Calculation Functions Used**:
- `calculateSIPFutureValue()` - For regular SIP mode
- `calculateStepUpSIP()` - For step-up SIP mode
- `calculateCompoundInterest()` - For Lumpsum mode
- `calculateLumpsumEvolution()` - For Lumpsum evolution table
- `calculateSIPEvolution()` - For SIP evolution table
- `calculateRealReturn()` - For inflation adjustments

**Key Features**:
- Supports both SIP and Lumpsum investment modes
- Step-up SIP functionality (only available in SIP mode)
- Comprehensive risk warnings explaining market volatility
- Enhanced explanation for negative real returns (clarifies that wealth is still growing, but purchasing power is being eroded)
- Visual indicators (red styling) when real returns are negative
- Detailed risk considerations and investment strategy tips

**Key Learnings**:
- Step-up SIP can show negative real returns even when nominal wealth is growing significantly
- Need comprehensive explanations to clarify that negative real returns don't mean losing money
- FormatCurrency already includes ₹ symbol - don't manually add it
- Step-up SIP invests more over time, making later investments worth less in today's terms due to inflation
