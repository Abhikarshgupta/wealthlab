import { useMemo } from 'react'
import ResultCard from '@/components/common/ResultCard'
import { formatCurrency } from '@/utils/formatters'
import { adjustForInflation } from '@/utils/calculations'
import { calculateTaxForMultipleInstruments } from '@/utils/taxCalculations'

/**
 * Corpus Results Component
 * Displays primary corpus metrics including nominal, inflation-adjusted, and post-tax values
 */
const CorpusResults = ({ results, settings, investments, instruments }) => {
  const { generalInflationRate, taxMethod, timeHorizon } = settings || {}

  // Calculate inflation-adjusted corpus
  const inflationAdjustedCorpus = useMemo(() => {
    if (!results?.nominalCorpus || !generalInflationRate || !timeHorizon) {
      return null
    }

    const inflationRateDecimal = generalInflationRate / 100
    return adjustForInflation(results.nominalCorpus, inflationRateDecimal, timeHorizon)
  }, [results?.nominalCorpus, generalInflationRate, timeHorizon])

  // Calculate post-tax corpus
  const postTaxResults = useMemo(() => {
    if (!results?.byInstrument || !investments || !instruments || !taxMethod) {
      return null
    }

    const corpusByInstrument = {}
    const returnsByInstrument = {}
    Object.keys(results.byInstrument).forEach((key) => {
      corpusByInstrument[key] = results.byInstrument[key].maturityValue
      returnsByInstrument[key] = results.byInstrument[key].returns || 0
    })

    const taxResults = calculateTaxForMultipleInstruments(
      corpusByInstrument,
      investments,
      instruments,
      taxMethod,
      {
        incomeTaxSlab: settings?.incomeTaxSlab || 0.30, // Use user-selected tax bracket
        returnsByInstrument, // Pass returns for LTCG exemption calculation
      }
    )

    return taxResults
  }, [results?.byInstrument, investments, instruments, taxMethod, settings?.incomeTaxSlab])

  if (!results) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No results available. Please configure your investments and calculate.
      </div>
    )
  }

  const icons = {
    invested: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    returns: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    corpus: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    adjusted: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
    tax: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Corpus Summary</h2>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultCard
          label="Total Invested (Future)"
          value={formatCurrency(results.totalFutureInvested || results.totalInvested || 0)}
          icon={icons.invested}
        />
        {results.totalExistingValue > 0 && (
          <ResultCard
            label="Existing Investment Value"
            value={formatCurrency(results.totalExistingValue || 0)}
            icon={icons.invested}
          />
        )}
        <ResultCard
          label="Total Returns"
          value={formatCurrency(results.totalReturns || 0)}
          icon={icons.returns}
        />
        <ResultCard
          label="Nominal Corpus"
          value={formatCurrency(results.nominalCorpus || 0)}
          icon={icons.corpus}
          className="md:col-span-2"
        />
      </div>

      {/* Inflation-Adjusted Corpus */}
      {inflationAdjustedCorpus !== null && (
        <div className="mt-4">
          <ResultCard
            label={`Inflation-Adjusted Corpus (${timeHorizon} years @ ${generalInflationRate}%)`}
            value={formatCurrency(inflationAdjustedCorpus)}
            icon={icons.adjusted}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 px-4">
            This shows the real purchasing power of your corpus after adjusting for inflation over{' '}
            {timeHorizon} years.
          </p>
        </div>
      )}

      {/* Post-Tax Corpus */}
      {postTaxResults && postTaxResults.total && (
        <div className="mt-4">
          <ResultCard
            label={`Post-Tax Corpus (${taxMethod === 'withdrawal' ? 'Tax on Withdrawal' : taxMethod === 'accumulation' ? 'Tax During Accumulation' : 'Both Methods'})`}
            value={formatCurrency(postTaxResults.total.postTaxCorpus)}
            icon={icons.tax}
          />
          <div className="mt-2 px-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tax Amount:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(postTaxResults.total.taxAmount)}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Tax calculation method: <strong>{taxMethod}</strong>. Actual tax may vary based on
              your income tax slab and other factors.
            </p>
          </div>
        </div>
      )}

      {/* Comparison Summary */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Summary Comparison
        </h3>
        <div className="space-y-2 text-sm">
          {results.totalExistingValue > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Existing Investment Value:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {formatCurrency(results.totalExistingValue)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Future Investment Amount:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(results.totalFutureInvested || results.totalInvested || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Nominal Corpus:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(results.nominalCorpus || 0)}
            </span>
          </div>
          {inflationAdjustedCorpus !== null && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Inflation-Adjusted:</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {formatCurrency(inflationAdjustedCorpus)}
              </span>
            </div>
          )}
          {postTaxResults?.total && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Post-Tax:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(postTaxResults.total.postTaxCorpus)}
              </span>
            </div>
          )}
          {inflationAdjustedCorpus !== null && results.nominalCorpus && (
            <div className="pt-2 border-t border-blue-200 dark:border-blue-700 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Purchasing Power Loss:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(results.nominalCorpus - inflationAdjustedCorpus)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CorpusResults

