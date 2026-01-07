import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import Bonds54ECCalculatorResults from './54ECBondsCalculatorResults'
import Bonds54ECCalculatorInfo from './54ECBondsCalculatorInfo'
import Bonds54ECCalculatorTable from './54ECBondsCalculatorTable'
import use54ECBondsCalculator from './use54ECBondsCalculator'
import { bonds54ECSchema } from './54ecBondsSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * 54EC Bonds Calculator Component
 * 
 * Real-time 54EC Bonds calculator with capital gains exemption calculation
 * Features:
 * - Capital gain amount input (from property sale)
 * - Investment amount input (max: capital gain amount, max ₹50L per FY)
 * - Fixed tenure: 5 years (locked)
 * - Rate of interest (default 5.75%)
 * - Tax savings calculation (capital gains exemption)
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 */
const Bonds54ECCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(bonds54ECSchema),
    defaultValues: {
      capitalGainAmount: 1000000,
      investmentAmount: 1000000,
      rate: investmentRates.bonds54EC?.rate || 5.75
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const capitalGainAmount = watch('capitalGainAmount')
  const investmentAmount = watch('investmentAmount')
  const rate = watch('rate')

  // Convert string values to numbers
  const capitalGainAmountNum = parseFloat(capitalGainAmount) || 0
  const investmentAmountNum = parseFloat(investmentAmount) || 0
  const rateNum = parseFloat(rate) || 0

  // Calculate results using custom hook
  const results = use54ECBondsCalculator(
    capitalGainAmountNum,
    investmentAmountNum,
    rateNum
  )

  // Calculate max values for sliders
  const maxCapitalGain = 100000000 // ₹10 crore
  const maxInvestment = Math.min(
    capitalGainAmountNum || 5000000,
    50000000 // ₹50L per financial year limit
  )
  const maxRate = 20

  // Handle investment amount change to ensure it doesn't exceed capital gain
  const handleInvestmentAmountChange = (value) => {
    const maxAllowed = Math.min(capitalGainAmountNum || 5000000, 5000000) // Max ₹50L or capital gain amount
    const adjustedValue = Math.min(value, maxAllowed)
    setValue('investmentAmount', adjustedValue, { shouldValidate: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          54EC Bonds Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your 54EC Capital Gain Bonds returns and tax savings from property sale
        </p>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Capital Gain Amount */}
              <div>
                <InputField
                  label="Capital Gain Amount (from property sale)"
                  type="number"
                  {...register('capitalGainAmount', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('capitalGainAmount', value, { shouldValidate: true })
                    // Auto-adjust investment amount if it exceeds new capital gain
                    if (investmentAmountNum > value) {
                      handleInvestmentAmountChange(value)
                    }
                  }}
                  error={errors.capitalGainAmount?.message}
                  showCurrency
                  placeholder="1000000"
                  min={0}
                  step={10000}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxCapitalGain}
                  value={capitalGainAmountNum || 1000000}
                  onChange={(value) => {
                    setValue('capitalGainAmount', value, { shouldValidate: true })
                    if (investmentAmountNum > value) {
                      handleInvestmentAmountChange(value)
                    }
                  }}
                  step={10000}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Investment Amount */}
              <div>
                <InputField
                  label="Investment Amount in 54EC Bonds"
                  type="number"
                  {...register('investmentAmount', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    handleInvestmentAmountChange(value)
                  }}
                  error={errors.investmentAmount?.message || errors.investmentAmount?.type === 'custom.investmentExceedsCapitalGain' ? 'Investment amount cannot exceed capital gain amount' : undefined}
                  showCurrency
                  placeholder="1000000"
                  min={1000}
                  max={Math.min(maxInvestment, 5000000)} // Max ₹50L per FY
                  step={1000}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1000}
                  max={Math.max(1000, maxInvestment)}
                  value={investmentAmountNum || 1000000}
                  onChange={(value) => handleInvestmentAmountChange(value)}
                  step={1000}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Maximum: ₹50 lakh per financial year or capital gain amount (whichever is lower)
                </p>
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
                  54EC Bonds have a fixed lock-in period of 5 years
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
                  placeholder="5.75"
                  min={0}
                  max={maxRate}
                  step={0.1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={0}
                  max={maxRate}
                  value={rateNum || investmentRates.bonds54EC?.rate || 5.75}
                  onChange={(value) => setValue('rate', value, { shouldValidate: true })}
                  step={0.1}
                  formatValue={(val) => formatPercentageValue(val)}
                />
              </div>

              {/* Important Note */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  ⚠️ Important Note
                </h3>
                <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                  <li>• Investment must be made within 6 months of property sale date</li>
                  <li>• Maximum exemption: ₹50 lakh per financial year</li>
                  <li>• Bonds are issued by NHAI, REC, PFC</li>
                  <li>• Interest is taxable as per income tax slab</li>
                </ul>
              </div>
            </div>
          }
          resultsPanel={
            <Bonds54ECCalculatorResults results={results} />
          }
          infoPanel={
            <Bonds54ECCalculatorInfo />
          }
          evolutionTable={
            <Bonds54ECCalculatorTable evolution={results?.evolution} tenure={5} results={results} />
          }
        />
    </div>
  )
}

export default Bonds54ECCalculator

