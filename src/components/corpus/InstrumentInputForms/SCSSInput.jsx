import InputField from '@/components/common/InputField/InputField'
import { investmentRates } from '@/constants/investmentRates'

/**
 * SCSS Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('scss')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const SCSSInput = ({ instrumentId, instrumentData, updateInvestment }) => {
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
        max={3000000}
      />
      <InputField
        label="Tenure (Years)"
        type="number"
        value={instrumentData.tenure || 5}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            tenure: parseFloat(e.target.value) || 0,
          })
        }
        min={1}
        max={5}
      />
      <InputField
        label="Interest Rate (%)"
        type="number"
        value={instrumentData.rate || investmentRates.scss?.rate || 0}
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
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Note: SCSS is available for citizens aged 60+ years
      </p>
    </div>
  )
}

export default SCSSInput

