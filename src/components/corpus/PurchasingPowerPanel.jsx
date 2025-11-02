import { useState } from 'react'
import { formatCurrency } from '@/utils/formatters'
import { getCityInfo } from '@/constants/purchasingPowerExamples'

/**
 * Purchasing Power Panel Component
 * Displays purchasing power analysis by category with affordability metrics
 */
const PurchasingPowerPanel = ({ purchasingPowerResults, selectedCity }) => {
  const [activeCategory, setActiveCategory] = useState(null)

  if (!purchasingPowerResults || Object.keys(purchasingPowerResults).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No purchasing power data available. Please calculate corpus first.
      </div>
    )
  }

  const cityInfo = selectedCity ? getCityInfo(selectedCity) : null
  const categories = Object.keys(purchasingPowerResults)

  const categoryIcons = {
    education: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    realEstate: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    luxuryGoods: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    healthcare: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    consumerGoods: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  }

  const categoryLabels = {
    education: 'Education',
    realEstate: 'Real Estate',
    luxuryGoods: 'Luxury Goods',
    healthcare: 'Healthcare',
    consumerGoods: 'Consumer Goods',
  }

  const handleCategoryToggle = (category) => {
    setActiveCategory(activeCategory === category ? null : category)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Purchasing Power Analysis
        </h3>
        {cityInfo && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            City: <span className="font-semibold">{cityInfo.name}</span> ({cityInfo.tier.toUpperCase()})
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        See how your corpus compares to future prices of real-world items and services. Prices are
        adjusted for category-specific inflation.
      </p>

      {/* Category Tabs/Accordion */}
      <div className="space-y-3">
        {categories.map((category) => {
          const categoryData = purchasingPowerResults[category]
          if (!categoryData || !categoryData.examples || categoryData.examples.length === 0) {
            return null
          }

          const isExpanded = activeCategory === category

          return (
            <div
              key={category}
              className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => handleCategoryToggle(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCategoryToggle(category)
                  }
                }}
                className="
                  w-full px-4 py-3 flex items-center justify-between
                  bg-gray-50 dark:bg-gray-800/50
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                "
                aria-expanded={isExpanded}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    {categoryIcons[category] || (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {categoryLabels[category] || category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({categoryData.examples.length} items)
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Category Content */}
              {isExpanded && (
                <div className="p-4 bg-white dark:bg-gray-900 space-y-3">
                  {categoryData.examples.map((example, index) => (
                    <div
                      key={index}
                      className="
                        p-4 rounded-lg border
                        border-gray-200 dark:border-gray-700
                        bg-gray-50 dark:bg-gray-800/50
                      "
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {example.label}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {example.unit}
                          </p>
                        </div>
                        {example.canAfford && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded">
                            Affordable
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(example.currentPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Future Price ({example.inflationRate.toFixed(1)}% inflation):
                          </span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">
                            {formatCurrency(example.futurePrice)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              Units Affordable:
                            </span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {example.unitsAffordable} {example.unit.includes('per') ? '' : example.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                example.canAfford
                                  ? 'bg-green-500 dark:bg-green-500'
                                  : 'bg-orange-500 dark:bg-orange-500'
                              }`}
                              style={{
                                width: `${Math.min(100, example.percentageAffordable)}%`,
                              }}
                            />
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                            {example.percentageAffordable.toFixed(1)}% of future price
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary Note */}
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
            <strong>Note:</strong> Prices shown are estimates based on current market rates and
            category-specific inflation assumptions. Actual prices may vary. City-specific pricing
            applies to Education, Real Estate, and Healthcare categories.
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchasingPowerPanel

