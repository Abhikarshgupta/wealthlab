import { useState } from 'react'
import { formatCurrency, formatCurrencyCompact } from '@/utils/formatters'

/**
 * TaxBreakdown Component
 * Expandable tax breakdown section with detailed information
 * 
 * @param {Object} props
 * @param {number} props.maturityAmount - Pre-tax maturity amount
 * @param {number} props.principal - Principal amount invested
 * @param {number} props.returns - Returns/interest earned
 * @param {number} props.taxAmount - Tax amount deducted
 * @param {number} props.postTaxAmount - Post-tax amount
 * @param {number} props.taxSlab - Tax slab rate (as decimal) - DEPRECATED, use taxRateLabel instead
 * @param {string} props.taxRateLabel - Actual tax rate label (e.g., "10% LTCG", "30% slab")
 * @param {string} props.taxRule - Tax rule description
 * @param {Object} props.tdsInfo - TDS information (optional)
 * @param {Object} props.indexationInfo - Indexation calculation details (optional)
 * @param {string} props.instrumentType - Type of instrument
 * @param {number} props.monthlyDeposit - Monthly deposit amount (optional, for RD/SIP)
 */
const TaxBreakdown = ({
  maturityAmount,
  principal,
  returns,
  taxAmount,
  postTaxAmount,
  taxSlab,
  taxRateLabel = null,
  taxRule,
  tdsInfo = null,
  indexationInfo = null,
  instrumentType = null,
  monthlyDeposit = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Format tax rate for display
  const getTaxRateDisplay = () => {
    if (taxRateLabel) {
      return taxRateLabel
    }
    // Fallback to taxSlab for backward compatibility
    return `${(taxSlab * 100).toFixed(0)}%`
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse tax details' : 'Expand tax details'}
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="text-lg">📊</span>
          Tax Breakdown
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          {/* Basic Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Maturity Amount (Pre-Tax)</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {formatCurrency(maturityAmount)}
              </p>
            </div>
            {principal > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Principal Invested</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(principal)} {monthlyDeposit && monthlyDeposit > 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    @{formatCurrencyCompact(monthlyDeposit)}/mo
                  </span>
                )}
                </p>
                
              </div>
            )}
            {returns > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {instrumentType === 'equity' || instrumentType === 'sip' || instrumentType === 'elss' || instrumentType === 'etf'
                    ? 'Capital Gains'
                    : 'Interest Earned'}
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(returns)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tax Deducted</p>
              <p className="text-base font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(taxAmount)} ({getTaxRateDisplay()})
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Money in Hand (Post-Tax)</p>
              <p className="text-base font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(postTaxAmount)}
              </p>
            </div>
          </div>

          {/* Tax Rule Info */}
          {taxRule && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax Treatment:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{taxRule}</p>
            </div>
          )}

          {/* Indexation Calculation (for Debt MFs) */}
          {indexationInfo && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📊 Indexation Calculation:
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p>
                  Purchase Year: FY {indexationInfo.purchaseYear} (CII: {indexationInfo.purchaseCII})
                </p>
                <p>
                  Sale Year: FY {indexationInfo.saleYear} (CII: {indexationInfo.saleCII})
                </p>
                <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  Indexed Cost = {formatCurrency(indexationInfo.principal)} × ({indexationInfo.saleCII} / {indexationInfo.purchaseCII})
                </p>
                <p className="font-semibold">
                  = {formatCurrency(indexationInfo.indexedCost)}
                </p>
                <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  Taxable Gains = {formatCurrency(indexationInfo.maturityAmount)} - {formatCurrency(indexationInfo.indexedCost)}
                </p>
                <p className="font-semibold">
                  = {formatCurrency(indexationInfo.taxableGains)}
                </p>
                <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  Tax @ 20% = {formatCurrency(indexationInfo.taxAmount)}
                </p>
                {indexationInfo.savings > 0 && (
                  <p className="text-green-600 dark:text-green-400 font-semibold pt-2">
                    ℹ️ Indexation reduces tax by {formatCurrency(indexationInfo.savings)} compared to flat 20%
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TDS Information */}
          {tdsInfo && tdsInfo.applicable && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                ℹ️ TDS Information:
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                <p>
                  Annual Interest: {formatCurrency(tdsInfo.annualInterest)}
                </p>
                <p>
                  TDS Threshold: {formatCurrency(tdsInfo.tdsThreshold)}
                </p>
                <p>
                  TDS Rate: {tdsInfo.tdsRate}%
                </p>
                <p className="font-semibold">
                  Total TDS: {formatCurrency(tdsInfo.totalTDS)}
                </p>
                <p className="text-blue-600 dark:text-blue-400 italic mt-2">
                  {tdsInfo.note}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TaxBreakdown

