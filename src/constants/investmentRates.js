// Investment Rates Constants
// Last Updated: November 2025

export const investmentRates = {
  ppf: {
    rate: 7.1,
    compounding: 'annual',
    lastUpdated: '2025-11-01',
    minInvestment: 500,
    maxInvestment: 150000,
    lockInPeriod: 15,
  },
  nsc: {
    rate: 7.7,
    compounding: 'annual',
    lastUpdated: '2025-11-01',
    minInvestment: 1000,
    maxInvestment: null,
    lockInPeriod: 5,
  },
  ssy: {
    rate: 8.2,
    compounding: 'annual',
    lastUpdated: '2025-11-01',
    minInvestment: 250,
    maxInvestment: 150000,
    lockInPeriod: 21, // Till girl child turns 21
  },
  scss: {
    rate: 8.2,
    compounding: 'quarterly',
    lastUpdated: '2025-11-01',
    minInvestment: 1000,
    maxInvestment: 3000000,
    lockInPeriod: 5,
  },
  sgb: {
    fixedRate: 2.5, // Per annum, paid semi-annually
    goldAppreciation: 8, // Expected, user adjustable
    lastUpdated: '2025-11-01',
    minInvestment: 1, // In grams
    lockInPeriod: 5, // Exit option after 5 years
  },
  fd: {
    // Varies by bank and tenure - using average
    rate: 6.5,
    compounding: 'quarterly',
    lastUpdated: '2025-11-01',
    minInvestment: 1000,
    maxInvestment: null,
  },
  nps: {
    // Market-linked, expected returns
    equity: 12,
    debt: 8,
    corporateBonds: 9,
    lastUpdated: '2025-11-01',
  },
  sip: {
    // Market-linked mutual funds
    expectedReturn: 12,
    lastUpdated: '2025-11-01',
  },
  elss: {
    expectedReturn: 14,
    lockInPeriod: 3,
    lastUpdated: '2025-11-01',
  },
  equity: {
    // User input expected
    defaultExpectedReturn: 12,
    lastUpdated: '2025-11-01',
  },
}

export default investmentRates