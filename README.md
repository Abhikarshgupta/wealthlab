# WealthLab

**Your personal finance experimentation lab** - A comprehensive financial planning and investment calculator platform built specifically for Indian retail investors. Take control of your financial future with real-time calculations, goal-based planning, and portfolio projections.

---

## 🎯 What WealthLab Offers

WealthLab empowers you to experiment with different investment strategies and gain complete control over your personal finance planning journey. Built with production-grade architecture, it provides:

### 📊 **17 Investment Calculators**

Calculate returns, tax implications, and real purchasing power for:

- **Fixed Income Instruments:** PPF, FD, NSC, SSY, SCSS, RD, POMIS
- **Equity Investments:** Equity (SIP/Lumpsum), SIP, ELSS, IPO/FPO, ETFs (Equity/Debt/Gold/International)
- **Advanced Instruments:** NPS, Debt Mutual Funds, SGB, REITs, 54EC Bonds

### 💰 **Post-Tax Calculations**

See the **actual money you'll receive** after tax deductions:

- **Tax-Aware Results:** All calculators show "Money in Hand" (post-tax amount)
- **Tax Breakdown:** Detailed tax calculations based on your income tax slab
- **Tax Rules:** Automatic application of LTCG/STCG rules, indexation benefits, exemptions
- **TDS Information:** Warnings when TDS thresholds are exceeded
- **Tax Slab Selection:** Choose your effective tax rate (5%, 20%, 30%)

### 📈 **Inflation-Adjusted Insights**

Understand **real purchasing power** of your investments:

- **Spending Power:** See how much your money will actually be worth in today's terms
- **Inflation Toggle:** Enable/disable inflation adjustments across all calculators
- **Real Returns:** Compare nominal vs. real returns to make informed decisions

### ✨ **Key Features**

- **Real-Time Calculations** - Instant results as you type, no calculate buttons needed
- **Visual Analytics** - Pie charts and year-wise evolution tables
- **Flexible Inputs** - Sliders, step-up options, multiple compounding frequencies
- **Comprehensive Information** - Current rates, tax benefits, eligibility criteria for each instrument
- **Beautiful UI** - Modern, responsive design with dark mode support
- **Production-Ready** - Scalable architecture built for performance and maintainability

### 🎯 **What Each Calculator Provides**

Every calculator includes:

- **Money in Hand** - Post-tax amount you'll actually receive
- **Spending Power** - Inflation-adjusted purchasing power (when enabled)
- **Tax Breakdown** - Detailed tax calculations with rules and exemptions
- **Investment Evolution** - Year-wise breakdown showing growth over time
- **Visual Charts** - Pie charts showing investment vs. returns breakdown
- **Current Rates** - Latest interest rates and market expectations
- **Tax Benefits** - Eligibility, exemptions, and tax-saving opportunities

---

## 🚀 Getting Started

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

### Testing

```bash
npm test              # Run tests
npm test:ui          # Run tests with UI
npm test:coverage    # Run tests with coverage
```

---

## 📊 Gold Price Integration

WealthLab uses GoldAPI.io for fetching real-time gold prices in the SGB Calculator:

- **Rate Limit:** Once per user per 24 hours (stored in localStorage)
- **Fallback:** Uses fallback price (₹6,500/gram) if API fails or rate limit is reached
- **Caching:** API responses are cached for 1 hour

Supported metals: Gold (XAU), Silver (XAG), Platinum (XPT), Palladium (XPD)

---

## 🛠️ Technology Stack

- **Framework:** React 19 with Vite
- **Styling:** TailwindCSS with dark mode support
- **State Management:** Zustand
- **Form Management:** React Hook Form + Joi validation
- **Routing:** React Router v6
- **Charts:** Highcharts
- **Testing:** Vitest + React Testing Library

---

## 📝 Current Interest Rates

*As of January 2025*

- **PPF:** 7.1% p.a. (compounded annually)
- **NSC:** 7.7% p.a. (compounded annually, paid at maturity)
- **SSY:** 8.2% p.a. (compounded annually)
- **SCSS:** 8.2% p.a. (paid quarterly)
- **SGB:** 2.5% p.a. + gold price appreciation
- **FD:** 5.5-7.5% p.a. (varies by bank/tenure)
- **RD:** 6.5-7.5% p.a. (varies by bank/tenure)
- **POMIS:** 7.4% p.a. (paid monthly)
- **NPS:** 8-12% expected (market-linked)
- **SIP/Mutual Funds:** 10-15% expected (market-linked)
- **ELSS:** 12-15% expected (market-linked)
- **Equity:** Variable (market-dependent)

---

## 🎨 Design System

- **Primary Colors:** Teal/Green (#14B8A6, #22d3ee)
- **Secondary Colors:** Indigo (#6366F1, #2563eb)
- **Typography:** Inter, Roboto, Nunito
- **Dark Mode:** Fully supported with localStorage persistence

---

## 📄 License

MIT

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

**Built with ❤️ for Indian investors who want to take control of their financial future.**
