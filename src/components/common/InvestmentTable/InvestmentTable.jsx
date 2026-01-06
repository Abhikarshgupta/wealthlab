import { formatCurrency } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { adjustForInflation } from '@/utils/calculations'

/**
 * InvestmentTable - Year-wise breakdown table with premium styling
 * @param {Object} props
 * @param {Array} props.data - Table data [{ year, openingBalance, investment, interest, closingBalance }] or [{ year, label, ... }]
 * @param {string} props.title - Table title
 * @param {number} props.tenure - Investment tenure in years (for inflation calculation)
 */
const InvestmentTable = ({
  data = [],
  title = 'Year-wise Breakdown',
  className = '',
  tenure = null,
}) => {
  const { adjustInflation, defaultInflationRate } = useUserPreferencesStore()

  if (!data || data.length === 0) {
    return null
  }

  const totalInvestment = data.reduce((sum, row) => sum + (row.investment || 0), 0)
  const totalInterest = data.reduce((sum, row) => sum + (row.interest || 0), 0)
  const finalBalance = data[data.length - 1]?.closingBalance || 0

  // Calculate inflation-adjusted totals if enabled
  const inflationRateDecimal = defaultInflationRate / 100
  const finalYear = tenure || data.length
  const adjustedFinalBalance = adjustInflation
    ? adjustForInflation(finalBalance, inflationRateDecimal, finalYear)
    : null
  const adjustedTotalInterest = adjustInflation
    ? adjustForInflation(totalInterest, inflationRateDecimal, finalYear)
    : null

  // Determine if this is monthly or yearly breakdown
  const isMonthly = data.length > 0 && data[0].label && data[0].label.startsWith('Month')
  const periodLabel = isMonthly ? 'Period' : 'Year'

  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {periodLabel}
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Opening Balance
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Investment
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Interest/Returns
              </th>
              {adjustInflation && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Adjusted Value
                  <span className="block text-[10px] font-normal text-gray-500 dark:text-gray-400 mt-0.5">
                    (@ {defaultInflationRate}%)
                  </span>
                </th>
              )}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Closing Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => {
              const yearNumber = isMonthly
                ? Math.floor(index / 12) + 1
                : index + 1
              const adjustedClosingBalance = adjustInflation
                ? adjustForInflation(
                    row.closingBalance || 0,
                    inflationRateDecimal,
                    yearNumber
                  )
                : null

              return (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {row.label || row.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                    {formatCurrency(row.openingBalance || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                    {formatCurrency(row.investment || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400 font-mono font-semibold tabular-nums">
                    {formatCurrency(row.interest || 0)}
                  </td>
                  {adjustInflation && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 dark:text-blue-400 font-mono font-semibold tabular-nums">
                      {adjustedClosingBalance !== null
                        ? formatCurrency(adjustedClosingBalance)
                        : '-'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white font-mono font-bold tabular-nums">
                    {formatCurrency(row.closingBalance || 0)}
                  </td>
                </tr>
              )
            })}
          </tbody>
          {data.length > 0 && (
            <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t-2 border-gray-300 dark:border-gray-600">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                  -
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(totalInvestment)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-green-600 dark:text-green-400 font-mono tabular-nums">
                  {formatCurrency(totalInterest)}
                </td>
                {adjustInflation && (
                  <td className="px-6 py-4 text-sm text-right font-bold text-blue-600 dark:text-blue-400 font-mono text-lg tabular-nums">
                    {adjustedFinalBalance !== null
                      ? formatCurrency(adjustedFinalBalance)
                      : '-'}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900 dark:text-white font-mono text-lg tabular-nums">
                  {formatCurrency(finalBalance)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default InvestmentTable