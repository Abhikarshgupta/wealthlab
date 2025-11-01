import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * Equity Calculator Evolution Table
 * Displays year-wise breakdown of equity investment
 * 
 * @param {Array} evolution - Evolution data from useEquityCalculator hook
 */
const EquityCalculatorTable = ({ evolution }) => {
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

export default EquityCalculatorTable

