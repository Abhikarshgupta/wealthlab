import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import ELSSCalculatorResults from './ELSSCalculatorResults'
import ELSSCalculatorInfo from './ELSSCalculatorInfo'
import ELSSCalculatorTable from './ELSSCalculatorTable'
import useELSSCalculator from './useELSSCalculator'
import { elssSchema } from './elssSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * ELSS Calculator Component
 * 
 * Real-time ELSS calculator with SIP and Lumpsum investment options
 * Features:
 * - Investment type selection (SIP or Lumpsum)
 * - Investment amount input (₹500+)
 * - Investment tenure (years, minimum 3 years due to lock-in)
 * - Expected return rate (default 14%, minimum 0.1%)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 * - Section 80C tax benefits information
 */
const ELSSCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(elssSchema),
    defaultValues: {
      investmentType: 'sip',
      amount: 5000,
      tenure: 5,
      expectedReturn: investmentRates.elss.expectedReturn,
      adjustInflation: false
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const investmentType = watch('investmentType')
  const amount = watch('amount')
  const tenure = watch('tenure')
  const expectedReturn = watch('expectedReturn')

  // Convert string values to numbers
  const amountNum = parseFloat(amount) || 0
  const tenureNum = parseFloat(tenure) || 0
  const expectedReturnNum = parseFloat(expectedReturn) || 0

  // Calculate results using custom hook
  const results = useELSSCalculator(
    investmentType,
    amountNum,
    tenureNum,
    expectedReturnNum
  )

  // Calculate max values for sliders
  const maxAmount = 100000
  const maxTenure = 50
  const maxReturn = 30

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          ELSS Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Equity-Linked Savings Scheme returns with tax benefits under Section 80C
        </p>
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
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    {...register('investmentType')}
                    value="sip"
                    className="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">SIP</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    {...register('investmentType')}
                    value="lumpsum"
                    className="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Lumpsum</span>
                </label>
              </div>
              {errors.investmentType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.investmentType.message}
                </p>
              )}
            </div>

            {/* Investment Amount */}
            <div>
              <InputField
                label={investmentType === 'sip' ? 'Monthly SIP Amount' : 'Lumpsum Investment Amount'}
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
                placeholder="5000"
                min={500}
                step={500}
                className="mb-4"
              />
              <Slider
                label=""
                min={500}
                max={maxAmount}
                value={amountNum || 5000}
                onChange={(value) => setValue('amount', value, { shouldValidate: true })}
                step={500}
                showCurrency
                formatValue={(val) => formatCurrency(val)}
              />
            </div>

            {/* Investment Tenure */}
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
                min={3}
                max={maxTenure}
                step={1}
                className="mb-4"
              />
              <Slider
                label=""
                min={3}
                max={maxTenure}
                value={tenureNum || 5}
                onChange={(value) => setValue('tenure', value, { shouldValidate: true })}
                step={1}
                formatValue={(val) => `${val} ${val === 1 ? 'year' : 'years'}`}
              />
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Minimum 3 years required (ELSS lock-in period)
              </p>
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
                placeholder="14"
                min={0.1}
                max={maxReturn}
                step={0.1}
                className="mb-4"
              />
              <Slider
                label=""
                min={0.1}
                max={maxReturn}
                value={expectedReturnNum || 14}
                onChange={(value) => setValue('expectedReturn', value, { shouldValidate: true })}
                step={0.1}
                formatValue={(val) => formatPercentageValue(val)}
              />
            </div>

          </div>
        }
        resultsPanel={
          <ELSSCalculatorResults results={results} investmentType={investmentType} />
        }
        infoPanel={
          <ELSSCalculatorInfo />
        }
        evolutionTable={
          <ELSSCalculatorTable evolution={results?.evolution} tenure={tenureNum} />
        }
      />
    </div>
  )
}

export default ELSSCalculator

