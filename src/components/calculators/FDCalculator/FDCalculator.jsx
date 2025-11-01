import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import FDCalculatorResults from './FDCalculatorResults'
import FDCalculatorInfo from './FDCalculatorInfo'
import FDCalculatorTable from './FDCalculatorTable'
import useFDCalculator from './useFDCalculator'
import { fdSchema } from './fdSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * FD Calculator Component
 * 
 * Real-time FD calculator with flexible tenure options and compounding frequencies
 * Features:
 * - Principal amount input (₹1,000+)
 * - Tenure input (years/months toggle)
 * - Interest rate input (default 6.5%)
 * - Compounding frequency options (Quarterly, Monthly, Annually, Cumulative)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const FDCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(fdSchema),
    defaultValues: {
      principal: 100000,
      tenure: 5,
      tenureUnit: 'years',
      rate: investmentRates.fd.rate,
      compoundingFrequency: 'quarterly',
      adjustInflation: false
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const principal = watch('principal')
  const tenure = watch('tenure')
  const tenureUnit = watch('tenureUnit')
  const rate = watch('rate')
  const compoundingFrequency = watch('compoundingFrequency')
  const adjustInflation = watch('adjustInflation')

  // Convert string values to numbers
  const principalNum = parseFloat(principal) || 0
  const tenureNum = parseFloat(tenure) || 0
  const rateNum = parseFloat(rate) || 0

  // Calculate results using custom hook
  const results = useFDCalculator(
    principalNum,
    tenureNum,
    tenureUnit,
    rateNum,
    compoundingFrequency,
    adjustInflation
  )

  // Calculate max values for sliders
  const maxPrincipal = 10000000 // ₹1 crore
  const maxTenure = tenureUnit === 'years' ? 10 : 120 // 10 years or 120 months
  const maxRate = 20

  // Compounding frequency options
  const compoundingOptions = [
    { value: 'quarterly', label: 'Quarterly', description: '4 times per year' },
    { value: 'monthly', label: 'Monthly', description: '12 times per year' },
    { value: 'annually', label: 'Annually', description: 'Once per year' },
    { value: 'cumulative', label: 'Cumulative', description: 'Paid at maturity' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          FD Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Fixed Deposit maturity amount with flexible tenure and compounding options
        </p>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Principal Amount */}
              <div>
                <InputField
                  label="Principal Amount"
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
                  value={tenureNum || (tenureUnit === 'years' ? 5 : 60)}
                  onChange={(value) => setValue('tenure', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} ${tenureUnit === 'years' ? (val === 1 ? 'year' : 'years') : (val === 1 ? 'month' : 'months')}`}
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
                    const value = Math.max(0.1, parseFloat(e.target.value) || 0.1)
                    setValue('rate', value, { shouldValidate: true })
                  }}
                  error={errors.rate?.message}
                  placeholder="6.5"
                  min={0.1}
                  max={maxRate}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0.1}
                  max={maxRate}
                  value={Math.max(0.1, rateNum || 6.5)}
                  onChange={(value) => setValue('rate', Math.max(0.1, value), { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
              </div>

              {/* Compounding Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Compounding Frequency
                </label>
                <div className="space-y-2">
                  {compoundingOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        compoundingFrequency === option.value
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('compoundingFrequency')}
                        value={option.value}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
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
            <FDCalculatorResults results={results} compoundingFrequency={compoundingFrequency} />
          }
          infoPanel={
            <FDCalculatorInfo />
          }
          evolutionTable={
            <FDCalculatorTable evolution={results?.evolution} />
          }
        />
    </div>
  )
}

export default FDCalculator

