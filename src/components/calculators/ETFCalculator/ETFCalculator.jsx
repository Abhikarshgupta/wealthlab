import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useEffect } from 'react'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ETFCalculatorResults from './ETFCalculatorResults'
import ETFCalculatorInfo from './ETFCalculatorInfo'
import ETFCalculatorTable from './ETFCalculatorTable'
import useETFCalculator from './useETFCalculator'
import { etfSchema } from './etfSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * ETF Calculator Component
 * 
 * Real-time ETF calculator supporting both SIP and Lumpsum investment modes
 * Features:
 * - Investment type selection (SIP or Lumpsum)
 * - ETF type selection (Equity, Debt, Gold, International)
 * - Investment amount input (₹500+)
 * - Tenure input (years)
 * - Expected CAGR input (default based on ETF type)
 * - Expense ratio input (default 0.20%)
 * - Step-up SIP option with annual increase percentage (SIP mode only)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const ETFCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(etfSchema),
    defaultValues: {
      investmentType: 'sip',
      amount: 5000,
      etfType: 'equity',
      tenure: 5,
      expectedCAGR: investmentRates.etf?.equity || 12,
      expenseRatio: 0.20,
      stepUpEnabled: false,
      stepUpPercentage: 10
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const investmentType = watch('investmentType')
  const amount = watch('amount')
  const etfType = watch('etfType')
  const tenure = watch('tenure')
  const expectedCAGR = watch('expectedCAGR')
  const expenseRatio = watch('expenseRatio')
  const stepUpEnabled = watch('stepUpEnabled')
  const stepUpPercentage = watch('stepUpPercentage')

  // Convert string values to numbers
  const amountNum = parseFloat(amount) || 0
  const tenureNum = parseFloat(tenure) || 0
  const expectedCAGRNum = parseFloat(expectedCAGR) || 0
  const expenseRatioNum = parseFloat(expenseRatio) || 0
  const stepUpPercentageNum = parseFloat(stepUpPercentage) || 0

  // Update expected CAGR when ETF type changes
  useEffect(() => {
    const defaultRates = {
      equity: investmentRates.etf?.equity || 12,
      debt: investmentRates.etf?.debt || 7,
      gold: investmentRates.etf?.gold || 8,
      international: investmentRates.etf?.international || 10
    }
    
    if (defaultRates[etfType] !== undefined) {
      setValue('expectedCAGR', defaultRates[etfType], { shouldValidate: true })
    }
  }, [etfType, setValue])

  // Calculate results using custom hook
  const results = useETFCalculator(
    investmentType,
    amountNum,
    etfType,
    tenureNum,
    expectedCAGRNum,
    expenseRatioNum,
    investmentType === 'sip' ? stepUpEnabled : false,
    stepUpPercentageNum
  )

  // Disable step-up when switching to lumpsum mode
  useEffect(() => {
    if (investmentType === 'lumpsum' && stepUpEnabled) {
      setValue('stepUpEnabled', false, { shouldValidate: true })
    }
  }, [investmentType, stepUpEnabled, setValue])

  // Calculate max values for sliders
  const maxAmount = investmentType === 'sip' ? 100000 : 10000000 // ₹1 lakh for SIP, ₹1 crore for Lumpsum
  const maxTenure = 50
  const maxCAGR = 30

  // Get default rates for current ETF type
  const getDefaultRate = () => {
    const defaultRates = {
      equity: investmentRates.etf?.equity || 12,
      debt: investmentRates.etf?.debt || 7,
      gold: investmentRates.etf?.gold || 8,
      international: investmentRates.etf?.international || 10
    }
    return defaultRates[etfType] || 12
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          ETF Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Exchange Traded Fund returns (SIP or Lumpsum) with lower expense ratios than mutual funds
        </p>
      </div>

      {/* Risk Warning Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 dark:border-orange-400 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
                Market Risk Warning
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                ETF investments are subject to market risk. Returns shown are estimates based on expected CAGR and may vary significantly. Past performance does not guarantee future returns. Expense ratio is already deducted from returns.
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

              {/* Investment Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Investment Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      investmentType === 'sip'
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('investmentType')}
                      value="sip"
                      className="mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        SIP
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Systematic Investment Plan
                      </div>
                    </div>
                  </label>
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      investmentType === 'lumpsum'
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('investmentType')}
                      value="lumpsum"
                      className="mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Lumpsum
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        One-time Investment
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* ETF Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  ETF Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'equity', label: 'Equity', desc: 'Nifty 50, Sensex' },
                    { value: 'debt', label: 'Debt', desc: 'Govt. Securities' },
                    { value: 'gold', label: 'Gold', desc: 'Gold ETFs' },
                    { value: 'international', label: 'International', desc: 'S&P 500, NASDAQ' }
                  ].map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        etfType === type.value
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('etfType')}
                        value={type.value}
                        className="mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {type.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {type.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <InputField
                  label={investmentType === 'sip' ? 'Monthly SIP Amount' : 'Investment Amount'}
                  type="number"
                  {...register('amount', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('amount', value, { shouldValidate: true })
                  }}
                  error={errors.amount?.message}
                  showCurrency
                  placeholder={investmentType === 'sip' ? '5000' : '100000'}
                  min={500}
                  step={investmentType === 'sip' ? 500 : 1000}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={500}
                  max={maxAmount}
                  value={amountNum || (investmentType === 'sip' ? 5000 : 100000)}
                  onChange={(value) => setValue('amount', value, { shouldValidate: true })}
                  step={investmentType === 'sip' ? 500 : 1000}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Tenure */}
              <div>
                <InputField
                  label="Investment Tenure (Years)"
                  type="number"
                  {...register('tenure', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('tenure', value, { shouldValidate: true })
                  }}
                  error={errors.tenure?.message}
                  placeholder="5"
                  min={1}
                  max={maxTenure}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1}
                  max={maxTenure}
                  value={tenureNum || 5}
                  onChange={(value) => setValue('tenure', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} ${val === 1 ? 'year' : 'years'}`}
                />
              </div>

              {/* Expected CAGR */}
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
                  placeholder={getDefaultRate().toString()}
                  min={0}
                  max={maxCAGR}
                  step={0.1}
                  className="mb-4"
                />
                <div className="mb-2">
                  <Slider
                    label=""
                    min={0}
                    max={maxCAGR}
                    value={expectedCAGRNum || getDefaultRate()}
                    onChange={(value) => setValue('expectedCAGR', value, { shouldValidate: true })}
                    step={0.1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  <strong>Note:</strong> Default rate is {formatPercentageValue(getDefaultRate())} for {etfType === 'equity' ? 'Equity' : etfType === 'debt' ? 'Debt' : etfType === 'gold' ? 'Gold' : 'International'} ETFs. This is an estimate and actual returns may vary.
                </p>
              </div>

              {/* Expense Ratio */}
              <div>
                <InputField
                  label="Expense Ratio (% p.a.)"
                  type="number"
                  {...register('expenseRatio', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('expenseRatio', value, { shouldValidate: true })
                  }}
                  error={errors.expenseRatio?.message}
                  placeholder="0.20"
                  min={0}
                  max={2}
                  step={0.05}
                  className="mb-4"
                />
                <div className="mb-2">
                  <Slider
                    label=""
                    min={0}
                    max={2}
                    value={expenseRatioNum || 0.20}
                    onChange={(value) => setValue('expenseRatio', value, { shouldValidate: true })}
                    step={0.05}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  <strong>Note:</strong> Expense ratio is deducted from returns. ETFs typically have 0.05-0.50% expense ratio (vs 1-2% for mutual funds). Lower expense ratio means more money stays invested.
                </p>
              </div>

              {/* Step-up SIP Toggle (only shown for SIP mode) */}
              {investmentType === 'sip' && (
                <>
                  <ToggleSwitch
                    label="Enable Step-up SIP"
                    checked={stepUpEnabled}
                    onChange={(checked) => setValue('stepUpEnabled', checked, { shouldValidate: true })}
                    description="Increase your SIP amount annually by a fixed percentage"
                  />

                  {/* Step-up Percentage (shown when step-up is enabled) */}
                  {stepUpEnabled && (
                    <div>
                      <InputField
                        label="Annual Step-up Percentage (%)"
                        type="number"
                        {...register('stepUpPercentage', { 
                          valueAsNumber: true
                        })}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0
                          setValue('stepUpPercentage', value, { shouldValidate: true })
                        }}
                        error={errors.stepUpPercentage?.message}
                        placeholder="10"
                        min={0}
                        max={100}
                        step={1}
                        className="mb-4"
                      />
                      <Slider
                        label=""
                        min={0}
                        max={50}
                        value={stepUpPercentageNum || 10}
                        onChange={(value) => setValue('stepUpPercentage', value, { shouldValidate: true })}
                        step={1}
                        formatValue={(val) => formatPercentageValue(val)}
                      />
                    </div>
                  )}
                </>
              )}

            </div>
          }
          resultsPanel={
            <ETFCalculatorResults results={results} />
          }
          infoPanel={
            <ETFCalculatorInfo />
          }
          evolutionTable={
            <ETFCalculatorTable evolution={results?.evolution} tenure={tenureNum} />
          }
        />
    </div>
  )
}

export default ETFCalculator

