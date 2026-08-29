// Investment Rates Constants
// Last Updated: August 2026

export const investmentRates = {
  ppf: {
    rate: 7.1,
    compounding: 'annual',
    lastUpdated: '2026-08-29',
    minInvestment: 500,
    maxInvestment: 150000,
    lockInPeriod: 15,
  },
  nsc: {
    rate: 7.7,
    compounding: 'annual',
    lastUpdated: '2026-08-29',
    minInvestment: 1000,
    maxInvestment: null,
    lockInPeriod: 5,
  },
  ssy: {
    rate: 8.2,
    compounding: 'annual',
    lastUpdated: '2026-08-29',
    minInvestment: 250,
    maxInvestment: 150000,
    lockInPeriod: 21, // Till girl child turns 21
  },
  scss: {
    rate: 8.2,
    compounding: 'quarterly',
    lastUpdated: '2026-08-29',
    minInvestment: 1000,
    maxInvestment: 3000000,
    lockInPeriod: 5,
  },
  pomis: {
    rate: 7.4,
    compounding: 'monthly',
    lastUpdated: '2026-08-29',
    minInvestment: 1000,
    maxInvestmentSingle: 900000,
    maxInvestmentJoint: 1500000,
    lockInPeriod: 5,
  },
  sgb: {
    fixedRate: 2.5, // Per annum, paid semi-annually
    goldAppreciation: 8, // Expected, user adjustable
    lastUpdated: '2026-08-29',
    minInvestment: 1, // In grams
    lockInPeriod: 5, // Exit option after 5 years
  },
  fd: {
    // Varies by bank and tenure - using average
    rate: 6.5,
    compounding: 'quarterly',
    lastUpdated: '2026-08-29',
    minInvestment: 1000,
    maxInvestment: null,
  },
  rd: {
    // Recurring Deposit - typically similar to FD rates
    rate: 6.5,
    compounding: 'quarterly',
    lastUpdated: '2026-08-29',
    minInvestment: 500,
    maxInvestment: null,
  },
  nps: {
    // Market-linked, expected returns
    equity: 12,
    debt: 8,
    corporateBonds: 9,
    lastUpdated: '2026-08-29',
  },
  sip: {
    // Market-linked mutual funds
    expectedReturn: 12,
    lastUpdated: '2026-08-29',
  },
  elss: {
    expectedReturn: 14,
    lockInPeriod: 3,
    lastUpdated: '2026-08-29',
  },
  equity: {
    // User input expected
    defaultExpectedReturn: 12,
    lastUpdated: '2026-08-29',
  },
  etf: {
    equity: 12,
    debt: 7,
    gold: 8,
    international: 10,
    lastUpdated: '2025-01-01',
  },
  debtMutualFund: {
    liquid: 6.5, // Liquid funds (0-90 days)
    shortTerm: 7.5, // Short-term debt (1-3 years)
    longTerm: 8.5, // Long-term debt (3+ years)
    gilt: 7.8, // Gilt funds
    corporateBond: 8.2, // Corporate bond funds
    lastUpdated: '2025-01-01',
  },
  reits: {
    dividendYield: 7, // Default dividend yield percentage
    capitalAppreciation: 6, // Default capital appreciation percentage
    lastUpdated: '2025-01-01',
  },
  bonds54EC: {
    rate: 5.25, // PFC/REC 54EC series FY 2025-26 (% p.a.)
    compounding: 'annual',
    lastUpdated: '2026-08-29',
    minInvestment: 1000,
    maxInvestment: 5000000, // ₹50L per financial year
    lockInPeriod: 5,
  },
}

export default investmentRates