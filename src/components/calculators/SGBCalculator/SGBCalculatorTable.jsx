import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SGB Calculator Evolution Table
 * Displays year-wise breakdown of SGB investment
 * 
 * @param {Array} evolution - Evolution data from useSGBCalculator hook
 */
const SGBCalculatorTable = ({ evolution }) => {
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

export default SGBCalculatorTable

