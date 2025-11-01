# Wealth Manager Platform - Implementation Plan

## Project Architecture

### Technology Stack
- **Framework:** React (JavaScript) with Vite
- **Styling:** Tailwind CSS with dark mode support
- **State Management:** 
  - Local component state (useState/useEffect) for individual calculators
  - Zustand ONLY for GoalPlanningPage & CorpusCalculatorPage
- **Form Management:** React Hook Form + Joi validation
- **Routing:** React Router v6 with production-grade route structure
- **Charting:** Highcharts (highcharts-react-official)
- **Utilities:** date-fns for date calculations

### Architecture Principles
- **Production-Grade:** Scalable, maintainable architecture to avoid rearchitecting
- **Separation of Concerns:** Each calculator is independent feature
- **Real-Time Calculations:** No calculate buttons, reactive updates via useEffect
- **Responsive Design:** Desktop (side-by-side), Mobile (stacked, one scroll below)
- **Modular Structure:** Each feature has its own PLAN.md for parallel development

### Current Interest Rates (As of November 2025)
Based on latest government and market data:
- PPF: 7.1% p.a. (compounded annually)
- NSC: 7.7% p.a. (compounded annually, paid at maturity)
- SSY: 8.2% p.a. (compounded annually)
- SCSS: 8.2% p.a. (paid quarterly)
- SGB: 2.5% p.a. + gold price appreciation
- FD: 5.5-7.5% p.a. (varies by bank/tenure)
- NPS: 8-12% expected (market-linked)
- SIP/Mutual Funds: 10-15% expected (market-linked)
- ELSS: 12-15% expected (market-linked)
- Equity: Variable (market-dependent)

## Phase 0: Foundation (✅ COMPLETED)

### ✅ Project Setup
- [x] Initialize Vite + React project
- [x] Install dependencies (Tailwind, Zustand, React Hook Form, Joi, Highcharts, React Router, date-fns)
- [x] Configure Tailwind CSS with dark mode
- [x] Set up folder structure
- [x] Create architecture.md document
- [x] Create PLAN.md document
- [x] Configure path aliases for absolute imports (`@/`)

### ✅ Base Configuration
- [x] Tailwind config with design system colors
- [x] PostCSS configuration
- [x] HTML template with Google Fonts (Inter, Roboto, Nunito)
- [x] CSS with Tailwind directives and custom components
- [x] Vite config with path alias resolution
- [x] jsconfig.json for IDE support

## Phase 1: Core Infrastructure (✅ COMPLETED)

### ✅ 1.1 Routing Setup
- [x] Create `routes/routes.js` with route constants
- [x] Create `routes/AppRoutes.jsx` with route configuration
- [x] Set up React Router in App.jsx
- [x] All routes configured (Home, Calculators, Goal Planning, Corpus Calculator)

### ✅ 1.2 Theme System
- [x] Create `contexts/ThemeContext.jsx`
- [x] Implement theme provider with localStorage persistence
- [x] Add theme toggle to Header
- [x] Dark mode fully functional

### ✅ 1.3 Layout Components
- [x] Create `components/common/Layout/MainLayout.jsx`
- [x] Create `components/common/Layout/Header.jsx` with navigation and theme toggle
- [x] Create `components/common/Layout/Footer.jsx`
- [x] Create `components/common/Layout/CalculatorLayout.jsx` for responsive calculator layout

### ✅ 1.4 State Management Stores
- [x] Create `store/goalPlanningStore.js` (Zustand)
- [x] Create `store/corpusCalculatorStore.js` (Zustand)
- [x] Create `store/userPreferencesStore.js` (Zustand)

### ✅ 1.5 Constants
- [x] Create `constants/investmentRates.js` with all hardcoded rates
- [x] Create `constants/investmentInfo.js` with instrument details

### ✅ 1.6 Utility Functions
- [x] Create `utils/calculations.js` with all financial formulas
- [x] Create `utils/formatters.js` for currency, percentage, date formatting
- [x] Create `utils/validators.js` for Joi validation helpers

### ✅ 1.7 Placeholder Pages
- [x] Create `pages/Home/Home.jsx`
- [x] Create `pages/calculators/CalculatorPage.jsx`
- [x] Create `pages/GoalPlanningPage/GoalPlanningPage.jsx`
- [x] Create `pages/CorpusCalculatorPage/CorpusCalculatorPage.jsx`

