import ResultCard from '@/components/common/ResultCard/ResultCard'
import PieChart from '@/components/common/PieChart/PieChart'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * Equity Calculator Results Panel
 * Displays calculated results including total invested, returns, corpus, XIRR, and pie chart
 * 
 * @param {Object} results - Calculation results from useEquityCalculator hook
 */
const EquityCalculatorResults = ({ results }) => {
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
            {realReturns < 0 && (
              <span className="ml-2 text-sm font-normal">⚠️ Important Clarification Below</span>
            )}
          </h3>
          
          {realReturns < 0 ? (
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-300 dark:border-red-700">
                <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
                  ⚠️ You're NOT Losing Money - Here's What This Actually Means:
                </p>
                <ul className="text-xs text-red-800 dark:text-red-300 space-y-2 ml-4 list-disc">
                  <li>
                    <strong>You're still gaining wealth:</strong> Your nominal corpus ({formatCurrency(corpusValue)}) is significantly higher than what you invested ({formatCurrency(totalInvested)}). You've earned {formatCurrency(returnsEarned)} in absolute terms.
                  </li>
                  <li>
                    <strong>What "Real Returns" means:</strong> Real returns show your purchasing power in today's terms. This calculation deflates your future corpus value to account for inflation over the investment period.
                  </li>
                  <li>
                    <strong>Why step-up SIP can show negative real returns:</strong> With step-up SIP, you invest more money over time than regular SIP. Later investments are worth less in today's terms due to inflation. When comparing total invested (which includes future-value investments) against real corpus value (deflated to today's terms), it can appear negative even though you're growing wealth.
                  </li>
                  <li>
                    <strong>Key insight:</strong> Negative real returns don't mean you're losing money. They mean inflation is eroding purchasing power faster than your returns are growing it, OR that you're investing more money later when inflation has already reduced its purchasing power. Your wealth is still growing - it's just not keeping up with inflation in purchasing power terms.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-red-700 dark:text-red-400">
                <strong>Bottom line:</strong> You're building wealth ({formatCurrency(corpusValue)} corpus from {formatCurrency(totalInvested)} invested), but inflation is eroding purchasing power. Consider increasing your expected CAGR or adjusting your investment strategy to better beat inflation.
              </p>
            </div>
          ) : (
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
              <strong>Understanding Real vs Nominal:</strong> Real value shows purchasing power in today's terms. 
              Even with positive real returns, your real corpus will be less than nominal corpus because inflation erodes purchasing power over time.
              <span className="font-semibold"> Positive real returns mean your investment is beating inflation, but future money still has less purchasing power than today's money.</span>
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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

export default EquityCalculatorResults

