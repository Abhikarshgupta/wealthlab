import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * ETF Calculator Evolution Table
 * Displays year-wise breakdown of ETF investment
 * 
 * @param {Array} evolution - Evolution data from useETFCalculator hook
 */
const ETFCalculatorTable = ({ evolution }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution"
    />
  )
}

export default ETFCalculatorTable

