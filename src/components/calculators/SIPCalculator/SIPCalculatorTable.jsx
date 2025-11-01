import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SIP Calculator Evolution Table
 * Displays year-wise breakdown of SIP investment
 * 
 * @param {Array} evolution - Evolution data from useSIPCalculator hook
 */
const SIPCalculatorTable = ({ evolution }) => {
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

export default SIPCalculatorTable

