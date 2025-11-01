import { formatCurrency } from '@/utils/formatters'

/**
 * InvestmentTable - Year-wise breakdown table with premium styling
 * @param {Object} props
 * @param {Array} props.data - Table data [{ year, openingBalance, investment, interest, closingBalance }]
 * @param {string} props.title - Table title
 */
const InvestmentTable = ({ 
  data = [], 
  title = 'Year-wise Breakdown',
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return null
  }

  const totalInvestment = data.reduce((sum, row) => sum + (row.investment || 0), 0)
  const totalInterest = data.reduce((sum, row) => sum + (row.interest || 0), 0)
  const finalBalance = data[data.length - 1]?.closingBalance || 0

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
                Year
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
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Closing Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => (
              <tr 
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  {row.year}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white font-mono font-bold tabular-nums">
                  {formatCurrency(row.closingBalance || 0)}
                </td>
              </tr>
            ))}
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