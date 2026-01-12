import { useEffect } from 'react'
import InputField from '@/components/common/InputField/InputField'
import { investmentRates } from '@/constants/investmentRates'
import { migrateFDData, normalizeYearsMonths } from '@/utils/fdTenureUtils'

/**
 * Fixed Deposit Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('fd')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const FDInput = ({ instrumentId, instrumentData, updateInvestment }) => {
  console.log('instrumentData', instrumentData); 
  // Migrate legacy data format on mount (if needed)
  useEffect(() => {
    const migrated = migrateFDData(instrumentData)
    console.log('migrated', migrated); 
    // Only update if migration actually changed something
    if (migrated.tenureYears !== instrumentData.tenureYears || 
        migrated.tenureMonths !== instrumentData.tenureMonths) {
      updateInvestment(instrumentId, migrated)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Get current values - migrateFDData handles legacy format conversion
  const migrated = migrateFDData(instrumentData)
  const tenureYears = migrated.tenureYears ?? 0
  const tenureMonths = migrated.tenureMonths ?? 0

  return (
    <div className="space-y-4">
      <InputField
        label="Principal Amount"
        type="number"
        value={instrumentData.principal || 100000}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            principal: parseFloat(e.target.value) || 0,
          })
        }
        showCurrency
        placeholder="100000"
        min={1000}
        required
      />
      
      {/* Tenure - Years and Months */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tenure <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Years"
            type="number"
            value={tenureYears}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              const currentMonths = parseInt(tenureMonths) || 0
              const normalized = normalizeYearsMonths(value, currentMonths)
              updateInvestment(instrumentId, {
                ...instrumentData,
                tenureYears: normalized.years,
                tenureMonths: normalized.months,
              })
            }}
            placeholder="0"
            min={0}
            max={10}
            step={1}
          />
          <InputField
            label="Months"
            type="number"
            value={tenureMonths}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              const normalized = normalizeYearsMonths(tenureYears, value)
              updateInvestment(instrumentId, {
                ...instrumentData,
                tenureYears: normalized.years,
                tenureMonths: normalized.months,
              })
            }}
            placeholder="0"
            min={0}
            max={11}
            step={1}
          />
        </div>
        {tenureMonths >= 12 && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Normalized to {normalizeYearsMonths(tenureYears, tenureMonths).years} year{normalizeYearsMonths(tenureYears, tenureMonths).years !== 1 ? 's' : ''} {normalizeYearsMonths(tenureYears, tenureMonths).months} month{normalizeYearsMonths(tenureYears, tenureMonths).months !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <InputField
        label="Interest Rate (%)"
        type="number"
        value={instrumentData.rate || investmentRates.fd?.rate || 0}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            rate: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0.1}
        max={20}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compounding Frequency
        </label>
        <select
          value={instrumentData.compoundingFrequency || 'quarterly'}
          onChange={(e) =>
            updateInvestment(instrumentId, {
              ...instrumentData,
              compoundingFrequency: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="quarterly">Quarterly</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
          <option value="cumulative">Cumulative</option>
        </select>
      </div>
    </div>
  )
}

export default FDInput

