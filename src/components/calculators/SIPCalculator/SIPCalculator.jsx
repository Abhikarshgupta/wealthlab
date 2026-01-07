import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import SIPCalculatorResults from './SIPCalculatorResults'
import SIPCalculatorInfo from './SIPCalculatorInfo'
import SIPCalculatorTable from './SIPCalculatorTable'
import useSIPCalculator from './useSIPCalculator'
import { sipSchema } from './sipSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * SIP Calculator Component
 * 
 * Real-time SIP calculator with step-up and inflation adjustment options
 * Features:
 * - Monthly SIP amount input (₹500+)
 * - Investment period (years/months)
 * - Expected return rate (default 12%)
 * - Step-up SIP option with annual increase percentage
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const SIPCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(sipSchema),
    defaultValues: {
      monthlySIP: 5000,
      tenure: 5,
      tenureUnit: 'years',
      expectedReturn: investmentRates.sip.expectedReturn,
      stepUpEnabled: false,
      stepUpPercentage: 10,
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const monthlySIP = watch('monthlySIP')
  const tenure = watch('tenure')
  const tenureUnit = watch('tenureUnit')
  const expectedReturn = watch('expectedReturn')
  const stepUpEnabled = watch('stepUpEnabled')
  const stepUpPercentage = watch('stepUpPercentage')

  // Convert string values to numbers
  const monthlySIPNum = parseFloat(monthlySIP) || 0
  const tenureNum = parseFloat(tenure) || 0
  const expectedReturnNum = parseFloat(expectedReturn) || 0
  const stepUpPercentageNum = parseFloat(stepUpPercentage) || 0

  // Calculate results using custom hook
  const results = useSIPCalculator(
    monthlySIPNum,
    tenureNum,
    tenureUnit,
    expectedReturnNum,
    stepUpEnabled,
    stepUpPercentageNum
  )

  // Calculate max values for sliders
  const maxSIP = 100000
  const maxTenure = tenureUnit === 'years' ? 50 : 600 // 50 years or 600 months
  const maxReturn = 30

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          SIP Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Systematic Investment Plan returns with step-up and inflation adjustments
        </p>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Monthly SIP Amount */}
              <div>
                <InputField
                  label="Monthly SIP Amount"
                  type="number"
                  {...register('monthlySIP', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('monthlySIP', value, { shouldValidate: true })
                  }}
                  error={errors.monthlySIP?.message}
                  showCurrency
                  placeholder="5000"
                  min={500}
                  step={500}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={500}
                  max={maxSIP}
                  value={monthlySIPNum || 5000}
                  onChange={(value) => setValue('monthlySIP', value, { shouldValidate: true })}
                  step={500}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Investment Period */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Investment Period
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('tenureUnit')}
                        value="years"
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Years</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('tenureUnit')}
                        value="months"
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Months</span>
                    </label>
                  </div>
                </div>
                <InputField
                  type="number"
                  {...register('tenure', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('tenure', value, { shouldValidate: true })
                  }}
                  error={errors.tenure?.message}
                  placeholder={tenureUnit === 'years' ? '5' : '60'}
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
                  formatValue={(val) => `${val} ${tenureUnit === 'years' ? 'years' : 'months'}`}
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
                  placeholder="12"
                  min={0}
                  max={maxReturn}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxReturn}
                  value={expectedReturnNum || 12}
                  onChange={(value) => setValue('expectedReturn', value, { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
              </div>

              {/* Step-up SIP Toggle */}
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

            </div>
          }
          resultsPanel={
            <SIPCalculatorResults results={results} />
          }
          infoPanel={
            <SIPCalculatorInfo />
          }
          evolutionTable={
            <SIPCalculatorTable evolution={results?.evolution} tenure={tenureUnit === 'years' ? tenureNum : tenureNum / 12} results={results} />
          }
        />
    </div>
  )
}

export default SIPCalculator

