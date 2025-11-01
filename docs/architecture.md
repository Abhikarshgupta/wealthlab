# Architecture Documentation

## System Overview

WealthLab is a comprehensive wealth management web application specifically designed for Indian retail investors. The application provides real-time investment calculators, goal-based financial planning, and multi-instrument corpus projection tools.

## Technology Stack

### Core Framework
- **React 19.1.1**: Modern React with hooks and functional components
- **Vite 7.1.7**: Fast build tool and dev server
- **JavaScript (ES6+)**: No TypeScript - using JavaScript for rapid development

### Styling & UI
- **Tailwind CSS 3.3.6**: Utility-first CSS framework
- **Dark Mode**: Class-based dark mode with theme switching
- **Responsive Design**: Mobile-first approach with breakpoints

### State Management
- **Zustand 5.0.8**: Lightweight state management
  - **Usage**: ONLY for GoalPlanningPage and CorpusCalculatorPage (multi-step forms)
  - **NOT used**: Individual calculators use local component state (useState/useEffect)

### Form Management
- **React Hook Form 7.66.0**: Performant form library with minimal re-renders
- **Joi 18.0.1**: Schema validation library for form validation

### Routing
- **React Router DOM 7.9.5**: Client-side routing with nested routes

### Data Visualization
- **Highcharts 12.4.0**: Professional charting library
- **highcharts-react-official 3.2.3**: React wrapper for Highcharts

### Utilities
- **date-fns 4.1.0**: Date manipulation and formatting utilities

## Folder Structure

```
src/
├── components/
│   ├── calculators/          # Individual calculator components
│   │   ├── PPFCalculator/
│   │   ├── FDCalculator/
│   │   └── ... (10 calculators total)
│   └── common/              # Reusable components
│       ├── InputField/
│       ├── Slider/
│       ├── ToggleSwitch/
│       ├── ResultCard/
│       ├── PieChart/
│       ├── InvestmentTable/
│       └── Layout/
│           ├── MainLayout.jsx
│           ├── Header.jsx
│           ├── Footer.jsx
│           └── CalculatorLayout.jsx
├── pages/
│   ├── Home/
│   │   └── Home.jsx
│   ├── calculators/
│   │   └── CalculatorPage.jsx
│   ├── GoalPlanningPage/
│   │   ├── GoalPlanningPage.jsx
│   │   └── components/
│   ├── CorpusCalculatorPage/
│   │   ├── CorpusCalculatorPage.jsx
│   │   └── components/
├── store/                    # Zustand stores
│   ├── goalPlanningStore.js
│   ├── corpusCalculatorStore.js
│   └── userPreferencesStore.js
├── utils/
│   ├── calculations.js      # Financial calculation functions
│   ├── formatters.js        # Currency, percentage, date formatters
│   └── validators.js        # Joi validation helpers
├── constants/
│   ├── investmentRates.js   # Hardcoded interest rates with timestamps
│   └── investmentInfo.js    # Instrument information and features
├── hooks/
│   └── useRealtimeCalculator.js
├── routes/
│   ├── AppRoutes.jsx        # Route configuration component
│   └── routes.js            # Route constants
├── contexts/
│   └── ThemeContext.jsx     # Theme provider (light/dark)
└── docs/
    ├── architecture.md       # This file
    ├── PLAN.md              # Main implementation plan
    ├── HANDOFF.md           # Implementation patterns and reference guide
    ├── QUICKSTART.md        # Quick start guide
    └── SETUP_STATUS.md      # Setup status
```

## State Management Strategy

### When to Use Local State (useState)
- **Individual Calculators**: All input fields, calculations, and results
- **Reason**: Calculators are self-contained, no need for global state
- **Pattern**: Real-time updates via useEffect watching form inputs

### When to Use Zustand
- **GoalPlanningPage**: Multi-field form with complex calculations and recommendations
- **CorpusCalculatorPage**: Multi-step form (3 steps) with state persistence across steps
- **UserPreferencesStore**: Global preferences (default inflation rate, currency format)

### State Management Pattern

```javascript
// Calculator Component - Local State
const PPFCalculator = () => {
  const { register, watch } = useForm()
  const [results, setResults] = useState(null)
  
  const yearlyInvestment = watch('yearlyInvestment')
  const tenure = watch('tenure')
  
  useEffect(() => {
    // Real-time calculation
    if (yearlyInvestment && tenure) {
      const calculated = calculatePPF(yearlyInvestment, tenure)
      setResults(calculated)
    }
  }, [yearlyInvestment, tenure])
}

// Complex Form - Zustand
const GoalPlanningPage = () => {
  const { targetCorpus, updateFormData, setRecommendations } = useGoalPlanningStore()
  // ... form logic
}
```

## Routing Strategy

### Route Structure
```
/                              → Home page
/calculators                   → Calculator index
/calculators/ppf               → PPF Calculator
/calculators/fd                → FD Calculator
/calculators/sip               → SIP Calculator
/calculators/equity            → Equity Calculator
/calculators/nps               → NPS Calculator
/calculators/ssy               → SSY Calculator
/calculators/sgb               → SGB Calculator
/calculators/nsc               → NSC Calculator
/calculators/elss              → ELSS Calculator
/calculators/scss              → SCSS Calculator
/goal-planning                 → Goal Planning Page
/corpus-calculator             → Corpus Calculator Page
```

### Route Configuration
- Centralized route constants in `routes/routes.js`
- Route components in `routes/AppRoutes.jsx`
- All routes configured and functional
- Lazy loading for calculator pages (future optimization)

### Absolute Imports
All imports use the `@/` alias pattern:
- `@/contexts/` - Context providers
- `@/components/` - React components
- `@/pages/` - Page components
- `@/routes/` - Routing configuration
- `@/store/` - Zustand stores
- `@/utils/` - Utility functions
- `@/constants/` - Constants and configuration

## Component Architecture

### Component Hierarchy

```
App
├── ThemeProvider
│   └── BrowserRouter
│       └── MainLayout
│           ├── Header
│           ├── AppRoutes
│           │   ├── Home
│           │   ├── CalculatorPage
│           │   │   └── PPFCalculator (or other)
│           │   │       ├── CalculatorLayout
│           │   │       │   ├── InputPanel (left)
│           │   │       │   ├── ResultsPanel (right)
│           │   │       │   ├── InfoPanel (below)
│           │   │       │   └── EvolutionTable (below)
│           │   ├── GoalPlanningPage
│           │   └── CorpusCalculatorPage
│           └── Footer
```

### Component Patterns

#### Calculator Components
- **Self-contained**: Each calculator is independent
- **Real-time**: No calculate button, updates on input change
- **Form Management**: React Hook Form for inputs
- **Validation**: Joi schemas per calculator
- **Layout**: Responsive layout component handles desktop/mobile

#### Layout Components
- **MainLayout**: Wraps entire app with Header/Footer
- **CalculatorLayout**: Handles responsive calculator layout
  - Desktop: Side-by-side (inputs left, results right)
  - Mobile: Stacked (inputs top, results below)

## Form Management

### React Hook Form Integration
```javascript
const { register, watch, formState: { errors } } = useForm({
  resolver: joiResolver(schema)
})

// Real-time watch for calculations
const inputValue = watch('fieldName')

// Register with validation
<input {...register('fieldName')} />
```

### Joi Validation
- Separate schema file per calculator (e.g., `ppfSchema.js`)
- Validation on blur and submit
- Error messages displayed inline
- Prevents invalid calculations

## Calculation Engine

### Financial Formulas
All formulas are centralized in `utils/calculations.js`:

- **Compound Interest**: `A = P(1 + r)^t`
- **SIP Future Value**: `FV = P × [(1 + r)^n - 1] / r × (1 + r)`
- **Real Return**: `Real Return = [(1 + Nominal Return) / (1 + Inflation)] - 1`
- **CAGR**: `CAGR = (Ending Value / Beginning Value)^(1/years) - 1`

### Calculation Accuracy
- All calculations verified against industry-standard calculators
- Rounding to 2 decimal places for currency
- Percentage calculations maintain precision

## Responsive Design

### Breakpoints
- **Mobile**: < 768px (single column, stacked)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (side-by-side layout)

