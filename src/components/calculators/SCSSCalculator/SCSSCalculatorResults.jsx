import { useState } from 'react'
import ResultCard from '@/components/common/ResultCard/ResultCard'
import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * SCSS Calculator Results Panel
 * Displays calculated results including principal, interest, maturity amount, quarterly interest, and pie chart
 * 
 * @param {Object} results - Calculation results from useSCSSCalculator hook
 */
const SCSSCalculatorResults = ({ results }) => {
  const { adjustInflation, incomeTaxSlab } = useUserPreferencesStore()
  const [showDetails, setShowDetails] = useState(false)

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
    totalInterest,
    maturityAmount,
    quarterlyInterest,
    effectiveReturn,
    realMaturityAmount,
    realTotalInterest,
    realReturnRate,
    taxAmount,
    postTaxAmount,
    taxRule,
    tdsInfo,
    actualSpendingPower,
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Principal',
      y: principal,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Total Interest',
      y: totalInterest,
      color: '#14B8A6' // Teal
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Results
      </h2>

      {/* Hero Section: Money in Hand / Actual Spending Power */}
      <MoneyInHandHero
        postTaxAmount={postTaxAmount}
        actualSpendingPower={actualSpendingPower}
        inflationAdjusted={adjustInflation && actualSpendingPower !== null}
        taxSlab={incomeTaxSlab}
        taxAmount={taxAmount}
        instrumentType="scss"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={maturityAmount}
        principal={principal}
        returns={totalInterest}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRule={taxRule}
        tdsInfo={tdsInfo}
        instrumentType="scss"
      />

      {/* Details Section (Collapsible) */}
      <div className="mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-expanded={showDetails}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span className="text-lg">📋</span>
            {showDetails ? 'Hide' : 'View'} Details
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {showDetails ? '▼' : '▶'}
          </span>
        </button>

        {showDetails && (
          <div className="mt-2">
            {/* Results Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Total Invested"
          value={formatCurrency(principal)}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <ResultCard
          label="Total Interest"
          value={formatCurrency(totalInterest)}
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
            </div>

            {/* Quarterly Interest Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Quarterly Interest Payment
              </h3>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(quarterlyInterest)}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Interest is paid quarterly (every 3 months) to your bank account
              </p>
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                  How it's calculated:
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Quarterly Interest = (Investment Amount × Annual Rate) ÷ 4
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
                  💡 Tip: Changing tenure or age doesn't affect quarterly interest. Only investment amount and interest rate affect this value.
                </p>
              </div>
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
                  {realTotalInterest < 0 && (
                    <span className="font-semibold"> Negative real returns indicate your investment is losing purchasing power despite nominal growth.</span>
                  )}
                  {realTotalInterest >= 0 && (
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
                      {formatCurrency(realTotalInterest)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${principal}-${totalInterest}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default SCSSCalculatorResults

