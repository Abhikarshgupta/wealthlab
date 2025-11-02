import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import REITsCalculatorResults from './REITsCalculatorResults'
import REITsCalculatorInfo from './REITsCalculatorInfo'
import REITsCalculatorTable from './REITsCalculatorTable'
import useREITsCalculator from './useREITsCalculator'
import { reitsSchema } from './reitsSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * REITs Calculator Component
 * 
 * Real-time REITs calculator supporting dividend income and capital appreciation calculations
 * Features:
 * - Investment amount input (₹1,000+)
 * - Number of units input (optional)
 * - Expected dividend yield input (default 7%, user-defined)
 * - Expected capital appreciation input (default 6%, user-defined)
 * - Tenure input (years)
 * - Real-time calculations with results panel, pie chart, and evolution table
 * - Year-wise breakdown showing dividends and capital gains separately
 */
const REITsCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(reitsSchema),
    defaultValues: {
      investmentAmount: 100000,
      numberOfUnits: null,
      dividendYield: investmentRates.reits.dividendYield,
      capitalAppreciation: investmentRates.reits.capitalAppreciation,
      tenure: 5
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const investmentAmount = watch('investmentAmount')
  const numberOfUnits = watch('numberOfUnits')
  const dividendYield = watch('dividendYield')
  const capitalAppreciation = watch('capitalAppreciation')
  const tenure = watch('tenure')

  // Convert string values to numbers
  const investmentAmountNum = parseFloat(investmentAmount) || 0
  const numberOfUnitsNum = numberOfUnits ? parseFloat(numberOfUnits) : null
  const dividendYieldNum = parseFloat(dividendYield) || 0
  const capitalAppreciationNum = parseFloat(capitalAppreciation) || 0
  const tenureNum = parseFloat(tenure) || 0

  // Calculate results using custom hook
  const results = useREITsCalculator(
    investmentAmountNum,
    numberOfUnitsNum,
    dividendYieldNum,
    capitalAppreciationNum,
    tenureNum
  )

  // Calculate max values for sliders
  const maxAmount = 10000000 // ₹1 crore
  const maxTenure = 50
  const maxDividendYield = 50
  const maxCapitalAppreciation = 50

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          REITs Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Real Estate Investment Trust returns with dividend income and capital appreciation
        </p>
      </div>

      {/* Risk Warning Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 dark:border-orange-400 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
                Market Risk Warning
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                REITs are subject to market risk. Returns shown are estimates based on expected dividend yield and capital appreciation and may vary significantly. Past performance does not guarantee future returns. Please invest only if you understand the risks involved.
              </p>
            </div>
          </div>
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
                  {...register('investmentAmount', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('investmentAmount', value, { shouldValidate: true })
                  }}
                  error={errors.investmentAmount?.message}
                  showCurrency
                  placeholder="100000"
                  min={1000}
                  step={1000}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1000}
                  max={maxAmount}
                  value={investmentAmountNum || 100000}
                  onChange={(value) => setValue('investmentAmount', value, { shouldValidate: true })}
                  step={1000}
                  showCurrency
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Number of Units (Optional) */}
              <div>
                <InputField
                  label="Number of Units (Optional)"
                  type="number"
                  {...register('numberOfUnits', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : null
                    setValue('numberOfUnits', value, { shouldValidate: true })
                  }}
                  error={errors.numberOfUnits?.message}
                  placeholder="Leave blank to auto-calculate"
                  min={1}
                  step={1}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  If not provided, units will be calculated based on investment amount (assuming ₹100 per unit)
                </p>
              </div>

              {/* Tenure */}
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

              {/* Dividend Yield */}
              <div>
                <InputField
                  label="Expected Dividend Yield (% p.a.)"
                  type="number"
                  {...register('dividendYield', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('dividendYield', value, { shouldValidate: true })
                  }}
                  error={errors.dividendYield?.message}
                  placeholder="7"
                  min={0}
                  max={maxDividendYield}
                  step={0.1}
                  className="mb-4"
                />
                <div className="mb-2">
                  <Slider
                    label=""
                    min={0}
                    max={maxDividendYield}
                    value={dividendYieldNum || 7}
                    onChange={(value) => setValue('dividendYield', value, { shouldValidate: true })}
                    step={0.1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  <strong>Note:</strong> Historical dividend yield for REITs in India ranges from 6-8% p.a. Returns may vary based on market conditions and individual REIT performance.
                </p>
              </div>

              {/* Capital Appreciation */}
              <div>
                <InputField
                  label="Expected Capital Appreciation (% p.a.)"
                  type="number"
                  {...register('capitalAppreciation', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('capitalAppreciation', value, { shouldValidate: true })
                  }}
                  error={errors.capitalAppreciation?.message}
                  placeholder="6"
                  min={0}
                  max={maxCapitalAppreciation}
                  step={0.1}
                  className="mb-4"
                />
                <div className="mb-2">
                  <Slider
                    label=""
                    min={0}
                    max={maxCapitalAppreciation}
                    value={capitalAppreciationNum || 6}
                    onChange={(value) => setValue('capitalAppreciation', value, { shouldValidate: true })}
                    step={0.1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  <strong>Note:</strong> Historical capital appreciation for REITs in India ranges from 5-7% p.a. Capital appreciation depends on real estate market conditions and may vary significantly.
                </p>
              </div>
            </div>
          }
          resultsPanel={
            <REITsCalculatorResults results={results} />
          }
          infoPanel={
            <REITsCalculatorInfo />
          }
          evolutionTable={
            <REITsCalculatorTable evolution={results?.evolution} />
          }
        />
    </div>
  )
}

export default REITsCalculator

