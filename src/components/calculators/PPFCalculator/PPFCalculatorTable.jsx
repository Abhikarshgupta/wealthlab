import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * PPF Calculator Evolution Table
 * Displays year-wise breakdown of PPF investment
 * 
 * @param {Array} evolution - Evolution data from usePPFCalculator hook
 */
const PPFCalculatorTable = ({ evolution }) => {
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

export default PPFCalculatorTable

