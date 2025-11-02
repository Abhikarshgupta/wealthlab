import PPFSSYInput from './PPFSSYInput'
import FDInput from './FDInput'
import SIPInput from './SIPInput'
import NSCInput from './NSCInput'
import SCSSInput from './SCSSInput'
import SGBInput from './SGBInput'
import NPSInput from './NPSInput'
import EquityInput from './EquityInput'

/**
 * Instrument Input Form Router
 * Routes to the appropriate input component based on instrument type
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const InstrumentInputForm = ({ instrumentId, instrumentData, updateInvestment }) => {
  const commonProps = {
    instrumentId,
    instrumentData,
    updateInvestment,
  }

  switch (instrumentId) {
    case 'ppf':
    case 'ssy':
      return <PPFSSYInput {...commonProps} />
    
    case 'fd':
      return <FDInput {...commonProps} />
    
    case 'sip':
      return <SIPInput {...commonProps} />
    
    case 'nsc':
      return <NSCInput {...commonProps} />
    
    case 'scss':
      return <SCSSInput {...commonProps} />
    
    case 'sgb':
      return <SGBInput {...commonProps} />
    
    case 'nps':
      return <NPSInput {...commonProps} />
    
    case 'equity':
    case 'elss':
      return <EquityInput {...commonProps} />
    
    default:
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Input form not configured for {instrumentId}
        </div>
      )
  }
}

export default InstrumentInputForm

