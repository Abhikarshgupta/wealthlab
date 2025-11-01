import ResultCard from '@/components/common/ResultCard/ResultCard'
import PieChart from '@/components/common/PieChart/PieChart'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * SGB Calculator Results Panel
 * Displays calculated results including principal, returns, maturity amount, and pie chart
 * 
 * @param {Object} results - Calculation results from useSGBCalculator hook
 */
const SGBCalculatorResults = ({ results }) => {
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
    principal,
    goldAmount,
    maturityAmount,
    goldAppreciatedValue,
    fixedInterestAmount,
    totalReturns,
    effectiveReturn,
    cagr,
    realMaturityAmount,
    realTotalReturns,
    realReturnRate
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Principal Invested',
      y: principal,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Fixed Interest',
      y: fixedInterestAmount,
      color: '#14B8A6' // Teal
    },
    {
      name: 'Gold Appreciation',
      y: goldAppreciatedValue - principal,
      color: '#F59E0B' // Amber
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
          label="Principal Invested"
          value={formatCurrency(principal)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <ResultCard
          label="Gold Amount"
          value={`${goldAmount} grams`}
          icon={
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          }
        />
        <ResultCard
          label="Fixed Interest Earned"
          value={formatCurrency(fixedInterestAmount)}
          icon={
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <ResultCard
          label="Gold Appreciation"
          value={formatCurrency(goldAppreciatedValue - principal)}
          icon={
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <ResultCard
          label="Total Returns"
          value={formatCurrency(totalReturns)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
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
          label="Effective Return"
          value={formatPercentageValue(effectiveReturn)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <ResultCard
          label="CAGR"
          value={formatPercentageValue(cagr)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Inflation-adjusted results (if enabled) */}
      {realMaturityAmount !== null && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
            Inflation-Adjusted Results (Real Value)
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
            <strong>Understanding Real vs Nominal:</strong> Real value shows purchasing power in today's terms. 
            Even with positive real returns, your real corpus will be less than nominal corpus because inflation erodes purchasing power over time.
            {realTotalReturns < 0 && (
              <span className="font-semibold"> Negative real returns indicate your investment is losing purchasing power despite nominal growth.</span>
            )}
            {realTotalReturns >= 0 && (
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
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Real Returns</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {formatCurrency(realTotalReturns)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${principal}-${fixedInterestAmount}-${goldAppreciatedValue - principal}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default SGBCalculatorResults

