import InputField from '@/components/common/InputField/InputField'
import { investmentRates } from '@/constants/investmentRates'

/**
 * NSC Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('nsc')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const NSCInput = ({ instrumentId, instrumentData, updateInvestment }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Principal Amount"
        type="number"
        value={instrumentData.principal || ''}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            principal: parseFloat(e.target.value) || 0,
          })
        }
        showCurrency
        placeholder="100000"
        min={1000}
      />
      <InputField
        label="Interest Rate (%)"
        type="number"
        value={instrumentData.rate || investmentRates.nsc?.rate || ''}
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
        Note: NSC has a fixed 5-year tenure. If you have existing NSC investments, the remaining tenure will be calculated automatically.
      </p>
    </div>
  )
}

export default NSCInput

