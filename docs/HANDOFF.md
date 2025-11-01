# Multi-Agent Handoff Guide

## Overview
This document describes the multi-agent workflow for parallel development of calculators in the Wealth Manager platform.

## Current Status
- ✅ Core infrastructure complete
- ✅ Common components ready (InputField, Slider, ToggleSwitch, ResultCard, PieChart, InvestmentTable)
- ✅ Layout components ready (CalculatorLayout, Header, Footer)
- ✅ Calculation utilities ready (calculations.js)
- ✅ Formatters ready (formatters.js)
- 🔄 Ready for calculator implementation

## Stub Files Structure
Each calculator has a `.stub.jsx` file located in:
```
src/components/calculators/{CalculatorName}/{CalculatorName}.stub.jsx
```

### Stub File Contents
Each stub file contains:
- Component structure outline
- TODO comments with requirements
- Reference to corresponding PLAN-*.md file
- Import examples
- Basic component skeleton

## Available Stub Files

| Calculator | Stub File | Plan File | Status |
|------------|-----------|-----------|--------|
| PPF | `PPFCalculator.stub.jsx` | `PLAN-PPF.md` | Ready |
| FD | `FDCalculator.stub.jsx` | `PLAN-FD.md` | Ready |
| SIP | `SIPCalculator.stub.jsx` | `PLAN-SIP.md` | Ready |
| SSY | `SSYCalculator.stub.jsx` | `PLAN-SSY.md` | Ready |
| NSC | `NSCalculator.stub.jsx` | `PLAN-NSC.md` | Ready |
| SCSS | `SCSSCalculator.stub.jsx` | `PLAN-SCSS.md` | Ready |
| SGB | `SGBCalculator.stub.jsx` | `PLAN-SGB.md` | Ready |
| Equity | `EquityCalculator.stub.jsx` | `PLAN-Equity.md` | Ready |
| ELSS | `ELSSCalculator.stub.jsx` | `PLAN-ELSS.md` | Ready |
| NPS | `NPSCalculator.stub.jsx` | `PLAN-NPS.md` | Ready |

## Handoff Process

### Step 1: Pick a Stub File
1. Check `docs/calculators/PLAN-*.md` for available calculators
2. Ensure no other agent is working on the same calculator
3. Update status in this document or project board

### Step 2: Read Documentation
1. Read the corresponding `PLAN-*.md` file
2. Review `docs/architecture.md` for architecture guidelines
3. Review `docs/PLAN.md` for overall project plan
4. Check existing calculator implementations for reference (if any)

### Step 3: Implement Calculator
1. Copy stub file to main component file:
   ```bash
   cp src/components/calculators/PPFCalculator/PPFCalculator.stub.jsx \
      src/components/calculators/PPFCalculator/PPFCalculator.jsx
   ```
2. Follow the structure outlined in PLAN-*.md
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
git worktree add ../wealth-mngr-ppf -b feature/ppf-calculator

# Create worktree for FD Calculator
git worktree add ../wealth-mngr-fd -b feature/fd-calculator

# Create worktree for SIP Calculator
git worktree add ../wealth-mngr-sip -b feature/sip-calculator

# List all worktrees
git worktree list

# Remove worktree (after merging)
git worktree remove ../wealth-mngr-ppf
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
- `calculateRealReturn()`: Inflation-adjusted returns
- `calculateCAGR()`: Compound Annual Growth Rate

## Validation Schemas

Create validation schemas in component folder:
- `ppfSchema.js`
- `fdSchema.js`
- `sipSchema.js`
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

- Use `@handoff: Agent Name` comments in stub files
- Update status in this document
- Comment PRs with implementation notes
- Reference PLAN-*.md files in commits

## Next Steps

1. Each agent picks one calculator stub file
2. Reads corresponding PLAN-*.md file
3. Implements calculator following architecture.md
4. Creates feature branch and commits
5. Updates documentation and status

---

**Last Updated**: Initial setup
**Status**: Ready for multi-agent implementation
