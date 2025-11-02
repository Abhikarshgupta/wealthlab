import InputField from '@/components/common/InputField/InputField'
import { checkTenureLimit } from '@/utils/existingInvestmentUtils'

/**
 * PPF/SSY Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('ppf' or 'ssy')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const PPFSSYInput = ({ instrumentId, instrumentData, updateInvestment }) => {
  const hasExistingInvestment = instrumentData.hasExistingInvestment || false
  const existingInvestment = instrumentData.existingInvestment || {}
  
  // Calculate max tenure based on existing investment
  const getMaxTenure = () => {
    if (hasExistingInvestment && existingInvestment.yearsInvested) {
      const tenureCheck = checkTenureLimit(instrumentId, existingInvestment.yearsInvested)
      return tenureCheck.maxTenure
        ? tenureCheck.maxTenure - existingInvestment.yearsInvested
        : 50
    }
    return 50
  }

  const handleTenureChange = (e) => {
    const newTenure = parseFloat(e.target.value) || 0
    // Check if existing investment limits tenure
    if (hasExistingInvestment && existingInvestment.yearsInvested) {
      const tenureCheck = checkTenureLimit(instrumentId, existingInvestment.yearsInvested)
      if (tenureCheck.maxTenure) {
        const remainingTenure = tenureCheck.maxTenure - existingInvestment.yearsInvested
        if (newTenure > remainingTenure) {
          // Don't allow exceeding remaining tenure
          return
        }
      }
    }
    updateInvestment(instrumentId, {
      ...instrumentData,
      tenure: newTenure,
    })
  }

  return (
    <div className="space-y-4">
      <InputField
        label="Yearly Investment"
        type="number"
        value={instrumentData.yearlyInvestment ?? ''}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            yearlyInvestment: parseFloat(e.target.value) || 0,
          })
        }
        showCurrency
        placeholder="10000"
        min={500}
        max={150000}
      />
      <InputField
        label="Tenure (Years)"
        type="number"
        value={instrumentData.tenure || ''}
        onChange={handleTenureChange}
        min={1}
        max={getMaxTenure()}
      />
      <InputField
        label="Interest Rate (%)"
        type="number"
        value={instrumentData.rate ?? ''}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            rate: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0.1}
        max={20}
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={instrumentData.stepUpEnabled || false}
          onChange={(e) =>
            updateInvestment(instrumentId, {
              ...instrumentData,
              stepUpEnabled: e.target.checked,
            })
          }
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Enable Step-Up</span>
      </label>
      {instrumentData.stepUpEnabled && (
        <InputField
          label="Step-Up Percentage (%)"
          type="number"
          value={instrumentData.stepUpPercentage || 10}
          onChange={(e) =>
            updateInvestment(instrumentId, {
              ...instrumentData,
              stepUpPercentage: parseFloat(e.target.value) || 0,
            })
          }
          min={0}
          max={50}
        />
      )}
    </div>
  )
}

export default PPFSSYInput

