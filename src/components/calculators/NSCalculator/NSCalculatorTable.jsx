import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * NSC Calculator Evolution Table
 * Displays year-wise breakdown of NSC investment
 * 
 * @param {Array} evolution - Evolution data from useNSCalculator hook
 */
const NSCalculatorTable = ({ evolution }) => {
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

export default NSCalculatorTable

