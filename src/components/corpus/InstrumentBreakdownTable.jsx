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

    if (taxMethod === 'withdrawal') {
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

    if (taxMethod === 'both') {
      // For 'both', show withdrawal tax in the breakdown table
      // (CorpusResults component shows the comparison separately)
      const taxResult = calculateTaxOnWithdrawal(
        maturityValue,
        instrumentType,
        tenure,
        {
          incomeTaxSlab,
          investmentData,
          returns,
        }
      )
      return taxResult
    }

    // For accumulation method, calculate tax during accumulation
    // Note: This is simplified - full implementation would require year-by-year calculation
    const taxResult = calculateTaxOnWithdrawal(
      maturityValue,
      instrumentType,
      tenure,
      {
        incomeTaxSlab,
        investmentData,
        returns,
      }
    )
    return taxResult
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
      const isProjectedBeyondHorizon = instrumentData.isProjectedBeyondHorizon || false
      const projectedMaturityValue = instrumentData.projectedMaturityValue || 0
      const projectedReturns = instrumentData.projectedReturns || 0
      const projectedInvestedAmount = instrumentData.projectedInvestedAmount || 0
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
        // Projected values beyond withdrawal horizon
        isProjectedBeyondHorizon,
        projectedMaturityValue,
        projectedReturns,
        projectedInvestedAmount,
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
                    {row.isProjectedBeyondHorizon && row.projectedInvestedAmount > row.investedAmount ? (
                      <div className="flex flex-col items-end">
                        <span>{formatCurrency(row.investedAmount)}</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                          *{formatCurrency(row.projectedInvestedAmount)} projected
                        </span>
                      </div>
                    ) : (
                      formatCurrency(row.investedAmount)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-semibold tabular-nums">
                    {row.isProjectedBeyondHorizon && row.projectedReturns > row.returns ? (
                      <div className="flex flex-col items-end">
                        <span className={row.returns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatCurrency(row.returns)}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                          *{formatCurrency(row.projectedReturns)} projected
                        </span>
                      </div>
                    ) : (
                      <span className={row.returns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {formatCurrency(row.returns)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white font-mono font-bold tabular-nums">
                    {row.isProjectedBeyondHorizon && row.projectedMaturityValue > row.maturityValue ? (
                      <div className="flex flex-col items-end">
                        <span>{formatCurrency(row.maturityValue)}</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                          *{formatCurrency(row.projectedMaturityValue)} projected
                        </span>
                      </div>
                    ) : (
                      formatCurrency(row.maturityValue)
                    )}
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
                {row.isExpanded && (() => {
                  const taxRule = getTaxRateForInstrument(row.instrumentType)
                  const isPartialTax = taxRule?.type === 'partial' // NPS: 60% tax-free, 40% taxable
                  const isInterestTax = taxRule?.type === 'interest' // FD, NSC, SCSS: Interest taxable
                  const incomeTaxSlab = settings?.incomeTaxSlab || 0.30

                  // For NPS, calculate taxable portion (40% of corpus)
                  const taxablePortion = isPartialTax ? row.maturityValue * 0.40 : null

                  return (
                    <tr className="bg-gray-50 dark:bg-gray-800/30">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="ml-8 space-y-3">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Tax Calculation Details
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {isPartialTax ? 'Returns Earned' : 'Interest Earned'}
                              </div>
                              <div className={`text-sm font-semibold font-mono ${
                                row.returns >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {formatCurrency(row.returns)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {isPartialTax
                                  ? 'Tax Rate on Taxable Portion (40%)'
                                  : isInterestTax
                                    ? 'Tax Rate on Interest'
                                    : 'Tax Rate'}
                              </div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {row.taxDetails.taxAmount > 0
                                  ? (row.taxDetails.taxRateLabel || formatPercentage(incomeTaxSlab, 0))
                                  : 'Tax-Free'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {isInterestTax || isPartialTax
                                  ? '(Your tax bracket)'
                                  : '(Actual tax rate applied)'}
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
                                {isPartialTax ? (
                                  <>
                                    <li>
                                      <strong>Tax Rate on Taxable Portion ({formatPercentage(incomeTaxSlab, 0)}):</strong> This is your income tax bracket rate, applied to 40% of your corpus (₹{formatCurrency(taxablePortion, false)}). The remaining 60% is tax-free.
                                    </li>
                                    <li>
                                      <strong>Effective Tax Rate ({formatPercentage(row.taxDetails.taxRate / 100, 2)}):</strong> This shows what percentage of your total maturity value (₹{formatCurrency(row.maturityValue, false)}) goes to tax. It's lower because only 40% of the corpus is taxable, and 60% is tax-free.
                                    </li>
                                    <li>
                                      <strong>Calculation:</strong> Tax = 40% of Corpus × Tax Bracket = ₹{formatCurrency(taxablePortion, false)} × {formatPercentage(incomeTaxSlab, 0)} = ₹{formatCurrency(row.taxDetails.taxAmount, false)}
                                    </li>
                                  </>
                                ) : isInterestTax ? (
                                  <>
                                    <li>
                                      <strong>Tax Rate on Interest ({formatPercentage(incomeTaxSlab, 0)}):</strong> This is your income tax bracket rate, applied to the interest earned (₹{formatCurrency(row.returns, false)}).
                                    </li>
                                    <li>
                                      <strong>Effective Tax Rate ({formatPercentage(row.taxDetails.taxRate / 100, 2)}):</strong> This shows what percentage of your total maturity value (₹{formatCurrency(row.maturityValue, false)}) goes to tax. It's lower because tax is only on interest, not the principal.
                                    </li>
                                    <li>
                                      <strong>Calculation:</strong> Tax = Interest × Tax Bracket = ₹{formatCurrency(row.returns, false)} × {formatPercentage(incomeTaxSlab, 0)} = ₹{formatCurrency(row.taxDetails.taxAmount, false)}
                                    </li>
                                  </>
                                ) : (
                                  <>
                                    <li>
                                      <strong>Tax Rate:</strong> {row.taxDetails.taxAmount > 0
                                        ? (row.taxDetails.taxRateLabel 
                                            ? `This instrument is taxed at ${row.taxDetails.taxRateLabel}.`
                                            : `This instrument is taxed at ${formatPercentage(row.taxDetails.taxRate / 100, 2)} effective rate.`)
                                        : 'This instrument is tax-free.'}
                                    </li>
                                    <li>
                                      <strong>Effective Tax Rate ({formatPercentage(row.taxDetails.taxRate / 100, 2)}):</strong> This shows what percentage of your total maturity value (₹{formatCurrency(row.maturityValue, false)}) goes to tax.
                                    </li>
                                    <li>
                                      <strong>Tax Amount:</strong> ₹{formatCurrency(row.taxDetails.taxAmount, false)}
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                          {row.taxDetails.tdsInfo && row.taxDetails.tdsInfo.applicable && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                                ⚠️ TDS (Tax Deducted at Source) Information
                              </div>
                              <div className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                                <div>Annual Interest: {formatCurrency(row.taxDetails.tdsInfo.annualInterest)}</div>
                                <div>TDS Threshold: {formatCurrency(row.taxDetails.tdsInfo.tdsThreshold)}</div>
                                <div>TDS Rate: {row.taxDetails.tdsInfo.tdsRate}%</div>
                                <div className="font-semibold mt-2">Total TDS Deducted: {formatCurrency(row.taxDetails.tdsInfo.totalTDS)}</div>
                                <div className="text-xs italic mt-2">{row.taxDetails.tdsInfo.note}</div>
                              </div>
                            </div>
                          )}
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              📋 Calculation Disclaimers
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                              {(row.instrumentType === 'sip' || row.instrumentType === 'equity') && (
                                <>
                                  <div>• SIP tax calculation uses simplified method (not FIFO). Actual tax may vary based on individual installment dates.</div>
                                  <div>• LTCG exemption of ₹1L is shared across all equity instruments.</div>
                                </>
                              )}
                              {row.instrumentType === 'debt_mutual_fund' && (
                                <div>• Indexation calculated using assumed 6% CII increase. Actual Cost Inflation Index (CII) may vary.</div>
                              )}
                              {row.instrumentType === 'nps' && (
                                <div>• 40% taxable portion can be used to purchase annuity. Annuity income is taxable annually.</div>
                              )}
                              <div>• Tax calculations are estimates based on current tax laws (FY 2024-25). Actual tax liability may vary.</div>
                              <div>• Surcharge and cess are not included in calculations.</div>
                              <div>• For accurate tax planning, consult a qualified Chartered Accountant.</div>
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
                  )
                })()}
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
          <strong>Note:</strong> This calculator estimates your <strong>net worth at the specified time horizon</strong> ({settings?.timeHorizon || 10} years).
          Values marked with <span className="text-blue-600 dark:text-blue-400 font-semibold">*projected</span> show what investments would be worth
          if continued beyond the withdrawal horizon.{' '}
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

