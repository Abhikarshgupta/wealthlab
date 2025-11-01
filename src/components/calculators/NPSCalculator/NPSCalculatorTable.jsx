import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * NPS Calculator Evolution Table
 * Displays year-wise breakdown of NPS investment
 * 
 * @param {Array} evolution - Evolution data from useNPSCalculator hook
 */
const NPSCalculatorTable = ({ evolution }) => {
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

export default NPSCalculatorTable