## Phase 1.5: Common Components (✅ COMPLETED)

### ✅ Common Components Built
- [x] Create `components/common/InputField/` - Reusable input with React Hook Form integration
- [x] Create `components/common/Slider/` - Range input component with value display
- [x] Create `components/common/ToggleSwitch/` - Toggle switch component
- [x] Create `components/common/ResultCard/` - Display calculated results with icon support
- [x] Create `components/common/PieChart/` - Highcharts donut chart wrapper with theme support
- [x] Create `components/common/InvestmentTable/` - Premium year-wise breakdown table

### Component Features
- **InputField**: React Hook Form compatible, currency prefix support, error handling, accessibility
- **Slider**: Visual progress indicator, custom formatting, currency display option
- **ToggleSwitch**: Accessible toggle with description support, smooth animations
- **ResultCard**: Gradient backgrounds, icon support, premium styling
- **PieChart**: Highcharts integration, dark mode support, responsive, customizable
- **InvestmentTable**: Premium styling, hover effects, gradient headers, tabular numbers, totals row

## Phase 2: Individual Investment Calculators (📋 PENDING)

Each calculator follows the same structure and is documented in `/docs/calculators/PLAN-*.md`.

### Calculator Layout Structure
```
Desktop (MacBook 13"):
┌─────────────────────────────────────┐
│         Calculator Header            │
├──────────────┬──────────────────────┤
│              │                       │
│ Input Panel  │   Results Panel      │
│ (Left)       │   (Right)            │
│              │                       │
├──────────────┴──────────────────────┤
│      Information Panel (Below)       │
├──────────────────────────────────────┤
│      Evolution Table (Below)         │
└──────────────────────────────────────┘

Mobile:
┌─────────────────────┐
│   Calculator Header │
├─────────────────────┤
│   Input Panel       │
├─────────────────────┤
│   Results Panel     │ (One scroll below)
├─────────────────────┤
│   Information Panel │
├─────────────────────┤
│   Evolution Table   │
└─────────────────────┘
```

### Calculator Features
1. **Real-Time Calculations:** No calculate button, useEffect watches inputs
2. **Input Panel:** React Hook Form + Joi validation
3. **Results Panel:** Auto-updates, shows invested amount, interest, maturity value, return %, pie chart
4. **Information Panel:** Current rate, features, tax benefits, lock-in, eligibility
5. **Evolution Table:** Year-wise breakdown

### Calculators to Build
1. **PPF Calculator** (`PLAN-PPF.md`)
   - Formula: A = P × [(1 + r)^n - 1] / r × (1 + r)
   - Annual compounding
   - Step-up option
   - Max ₹1.5L/year

2. **FD Calculator** (`PLAN-FD.md`)
   - Formula: A = P × (1 + r/n)^(nt)
   - Quarterly compounding
   - Lumpsum only

3. **SIP Calculator** (`PLAN-SIP.md`)
   - Formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
   - Monthly investment
   - Step-up SIP option

4. **SSY Calculator** (`PLAN-SSY.md`)
   - Same as PPF formula
   - Yearly contribution
   - Age validation (girl child < 10 years)

5. **NSC Calculator** (`PLAN-NSC.md`)
   - Formula: A = P × (1 + r)^n
   - Annual compounding, paid at maturity
   - 5-year lock-in

6. **SCSS Calculator** (`PLAN-SCSS.md`)
   - Quarterly interest
   - Age validation (60+ years)

7. **SGB Calculator** (`PLAN-SGB.md`)
   - Fixed interest: 2.5% p.a. + gold appreciation
   - User-adjustable gold appreciation rate

8. **Equity Calculator** (`PLAN-Equity.md`)
   - SIP or lumpsum
   - User-input expected CAGR

9. **ELSS Calculator** (`PLAN-ELSS.md`)
   - Similar to SIP
   - 3-year lock-in

10. **NPS Calculator** (`PLAN-NPS.md`)
    - Asset allocation (Equity/Debt/Corporate Bonds)
    - Variable returns based on allocation

## Phase 3: Goal-Based Financial Planning (📋 PENDING)

