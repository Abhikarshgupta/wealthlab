import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import PPFCalculatorResults from './PPFCalculatorResults'
import PPFCalculatorInfo from './PPFCalculatorInfo'
import PPFCalculatorTable from './PPFCalculatorTable'
import usePPFCalculator from './usePPFCalculator'
import { ppfSchema } from './ppfSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * PPF Calculator Component
 * 
 * Real-time PPF calculator with step-up and inflation adjustment options
 * Features:
 * - Yearly investment amount input (₹500 - ₹1.5L)
 * - Investment period (1-50 years)
 * - Interest rate (default 7.1%)
 * - Step-up investment option with annual increase percentage
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const PPFCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(ppfSchema),
    defaultValues: {
      yearlyInvestment: 10000,
      tenure: 15,
      rate: investmentRates.ppf.rate,
      stepUpEnabled: false,
      stepUpPercentage: 10,
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const yearlyInvestment = watch('yearlyInvestment')
  const tenure = watch('tenure')
  const rate = watch('rate')
  const stepUpEnabled = watch('stepUpEnabled')
  const stepUpPercentage = watch('stepUpPercentage')

  // Convert string values to numbers
  const yearlyInvestmentNum = parseFloat(yearlyInvestment) || 0
  const tenureNum = parseFloat(tenure) || 0
  const rateNum = parseFloat(rate) || 0
  const stepUpPercentageNum = parseFloat(stepUpPercentage) || 0

  // Calculate results using custom hook
  const results = usePPFCalculator(
    yearlyInvestmentNum,
    tenureNum,
    rateNum,
    stepUpEnabled,
    stepUpPercentageNum
  )

  // Calculate max values for sliders
  const maxInvestment = 150000
  const maxTenure = 50
  const maxRate = 20

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          PPF Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Public Provident Fund returns with step-up and inflation adjustments
        </p>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Yearly Investment Amount */}
              <div>
                <InputField
                  label="Yearly Investment Amount"
                  type="number"
                  {...register('yearlyInvestment', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('yearlyInvestment', value, { shouldValidate: true })
                  }}
                  error={errors.yearlyInvestment?.message}
                  showCurrency
                  placeholder="10000"
                  min={500}
                  max={150000}
                  step={500}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={500}
                  max={maxInvestment}
                  value={yearlyInvestmentNum || 10000}
                  onChange={(value) => setValue('yearlyInvestment', value, { shouldValidate: true })}
                  step={500}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Investment Period */}
              <div>
                <InputField
                  label="Investment Period (Years)"
                  type="number"
                  {...register('tenure', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('tenure', value, { shouldValidate: true })
                  }}
                  error={errors.tenure?.message}
                  placeholder="15"
                  min={1}
                  max={maxTenure}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1}
                  max={maxTenure}
                  value={tenureNum || 15}
                  onChange={(value) => setValue('tenure', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} ${val === 1 ? 'year' : 'years'}`}
                />
              </div>

              {/* Interest Rate */}
              <div>
                <InputField
                  label="Rate of Interest (% p.a.)"
                  type="number"
                  {...register('rate', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('rate', value, { shouldValidate: true })
                  }}
                  error={errors.rate?.message}
                  placeholder="7.1"
                  min={0}
                  max={maxRate}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxRate}
                  value={rateNum || 7.1}
                  onChange={(value) => setValue('rate', value, { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Current PPF rate: {formatPercentageValue(investmentRates.ppf.rate)} (Last updated: {new Date(investmentRates.ppf.lastUpdated).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })})
                </p>
              </div>

              {/* Step-up Investment Toggle */}
              <ToggleSwitch
                label="Enable Step-up Investment"
                checked={stepUpEnabled}
                onChange={(checked) => setValue('stepUpEnabled', checked, { shouldValidate: true })}
                description="Increase your yearly investment amount annually by a fixed percentage"
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
            <PPFCalculatorResults results={results} />
          }
          infoPanel={
            <PPFCalculatorInfo />
          }
          evolutionTable={
            <PPFCalculatorTable evolution={results?.evolution} tenure={tenureNum} />
          }
        />
    </div>
  )
}

export default PPFCalculator

