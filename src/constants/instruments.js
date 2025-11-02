/**
 * Available investment instruments configuration
 */
export const availableInstruments = [
  { id: 'ppf', name: 'PPF', fullName: 'Public Provident Fund', icon: '💰' },
  { id: 'fd', name: 'FD', fullName: 'Fixed Deposit', icon: '🏦' },
  { id: 'sip', name: 'SIP', fullName: 'Systematic Investment Plan', icon: '📈' },
  { id: 'ssy', name: 'SSY', fullName: 'Sukanya Samriddhi Yojana', icon: '👧' },
  { id: 'nsc', name: 'NSC', fullName: 'National Savings Certificate', icon: '📜' },
  { id: 'scss', name: 'SCSS', fullName: 'Senior Citizens Savings Scheme', icon: '👴' },
  { id: 'sgb', name: 'SGB', fullName: 'Sovereign Gold Bond', icon: '🥇' },
  { id: 'nps', name: 'NPS', fullName: 'National Pension System', icon: '🎯' },
  { id: 'equity', name: 'Equity', fullName: 'Equity/Mutual Funds', icon: '📊' },
  { id: 'elss', name: 'ELSS', fullName: 'Equity Linked Savings Scheme', icon: '💎' },
  { id: 'ipo', name: 'IPO/FPO', fullName: 'Initial/Follow-on Public Offer', icon: '🚀' },
  { id: 'rd', name: 'RD', fullName: 'Recurring Deposit', icon: '💳' },
  { id: 'debtMutualFund', name: 'Debt MF', fullName: 'Debt Mutual Funds', icon: '📉' },
  { id: 'etf', name: 'ETF', fullName: 'Exchange Traded Funds', icon: '📉' },
  { id: 'reits', name: 'REITs', fullName: 'Real Estate Investment Trusts', icon: '🏢' },
  { id: 'bonds54EC', name: '54EC Bonds', fullName: 'Capital Gain Bonds', icon: '🏛️' },
]

/**
 * Step configuration for corpus simulator
 */
export const corpusSteps = [
  {
    number: 1,
    title: 'Select Investment Instruments',
    shortTitle: 'Select Instruments',
  },
  {
    number: 2,
    title: 'Investment Details',
    shortTitle: 'Investment Details',
  },
  {
    number: 3,
    title: 'Settings',
    shortTitle: 'Settings',
  },
  {
    number: 4,
    title: 'Results',
    shortTitle: 'Results',
  },
]

