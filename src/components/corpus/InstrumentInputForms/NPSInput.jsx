import InputField from '@/components/common/InputField/InputField'
import { investmentRates } from '@/constants/investmentRates'

/**
 * NPS Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('nps')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const NPSInput = ({ instrumentId, instrumentData, updateInvestment }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Monthly Contribution"
        type="number"
        value={instrumentData.monthlyContribution || 5000}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            monthlyContribution: parseFloat(e.target.value) || 0,
          })
        }
        showCurrency
        placeholder="5000"
        min={500}
      />
      <InputField
        label="Tenure (Years)"
        type="number"
        value={instrumentData.tenure || 25}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            tenure: parseFloat(e.target.value) || 0,
          })
        }
        min={1}
        max={50}
      />
      <InputField
        label="Equity Allocation (%)"
        type="number"
        value={instrumentData.equityAllocation || 50}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            equityAllocation: parseFloat(e.target.value) || 0,
          })
        }
        min={0}
        max={100}
      />
      <InputField
        label="Corporate Bonds Allocation (%)"
        type="number"
        value={instrumentData.corporateBondsAllocation || 30}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            corporateBondsAllocation: parseFloat(e.target.value) || 0,
          })
        }
        min={0}
        max={100}
      />
      <InputField
        label="Government Bonds Allocation (%)"
        type="number"
        value={instrumentData.governmentBondsAllocation || 20}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            governmentBondsAllocation: parseFloat(e.target.value) || 0,
          })
        }
        min={0}
        max={100}
      />
      <InputField
        label="Expected Equity Return (%)"
        type="number"
        value={instrumentData.equityReturn || investmentRates.nps?.equity || 0}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            equityReturn: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0}
        max={30}
      />
      <InputField
        label="Expected Corporate Bonds Return (%)"
        type="number"
        value={instrumentData.corporateBondsReturn || investmentRates.nps?.corporateBonds || 0}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            corporateBondsReturn: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0}
        max={20}
      />
      <InputField
        label="Expected Government Bonds Return (%)"
        type="number"
        value={instrumentData.governmentBondsReturn || investmentRates.nps?.debt || 0}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            governmentBondsReturn: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0}
        max={15}
      />
    </div>
  )
}

export default NPSInput

