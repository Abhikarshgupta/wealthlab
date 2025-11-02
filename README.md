# WealthLab

**Your personal finance experimentation lab** - A comprehensive financial planning and investment calculator platform built specifically for Indian retail investors. Take control of your financial future with real-time calculations, goal-based planning, and portfolio projections.

## 🎯 What is WealthLab?

WealthLab is a modern web application that empowers you to experiment with different investment strategies and gain complete control over your personal finance planning journey. Built with production-grade architecture, it provides:

- **15+ Investment Calculators** - Calculate returns for PPF, FD, SIP, NPS, NSC, SSY, SCSS, SGB, ELSS, Equity, ETFs, Debt Mutual Funds, REITs, 54EC Bonds, IPO/FPO, RD, POMIS, and more
- **Real-Time Calculations** - Instant results as you type, no calculate buttons needed
- **Goal-Based Planning** - Plan your financial goals with risk-based asset allocation recommendations
- **Multi-Instrument Corpus Calculator** - Project your portfolio across multiple investment instruments
- **Beautiful UI** - Modern, responsive design with dark mode support
- **Production-Ready** - Scalable architecture built for performance and maintainability

## ✨ Current Status

### ✅ Completed Features

**Core Infrastructure**
- ✅ Project setup with Vite + React
- ✅ Theme system with dark mode support
- ✅ Responsive layout components
- ✅ Routing architecture
- ✅ State management with Zustand

**Investment Calculators (15/15 Complete)**
- ✅ **PPF Calculator** - Annual compounding with step-up option
- ✅ **FD Calculator** - Flexible compounding frequencies (Quarterly/Monthly/Annually)
- ✅ **SIP Calculator** - Monthly SIP with step-up support
- ✅ **NSC Calculator** - 5-year maturity calculations
- ✅ **SSY Calculator** - Sukanya Samriddhi Yojana for girl child
- ✅ **SCSS Calculator** - Senior Citizen Savings Scheme
- ✅ **SGB Calculator** - Sovereign Gold Bonds with real-time gold prices
- ✅ **NPS Calculator** - National Pension System with asset allocation
- ✅ **ELSS Calculator** - Equity Linked Savings Scheme with 3-year lock-in
- ✅ **Equity Calculator** - SIP/Lumpsum with step-up support
- ✅ **RD Calculator** - Recurring Deposit with flexible tenure
- ✅ **POMIS Calculator** - Post Office Monthly Income Scheme
- ✅ **ETF Calculator** - Exchange Traded Funds (Equity, Debt, Gold, International)
- ✅ **Debt Mutual Funds Calculator** - Tax-efficient debt investments with indexation
- ✅ **REITs Calculator** - Real Estate Investment Trusts
- ✅ **IPO/FPO Calculator** - Initial/Follow-on Public Offer
- ✅ **54EC Bonds Calculator** - Capital Gain Bonds with tax exemption

**Each Calculator Includes:**
- Real-time calculation engine
- Input validation with React Hook Form + Joi
- Results panel with invested amount, returns, maturity value, and ROI
- Visual pie charts using Highcharts
- Year-wise evolution table
- Information panel with current rates, features, tax benefits, and eligibility

**Common Components**
- ✅ Reusable InputField component
- ✅ Slider component for range inputs
- ✅ ToggleSwitch component
- ✅ ResultCard component
- ✅ PieChart component (Highcharts integration)
- ✅ InvestmentTable component

### 🚧 Coming Soon

**Phase 3: Goal-Based Financial Planning**
- Risk-based asset allocation recommendations
- Shortfall detection and SIP recommendations
- Goal timeline visualization
- Portfolio recommendations based on risk appetite

**Phase 4: Multi-Instrument Corpus Calculator**
- Three-step form for investment selection
- Detailed input forms for each selected instrument
- Overall corpus breakdown with pie charts
- Sectional breakdown per instrument
- Export/import JSON functionality

**Phase 5: Polish & Enhancements**
- Loading states and error handling
- Accessibility improvements
- Performance optimizations
- Comprehensive testing
- Documentation updates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_GOLDAPI_KEY=your-goldapi-key-here
```

**Getting GoldAPI.io Key:**
1. Sign up at https://www.goldapi.io/
2. Copy your API key from the dashboard
3. Add it to `.env.local` file

**Note:** The `.env.local` file is gitignored and won't be committed to version control.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## 📊 Gold Price Integration

WealthLab uses GoldAPI.io for fetching real-time gold prices in the SGB Calculator:

- **Rate Limit**: Once per user per 24 hours (stored in localStorage)
- **Fallback**: Uses fallback price (₹6,500/gram) if API fails or rate limit is reached
- **Caching**: API responses are cached for 1 hour

Supported metals: Gold (XAU), Silver (XAG), Platinum (XPT), Palladium (XPD)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── calculators/      # Individual calculator components
│   │   ├── PPFCalculator/
│   │   ├── FDCalculator/
│   │   ├── SIPCalculator/
│   │   └── ... (15 calculators total)
│   └── common/          # Reusable UI components
│       ├── InputField/
│       ├── Slider/
│       ├── ToggleSwitch/
│       ├── ResultCard/
│       ├── PieChart/
│       └── InvestmentTable/
├── pages/               # Page components
│   ├── Home/
│   ├── calculators/
│   ├── GoalPlanningPage/
│   └── CorpusCalculatorPage/
├── routes/              # Route configuration
├── store/               # Zustand state management
├── utils/               # Utility functions
│   ├── calculations.js  # Financial calculation formulas
│   ├── formatters.js   # Currency, percentage, date formatting
│   ├── validators.js   # Joi validation helpers
│   └── goldPriceService.js  # Gold price API integration
├── constants/           # Constants and configuration
│   ├── investmentRates.js  # Current interest rates
│   └── investmentInfo.js   # Instrument details
└── contexts/            # React contexts
    └── ThemeContext.jsx    # Theme provider
```

## 🛠️ Technology Stack

- **Framework:** React 19 with Vite
- **Styling:** TailwindCSS with dark mode support
- **State Management:** Zustand (for Goal Planning & Corpus Calculator)
- **Form Management:** React Hook Form + Joi validation
- **Routing:** React Router v6
- **Charts:** Highcharts (highcharts-react-official)
- **Date Utilities:** date-fns

## 📝 Current Interest Rates

*As of November 2025*

- **PPF:** 7.1% p.a. (compounded annually)
- **NSC:** 7.7% p.a. (compounded annually, paid at maturity)
- **SSY:** 8.2% p.a. (compounded annually)
- **SCSS:** 8.2% p.a. (paid quarterly)
- **SGB:** 2.5% p.a. + gold price appreciation
- **FD:** 5.5-7.5% p.a. (varies by bank/tenure)
- **NPS:** 8-12% expected (market-linked)
- **SIP/Mutual Funds:** 10-15% expected (market-linked)
- **ELSS:** 12-15% expected (market-linked)
- **Equity:** Variable (market-dependent)

## 🎨 Design System

- **Primary Colors:** Teal/Green (#14B8A6, #22d3ee)
- **Secondary Colors:** Indigo (#6366F1, #2563eb)
- **Typography:** Inter, Roboto, Nunito
- **Dark Mode:** Fully supported with localStorage persistence

## 📄 License

MIT

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

**Built with ❤️ for Indian investors who want to take control of their financial future.**
