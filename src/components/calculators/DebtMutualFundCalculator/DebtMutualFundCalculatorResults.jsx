import ResultCard from '@/components/common/ResultCard/ResultCard'
import PieChart from '@/components/common/PieChart/PieChart'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * Debt Mutual Fund Calculator Results Panel
 * Displays calculated results including total invested, returns, corpus, XIRR, and pie chart
 * 
 * @param {Object} results - Calculation results from useDebtMutualFundCalculator hook
 */
const DebtMutualFundCalculatorResults = ({ results }) => {
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
    totalInvested,
    returnsEarned,
    corpusValue,
    xirr,
    realCorpusValue,
    realReturns,
    realReturnRate
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Total Invested',
      y: totalInvested,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Returns Earned',
      y: returnsEarned,
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
          label="Total Invested"
          value={formatCurrency(totalInvested)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <ResultCard
          label="Returns Earned"
          value={formatCurrency(returnsEarned)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <ResultCard
          label="Corpus Value"
          value={formatCurrency(corpusValue)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <ResultCard
          label="Expected CAGR"
          value={formatPercentageValue(xirr)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Inflation-adjusted results (if enabled) */}
      {realCorpusValue !== null && (
        <div className={`mt-6 p-4 border rounded-lg ${
          realReturns < 0 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            realReturns < 0 
              ? 'text-red-900 dark:text-red-200' 
              : 'text-yellow-900 dark:text-yellow-200'
          }`}>
            Inflation-Adjusted Results (Real Value)
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
            <strong>Understanding Real vs Nominal:</strong> Real value shows purchasing power in today's terms. 
            Even with positive real returns, your real corpus will be less than nominal corpus because inflation erodes purchasing power over time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Return Rate</p>
              <p className={`text-xl font-bold ${
                realReturns < 0 
                  ? 'text-red-900 dark:text-red-100' 
                  : 'text-yellow-900 dark:text-yellow-100'
              }`}>
                {formatPercentageValue(realReturnRate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Corpus Value</p>
              <p className={`text-xl font-bold ${
                realReturns < 0 
                  ? 'text-red-900 dark:text-red-100' 
                  : 'text-yellow-900 dark:text-yellow-100'
              }`}>
                {formatCurrency(realCorpusValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Returns</p>
              <p className={`text-xl font-bold ${
                realReturns < 0 
                  ? 'text-red-900 dark:text-red-100' 
                  : 'text-yellow-900 dark:text-yellow-100'
              }`}>
                {formatCurrency(realReturns)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tax Efficiency Note */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Tax Efficiency Note
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
          Debt mutual funds offer tax advantages over Fixed Deposits:
        </p>
        <ul className="text-xs text-blue-700 dark:text-blue-400 ml-4 list-disc space-y-1">
          <li>
            <strong>Long-term (held &gt;3 years):</strong> LTCG taxed at 20% with indexation benefit, which reduces effective tax rate significantly
          </li>
          <li>
            <strong>Short-term (held &lt;3 years):</strong> STCG taxed as per your income tax slab
          </li>
          <li>
            <strong>No TDS:</strong> Unlike FDs, no TDS is deducted on redemption
          </li>
          <li>
            <strong>Post-tax returns:</strong> After accounting for indexation, debt mutual funds often provide better post-tax returns than FDs
          </li>
        </ul>
      </div>

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${totalInvested}-${returnsEarned}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default DebtMutualFundCalculatorResults

