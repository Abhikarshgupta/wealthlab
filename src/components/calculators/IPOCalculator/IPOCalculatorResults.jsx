import ResultCard from '@/components/common/ResultCard/ResultCard'
import PieChart from '@/components/common/PieChart/PieChart'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * IPO Calculator Results Panel
 * Displays calculated results including listing gains, final value, tax, and pie chart
 * 
 * @param {Object} results - Calculation results from useIPOCalculator hook
 */
const IPOCalculatorResults = ({ results }) => {
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
    initialInvestment,
    listingValue,
    listingGain,
    listingGainPercentage,
    finalValue,
    totalReturns,
    totalReturnPercentage,
    overallCAGR,
    taxAmount,
    postTaxValue,
    postTaxReturns,
    isLongTerm,
    realFinalValue,
    realReturns,
    realReturnRate
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Initial Investment',
      y: initialInvestment,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Total Returns',
      y: totalReturns,
      color: totalReturns >= 0 ? '#14B8A6' : '#EF4444' // Teal for gains, Red for losses
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Results
      </h2>

      {/* Listing Gains Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Listing Day Results
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Listing Value</p>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(listingValue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Listing Gain/Loss</p>
            <p className={`text-xl font-bold ${
              listingGain >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(listingGain)} ({formatPercentageValue(listingGainPercentage)})
            </p>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Initial Investment"
          value={formatCurrency(initialInvestment)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <ResultCard
          label="Final Value"
          value={formatCurrency(finalValue)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <ResultCard
          label="Total Returns"
          value={`${formatCurrency(totalReturns)} (${formatPercentageValue(totalReturnPercentage)})`}
          icon={
            <svg className={`w-6 h-6 ${totalReturns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <ResultCard
          label="Overall CAGR"
          value={formatPercentageValue(overallCAGR)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Tax Information */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-3">
          Tax Implications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-purple-700 dark:text-purple-300">Tax Type</p>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
              {isLongTerm ? 'LTCG' : 'STCG'}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {isLongTerm 
                ? 'Long-term Capital Gains (held ≥ 1 year)' 
                : 'Short-term Capital Gains (held < 1 year)'}
            </p>
          </div>
          <div>
            <p className="text-sm text-purple-700 dark:text-purple-300">Tax Amount</p>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
              {formatCurrency(taxAmount)}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {isLongTerm 
                ? '10% above ₹1L exemption' 
                : '15% on all gains'}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300">Post-Tax Value</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(postTaxValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300">Post-Tax Returns</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(postTaxReturns)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inflation-adjusted results (if enabled) */}
      {realFinalValue !== null && realFinalValue !== undefined && (
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Final Value</p>
              <p className={`text-xl font-bold ${
                realReturns < 0 
                  ? 'text-red-900 dark:text-red-100' 
                  : 'text-yellow-900 dark:text-yellow-100'
              }`}>
                {formatCurrency(realFinalValue)}
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
          key={`${initialInvestment}-${totalReturns}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default IPOCalculatorResults

