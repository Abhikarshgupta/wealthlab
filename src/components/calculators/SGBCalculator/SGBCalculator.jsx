import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import SGBCalculatorResults from './SGBCalculatorResults'
import SGBCalculatorInfo from './SGBCalculatorInfo'
import SGBCalculatorTable from './SGBCalculatorTable'
import useSGBCalculator from './useSGBCalculator'
import { sgbSchema } from './sgbSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import { useState, useEffect } from 'react'
import { getRateLimitStatus } from '@/utils/goldPriceService'

/**
 * SGB Calculator Component
 * 
 * Real-time SGB calculator with gold appreciation and fixed interest
 * Features:
 * - Gold amount input (grams: 1-1000)
 * - Tenure selection (5 or 8 years)
 * - Fixed interest rate (2.5% p.a., fixed)
 * - Gold appreciation rate (user input, default 8%)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const SGBCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(sgbSchema),
    defaultValues: {
      goldAmount: 10,
      tenure: 8,
      goldAppreciationRate: investmentRates.sgb.goldAppreciation,
      adjustInflation: false
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const goldAmount = watch('goldAmount')
  const tenure = watch('tenure')
  const goldAppreciationRate = watch('goldAppreciationRate')
  const adjustInflation = watch('adjustInflation')

  // Convert string values to numbers
  const goldAmountNum = parseFloat(goldAmount) || 0
  const tenureNum = parseFloat(tenure) || 8
  const goldAppreciationRateNum = parseFloat(goldAppreciationRate) || 0

  // Calculate results using custom hook
  const results = useSGBCalculator(
    goldAmountNum,
    tenureNum,
    goldAppreciationRateNum,
    adjustInflation
  )

  // State for refreshing gold price
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false)
  const [rateLimitStatus, setRateLimitStatus] = useState({ canCall: true, timeUntilNextCall: null })

  // Update rate limit status periodically
  useEffect(() => {
    const updateRateLimitStatus = () => {
      const status = getRateLimitStatus()
      setRateLimitStatus(status)
    }

    // Update immediately
    updateRateLimitStatus()

    // Update every minute
    const interval = setInterval(updateRateLimitStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeUntilNextCall = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return null
    const hours = Math.floor(milliseconds / (60 * 60 * 1000))
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000))
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleRefreshGoldPrice = async () => {
    if (results?.refreshGoldPrice) {
      setIsRefreshingPrice(true)
      results.refreshGoldPrice()
      // Update rate limit status after refresh
      setTimeout(() => {
        const status = getRateLimitStatus()
        setRateLimitStatus(status)
        setIsRefreshingPrice(false)
      }, 2000) // Wait for API call to complete
    }
  }

  // Calculate max values for sliders
  const maxGoldAmount = 1000
  const maxGoldAppreciationRate = 30

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          SGB Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Sovereign Gold Bond returns with fixed interest and gold appreciation
        </p>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Gold Amount */}
              <div>
                <InputField
                  label="Gold Amount (grams)"
                  type="number"
                  {...register('goldAmount', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('goldAmount', value, { shouldValidate: true })
                  }}
                  error={errors.goldAmount?.message}
                  placeholder="10"
                  min={1}
                  max={maxGoldAmount}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1}
                  max={maxGoldAmount}
                  value={goldAmountNum || 10}
                  onChange={(value) => setValue('goldAmount', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} grams`}
                />
                {results && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Investment Amount: {formatCurrency(results.principal)} 
                      {' '}(at ₹{results.goldPricePerGram.toLocaleString('en-IN')} per gram)
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {results.isLoadingPrice ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching latest gold price...
                          </span>
                        ) : results.isRealTimePrice ? (
                          <span className="text-green-600 dark:text-green-400">✓ Real-time gold price</span>
                        ) : !rateLimitStatus.canCall && rateLimitStatus.timeUntilNextCall ? (
                          <span className="text-gray-500 dark:text-gray-400">
                            Rate limit: Refresh available in {formatTimeUntilNextCall(rateLimitStatus.timeUntilNextCall)}
                          </span>
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-400">⚠ Using fallback price (₹{results.goldPricePerGram.toLocaleString('en-IN')}/gram)</span>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={handleRefreshGoldPrice}
                        disabled={isRefreshingPrice || results.isLoadingPrice || !rateLimitStatus.canCall}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                        title={
                          !rateLimitStatus.canCall
                            ? `Rate limit: Can refresh in ${formatTimeUntilNextCall(rateLimitStatus.timeUntilNextCall)}`
                            : results.isRealTimePrice
                            ? "Refresh gold price from API"
                            : "Click to fetch latest gold price (currently using fallback)"
                        }
                      >
                        {isRefreshingPrice ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Price
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tenure */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tenure
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('tenure')}
                        value={5}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">5 years (Exit Option)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('tenure')}
                        value={8}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">8 years (Full Term)</span>
                    </label>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-2">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Fixed Interest Rate:</strong> {investmentRates.sgb.fixedRate}% p.a. (paid semi-annually)
                  </p>
                </div>
              </div>

              {/* Gold Appreciation Rate */}
              <div>
                <InputField
                  label="Gold Appreciation Rate (% p.a.)"
                  type="number"
                  {...register('goldAppreciationRate', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('goldAppreciationRate', value, { shouldValidate: true })
                  }}
                  error={errors.goldAppreciationRate?.message}
                  placeholder="8"
                  min={0}
                  max={maxGoldAppreciationRate}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxGoldAppreciationRate}
                  value={goldAppreciationRateNum || 8}
                  onChange={(value) => setValue('goldAppreciationRate', value, { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
              </div>

              {/* Inflation Adjustment Toggle */}
              <ToggleSwitch
                label="Adjust for Inflation"
                checked={adjustInflation}
                onChange={(checked) => setValue('adjustInflation', checked, { shouldValidate: true })}
                description="Show real returns after accounting for inflation"
              />
            </div>
          }
          resultsPanel={
            <SGBCalculatorResults results={results} />
          }
          infoPanel={
            <SGBCalculatorInfo />
          }
          evolutionTable={
            <SGBCalculatorTable evolution={results?.evolution} />
          }
        />
    </div>
  )
}

export default SGBCalculator

