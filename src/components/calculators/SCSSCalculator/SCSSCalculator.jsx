import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import SCSSCalculatorResults from './SCSSCalculatorResults'
import SCSSCalculatorInfo from './SCSSCalculatorInfo'
import SCSSCalculatorTable from './SCSSCalculatorTable'
import useSCSSCalculator from './useSCSSCalculator'
import { scssSchema } from './scssSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * SCSS Calculator Component
 * 
 * Real-time SCSS calculator with inflation adjustment options
 * Features:
 * - Investment amount input (₹1,000 - ₹30L)
 * - Tenure input (1-5 years)
 * - Senior's age input (60+ years)
 * - Rate of interest (default 8.2%)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const SCSSCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(scssSchema),
    defaultValues: {
      principal: 1000000,
      tenure: 5,
      seniorsAge: 65,
      isDefensePersonnel: false,
      rate: investmentRates.scss.rate
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const principal = watch('principal')
  const tenure = watch('tenure')
  const seniorsAge = watch('seniorsAge')
  const isDefensePersonnel = watch('isDefensePersonnel')
  const rate = watch('rate')

  // Convert string values to numbers
  const principalNum = parseFloat(principal) || 0
  const tenureNum = parseFloat(tenure) || 0
  const seniorsAgeNum = parseFloat(seniorsAge) || 0
  const rateNum = parseFloat(rate) || 0

  // Calculate results using custom hook
  const results = useSCSSCalculator(
    principalNum,
    tenureNum,
    seniorsAgeNum,
    rateNum,
    isDefensePersonnel
  )

  // Calculate max values for sliders
  const maxPrincipal = 3000000 // ₹30 lakh
  const maxTenure = 5
  const minAge = isDefensePersonnel ? 55 : 60
  const maxAge = 100
  const maxRate = 20

  // Adjust age if it's below minimum when defense personnel checkbox changes
  const handleDefensePersonnelChange = (checked) => {
    setValue('isDefensePersonnel', checked, { shouldValidate: true })
    const currentAge = parseFloat(seniorsAge) || 0
    if (checked && currentAge < 55) {
      setValue('seniorsAge', 55, { shouldValidate: true })
    } else if (!checked && currentAge < 60) {
      setValue('seniorsAge', 60, { shouldValidate: true })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          SCSS Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Senior Citizens Savings Scheme returns with quarterly interest payments
        </p>
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Quick Guide:</strong> Investment amount and interest rate affect all calculations. 
            Tenure determines total interest earned. Age is only for eligibility verification (doesn't affect calculations).
          </p>
        </div>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Investment Amount */}
              <div>
                <InputField
                  label="Investment Amount"
                  type="number"
                  {...register('principal', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('principal', value, { shouldValidate: true })
                  }}
                  error={errors.principal?.message}
                  showCurrency
                  placeholder="1000000"
                  min={1000}
                  step={1000}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1000}
                  max={maxPrincipal}
                  value={principalNum || 1000000}
                  onChange={(value) => setValue('principal', value, { shouldValidate: true })}
                  step={1000}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Tenure */}
              <div>
                <InputField
                  label="Tenure (Years)"
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

              {/* Retired Defense Personnel Toggle */}
              <ToggleSwitch
                label="Retired Defense Personnel"
                checked={isDefensePersonnel}
                onChange={handleDefensePersonnelChange}
                description="Check if you are a retired defense personnel (eligible at age 55+)"
              />

              {/* Senior's Age */}
              <div>
                <InputField
                  label="Senior's Age (Years)"
                  type="number"
                  {...register('seniorsAge', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('seniorsAge', value, { shouldValidate: true })
                  }}
                  error={errors.seniorsAge?.message}
                  placeholder={isDefensePersonnel ? "55" : "60"}
                  min={minAge}
                  max={maxAge}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={minAge}
                  max={maxAge}
                  value={seniorsAgeNum || (isDefensePersonnel ? 55 : 60)}
                  onChange={(value) => setValue('seniorsAge', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} ${val === 1 ? 'year' : 'years'}`}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum age: {isDefensePersonnel ? '55 years (for retired defense personnel)' : '60 years (55 years for retired defense personnel)'}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                  ℹ️ Note: Age is for eligibility only. It does not affect interest calculations.
                </p>
              </div>

              {/* Rate of Interest */}
              <div>
                <InputField
                  label="Rate of Interest (% p.a.)"
                  type="number"
                  {...register('rate', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = Math.max(0, parseFloat(e.target.value) || 0)
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
                  value={Math.max(0, rateNum || 8.2)}
                  onChange={(value) => setValue('rate', Math.max(0, value), { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
              </div>

            </div>
          }
          resultsPanel={
            <SCSSCalculatorResults results={results} />
          }
          infoPanel={
            <SCSSCalculatorInfo />
          }
          evolutionTable={
            <SCSSCalculatorTable evolution={results?.evolution} tenure={tenureNum} results={results} />
          }
        />
    </div>
  )
}

export default SCSSCalculator

