import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import SSYCalculatorResults from './SSYCalculatorResults'
import SSYCalculatorInfo from './SSYCalculatorInfo'
import SSYCalculatorTable from './SSYCalculatorTable'
import useSSYCalculator from './useSSYCalculator'
import { ssySchema } from './ssySchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * SSY Calculator Component
 * 
 * Real-time SSY calculator for girl child savings scheme
 * Features:
 * - Yearly investment amount input (₹250 - ₹1.5L)
 * - Girl's age input (0-9 years, critical validation)
 * - Start period (year)
 * - Interest rate (default 8.2%)
 * - Step-up investment option with annual increase percentage (capped at ₹1.5L per year)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 * - Account matures when girl child turns 21 years
 */
const SSYCalculator = () => {
  const currentYear = new Date().getFullYear()
  
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(ssySchema),
    defaultValues: {
      yearlyInvestment: 10000,
      girlsAge: 5,
      startYear: currentYear,
      rate: investmentRates.ssy.rate,
      stepUpEnabled: false,
      stepUpPercentage: 10
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const yearlyInvestment = watch('yearlyInvestment')
  const girlsAge = watch('girlsAge')
  const startYear = watch('startYear')
  const rate = watch('rate')
  const stepUpEnabled = watch('stepUpEnabled')
  const stepUpPercentage = watch('stepUpPercentage')

  // Convert string values to numbers
  const yearlyInvestmentNum = parseFloat(yearlyInvestment) || 0
  const girlsAgeNum = parseFloat(girlsAge) || 0
  const startYearNum = parseFloat(startYear) || currentYear
  const rateNum = parseFloat(rate) || 0
  const stepUpPercentageNum = parseFloat(stepUpPercentage) || 0

  // Calculate results using custom hook
  const results = useSSYCalculator(
    yearlyInvestmentNum,
    girlsAgeNum,
    startYearNum,
    rateNum,
    stepUpEnabled,
    stepUpPercentageNum
  )

  // Calculate max values for sliders
  const maxInvestment = 150000
  const maxRate = 20
  const yearsTillMaturity = results?.yearsTillMaturity || (21 - girlsAgeNum)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          SSY Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Sukanya Samriddhi Yojana returns - A savings scheme exclusively for girl child
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
                  min={250}
                  max={150000}
                  step={250}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={250}
                  max={maxInvestment}
                  value={yearlyInvestmentNum || 10000}
                  onChange={(value) => setValue('yearlyInvestment', value, { shouldValidate: true })}
                  step={250}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Girl's Age */}
              <div>
                <InputField
                  label="Girl's Age (Years)"
                  type="number"
                  {...register('girlsAge', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('girlsAge', value, { shouldValidate: true })
                  }}
                  error={errors.girlsAge?.message}
                  placeholder="5"
                  min={0}
                  max={9}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={9}
                  value={girlsAgeNum >= 0 ? girlsAgeNum : 5}
                  onChange={(value) => setValue('girlsAge', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => val === 0 ? '0 years (newborn)' : `${val} ${val === 1 ? 'year' : 'years'}`}
                />
                {yearsTillMaturity > 0 && yearsTillMaturity <= 21 && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    Account will mature in {yearsTillMaturity} {yearsTillMaturity === 1 ? 'year' : 'years'} (when girl turns 21)
                  </p>
                )}
                {girlsAgeNum >= 10 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    ⚠️ Girl must be below 10 years of age to open SSY account
                  </p>
                )}
                {girlsAgeNum === 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    ✓ Account can be opened for a newborn girl child (age 0)
                  </p>
                )}
              </div>

              {/* Start Period (Year) */}
              <div>
                <InputField
                  label="Start Period (Year)"
                  type="number"
                  {...register('startYear', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || currentYear
                    setValue('startYear', value, { shouldValidate: true })
                  }}
                  error={errors.startYear?.message}
                  placeholder={currentYear.toString()}
                  min={2000}
                  max={2100}
                  step={1}
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
                  placeholder="8.2"
                  min={0}
                  max={maxRate}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxRate}
                  value={rateNum || 8.2}
                  onChange={(value) => setValue('rate', value, { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Current SSY rate: {formatPercentageValue(investmentRates.ssy.rate)} (Last updated: {new Date(investmentRates.ssy.lastUpdated).toLocaleDateString('en-IN', {
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
                description="Increase your yearly investment amount annually by a fixed percentage (capped at ₹1.5L per year)"
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Note: Yearly investment will be capped at ₹1.5L as per SSY rules
                  </p>
                </div>
              )}

            </div>
          }
          resultsPanel={
            <SSYCalculatorResults results={results} />
          }
          infoPanel={
            <SSYCalculatorInfo />
          }
          evolutionTable={
            <SSYCalculatorTable evolution={results?.evolution} tenure={yearsTillMaturity} results={results} />
          }
        />
    </div>
  )
}

export default SSYCalculator

