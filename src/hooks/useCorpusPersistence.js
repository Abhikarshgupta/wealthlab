import { useState, useCallback } from 'react'
import { calculateCorpusFromInstruments } from '@/utils/corpusCalculations'
import { calculatePurchasingPower } from '@/utils/purchasingPowerComparisons'
import { getCategoryExamples } from '@/constants/purchasingPowerExamples'
import { saveCurrentState, isStorageAvailable } from '@/utils/corpusCalculatorStorage'

/**
 * Custom hook for corpus simulator persistence
 * Handles save/restore functionality and restore banner state
 * @returns {Object} - { showRestoreBanner, showSaveModal, saveCalculationName, setSaveCalculationName, handleSaveAndStartFresh, handleLoadCalculation, setShowSaveModal }
 */
const useCorpusPersistence = ({
  selectedInstruments,
  investments,
  settings,
  results,
  purchasingPower,
  currentStep,
  setResults,
  setPurchasingPower,
  loadCalculation,
  reset,
  setCurrentStep,
  setShowRestoreBanner,
}) => {
  // Check if there's persisted state on mount
  const [showRestoreBanner, setShowRestoreBannerState] = useState(() => {
    try {
      const saved = localStorage.getItem('wealth-mngr-corpus-calculator-state')
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.selectedInstruments?.length > 0 || Object.keys(parsed.investments || {}).length > 0
      }
    } catch {
      // Ignore errors
    }
    return false
  })

  // State for save modal
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveCalculationName, setSaveCalculationName] = useState('')

  // Handle save and start fresh
  const handleSaveAndStartFresh = useCallback(() => {
    if (!saveCalculationName.trim()) {
      alert('Please enter a name for this calculation')
      return
    }

    try {
      const state = {
        selectedInstruments: selectedInstruments,
        investments: investments,
        settings: settings,
        results: results,
        purchasingPower: purchasingPower,
        currentStep: currentStep,
      }

      saveCurrentState(state, saveCalculationName.trim())
      setShowSaveModal(false)
      setSaveCalculationName('')
      setShowRestoreBannerState(false)
      
      // Reset and start fresh
      reset()
      setCurrentStep(1)
      
      alert('Calculation saved successfully! Starting fresh.')
    } catch (error) {
      console.error('Error saving calculation:', error)
      alert('Failed to save calculation. Please try again.')
    }
  }, [selectedInstruments, investments, settings, results, purchasingPower, currentStep, saveCalculationName, reset, setCurrentStep])

  // Handle loading a saved calculation
  const handleLoadCalculation = useCallback((calculationData) => {
    loadCalculation(calculationData)
    // Recalculate immediately after loading
    setTimeout(() => {
      if (calculationData.selectedInstruments?.length > 0 && Object.keys(calculationData.investments || {}).length > 0) {
        const corpusResults = calculateCorpusFromInstruments(
          calculationData.selectedInstruments,
          calculationData.investments,
          calculationData.settings?.timeHorizon || 10
        )
        setResults(corpusResults)

        if (corpusResults.nominalCorpus > 0 && calculationData.settings?.selectedCity && calculationData.settings?.timeHorizon) {
          try {
            const purchasingPowerResults = calculatePurchasingPower(
              corpusResults.nominalCorpus,
              {
                education: getCategoryExamples('education'),
                realEstate: getCategoryExamples('realEstate'),
                luxuryGoods: getCategoryExamples('luxuryGoods'),
                healthcare: getCategoryExamples('healthcare'),
                consumerGoods: getCategoryExamples('consumerGoods'),
              },
              calculationData.settings.timeHorizon,
              calculationData.settings.selectedCity,
              {
                education: (calculationData.settings.inflationRates?.education || 10) / 100,
                healthcare: (calculationData.settings.inflationRates?.healthcare || 8) / 100,
                realEstate: (calculationData.settings.inflationRates?.realEstate || 7) / 100,
                luxuryGoods: (calculationData.settings.inflationRates?.luxuryGoods || 6) / 100,
                consumerGoodsRetail: (calculationData.settings.inflationRates?.consumerGoodsRetail || 5) / 100,
                general: (calculationData.settings.generalInflationRate || 6) / 100,
              }
            )
            setPurchasingPower(purchasingPowerResults)
          } catch (error) {
            console.error('Error calculating purchasing power:', error)
          }
        }
      }
    }, 100)
  }, [loadCalculation, setResults, setPurchasingPower])

  const handleDismissRestoreBanner = useCallback(() => {
    setShowRestoreBannerState(false)
    if (setShowRestoreBanner) {
      setShowRestoreBanner(false)
    }
  }, [setShowRestoreBanner])

  return {
    showRestoreBanner,
    showSaveModal,
    saveCalculationName,
    setSaveCalculationName,
    setShowSaveModal,
    handleSaveAndStartFresh,
    handleLoadCalculation,
    handleDismissRestoreBanner,
    isStorageAvailable: isStorageAvailable(),
  }
}

export default useCorpusPersistence

