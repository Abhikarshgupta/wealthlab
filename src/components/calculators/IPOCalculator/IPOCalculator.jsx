import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useEffect } from 'react'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import IPOCalculatorResults from './IPOCalculatorResults'
import IPOCalculatorInfo from './IPOCalculatorInfo'
import IPOCalculatorTable from './IPOCalculatorTable'
import useIPOCalculator from './useIPOCalculator'
import { ipoSchema } from './ipoSchema'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * IPO/FPO Calculator Component
 * 
 * Real-time IPO/FPO calculator for calculating listing gains and post-listing returns
 * Features:
 * - Application amount input
 * - Shares allotted input
 * - Issue price input
 * - Listing price or listing gain percentage input
 * - Holding period input (years)
 * - Expected CAGR for post-listing period
 * - Tax calculations (STCG/LTCG)
 * - Year-wise breakdown table
 */
const IPOCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(ipoSchema),
    defaultValues: {
      applicationAmount: 10000,
      sharesAllotted: 100,
      issuePrice: 100,
      inputMode: 'listingPrice',
      listingPrice: 110,
      listingGainPercent: 10,
      holdingPeriod: 1,
      expectedCAGR: 12
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const applicationAmount = watch('applicationAmount')
  const sharesAllotted = watch('sharesAllotted')
  const issuePrice = watch('issuePrice')
  const inputMode = watch('inputMode')
  const listingPrice = watch('listingPrice')
  const listingGainPercent = watch('listingGainPercent')
  const holdingPeriod = watch('holdingPeriod')
  const expectedCAGR = watch('expectedCAGR')

  // Convert string values to numbers
  const applicationAmountNum = parseFloat(applicationAmount) || 0
  const sharesAllottedNum = parseFloat(sharesAllotted) || 0
  const issuePriceNum = parseFloat(issuePrice) || 0
  const listingPriceNum = inputMode === 'listingPrice' ? (parseFloat(listingPrice) || 0) : null
  const listingGainPercentNum = inputMode === 'listingGainPercent' ? (parseFloat(listingGainPercent) || 0) : null
  const holdingPeriodNum = parseFloat(holdingPeriod) || 0
  const expectedCAGRNum = parseFloat(expectedCAGR) || 0

  // Calculate results using custom hook
  const results = useIPOCalculator(
    applicationAmountNum,
    sharesAllottedNum,
    issuePriceNum,
    listingPriceNum,
    listingGainPercentNum,
    holdingPeriodNum,
    holdingPeriodNum > 0 ? expectedCAGRNum : null
  )

  // Reset expectedCAGR when holding period is 0
  useEffect(() => {
    if (holdingPeriodNum === 0 && expectedCAGRNum > 0) {
      setValue('expectedCAGR', 0, { shouldValidate: false })
    }
  }, [holdingPeriodNum, expectedCAGRNum, setValue])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          IPO/FPO Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate listing gains/losses and post-listing returns for IPO/FPO investments
        </p>
      </div>

      {/* Risk Warning Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                IPO Investment Risk Warning
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                IPO investments are subject to market risk. Listing prices can be volatile and may result in losses. 
                Past performance does not guarantee future returns. Please invest only if you understand the risks involved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Application Amount */}
              <div>
                <InputField
                  label="Application Amount"
                  type="number"
                  {...register('applicationAmount', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('applicationAmount', value, { shouldValidate: true })
                  }}
                  error={errors.applicationAmount?.message}
                  showCurrency
                  placeholder="10000"
                  min={1000}
                  step={1000}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1000}
                  max={1000000}
                  value={applicationAmountNum || 10000}
                  onChange={(value) => setValue('applicationAmount', value, { shouldValidate: true })}
                  step={1000}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Shares Allotted */}
              <div>
                <InputField
                  label="Shares Allotted"
                  type="number"
                  {...register('sharesAllotted', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('sharesAllotted', value, { shouldValidate: true })
                  }}
                  error={errors.sharesAllotted?.message}
                  placeholder="100"
                  min={1}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1}
                  max={10000}
                  value={sharesAllottedNum || 100}
                  onChange={(value) => setValue('sharesAllotted', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} ${val === 1 ? 'share' : 'shares'}`}
                />
              </div>

              {/* Issue Price */}
              <div>
                <InputField
                  label="Issue Price (per share)"
                  type="number"
                  {...register('issuePrice', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('issuePrice', value, { shouldValidate: true })
                  }}
                  error={errors.issuePrice?.message}
                  showCurrency
                  placeholder="100"
                  min={1}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1}
                  max={10000}
                  value={issuePriceNum || 100}
                  onChange={(value) => setValue('issuePrice', value, { shouldValidate: true })}
                  step={1}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Input Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Listing Price Input Mode
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      inputMode === 'listingPrice'
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('inputMode')}
                      value="listingPrice"
                      className="mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Listing Price
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Enter actual listing price
                      </div>
                    </div>
                  </label>
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      inputMode === 'listingGainPercent'
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('inputMode')}
                      value="listingGainPercent"
                      className="mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Listing Gain %
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Enter expected gain %
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Listing Price or Listing Gain Percent */}
              {inputMode === 'listingPrice' ? (
                <div>
                  <InputField
                    label="Listing Price (per share)"
                    type="number"
                    {...register('listingPrice', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setValue('listingPrice', value, { shouldValidate: true })
                    }}
                    error={errors.listingPrice?.message}
                    showCurrency
                    placeholder="110"
                    min={1}
                    step={1}
                    className="mb-4"
                  />
                  <Slider
                    label=""
                    min={1}
                    max={10000}
                    value={listingPriceNum || 110}
                    onChange={(value) => setValue('listingPrice', value, { shouldValidate: true })}
                    step={1}
                    showCurrency
                    formatValue={(val) => formatCurrency(val)}
                  />
                </div>
              ) : (
                <div>
                  <InputField
                    label="Expected Listing Gain (%)"
                    type="number"
                    {...register('listingGainPercent', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setValue('listingGainPercent', value, { shouldValidate: true })
                    }}
                    error={errors.listingGainPercent?.message}
                    placeholder="10"
                    min={-100}
                    max={1000}
                    step={1}
                    className="mb-4"
                  />
                  <Slider
                    label=""
                    min={-50}
                    max={200}
                    value={listingGainPercentNum || 10}
                    onChange={(value) => setValue('listingGainPercent', value, { shouldValidate: true })}
                    step={1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Negative values indicate expected listing loss
                  </p>
                </div>
              )}

              {/* Holding Period */}
              <div>
                <InputField
                  label="Holding Period (Years)"
                  type="number"
                  {...register('holdingPeriod', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('holdingPeriod', value, { shouldValidate: true })
                  }}
                  error={errors.holdingPeriod?.message}
                  placeholder="1"
                  min={0}
                  max={30}
                  step={0.25}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={30}
                  value={holdingPeriodNum || 1}
                  onChange={(value) => setValue('holdingPeriod', value, { shouldValidate: true })}
                  step={0.25}
                  formatValue={(val) => `${val} ${val === 1 ? 'year' : 'years'}`}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Set to 0 if you plan to sell on listing day
                </p>
              </div>

              {/* Expected CAGR (only shown if holding period > 0) */}
              {holdingPeriodNum > 0 && (
                <div>
                  <InputField
                    label="Expected CAGR (% p.a.)"
                    type="number"
                    {...register('expectedCAGR', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setValue('expectedCAGR', value, { shouldValidate: true })
                    }}
                    error={errors.expectedCAGR?.message}
                    placeholder="12"
                    min={0}
                    max={100}
                    step={0.1}
                    className="mb-4"
                  />
                  <div className="mb-2">
                    <Slider
                      label=""
                      min={0}
                      max={100}
                      value={expectedCAGRNum || 12}
                      onChange={(value) => setValue('expectedCAGR', value, { shouldValidate: true })}
                      step={0.1}
                      formatValue={(val) => formatPercentageValue(val)}
                    />
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    <strong>Note:</strong> This is an estimate for post-listing growth. Actual returns may vary significantly.
                  </p>
                </div>
              )}

            </div>
          }
          resultsPanel={
            <IPOCalculatorResults results={results} />
          }
          infoPanel={
            <IPOCalculatorInfo />
          }
          evolutionTable={
            <IPOCalculatorTable evolution={results?.evolution} tenure={holdingPeriodNum} />
          }
        />
    </div>
  )
}

export default IPOCalculator

