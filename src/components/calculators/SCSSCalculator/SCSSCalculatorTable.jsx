import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SCSS Calculator Evolution Table
 * Displays year-wise breakdown of SCSS investment
 * 
 * @param {Array} evolution - Evolution data from useSCSSCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const SCSSCalculatorTable = ({ evolution, tenure }) => {
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

export default SCSSCalculatorTable

