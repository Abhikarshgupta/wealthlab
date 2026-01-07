import { formatCurrency } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { adjustForInflation } from '@/utils/calculations'

/**
 * InvestmentTable - Year-wise breakdown table with premium styling
 * @param {Object} props
 * @param {Array} props.data - Table data [{ year, openingBalance, investment, interest, closingBalance }] or [{ year, label, ... }]
 * @param {string} props.title - Table title
 * @param {number} props.tenure - Investment tenure in years (for inflation calculation)
 * @param {number} props.preTaxMaturity - Final pre-tax maturity amount (optional, for footer)
 * @param {number} props.taxAmount - Tax amount at maturity (optional, for footer)
 * @param {number} props.postTaxAmount - Final post-tax amount (optional, for footer)
 * @param {number} props.postTaxSpendingPower - Post-tax spending power if inflation enabled (optional, for footer)
 * @param {string} props.instrumentType - Instrument type for context (optional)
 */
const InvestmentTable = ({
  data = [],
  title = 'Year-wise Breakdown',
  className = '',
  tenure = null,
  preTaxMaturity = null,
  taxAmount = null,
  postTaxAmount = null,
  postTaxSpendingPower = null,
  instrumentType = null,
}) => {
  const { adjustInflation, defaultInflationRate, incomeTaxSlab } = useUserPreferencesStore()

  if (!data || data.length === 0) {
    return null
  }

  const totalInvestment = data.reduce((sum, row) => sum + (row.investment || 0), 0)
  const totalInterest = data.reduce((sum, row) => sum + (row.interest || 0), 0)
  const finalBalance = preTaxMaturity !== null ? preTaxMaturity : (data[data.length - 1]?.closingBalance || 0)

  // Calculate inflation-adjusted totals if enabled
  const inflationRateDecimal = defaultInflationRate / 100
  const finalYear = tenure || data.length
  const adjustedFinalBalance = adjustInflation
    ? adjustForInflation(finalBalance, inflationRateDecimal, finalYear)
    : null

  // Determine if we should show post-tax footer
  const showPostTaxFooter = preTaxMaturity !== null && taxAmount !== null && postTaxAmount !== null

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
            <tfoot>
              {/* Pre-Tax Summary Row */}
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t-2 border-gray-300 dark:border-gray-600">
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  Total (Pre-Tax)
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
                  <td className="px-6 py-4 text-sm text-right font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                    {adjustedFinalBalance !== null
                      ? formatCurrency(adjustedFinalBalance)
                      : '-'}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(finalBalance)}
                </td>
              </tr>
              
              {/* Post-Tax Summary Row (if tax data provided) */}
              {showPostTaxFooter && (
                <>
                  <tr className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-t-2 border-yellow-300 dark:border-yellow-700">
                    <td colSpan={adjustInflation ? 6 : 5} className="px-6 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💰</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          Post-Tax Summary (At Maturity)
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Final Pre-Tax Maturity
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    {adjustInflation && (
                      <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                        -
                      </td>
                    )}
                    <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                      {formatCurrency(preTaxMaturity)}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                    <td className="px-6 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
                      Tax at Maturity
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-red-600 dark:text-red-400 font-mono tabular-nums">
                      {formatCurrency(taxAmount)}
                      {incomeTaxSlab && (
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          (@ {Math.round(incomeTaxSlab * 100)}% slab)
                        </span>
                      )}
                    </td>
                    {adjustInflation && (
                      <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                        -
                      </td>
                    )}
                    <td className="px-6 py-3 text-sm text-right font-bold text-red-600 dark:text-red-400 font-mono tabular-nums">
                      -{formatCurrency(taxAmount)}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-800">
                    <td className="px-6 py-3 text-sm font-semibold text-green-700 dark:text-green-400">
                      Final Post-Tax Amount
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                      -
                    </td>
                    {adjustInflation && (
                      <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                        -
                      </td>
                    )}
                    <td className="px-6 py-3 text-sm text-right font-bold text-green-700 dark:text-green-400 font-mono text-lg tabular-nums">
                      {formatCurrency(postTaxAmount)}
                    </td>
                  </tr>
                  {adjustInflation && postTaxSpendingPower !== null && (
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-blue-200 dark:border-blue-800">
                      <td className="px-6 py-3 text-sm font-semibold text-blue-700 dark:text-blue-400">
                        Post-Tax Spending Power
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                        -
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                        -
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                        -
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-blue-700 dark:text-blue-400 font-mono tabular-nums">
                        {formatCurrency(postTaxSpendingPower)}
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          (@ {defaultInflationRate}% inflation)
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-bold text-blue-700 dark:text-blue-400 font-mono text-lg tabular-nums">
                        {formatCurrency(postTaxSpendingPower)}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default InvestmentTable