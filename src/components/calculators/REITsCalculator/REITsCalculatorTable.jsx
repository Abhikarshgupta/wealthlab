import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * REITs Calculator Evolution Table
 * Displays year-wise breakdown of REITs investment including dividends and capital appreciation
 * 
 * @param {Array} evolution - Evolution data from useREITsCalculator hook
 */
const REITsCalculatorTable = ({ evolution }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Transform evolution data for InvestmentTable format
  const tableData = evolution.map((yearData, index) => {
    const openingBalance = index === 0 
      ? yearData.investmentValue - yearData.totalReturn 
      : evolution[index - 1].investmentValue
    const closingBalance = yearData.investmentValue
    
    return {
      year: yearData.year,
      openingBalance,
      investment: 0, // No new investment in REITs after initial
      interest: yearData.dividendIncome + yearData.capitalGain, // Total returns (dividend + capital gain)
      closingBalance,
      // Store additional data for potential future use
      dividendIncome: yearData.dividendIncome,
      capitalGain: yearData.capitalGain,
    }
  })

  return (
    <InvestmentTable
      data={tableData}
      title="Year-wise Investment Evolution (Dividend + Capital Appreciation)"
    />
  )
}

export default REITsCalculatorTable