### Features
- Input form: Target corpus, time horizon, risk appetite, current savings, monthly SIP
- Risk-based asset allocation:
  - Very High: 80% Equity + 10% SGB + 10% Debt
  - High: 60% Equity/MF + 20% Hybrid + 20% Debt
  - Medium: 40% Equity/MF + 30% Debt + 30% Safe
  - Low: 20% Equity + 40% Debt + 40% Safe
- Calculation engine with shortfall detection
- Recommendations display
- Zustand store for form state

## Phase 4: Multi-Instrument Corpus Calculator (📋 PENDING)

### Three-Step Form
1. **Step 1:** Investment selection (checkbox cards)
2. **Step 2:** Detailed input forms for each selected instrument
3. **Step 3:** Review and submit

### Output Display
- Overall corpus breakdown (invested, returns, corpus, %, pie chart)
- Sectional breakdown per instrument
- Export/import JSON functionality
- Zustand store for multi-step form state

## Phase 5: Polish & Testing (📋 PENDING)

### UI/UX Polish
- Ensure responsive design
- Add loading states
- Improve accessibility
- Error handling

### Testing
- Calculation accuracy verification
- Form validation testing
- Cross-browser testing
- Mobile device testing

## Implementation Priority

### ✅ Week 1: Foundation (COMPLETED)
- [x] Project setup
- [x] Architecture documentation
- [x] Folder structure
- [x] Path aliases configuration

### ✅ Week 1: Core Infrastructure (COMPLETED)
- [x] Routing, theme, layouts
- [x] Utility functions
- [x] Constants
- [x] State management stores
- [x] Placeholder pages

### ✅ Week 2: Common Components (COMPLETED)
- [x] InputField component
- [x] Slider component
- [x] ToggleSwitch component
- [x] ResultCard component
- [x] PieChart component (Highcharts)
- [x] InvestmentTable component

### 📋 Week 2-3: Core Calculators (NEXT)
- [ ] PPF Calculator
- [ ] FD Calculator
- [ ] SIP Calculator

### 📋 Week 3-4: Additional Calculators
- [ ] SSY Calculator
- [ ] NSC Calculator
- [ ] SCSS Calculator
- [ ] SGB Calculator

### 📋 Week 4-5: Market-Linked Calculators
- [ ] Equity Calculator
- [ ] ELSS Calculator
- [ ] NPS Calculator

### 📋 Week 5-6: Advanced Features
- [ ] Goal Planning Page
- [ ] Corpus Calculator Page

### 📋 Week 7-8: Polish & Deploy
- [ ] Testing
- [ ] UI polish
- [ ] Documentation
- [ ] Deployment

## Key Formulas Reference

### Compound Interest (Annual)
```
A = P(1 + r)^t
```

### Compound Interest (Multiple Compounding)
```
A = P(1 + r/n)^(nt)
```

### SIP Future Value
```
FV = P × [(1 + r)^n - 1] / r × (1 + r)
P = monthly payment
r = monthly rate of return
n = number of months
```

### Real Return (Inflation-adjusted)
```
Real Return = [(1 + Nominal Return) / (1 + Inflation)] - 1
```

### CAGR
```
CAGR = (Ending Value / Beginning Value)^(1/years) - 1
```

## Design System

### Colors
- Primary: Teal/Green (#14B8A6, #22d3ee)
- Secondary: Indigo (#6366F1, #2563eb)
- Background: White / Dark Gray (#18181b)
- Text: Gray-800 / White

### Typography
- Font: Inter, Roboto, Nunito
- Headings: Bold, various sizes
- Body: Regular, medium weight

### Spacing
- Cards: `rounded-xl`, `shadow-md`, `p-6 md:p-8`
- Grid gaps: `gap-x-6`, `gap-y-8`

### Dark Mode
- Class-based (`dark:` prefix)
- Theme toggle in header
- localStorage persistence

## Notes for Parallel Development

Each calculator is independent and can be developed in parallel:
1. Create PLAN-*.md file in `/docs/calculators/`
2. Build calculator component following the structure
3. Use common components from `/components/common/`
4. Follow calculation formulas from `/utils/calculations.js`
5. Use validation schemas with Joi
6. Test against reference calculators

See `architecture.md` for detailed technical specifications.