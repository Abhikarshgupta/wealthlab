import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * Equity Calculator Evolution Table
 * Displays year-wise breakdown of equity investment
 * 
 * @param {Array} evolution - Evolution data from useEquityCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const EquityCalculatorTable = ({ evolution, tenure }) => {
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

export default EquityCalculatorTable

