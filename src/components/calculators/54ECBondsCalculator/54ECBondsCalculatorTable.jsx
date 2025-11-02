import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * 54EC Bonds Calculator Evolution Table
 * Displays year-wise breakdown of 54EC Bonds investment
 * 
 * @param {Array} evolution - Evolution data from use54ECBondsCalculator hook
 */
const Bonds54ECCalculatorTable = ({ evolution }) => {
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

export default Bonds54ECCalculatorTable

