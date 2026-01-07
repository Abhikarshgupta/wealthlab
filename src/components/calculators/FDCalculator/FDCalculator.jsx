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
import { 
  convertYearsMonthsToYears, 
  convertYearsMonthsToMonths,
  normalizeYearsMonths,
  formatTenureDisplay
} from '@/utils/fdTenureUtils'

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
      tenureYears: 1,
      tenureMonths: 0,
      rate: investmentRates.fd.rate,
      compoundingFrequency: 'quarterly',
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const principal = watch('principal')
  const tenureYears = watch('tenureYears')
  const tenureMonths = watch('tenureMonths')
  const rate = watch('rate')
  const compoundingFrequency = watch('compoundingFrequency')

  // Convert string values to numbers
  const principalNum = parseFloat(principal) || 0
  const tenureYearsNum = parseInt(tenureYears) || 0
  const tenureMonthsNum = parseInt(tenureMonths) || 0
  const rateNum = parseFloat(rate) || 0

  // Normalize months if > 11
  const normalizedTenure = normalizeYearsMonths(tenureYearsNum, tenureMonthsNum)
  const totalYears = convertYearsMonthsToYears(normalizedTenure.years, normalizedTenure.months)

  // Calculate results using custom hook
  const results = useFDCalculator(
    principalNum,
    normalizedTenure.years,
    normalizedTenure.months,
    rateNum,
    compoundingFrequency
  )

  // Calculate max values for sliders
  const maxPrincipal = 10000000 // ₹1 crore
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

              {/* Tenure - Years and Months */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Tenure
                </label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <InputField
                      label="Years"
                      type="number"
                      {...register('tenureYears', { 
                        valueAsNumber: true
                      })}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        setValue('tenureYears', Math.max(0, value), { shouldValidate: true })
                        // Auto-normalize if needed
                        const currentMonths = parseInt(tenureMonths) || 0
                        const normalized = normalizeYearsMonths(value, currentMonths)
                        if (normalized.months !== currentMonths) {
                          setValue('tenureMonths', normalized.months, { shouldValidate: true })
                        }
                        if (normalized.years !== value) {
                          setValue('tenureYears', normalized.years, { shouldValidate: true })
                        }
                      }}
                      error={errors.tenureYears?.message}
                      placeholder="0"
                      min={0}
                      max={10}
                      step={1}
                    />
                  </div>
                  <div>
                    <InputField
                      label="Months"
                      type="number"
                      {...register('tenureMonths', { 
                        valueAsNumber: true
                      })}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        const normalized = normalizeYearsMonths(tenureYearsNum || 0, value)
                        setValue('tenureYears', normalized.years, { shouldValidate: true })
                        setValue('tenureMonths', normalized.months, { shouldValidate: true })
                      }}
                      error={errors.tenureMonths?.message || errors.tenure?.message}
                      placeholder="0"
                      min={0}
                      max={11}
                      step={1}
                    />
                    {tenureMonthsNum >= 12 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Normalized to {normalizedTenure.years} year{normalizedTenure.years !== 1 ? 's' : ''} {normalizedTenure.months} month{normalizedTenure.months !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                {/* Combined slider showing total tenure */}
                <Slider
                  label=""
                  min={0}
                  max={120} // 10 years = 120 months
                  value={convertYearsMonthsToMonths(normalizedTenure.years, normalizedTenure.months)}
                  onChange={(value) => {
                    // Convert slider value (total months) back to years + months
                    const totalMonths = Math.max(1, Math.min(120, value))
                    const normalized = normalizeYearsMonths(0, totalMonths)
                    setValue('tenureYears', normalized.years, { shouldValidate: true })
                    setValue('tenureMonths', normalized.months, { shouldValidate: true })
                  }}
                  step={1}
                  formatValue={(val) => formatTenureDisplay(Math.floor(val / 12), val % 12)}
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

            </div>
          }
          resultsPanel={
            <FDCalculatorResults results={results} compoundingFrequency={compoundingFrequency} />
          }
          infoPanel={
            <FDCalculatorInfo />
          }
          evolutionTable={
            <FDCalculatorTable evolution={results?.evolution} tenure={totalYears} results={results} />
          }
        />
    </div>
  )
}

export default FDCalculator

