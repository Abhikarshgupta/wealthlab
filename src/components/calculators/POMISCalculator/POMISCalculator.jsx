import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import POMISCalculatorResults from './POMISCalculatorResults'
import POMISCalculatorInfo from './POMISCalculatorInfo'
import POMISCalculatorTable from './POMISCalculatorTable'
import usePOMISCalculator from './usePOMISCalculator'
import { pomisSchema } from './pomisSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * POMIS Calculator Component
 * 
 * Real-time POMIS calculator with inflation adjustment options
 * Features:
 * - Investment amount input (₹1,000 - ₹9L single, ₹15L joint)
 * - Fixed 5-year tenure
 * - Rate of interest (default 7.4%)
 * - Joint account toggle (affects max limit)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const POMISCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(pomisSchema),
    defaultValues: {
      principal: 1000000,
      isJointAccount: false,
      rate: investmentRates.pomis.rate
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const principal = watch('principal')
  const isJointAccount = watch('isJointAccount')
  const rate = watch('rate')

  // Convert string values to numbers
  const principalNum = parseFloat(principal) || 0
  const rateNum = parseFloat(rate) || 0

  // Calculate max values based on account type
  const maxPrincipal = isJointAccount ? 1500000 : 900000
  const maxRate = 20

  // Adjust principal if it exceeds max when account type changes
  const handleJointAccountChange = (checked) => {
    setValue('isJointAccount', checked, { shouldValidate: true })
    const currentPrincipal = parseFloat(principal) || 0
    const newMax = checked ? 1500000 : 900000
    if (currentPrincipal > newMax) {
      setValue('principal', newMax, { shouldValidate: true })
    }
  }

  // Calculate results using custom hook
  const results = usePOMISCalculator(
    principalNum,
    isJointAccount,
    rateNum
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          POMIS Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Post Office Monthly Income Scheme returns with monthly interest payments
        </p>
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Quick Guide:</strong> Investment amount and interest rate affect monthly income. 
            Tenure is fixed at 5 years. Joint accounts allow higher investment limits (₹15L vs ₹9L).
          </p>
        </div>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Joint Account Toggle */}
              <ToggleSwitch
                label="Joint Account"
                checked={isJointAccount}
                onChange={handleJointAccountChange}
                description={`Maximum investment limit: ${isJointAccount ? '₹15 lakh' : '₹9 lakh'} (single account)`}
              />

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
                  max={maxPrincipal}
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum: {formatCurrency(maxPrincipal)} ({isJointAccount ? 'Joint' : 'Single'} account)
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
                  placeholder="7.4"
                  min={0}
                  max={maxRate}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxRate}
                  value={Math.max(0, rateNum || 7.4)}
                  onChange={(value) => setValue('rate', Math.max(0, value), { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
              </div>

              {/* Tenure Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tenure
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Fixed at <strong>5 years</strong> for POMIS accounts
                </p>
              </div>
            </div>
          }
          resultsPanel={
            <POMISCalculatorResults results={results} />
          }
          infoPanel={
            <POMISCalculatorInfo />
          }
          evolutionTable={
            <POMISCalculatorTable evolution={results?.evolution} tenure={5} />
          }
        />
    </div>
  )
}

export default POMISCalculator

