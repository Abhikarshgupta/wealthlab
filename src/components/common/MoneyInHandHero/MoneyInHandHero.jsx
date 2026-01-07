import { useState, useEffect } from 'react'
import { formatCurrency, formatCurrencyCompact, formatPercentageValue } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * MoneyInHandHero Component
 * Hero section displaying "Money in Hand" or "Actual Spending Power"
 * Primary focus element with responsive design
 * 
 * @param {Object} props
 * @param {number} props.postTaxAmount - Post-tax amount (Money in Hand)
 * @param {number} props.actualSpendingPower - Actual spending power (inflation-adjusted, optional)
 * @param {boolean} props.inflationAdjusted - Whether inflation adjustment is enabled
 * @param {number} props.taxSlab - Tax slab rate (as decimal, e.g., 0.30)
 * @param {number} props.taxAmount - Tax amount deducted
 * @param {string} props.instrumentType - Type of instrument (for tax-free badge)
 * @param {number} props.effectiveReturn - Effective return percentage (optional)
 * @param {string} props.className - Additional CSS classes
 */
const MoneyInHandHero = ({
  postTaxAmount,
  actualSpendingPower = null,
  inflationAdjusted = false,
  taxSlab = 0.30,
  taxAmount = 0,
  instrumentType = null,
  effectiveReturn = null,
  className = '',
}) => {
  const { adjustInflation, defaultInflationRate } = useUserPreferencesStore()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // Determine if instrument is tax-free
  const isTaxFree = instrumentType === 'ppf' || instrumentType === 'ssy'
  const effectiveInflationAdjusted = inflationAdjusted && adjustInflation && actualSpendingPower !== null

  // Format value based on device
  const formatValue = (value) => {
    if (isTablet && value >= 100000) {
      return formatCurrencyCompact(value)
    }
    return formatCurrency(value)
  }

  // Format tax slab percentage
  const formatTaxSlab = (slab) => {
    return `${(slab * 100).toFixed(0)}%`
  }

  // When inflation is ON and we have spending power, show Money in Hand first, then Spending Power
  if (effectiveInflationAdjusted) {
    return (
      <div
        className={`relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 border-2 border-green-200 dark:border-green-800 shadow-lg ${className}`}
      >
        <div className="text-center">
          {/* Primary: Money in Hand */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl sm:text-3xl">💰</span>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
              {isTaxFree ? 'Money in Hand (Tax-Free)' : 'Money in Hand'}
            </h3>
          </div>
          <div
            className={`font-bold text-green-600 dark:text-green-400 mb-2 ${
              isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl'
            }`}
          >
            {formatValue(postTaxAmount)}
          </div>
          {isTaxFree ? (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              This investment is completely tax-free (EEE - Exempt, Exempt, Exempt)
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              After tax @ {formatTaxSlab(taxSlab)} slab • Post-tax amount
            </p>
          )}
          {effectiveReturn !== null && effectiveReturn !== undefined && (
            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
              Effective Return: {formatPercentageValue(effectiveReturn)}
            </p>
          )}
          {taxAmount > 0 && !isTaxFree && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Tax Deducted: {formatValue(taxAmount)}
            </p>
          )}

          {/* Secondary: Spending Power */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl sm:text-2xl">📉</span>
              <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                Spending Power
              </h3>
            </div>
            <div
              className={`font-bold text-blue-600 dark:text-blue-400 mb-1 ${
                isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl'
              }`}
            >
              {formatValue(actualSpendingPower)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              What {formatValue(postTaxAmount)} is worth today • Adjusted for inflation @ {defaultInflationRate}%
            </p>
          </div>
        </div>
      </div>
    )
  }

  // When inflation is OFF or no spending power data, show Money in Hand as primary
  return (
    <div
      className={`relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 border-2 border-green-200 dark:border-green-800 shadow-lg ${className}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl sm:text-3xl">💰</span>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            {isTaxFree ? 'Money in Hand (Tax-Free)' : 'Money in Hand'}
          </h3>
        </div>
        <div
          className={`font-bold text-green-600 dark:text-green-400 mb-2 ${
            isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl'
          }`}
        >
          {formatValue(postTaxAmount)}
        </div>
        <div className="space-y-1">
          {isTaxFree ? (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              This investment is completely tax-free (EEE - Exempt, Exempt, Exempt)
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              After tax @ {formatTaxSlab(taxSlab)} slab • Post-tax amount
            </p>
          )}
          {effectiveReturn !== null && effectiveReturn !== undefined && (
            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Effective Return: {formatPercentageValue(effectiveReturn)}
            </p>
          )}
        </div>
        {taxAmount > 0 && !isTaxFree && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Tax Deducted: {formatValue(taxAmount)}
          </p>
        )}
      </div>
    </div>
  )
}

export default MoneyInHandHero

