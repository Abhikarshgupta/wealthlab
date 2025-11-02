import ResultCard from '@/components/common/ResultCard/ResultCard'
import PieChart from '@/components/common/PieChart/PieChart'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * 54EC Bonds Calculator Results Panel
 * Displays calculated results including principal, interest earned, maturity amount, 
 * tax savings, and pie chart
 * 
 * @param {Object} results - Calculation results from use54ECBondsCalculator hook
 */
const Bonds54ECCalculatorResults = ({ results }) => {
  if (!results) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Results
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Enter values to see calculation results
        </p>
      </div>
    )
  }

  const {
    investmentAmount,
    interestEarned,
    maturityAmount,
    effectiveReturn,
    taxSaved,
    taxOnInterest,
    netTaxBenefit,
    exemptedCapitalGain,
    realMaturityAmount,
    realInterestEarned,
    realReturnRate
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Investment',
      y: investmentAmount,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Interest Earned',
      y: interestEarned,
      color: '#14B8A6' // Teal
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Results
      </h2>

      {/* Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Maturity Amount"
          value={formatCurrency(maturityAmount)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <ResultCard
          label="Interest Earned"
          value={formatCurrency(interestEarned)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <ResultCard
          label="Effective Return %"
          value={formatPercentageValue(effectiveReturn)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Tax Savings Section */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
          Tax Savings & Benefits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Capital Gain Exempted</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(exemptedCapitalGain)}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Tax Saved (on Capital Gains)</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(taxSaved)}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Tax on Interest (30% slab)</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(taxOnInterest)}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Net Tax Benefit</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(netTaxBenefit)}
            </p>
          </div>
        </div>
        <p className="text-xs text-green-700 dark:text-green-400 mt-3">
          <strong>Note:</strong> Tax calculations assume 20% LTCG tax on property sale and 30% income tax slab on interest. 
          Actual tax savings may vary based on your tax bracket.
        </p>
      </div>

      {/* Inflation-adjusted results (if enabled) */}
      {realMaturityAmount !== null && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
            Inflation-Adjusted Results (Real Value)
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
            <strong>Understanding Real vs Nominal:</strong> Real value shows purchasing power in today's terms. 
            Even with positive real returns, your real maturity amount will be less than nominal amount because inflation erodes purchasing power over time.
            {realInterestEarned < 0 && (
              <span className="font-semibold"> Negative real returns indicate your investment is losing purchasing power despite nominal growth.</span>
            )}
            {realInterestEarned >= 0 && (
              <span className="font-semibold"> Positive real returns mean your investment is beating inflation, but future money still has less purchasing power than today's money.</span>
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Return Rate</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {formatPercentageValue(realReturnRate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Maturity Amount</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {formatCurrency(realMaturityAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Interest Earned</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {formatCurrency(realInterestEarned)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${investmentAmount}-${interestEarned}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default Bonds54ECCalculatorResults

