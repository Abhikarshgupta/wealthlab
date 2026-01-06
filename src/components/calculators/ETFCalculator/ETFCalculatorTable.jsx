import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * ETF Calculator Evolution Table
 * Displays year-wise breakdown of ETF investment
 * 
 * @param {Array} evolution - Evolution data from useETFCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const ETFCalculatorTable = ({ evolution, tenure }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution"
      tenure={tenure}
    />
  )
}

export default ETFCalculatorTable