### Layout Strategy
- **Desktop (MacBook 13")**: Inputs left, results right, info below
- **Mobile**: Inputs top, results one scroll below, info below results

## Dark Mode Implementation

### Theme Provider
- React Context for theme state
- localStorage persistence
- Class-based dark mode (`dark:` prefix in Tailwind)

### Color Scheme
- **Light**: White backgrounds, dark text
- **Dark**: Dark gray backgrounds (#18181b), light text
- **Accent Colors**: Green for primary actions, blue for secondary

## Performance Optimization

### Code Splitting
- Lazy loading for calculator pages (future)
- Route-based code splitting

### Real-time Calculations
- Debounced updates for expensive calculations (optional)
- Memoization for complex calculations

## Testing Strategy

### Unit Tests
- Calculation functions (`utils/calculations.js`)
- Validation schemas (Joi)

### Integration Tests
- Calculator workflows
- Form submissions
- Navigation flows

### Manual Testing
- Cross-browser compatibility
- Mobile responsiveness
- Calculation accuracy against reference calculators

## Deployment

### Build Process
```bash
npm run build  # Creates optimized production build
```

### Environment Variables
- None required for initial version
- Future: API endpoints for dynamic rates

### Build Output
- Static files in `dist/`
- Deployable to any static hosting (Vercel, Netlify, etc.)

## Implementation Status

### ✅ Completed (Phase 0 & Phase 1)
- Project setup and configuration
- Routing system with all routes
- Theme system (light/dark mode)
- Layout components (MainLayout, Header, Footer, CalculatorLayout)
- State management stores (Zustand)
- Constants (investment rates and info)
- Utility functions (calculations, formatters, validators)
- Placeholder pages
- Path aliases configuration (`@/` imports)

### ✅ Completed (Phase 1.5)
- Common reusable components (InputField, Slider, ToggleSwitch, ResultCard, PieChart, InvestmentTable)
- All components feature premium styling, dark mode support, and accessibility features

### ✅ Completed (Phase 2)
- **FD Calculator** - Complete with flexible compounding and tenure options
- **SIP Calculator** - Complete with step-up SIP and inflation adjustment
- **NSC Calculator** - Complete with 5-year fixed tenure
- **SGB Calculator** - Complete with real-time gold price integration
- **NPS Calculator** - Complete with asset allocation options
- **PPF Calculator** - Complete with step-up option
- **SSY Calculator** - Complete with age validation
- **SCSS Calculator** - Complete with quarterly interest
- **Equity Calculator** - Complete with SIP/Lumpsum modes and step-up SIP
- **ELSS Calculator** - Complete with 3-year lock-in
- Calculator index page with card-based navigation

### 📋 Pending
- Goal Planning Page
- Corpus Calculator Page
- Testing and polish

## Future Enhancements

### Planned Features
1. **API Integration**: Dynamic interest rate fetching
2. **User Authentication**: Save user portfolios
3. **Advanced Analytics**: Portfolio performance tracking
4. **Export Formats**: PDF reports, Excel exports
5. **Internationalization**: Multi-language support

### Scalability Considerations
- Component-based architecture supports easy feature addition
- Zustand stores can be split further if needed
- Route structure supports nested calculator categories

## Code Standards

### Naming Conventions
- **Components**: PascalCase (e.g., `PPFCalculator.jsx`)
- **Files**: camelCase (e.g., `investmentRates.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_INVESTMENT`)
- **Hooks**: camelCase with `use` prefix (e.g., `useRealtimeCalculator`)

### File Organization
- One component per file
- Co-located related files (schema files with components)
- Clear separation of concerns

### Import Patterns
- **Always use absolute imports**: `@/component/Path` instead of relative paths
- **Consistent structure**: All imports follow `@/` pattern
- **IDE support**: jsconfig.json enables autocomplete

## Security Considerations

### Input Validation
- All user inputs validated via Joi schemas
- Sanitization of numeric inputs
- Range validation for investment amounts

### Data Privacy
- No backend currently - all calculations client-side
- Export/import functionality uses local storage
- No user data transmitted to servers

## Browser Support

### Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Support
- iOS Safari
- Chrome Mobile
- Responsive design tested on common screen sizes

## Development Workflow

### Setup
```bash
npm install
npm run dev
```

### Path Aliases
- Use `@/` prefix for all imports from `src/` directory
- Example: `import { formatCurrency } from '@/utils/formatters'`
- Works with both Vite and IDE (via jsconfig.json)

### Building
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## Dependencies Overview

### Production Dependencies
- `react`, `react-dom`: Core framework
- `react-router-dom`: Routing
- `react-hook-form`: Form management
- `joi`: Validation
- `zustand`: State management (limited use)
- `highcharts`, `highcharts-react-official`: Charts
- `date-fns`: Date utilities

### Development Dependencies
- `vite`: Build tool
- `tailwindcss`, `postcss`, `autoprefixer`: Styling
- `eslint`: Code linting
- `@vitejs/plugin-react`: React plugin for Vite

## Architecture Decisions

### Why Zustand Only for Complex Forms?
- Individual calculators don't need global state
- Reduces complexity and bundle size
- Better performance (fewer re-renders)

### Why React Hook Form?
- Minimal re-renders
- Better performance than controlled inputs
- Easy integration with Joi validation

### Why Highcharts?
- Professional, feature-rich charts
- Better than Recharts for complex visualizations
- Good documentation and support

### Why JavaScript (not TypeScript)?
- Faster development iteration
- Less boilerplate
- Team preference for this project

### Why Absolute Imports (`@/`)?
- Cleaner, more maintainable code
- Easier refactoring (no relative path updates)
- Better IDE support and autocomplete
- Consistent import patterns across project

## Documentation Structure

- **architecture.md**: This file - system overview and technical specifications
- **PLAN.md**: Main implementation plan with progress tracking
- **HANDOFF.md**: Implementation patterns and reference guide for completed calculators
- **QUICKSTART.md**: Quick start guide for developers
- **SETUP_STATUS.md**: Project setup and status information

All calculators are complete and documented in HANDOFF.md with implementation details.
