import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useEffect } from 'react'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import DebtMutualFundCalculatorResults from './DebtMutualFundCalculatorResults'
import DebtMutualFundCalculatorInfo from './DebtMutualFundCalculatorInfo'
import DebtMutualFundCalculatorTable from './DebtMutualFundCalculatorTable'
import useDebtMutualFundCalculator from './useDebtMutualFundCalculator'
import { debtMutualFundSchema } from './debtMutualFundSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * Debt Mutual Fund Calculator Component
 * 
 * Real-time debt mutual fund calculator supporting both SIP and Lumpsum investment modes
 * Features:
 * - Investment type selection (SIP or Lumpsum)
 * - Debt fund type selection (Liquid, Short-term, Long-term, Gilt, Corporate Bond)
 * - Investment amount input (₹500+)
 * - Tenure input (years)
 * - Expected return input (default varies by fund type)
 * - Step-up SIP option with annual increase percentage (SIP mode only)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const DebtMutualFundCalculator = () => {
  // Get default rates based on fund type
  const getDefaultReturn = (fundType) => {
    const rates = investmentRates.debtMutualFund || {}
    return rates[fundType] || 7.5
  }

  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(debtMutualFundSchema),
    defaultValues: {
      investmentType: 'sip',
      amount: 5000,
      tenure: 5,
      fundType: 'shortTerm',
      expectedReturn: getDefaultReturn('shortTerm'),
      stepUpEnabled: false,
      stepUpPercentage: 10
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const investmentType = watch('investmentType')
  const amount = watch('amount')
  const tenure = watch('tenure')
  const fundType = watch('fundType')
  const expectedReturn = watch('expectedReturn')
  const stepUpEnabled = watch('stepUpEnabled')
  const stepUpPercentage = watch('stepUpPercentage')

  // Convert string values to numbers
  const amountNum = parseFloat(amount) || 0
  const tenureNum = parseFloat(tenure) || 0
  const expectedReturnNum = parseFloat(expectedReturn) || 0
  const stepUpPercentageNum = parseFloat(stepUpPercentage) || 0

  // Update expected return when fund type changes
  useEffect(() => {
    const newDefaultReturn = getDefaultReturn(fundType)
    if (Math.abs(expectedReturnNum - newDefaultReturn) < 0.5) {
      // Only update if current value is close to old default
      setValue('expectedReturn', newDefaultReturn, { shouldValidate: true })
    }
  }, [fundType, setValue])

  // Calculate results using custom hook
  const results = useDebtMutualFundCalculator(
    investmentType,
    amountNum,
    tenureNum,
    fundType,
    expectedReturnNum,
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
  const maxReturn = 20

  // Fund type options
  const fundTypeOptions = [
    { value: 'liquid', label: 'Liquid Funds', description: '0-90 days maturity' },
    { value: 'shortTerm', label: 'Short-term Debt', description: '1-3 years maturity' },
    { value: 'longTerm', label: 'Long-term Debt', description: '3+ years maturity' },
    { value: 'gilt', label: 'Gilt Funds', description: 'Government Securities' },
    { value: 'corporateBond', label: 'Corporate Bond Funds', description: 'Corporate Bonds' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Debt Mutual Fund Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your debt mutual fund returns with tax-efficient indexation benefits
        </p>
      </div>

      {/* Tax Efficiency Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                Tax Efficiency Advantage
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Debt mutual funds offer indexation benefit for long-term capital gains (held &gt;3 years), making them more tax-efficient than Fixed Deposits. LTCG is taxed at 20% with indexation, while STCG (held &lt;3 years) is taxed as per your income tax slab.
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

              {/* Debt Fund Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Debt Fund Type
                </label>
                <select
                  {...register('fundType')}
                  onChange={(e) => {
                    setValue('fundType', e.target.value, { shouldValidate: true })
                    const newDefaultReturn = getDefaultReturn(e.target.value)
                    setValue('expectedReturn', newDefaultReturn, { shouldValidate: true })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {fundTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Select the type of debt mutual fund based on your investment horizon and risk appetite
                </p>
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

              {/* Expected Return Rate */}
              <div>
                <InputField
                  label="Expected Return Rate (% p.a.)"
                  type="number"
                  {...register('expectedReturn', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('expectedReturn', value, { shouldValidate: true })
                  }}
                  error={errors.expectedReturn?.message}
                  placeholder="7.5"
                  min={0}
                  max={maxReturn}
                  step={0.1}
                  className="mb-4"
                />
                <div className="mb-2">
                  <Slider
                    label=""
                    min={0}
                    max={maxReturn}
                    value={expectedReturnNum || 7.5}
                    onChange={(value) => setValue('expectedReturn', value, { shouldValidate: true })}
                    step={0.1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  <strong>Note:</strong> Returns are market-linked and may vary. Historical debt mutual fund returns have averaged around 7-9% p.a. depending on fund type and market conditions.
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
            <DebtMutualFundCalculatorResults results={results} />
          }
          infoPanel={
            <DebtMutualFundCalculatorInfo />
          }
          evolutionTable={
            <DebtMutualFundCalculatorTable evolution={results?.evolution} tenure={tenureNum} />
          }
        />
    </div>
  )
}

export default DebtMutualFundCalculator

