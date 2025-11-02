import { useState } from 'react'
import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'
import { getDefaultInflationRate } from '@/constants/inflationRates'
import InputField from '@/components/common/InputField'

/**
 * Category Inflation Settings Component
 * Allows users to configure category-specific inflation rates
 * Expandable section with input fields for each category
 */
const CategoryInflationSettings = () => {
  const { settings, updateInflationRate } = useCorpusCalculatorStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    {
      key: 'education',
      label: 'Education',
      description: 'School fees, college tuition, and educational expenses',
      defaultRate: getDefaultInflationRate('education'),
    },
    {
      key: 'healthcare',
      label: 'Healthcare',
      description: 'Medical expenses, insurance premiums, and treatment costs',
      defaultRate: getDefaultInflationRate('healthcare'),
    },
    {
      key: 'realEstate',
      label: 'Real Estate',
      description: 'Property prices, apartments, and land',
      defaultRate: getDefaultInflationRate('realEstate'),
    },
    {
      key: 'luxuryGoods',
      label: 'Luxury Goods',
      description: 'Premium products, cars, electronics',
      defaultRate: getDefaultInflationRate('luxuryGoods'),
    },
    {
      key: 'consumerGoodsWholesale',
      label: 'Consumer Goods (Wholesale)',
      description: 'Wholesale price index for consumer goods',
      defaultRate: getDefaultInflationRate('consumerGoodsWholesale'),
    },
    {
      key: 'consumerGoodsRetail',
      label: 'Consumer Goods (Retail)',
      description: 'Retail price index for consumer goods',
      defaultRate: getDefaultInflationRate('consumerGoodsRetail'),
    },
  ]

  const handleRateChange = (category, value) => {
    const rate = parseFloat(value) || 0
    if (rate >= 0 && rate <= 100) {
      updateInflationRate(category, rate)
    }
  }

  const handleReset = () => {
    categories.forEach((category) => {
      updateInflationRate(category.key, category.defaultRate)
    })
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
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
        aria-controls="inflation-settings-content"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Category-Specific Inflation Rates
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Customize inflation rates for different expense categories
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div id="inflation-settings-content" className="p-4 bg-white dark:bg-gray-900">
          <div className="space-y-4">
            {categories.map((category) => {
              const currentRate = settings.inflationRates[category.key] || category.defaultRate
              const isDefault = currentRate === category.defaultRate

              return (
                <div
                  key={category.key}
                  className="
                    p-4 rounded-lg border
                    border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800/50
                  "
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {category.label}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                    {isDefault && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <InputField
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={currentRate}
                        onChange={(e) => handleRateChange(category.key, e.target.value)}
                        className="w-full"
                        placeholder={`${category.defaultRate}%`}
                        aria-label={`${category.label} inflation rate`}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">%</span>
                    <button
                      type="button"
                      onClick={() => handleRateChange(category.key, category.defaultRate)}
                      className="
                        px-3 py-2 text-xs font-medium
                        text-gray-700 dark:text-gray-300
                        hover:text-green-600 dark:hover:text-green-400
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        rounded transition-colors
                      "
                      aria-label={`Reset ${category.label} to default`}
                    >
                      Reset
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Default: {category.defaultRate}% per annum
                  </div>
                </div>
              )
            })}

            {/* Reset All Button */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleReset}
                className="
                  w-full px-4 py-2 text-sm font-medium
                  text-gray-700 dark:text-gray-300
                  bg-gray-100 dark:bg-gray-800
                  hover:bg-gray-200 dark:hover:bg-gray-700
                  rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                "
              >
                Reset All to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryInflationSettings

