import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SGB Calculator Evolution Table
 * Displays year-wise breakdown of SGB investment
 * 
 * @param {Array} evolution - Evolution data from useSGBCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const SGBCalculatorTable = ({ evolution, tenure }) => {
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

export default SGBCalculatorTable

