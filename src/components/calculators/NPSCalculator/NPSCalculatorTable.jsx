import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * NPS Calculator Evolution Table
 * Displays year-wise breakdown of NPS investment
 * 
 * @param {Array} evolution - Evolution data from useNPSCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const NPSCalculatorTable = ({ evolution, tenure }) => {
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

export default NPSCalculatorTable

