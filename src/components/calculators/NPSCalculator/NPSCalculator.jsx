import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useEffect } from 'react'
import CalculatorLayout from '@/components/common/Layout/CalculatorLayout'
import InputField from '@/components/common/InputField/InputField'
import Slider from '@/components/common/Slider/Slider'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import NPSCalculatorResults from './NPSCalculatorResults'
import NPSCalculatorInfo from './NPSCalculatorInfo'
import NPSCalculatorTable from './NPSCalculatorTable'
import useNPSCalculator from './useNPSCalculator'
import { npsSchema } from './npsSchema'
import { investmentRates } from '@/constants/investmentRates'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * NPS Calculator Component
 * 
 * Comprehensive NPS calculator with asset allocation and age-based caps
 * Features:
 * - Monthly contribution input (₹500+)
 * - Investment tenure (years) - automatically adjusted based on max contribution age (60)
 * - Current age input (for age-based equity caps)
 * - Asset allocation sliders (Equity, Corporate Bonds, Government Bonds, Alternative Investments)
 * - Expected returns per asset class
 * - Age-based equity allocation caps (75% up to age 50, decreases after) - automatically enforced
 * - Inflation adjustment toggle
 * - Real-time calculations with results panel, pie chart, and evolution table
 * 
 * NPS Rules (Updated October 1, 2025):
 * - Maximum contribution age: 60 years (can extend up to 75)
 * - Maximum equity allocation: 
 *   - Age ≤35: Up to 100% equity (NEW)
 *   - Age 36-50: Decreases by 2.5% annually (reaches 75% at age 50)
 *   - Age 51-60: Continues decreasing by 2.5% annually (reaches 50% at age 60)
 *   - Age 60+: Maximum 50% equity
 * 
 * References:
 * - PFRDA Guidelines: https://enps.nsdl.com/eNPS/getSchemeInfo.html
 * - Asset Allocation Rules: Equity up to 75% (age ≤50), Corporate Bonds up to 100%, Government Bonds up to 100%, Alternative up to 5%
 */
