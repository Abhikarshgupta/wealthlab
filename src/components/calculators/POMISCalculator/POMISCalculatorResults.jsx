import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * POMIS Calculator Results Panel
 * Displays calculated results including principal, interest, maturity amount, monthly interest, and pie chart
 * 
 * @param {Object} results - Calculation results from usePOMISCalculator hook
 */
const POMISCalculatorResults = ({ results }) => {
  const { adjustInflation, incomeTaxSlab } = useUserPreferencesStore()

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
    monthlyInterest,
    annualInterest,
    effectiveReturn,
    taxAmount,
    postTaxAmount,
    taxRule,
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
        effectiveReturn={effectiveReturn}
        instrumentType="pomis"
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
        instrumentType="pomis"
      />

      {/* Monthly Interest Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Monthly Income Payment
        </h3>
        <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
          {formatCurrency(monthlyInterest)}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
          Interest is paid monthly to your bank account
        </p>
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                Monthly Interest:
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {formatCurrency(monthlyInterest)}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                Annual Interest:
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {formatCurrency(annualInterest)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TDS Warning */}
      {annualInterest > 40000 && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
            TDS Applicable
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Your annual interest ({formatCurrency(annualInterest)}) exceeds ₹40,000. 
            TDS at 10% will be deducted unless you submit Form 15G/15H for exemption.
          </p>
        </div>
      )}

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

export default POMISCalculatorResults

