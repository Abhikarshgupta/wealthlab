import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SCSS Calculator Evolution Table
 * Displays year-wise breakdown of SCSS investment
 * 
 * @param {Array} evolution - Evolution data from useSCSSCalculator hook
 */
const SCSSCalculatorTable = ({ evolution }) => {
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

export default SCSSCalculatorTable