const NPSCalculator = () => {
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(npsSchema),
    defaultValues: {
      monthlyContribution: 5000,
      tenure: 25,
      currentAge: 35,
      equityAllocation: 50,
      corporateBondsAllocation: 30,
      governmentBondsAllocation: 20,
      alternativeAllocation: 0,
      equityReturn: investmentRates.nps.equity,
      corporateBondsReturn: investmentRates.nps.corporateBonds,
      governmentBondsReturn: investmentRates.nps.debt || 8,
      alternativeReturn: 7,
      useAgeBasedCaps: false,
      withdrawalPercentage: 80, // Default to 80% (new rule)
    },
    mode: 'onChange'
  })

  // Watch form values for real-time updates
  const monthlyContribution = watch('monthlyContribution')
  const tenure = watch('tenure')
  const currentAge = watch('currentAge')
  const equityAllocation = watch('equityAllocation')
  const corporateBondsAllocation = watch('corporateBondsAllocation')
  const governmentBondsAllocation = watch('governmentBondsAllocation')
  const alternativeAllocation = watch('alternativeAllocation')
  const equityReturn = watch('equityReturn')
  const corporateBondsReturn = watch('corporateBondsReturn')
  const governmentBondsReturn = watch('governmentBondsReturn')
  const alternativeReturn = watch('alternativeReturn')
  const useAgeBasedCaps = watch('useAgeBasedCaps')
  const withdrawalPercentage = watch('withdrawalPercentage')

  // Convert string values to numbers
  const monthlyContributionNum = parseFloat(monthlyContribution) || 0
  const tenureNum = parseFloat(tenure) || 0
  const currentAgeNum = parseFloat(currentAge) || 35
  const equityAllocationNum = parseFloat(equityAllocation) || 0
  const corporateBondsAllocationNum = parseFloat(corporateBondsAllocation) || 0
  const governmentBondsAllocationNum = parseFloat(governmentBondsAllocation) || 0
  const alternativeAllocationNum = parseFloat(alternativeAllocation) || 0
  const equityReturnNum = parseFloat(equityReturn) || 0
  const corporateBondsReturnNum = parseFloat(corporateBondsReturn) || 0
  const governmentBondsReturnNum = parseFloat(governmentBondsReturn) || 0
  const alternativeReturnNum = parseFloat(alternativeReturn) || 0

  // Calculate max equity allocation based on age
  // NEW RULES (Effective October 1, 2025): 
  // - Age ≤35: Up to 100% equity allowed
  // - Age 36-50: Decreases by 2.5% annually (97.5% at 36, 75% at 50)
  // - Age 51-59: Continues decreasing by 2.5% annually (reaches 52.5% at 59)
  // - Age 59: Maximum 53% equity (rounded up from 52.5%)
  const maxEquityDecimal = currentAgeNum <= 35 
    ? 100 
    : currentAgeNum <= 50 
      ? Math.max(75, 100 - (currentAgeNum - 35) * 2.5)
      : Math.max(50, 75 - (currentAgeNum - 50) * 2.5)
  
  // Round up to allow reaching the calculated percentage (e.g., 52.5% rounds to 53%)
  const maxEquity = Math.ceil(maxEquityDecimal)
  
  // Calculate max tenure based on NPS rules
  // Max contribution age is 60, but we cap input age at 59 to prevent breaking
  // At age 59, user can still contribute for 1 year (until age 60)
  const MAX_CONTRIBUTION_AGE = 60 // Actual max contribution age
  const MAX_INPUT_AGE = 59 // Capped input age to prevent calculator issues
  const maxTenure = currentAgeNum >= MAX_INPUT_AGE 
    ? 1 // At age 59, can contribute for 1 more year until age 60
    : Math.max(1, MAX_CONTRIBUTION_AGE - currentAgeNum)

  // Auto-adjust age if it exceeds maximum input age
  useEffect(() => {
    if (currentAgeNum > MAX_INPUT_AGE) {
      setValue('currentAge', MAX_INPUT_AGE, { shouldValidate: true })
    }
  }, [currentAgeNum, setValue])

  // Auto-adjust tenure when currentAge + tenure exceeds max contribution age
  useEffect(() => {
    if (currentAgeNum && tenureNum) {
      const exitAge = currentAgeNum + tenureNum
      
      // If exit age exceeds max contribution age, adjust tenure
      if (exitAge > MAX_CONTRIBUTION_AGE) {
        const adjustedTenure = Math.max(1, MAX_CONTRIBUTION_AGE - currentAgeNum)
        setValue('tenure', adjustedTenure, { shouldValidate: true })
      }
      
      // If age is 59 and tenure is 0, set it to 1 (can contribute until age 60)
      if (currentAgeNum === MAX_INPUT_AGE && tenureNum === 0) {
        setValue('tenure', 1, { shouldValidate: true })
      }
    }
  }, [currentAgeNum, tenureNum, setValue])

  // Auto-adjust equity allocation when it exceeds age-based cap (regulatory requirement)
  useEffect(() => {
    if (equityAllocationNum > maxEquity) {
      // Simply cap at maxEquity without redistributing excess
      setValue('equityAllocation', maxEquity, { shouldValidate: true })
    }
  }, [currentAgeNum, maxEquity, equityAllocationNum, setValue])

  // Calculate total allocation
  const totalAllocation = 
    equityAllocationNum + 
    corporateBondsAllocationNum + 
    governmentBondsAllocationNum + 
    alternativeAllocationNum

  /**
   * Handle asset allocation change
   * Simply sets the allocation value without automatic redistribution
   * Enforces max caps for equity and alternative investments
   * Uses whole numbers for all percentages
   */
  const handleAllocationChange = (assetType, newValue) => {
    // Round to whole number
    let adjustedValue = Math.round(newValue)
    
    // For equity, enforce max cap
    if (assetType === 'equity') {
      adjustedValue = Math.min(maxEquity, adjustedValue)
    }
    // For alternative, enforce max cap
    if (assetType === 'alternative') {
      adjustedValue = Math.min(5, adjustedValue)
    }
    
    // Ensure non-negative
    adjustedValue = Math.max(0, adjustedValue)
    
    // Set the changed allocation (rounded to whole number)
    setValue(`${assetType}Allocation`, adjustedValue, { shouldValidate: true })
  }

  // Calculate results using custom hook
  const withdrawalPercentageNum = parseFloat(withdrawalPercentage) || 80

  const results = useNPSCalculator(
    monthlyContributionNum,
    tenureNum,
    currentAgeNum,
    equityAllocationNum,
    corporateBondsAllocationNum,
    governmentBondsAllocationNum,
    alternativeAllocationNum,
    equityReturnNum,
    corporateBondsReturnNum,
    governmentBondsReturnNum,
    alternativeReturnNum,
    useAgeBasedCaps,
    withdrawalPercentageNum
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Calculator Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          NPS Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your National Pension System returns with customizable asset allocation and age-based caps.
          <span className="text-green-600 dark:text-green-400 font-semibold"> NEW: Up to 100% equity allowed for subscribers up to age 35 (effective October 1, 2025)</span>
        </p>
      </div>

      <CalculatorLayout
          inputPanel={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Investment Details
              </h2>

              {/* Monthly Contribution */}
              <div>
                <InputField
                  label="Monthly Contribution"
                  type="number"
                  {...register('monthlyContribution', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setValue('monthlyContribution', value, { shouldValidate: true })
                  }}
                  error={errors.monthlyContribution?.message}
                  showCurrency
                  placeholder="5000"
                  min={500}
                  step={500}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={500}
                  max={100000}
                  value={monthlyContributionNum || 5000}
                  onChange={(value) => setValue('monthlyContribution', value, { shouldValidate: true })}
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
                    const adjustedValue = Math.min(maxTenure, Math.max(1, value))
                    setValue('tenure', adjustedValue, { shouldValidate: true })
                  }}
                  error={errors.tenure?.message}
                  placeholder="25"
                  min={1}
                  max={maxTenure}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={1}
                  max={maxTenure}
                  value={tenureNum || 1}
                  onChange={(value) => setValue('tenure', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} years`}
                />
                {currentAgeNum + tenureNum > MAX_CONTRIBUTION_AGE && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    ⚠️ Maximum contribution age is {MAX_CONTRIBUTION_AGE} years. Tenure adjusted to {maxTenure} years.
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum tenure: {maxTenure} year{maxTenure !== 1 ? 's' : ''} (until age {MAX_CONTRIBUTION_AGE})
                  {currentAgeNum >= MAX_INPUT_AGE && (
                    <span className="text-yellow-600 dark:text-yellow-400 ml-1">
                      (You can contribute for 1 more year)
                    </span>
                  )}
                </p>
              </div>

              {/* Current Age */}
              <div>
                <InputField
                  label="Current Age (Years)"
                  type="number"
                  {...register('currentAge', { 
                    valueAsNumber: true
                  })}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    // Cap at maximum input age (59)
                    const cappedValue = Math.min(MAX_INPUT_AGE, Math.max(18, value))
                    setValue('currentAge', cappedValue, { shouldValidate: true })
                  }}
                  error={errors.currentAge?.message}
                  placeholder="35"
                  min={18}
                  max={MAX_INPUT_AGE}
                  step={1}
                  className="mb-4"
                />
                <Slider
                  label=""
                  min={18}
                  max={MAX_INPUT_AGE}
                  value={Math.min(MAX_INPUT_AGE, currentAgeNum || 35)}
                  onChange={(value) => setValue('currentAge', value, { shouldValidate: true })}
                  step={1}
                  formatValue={(val) => `${val} years`}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Used for age-based equity allocation caps (max {maxEquity}% equity at age {currentAgeNum})
                  {currentAgeNum <= 35 && (
                    <span className="text-green-600 dark:text-green-400 ml-1">(NEW: 100% allowed for age ≤35)</span>
                  )}
                </p>
                {currentAgeNum >= MAX_INPUT_AGE && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    ⚠️ Maximum input age is {MAX_INPUT_AGE} years. You can contribute for 1 more year (until age {MAX_CONTRIBUTION_AGE}).
                  </p>
                )}
              </div>

              {/* Asset Allocation Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Asset Allocation
                </h3>
                <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Total Allocation:</strong> {Math.round(totalAllocation)}%
                    {Math.abs(totalAllocation - 100) > 0.01 && (
                      <span className="text-red-600 dark:text-red-400 ml-2">
                        (Must equal 100%)
                      </span>
                    )}
                  </p>
                </div>

                {/* Equity Allocation */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Equity (E) - Max {maxEquity.toFixed(0)}%
                      {currentAgeNum <= 35 && (
                        <span className="text-green-600 dark:text-green-400 ml-1 text-xs">
                          (NEW: 100% allowed!)
                        </span>
                      )}
                    </label>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {Math.round(equityAllocationNum)}%
                      {equityAllocationNum > maxEquity && (
                        <span className="text-yellow-600 dark:text-yellow-400 ml-1">
                          (adjusted to {Math.round(maxEquity)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <InputField
                    type="number"
                    {...register('equityAllocation', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = Math.round(parseFloat(e.target.value) || 0)
                      handleAllocationChange('equity', Math.min(maxEquity, value))
                    }}
                    error={errors.equityAllocation?.message}
                    placeholder="50"
                    min={0}
                    max={maxEquity}
                    step={1}
                    className="mb-2"
                  />
                  <Slider
                    label=""
                    min={0}
                    max={maxEquity}
                    value={Math.round(equityAllocationNum) || 0}
                    onChange={(value) => handleAllocationChange('equity', value)}
                    step={1}
                    formatValue={(val) => `${Math.round(val)}%`}
                  />
                  {equityAllocationNum > maxEquity && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      ⚠️ Equity allocation capped at {maxEquity.toFixed(0)}% for age {currentAgeNum} (PFRDA regulation, updated October 1, 2025)
                    </p>
                  )}
                  {currentAgeNum <= 35 && maxEquity === 100 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✅ New Rule: Up to 100% equity allocation allowed for subscribers up to age 35 (effective October 1, 2025)
                    </p>
                  )}
                </div>

                {/* Corporate Bonds Allocation */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Corporate Bonds (C) - Max 100%
                    </label>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {Math.round(corporateBondsAllocationNum)}%
                    </span>
                  </div>
                  <InputField
                    type="number"
                    {...register('corporateBondsAllocation', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = Math.round(parseFloat(e.target.value) || 0)
                      handleAllocationChange('corporateBonds', value)
                    }}
                    error={errors.corporateBondsAllocation?.message}
                    placeholder="30"
                    min={0}
                    max={100}
                    step={1}
                    className="mb-2"
                  />
                  <Slider
                    label=""
                    min={0}
                    max={100}
                    value={Math.round(corporateBondsAllocationNum) || 0}
                    onChange={(value) => handleAllocationChange('corporateBonds', value)}
                    step={1}
                    formatValue={(val) => `${Math.round(val)}%`}
                  />
                </div>

                {/* Government Bonds Allocation */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Government Bonds (G) - Max 100%
                    </label>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {Math.round(governmentBondsAllocationNum)}%
                    </span>
                  </div>
                  <InputField
                    type="number"
                    {...register('governmentBondsAllocation', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = Math.round(parseFloat(e.target.value) || 0)
                      handleAllocationChange('governmentBonds', value)
                    }}
                    error={errors.governmentBondsAllocation?.message}
                    placeholder="20"
                    min={0}
                    max={100}
                    step={1}
                    className="mb-2"
                  />
                  <Slider
                    label=""
                    min={0}
                    max={100}
                    value={Math.round(governmentBondsAllocationNum) || 0}
                    onChange={(value) => handleAllocationChange('governmentBonds', value)}
                    step={1}
                    formatValue={(val) => `${Math.round(val)}%`}
                  />
                </div>

                {/* Alternative Investments Allocation */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alternative Investments (A) - Max 5%
                    </label>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {Math.round(alternativeAllocationNum)}%
                    </span>
                  </div>
                  <InputField
                    type="number"
                    {...register('alternativeAllocation', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = Math.round(parseFloat(e.target.value) || 0)
                      handleAllocationChange('alternative', Math.min(5, value))
                    }}
                    error={errors.alternativeAllocation?.message}
                    placeholder="0"
                    min={0}
                    max={5}
                    step={1}
                    className="mb-2"
                  />
                  <Slider
                    label=""
                    min={0}
                    max={5}
                    value={Math.round(alternativeAllocationNum) || 0}
                    onChange={(value) => handleAllocationChange('alternative', value)}
                    step={1}
                    formatValue={(val) => `${Math.round(val)}%`}
                  />
                </div>
              </div>

              {/* Expected Returns Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Expected Returns (% p.a.)
                </h3>

                {/* Equity Return */}
                <div className="mb-4">
                  <InputField
                    label="Equity Return"
                    type="number"
                    {...register('equityReturn', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setValue('equityReturn', value, { shouldValidate: true })
                    }}
                    error={errors.equityReturn?.message}
                    placeholder="12"
                    min={0}
                    max={100}
                    step={0.1}
                    className="mb-2"
                  />
                  <Slider
                    label=""
                    min={0}
                    max={30}
                    value={equityReturnNum || 12}
                    onChange={(value) => setValue('equityReturn', value, { shouldValidate: true })}
                    step={0.1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>

                {/* Corporate Bonds Return */}
                <div className="mb-4">
                  <InputField
                    label="Corporate Bonds Return"
                    type="number"
                    {...register('corporateBondsReturn', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setValue('corporateBondsReturn', value, { shouldValidate: true })
                    }}
                    error={errors.corporateBondsReturn?.message}
                    placeholder="9"
                    min={0}
                    max={100}
                    step={0.1}
                    className="mb-2"
                  />
                  <Slider
                    label=""
                    min={0}
                    max={20}
                    value={corporateBondsReturnNum || 9}
                    onChange={(value) => setValue('corporateBondsReturn', value, { shouldValidate: true })}
                    step={0.1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>

                {/* Government Bonds Return */}
                <div className="mb-4">
                  <InputField
                    label="Government Bonds Return"
                    type="number"
                    {...register('governmentBondsReturn', { 
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setValue('governmentBondsReturn', value, { shouldValidate: true })
                    }}
                    error={errors.governmentBondsReturn?.message}
                    placeholder="8"
                    min={0}
                    max={100}
                    step={0.1}
                    className="mb-2"
                  />
                  <Slider
                    label=""
                    min={0}
                    max={15}
                    value={governmentBondsReturnNum || 8}
                    onChange={(value) => setValue('governmentBondsReturn', value, { shouldValidate: true })}
                    step={0.1}
                    formatValue={(val) => formatPercentageValue(val)}
                  />
                </div>

                {/* Alternative Return */}
                {alternativeAllocationNum > 0 && (
                  <div className="mb-4">
                    <InputField
                      label="Alternative Investments Return"
                      type="number"
                      {...register('alternativeReturn', { 
                        valueAsNumber: true
                      })}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setValue('alternativeReturn', value, { shouldValidate: true })
                      }}
                      error={errors.alternativeReturn?.message}
                      placeholder="7"
                      min={0}
                      max={100}
                      step={0.1}
                      className="mb-2"
                    />
                    <Slider
                      label=""
                      min={0}
                      max={15}
                      value={alternativeReturnNum || 7}
                      onChange={(value) => setValue('alternativeReturn', value, { shouldValidate: true })}
                      step={0.1}
                      formatValue={(val) => formatPercentageValue(val)}
                    />
                  </div>
                )}
              </div>

              {/* Age-based Caps Toggle */}
              <ToggleSwitch
                label="Apply Age-based Equity Caps"
                checked={useAgeBasedCaps}
                onChange={(checked) => setValue('useAgeBasedCaps', checked, { shouldValidate: true })}
                description="Automatically reduce equity allocation cap as you age (100% up to age 35, decreases by 2.5% annually after, reaches 50% at age 60+)"
              />

              {/* Withdrawal Percentage */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Withdrawal Percentage
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('withdrawalPercentage')}
                      value={60}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">60% Lump Sum + 40% Annuity</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('withdrawalPercentage')}
                      value={80}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">80% Lump Sum + 20% Annuity</span>
                  </label>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-2">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {withdrawalPercentageNum === 80 
                      ? "New rule: Up to 80% can be withdrawn as lump sum (taxable), remaining 20% must be used to purchase annuity (taxable)."
                      : "Traditional rule: Up to 60% can be withdrawn as lump sum (taxable), remaining 40% must be used to purchase annuity (taxable)."
                    }
                  </p>
                </div>
              </div>

            </div>
          }
          resultsPanel={
            <NPSCalculatorResults results={results} />
          }
          infoPanel={
            <NPSCalculatorInfo />
          }
          evolutionTable={
            <NPSCalculatorTable evolution={results?.evolution} tenure={tenureNum} results={results} />
          }
        />
    </div>
  )
}

export default NPSCalculator

