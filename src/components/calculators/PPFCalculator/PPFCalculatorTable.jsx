import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * PPF Calculator Evolution Table
 * Displays year-wise breakdown of PPF investment
 * 
 * @param {Array} evolution - Evolution data from usePPFCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const PPFCalculatorTable = ({ evolution, tenure }) => {
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

export default PPFCalculatorTable

