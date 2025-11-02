import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'

/**
 * Tax Method Selector Component
 * Allows users to select tax calculation method
 * Options: Withdrawal, Accumulation, or Both (Comparison)
 */
const TaxMethodSelector = () => {
  const { settings, setTaxMethod } = useCorpusCalculatorStore()

  const taxMethods = [
    {
      value: 'withdrawal',
      label: 'Taxes on Withdrawal',
      description: 'Most Realistic',
      details:
        'Tax is calculated when you withdraw the corpus. This is the most common scenario for retirement planning.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      value: 'accumulation',
      label: 'Taxes During Accumulation',
      description: 'Annual Tax Payment',
      details:
        'Tax is calculated and paid annually during the investment period. Useful for instruments like FD where interest is taxed yearly.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      value: 'both',
      label: 'Show Both (Comparison)',
      description: 'Compare Approaches',
      details:
        'Calculate and display both scenarios side-by-side to understand the tax impact difference.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ]

  const handleMethodSelect = (method) => {
    setTaxMethod(method)
  }

  const handleKeyDown = (e, method) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleMethodSelect(method)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tax Calculation Method
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Choose how taxes should be calculated. Different methods yield different post-tax corpus amounts.
      </p>

      <div className="space-y-3" role="radiogroup" aria-label="Tax calculation method">
        {taxMethods.map((method) => {
          const isSelected = settings.taxMethod === method.value

          return (
            <div
              key={method.value}
              className={`
                relative border-2 rounded-lg p-4 cursor-pointer transition-all
                focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2
                ${
                  isSelected
                    ? 'border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-600'
                }
              `}
              onClick={() => handleMethodSelect(method.value)}
              onKeyDown={(e) => handleKeyDown(e, method.value)}
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
            >
              <div className="flex items-start space-x-4">
                {/* Radio Button */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        isSelected
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-400 dark:border-gray-500'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-500" />
                    )}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`
                    flex-shrink-0 p-2 rounded-lg
                    ${
                      isSelected
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {method.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {method.label}
                    </h3>
                    <span
                      className={`
                        px-2 py-0.5 text-xs font-medium rounded
                        ${
                          isSelected
                            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      {method.description}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{method.details}</p>
                </div>

                {/* Checkmark for selected */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-500 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Link */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-xs text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Tax rules vary by instrument type. Some instruments (like PPF) are
            tax-free, while others (like FD) have tax implications. See the Tax Education Panel for
            detailed explanations.
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaxMethodSelector

