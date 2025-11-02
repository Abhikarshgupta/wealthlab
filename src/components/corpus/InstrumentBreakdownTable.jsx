import { useState } from 'react'
import React from 'react'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import { getTaxRateForInstrument, calculateTaxOnWithdrawal } from '@/utils/taxCalculations'
import { convertYearsMonthsToYears, migrateFDData } from '@/utils/fdTenureUtils'
import TaxEducationPanelOverlay from './TaxEducationPanelOverlay'

/**
 * Instrument Breakdown Table Component
 * Displays per-instrument contributions to the total corpus with expandable tax details
 */
const InstrumentBreakdownTable = ({ results, investments, instruments, settings }) => {
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [showTaxEducationPanel, setShowTaxEducationPanel] = useState(false)

  if (!results || !results.byInstrument || Object.keys(results.byInstrument).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No instrument data available.
      </div>
    )
  }

  /**
   * Toggle row expansion
   */
  const toggleRow = (instrumentType) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(instrumentType)) {
      newExpanded.delete(instrumentType)
    } else {
      newExpanded.add(instrumentType)
    }
    setExpandedRows(newExpanded)
  }

  /**
   * Calculate tax details for an instrument
   */
  const calculateTaxDetails = (instrumentType, maturityValue, investmentData, returns) => {
    const taxMethod = settings?.taxMethod || 'withdrawal'
    const incomeTaxSlab = settings?.incomeTaxSlab || 0.30
    
    if (taxMethod === 'withdrawal') {
      // Handle FD tenure conversion (years + months to total years)
      let tenure = 0
      if (instrumentType === 'fd' && investmentData) {
        const migratedData = migrateFDData(investmentData)
        if (migratedData.tenureYears !== undefined || migratedData.tenureMonths !== undefined) {
          tenure = convertYearsMonthsToYears(migratedData.tenureYears || 0, migratedData.tenureMonths || 0)
        } else if (investmentData.tenure && investmentData.tenureUnit) {
          tenure = investmentData.tenureUnit === 'months' ? investmentData.tenure / 12 : investmentData.tenure
        }
      } else {
        tenure = investmentData?.tenure || 0
      }
      
      const taxResult = calculateTaxOnWithdrawal(
        maturityValue,
        instrumentType,
        tenure,
        {
          incomeTaxSlab, // Use user-selected tax bracket
          investmentData, // Pass investment data for accurate calculation
          returns, // Pass actual returns if available
        }
      )
      return taxResult
    }
    
    // For accumulation or both methods, return simplified result
    return {
      taxAmount: 0,
      postTaxCorpus: maturityValue,
      taxRate: 0,
    }
  }

  // Get instrument display names
  const instrumentNames = {
    ppf: 'PPF',
    fd: 'Fixed Deposit',
    sip: 'SIP',
    ssy: 'SSY',
    nsc: 'NSC',
    scss: 'SCSS',
    sgb: 'SGB',
    nps: 'NPS',
    equity: 'Equity',
    elss: 'ELSS',
  }

  // Prepare table data
  const tableData = instruments
    .map((instrumentType) => {
      const instrumentData = results.byInstrument[instrumentType]
      if (!instrumentData) return null

      const taxRule = getTaxRateForInstrument(instrumentType)
      const investmentData = investments[instrumentType] || {}
      const maturityValue = instrumentData.maturityValue || 0
      const returns = instrumentData.returns || 0 // Get actual returns from corpus calculation
      const taxDetails = calculateTaxDetails(instrumentType, maturityValue, investmentData, returns)

      return {
        instrumentType,
        instrumentName: instrumentNames[instrumentType] || instrumentType.toUpperCase(),
        investedAmount: instrumentData.investedAmount || 0,
        maturityValue,
        returns: instrumentData.returns || 0,
        percentage: instrumentData.percentage || 0,
        taxRule: taxRule.notes || 'N/A',
        taxDetails,
        isExpanded: expandedRows.has(instrumentType),
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.maturityValue - a.maturityValue) // Sort by maturity value descending

  const totalInvested = results.totalInvested || 0
  const totalMaturity = results.nominalCorpus || 0
  const totalReturns = results.totalReturns || 0
  
  // Calculate total tax by summing individual instrument taxes
  const totalTax = tableData.reduce((sum, row) => sum + (row.taxDetails.taxAmount || 0), 0)
  
  // Calculate total post-tax corpus by summing individual post-tax values
  const totalPostTaxCorpus = tableData.reduce((sum, row) => sum + (row.taxDetails.postTaxCorpus || 0), 0)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Instrument-Wise Breakdown
      </h3>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12">
                {/* Expand/collapse column */}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Instrument
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Invested
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Returns
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Maturity Value
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Tax Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Post-Tax Value
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                % of Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Tax Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {tableData.map((row) => (
              <React.Fragment key={row.instrumentType}>
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => toggleRow(row.instrumentType)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRow(row.instrumentType)
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                      aria-label={row.isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${row.isExpanded ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {row.instrumentName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                    {formatCurrency(row.investedAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400 font-mono font-semibold tabular-nums">
                    {formatCurrency(row.returns)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white font-mono font-bold tabular-nums">
                    {formatCurrency(row.maturityValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400 font-mono font-semibold tabular-nums">
                    {formatCurrency(row.taxDetails.taxAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white font-mono font-bold tabular-nums">
                    {formatCurrency(row.taxDetails.postTaxCorpus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                    <div className="flex items-center justify-end space-x-2">
                      <span>{formatPercentage(row.percentage / 100, 1)}</span>
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 dark:bg-green-500 transition-all"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="max-w-xs">
                      <span className="text-xs">{row.taxRule}</span>
                    </div>
                  </td>
                </tr>
                {row.isExpanded && (
                  <tr className="bg-gray-50 dark:bg-gray-800/30">
                    <td colSpan={9} className="px-6 py-4">
                      <div className="ml-8 space-y-3">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Tax Calculation Details
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Interest Earned</div>
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400 font-mono">
                              {formatCurrency(row.returns)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax Rate on Interest</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {row.taxDetails.taxAmount > 0 && row.returns > 0
                                ? formatPercentage((settings?.incomeTaxSlab || 0.30), 0)
                                : 'Tax-Free'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              (Your tax bracket)
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Effective Tax Rate</div>
                            <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                              {row.taxDetails.taxRate > 0 
                                ? formatPercentage(row.taxDetails.taxRate / 100, 2) 
                                : 'Tax-Free'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              (Tax ÷ Maturity Value)
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax Amount</div>
                            <div className="text-sm font-semibold text-red-600 dark:text-red-400 font-mono">
                              {formatCurrency(row.taxDetails.taxAmount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Post-Tax Value</div>
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400 font-mono">
                              {formatCurrency(row.taxDetails.postTaxCorpus)}
                            </div>
                          </div>
                        </div>
                        {/* Explanation */}
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="text-xs text-blue-800 dark:text-blue-300">
                            <strong>Understanding the Tax Rates:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>
                                <strong>Tax Rate on Interest ({formatPercentage((settings?.incomeTaxSlab || 0.30), 0)}):</strong> This is your income tax bracket rate, applied to the interest earned (₹{formatCurrency(row.returns, false)}).
                              </li>
                              <li>
                                <strong>Effective Tax Rate ({formatPercentage(row.taxDetails.taxRate / 100, 2)}):</strong> This shows what percentage of your total maturity value (₹{formatCurrency(row.maturityValue, false)}) goes to tax. It's lower because tax is only on interest, not the principal.
                              </li>
                              <li>
                                <strong>Calculation:</strong> Tax = Interest × Tax Bracket = ₹{formatCurrency(row.returns, false)} × {formatPercentage((settings?.incomeTaxSlab || 0.30), 0)} = ₹{formatCurrency(row.taxDetails.taxAmount, false)}
                              </li>
                            </ul>
                          </div>
                        </div>
                        {row.taxRule && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <strong>Tax Rule:</strong> {row.taxRule}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t-2 border-gray-300 dark:border-gray-600">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white"></td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                Total
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                {formatCurrency(totalInvested)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-green-600 dark:text-green-400 font-mono tabular-nums">
                {formatCurrency(totalReturns)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900 dark:text-white font-mono text-lg tabular-nums">
                {formatCurrency(totalMaturity)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-red-600 dark:text-red-400 font-mono tabular-nums">
                {formatCurrency(totalTax)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-green-600 dark:text-green-400 font-mono tabular-nums">
                {formatCurrency(totalPostTaxCorpus)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                100%
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Tax status shown is general information. Actual tax liability depends
          on your income tax slab, holding period, and other factors.{' '}
          <button
            type="button"
            onClick={() => setShowTaxEducationPanel(true)}
            className="
              text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
              underline font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
            "
          >
            See Tax Education Panel
          </button>{' '}
          for detailed information. Click on any row to expand and see detailed tax calculations.
        </p>
      </div>

      {/* Tax Education Panel Overlay */}
      <TaxEducationPanelOverlay
        isOpen={showTaxEducationPanel}
        onClose={() => setShowTaxEducationPanel(false)}
      />
    </div>
  )
}

export default InstrumentBreakdownTable

