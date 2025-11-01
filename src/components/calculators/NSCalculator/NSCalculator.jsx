import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import NSCalculatorResults from './NSCalculatorResults'
import NSCalculatorInfo from './NSCalculatorInfo'
import NSCalculatorTable from './NSCalculatorTable'
import useNSCalculator from './useNSCalculator'
import { nscSchema } from './nscSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * NSC Calculator Component
 * 
 * Real-time NSC calculator with inflation adjustment option
 * Features:
 * - Investment amount input (₹1,000+)
 * - Fixed tenure: 5 years (locked)
 * - Rate of interest (default 7.7%)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const NSCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(nscSchema),
    defaultValues: {
      principal: 100000,
      rate: investmentRates.nsc.rate,
      adjustInflation: false
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const principal = watch('principal')
  const rate = watch('rate')
  const adjustInflation = watch('adjustInflation')

  // Convert string values to numbers
  const principalNum = parseFloat(principal) || 0
  const rateNum = parseFloat(rate) || 0

  // Calculate results using custom hook
  const results = useNSCalculator(
    principalNum,
    rateNum,
    adjustInflation
  )

  // Calculate max values for sliders
  const maxPrincipal = 10000000 // ₹1 crore
  const maxRate = 20

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          NSC Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your National Savings Certificate returns with guaranteed returns
        </p>
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
                  placeholder="100000"
                  min={1000}
                  step={1000}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1000}
                  max={maxPrincipal}
                  value={principalNum || 100000}
                  onChange={(value) => setValue('principal', value, { shouldValidate: true })}
                  step={1000}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Tenure - Fixed at 5 years */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tenure
                </label>
                <div className="flex items-center space-x-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    5 years (Fixed)
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  NSC has a fixed lock-in period of 5 years
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
                    const value = parseFloat(e.target.value) || 0
                    setValue('rate', value, { shouldValidate: true })
                  }}
                  error={errors.rate?.message}
                  placeholder="7.7"
                  min={0}
                  max={maxRate}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxRate}
                  value={rateNum || investmentRates.nsc.rate}
                  onChange={(value) => setValue('rate', value, { shouldValidate: true })}
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
            <NSCalculatorResults results={results} />
          }
          infoPanel={
            <NSCalculatorInfo />
          }
          evolutionTable={
            <NSCalculatorTable evolution={results?.evolution} />
          }
        />
    </div>
  )
}

export default NSCalculator

