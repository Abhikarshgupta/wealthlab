import ResultCard from '@/components/common/ResultCard/ResultCard'
import PieChart from '@/components/common/PieChart/PieChart'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * NPS Calculator Results Panel
 * Displays calculated results including total invested, returns, corpus, weighted return, and pie chart
 * 
 * @param {Object} results - Calculation results from useNPSCalculator hook
 */
const NPSCalculatorResults = ({ results }) => {
  if (!results) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Results
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Enter values and ensure asset allocation totals 100% to see calculation results
        </p>
      </div>
    )
  }

  const {
    totalInvested,
    returnsEarned,
    corpusValue,
    weightedReturn,
    xirr,
    realCorpusValue,
    realReturns,
    realReturnRate,
    allocation,
    inputAllocation
  } = results

  // Check if allocation was adjusted (input differs from effective)
  const allocationAdjusted = inputAllocation && (
    Math.abs(inputAllocation.equity - allocation.equity) > 0.01 ||
    Math.abs(inputAllocation.corporateBonds - allocation.corporateBonds) > 0.01 ||
    Math.abs(inputAllocation.governmentBonds - allocation.governmentBonds) > 0.01 ||
    Math.abs(inputAllocation.alternative - allocation.alternative) > 0.01
  )

  // Prepare pie chart data for investment breakdown
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

  // Prepare pie chart data for asset allocation
  const allocationChartData = [
    {
      name: 'Equity',
      y: allocation.equity,
      color: '#3B82F6' // Blue
    },
    {
      name: 'Corporate Bonds',
      y: allocation.corporateBonds,
      color: '#10B981' // Green
    },
    {
      name: 'Government Bonds',
      y: allocation.governmentBonds,
      color: '#F59E0B' // Amber
    },
    ...(allocation.alternative > 0 ? [{
      name: 'Alternative',
      y: allocation.alternative,
      color: '#8B5CF6' // Purple
    }] : [])
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
          label="Weighted Return"
          value={formatPercentageValue(weightedReturn)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* XIRR Card */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">XIRR (Approximate)</span>
          </div>
          <span className="text-xl font-bold text-purple-900 dark:text-purple-100">
            {formatPercentageValue(xirr)}
          </span>
        </div>
      </div>

      {/* Inflation-adjusted results (if enabled) */}
      {realCorpusValue !== null && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
            Inflation-Adjusted Results (Real Value)
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
            <strong>Understanding Real vs Nominal:</strong> Real value shows purchasing power in today's terms. 
            Even with positive real returns, your real corpus will be less than nominal corpus because inflation erodes purchasing power over time.
            {realReturns < 0 && (
              <span className="font-semibold"> Negative real returns indicate your investment is losing purchasing power despite nominal growth.</span>
            )}
            {realReturns >= 0 && (
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
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Corpus Value</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {formatCurrency(realCorpusValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Returns</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {formatCurrency(realReturns)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Investment Breakdown Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${totalInvested}-${returnsEarned}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>

      {/* Asset Allocation Pie Chart */}
      <div className="mt-6">
        {allocationAdjusted && (
          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Note:</strong> Asset allocation has been adjusted to comply with PFRDA age-based regulations. 
              The chart below shows the effective allocation used in calculations.
            </p>
          </div>
        )}
        <PieChart
          key={`${allocation.equity}-${allocation.corporateBonds}-${allocation.governmentBonds}-${allocation.alternative}`}
          data={allocationChartData}
          title="Asset Allocation (Effective)"
          height={350}
        />
      </div>
    </div>
  )
}

export default NPSCalculatorResults

