import { useEffect } from 'react'
import { calculateCorpusFromInstruments } from '@/utils/corpusCalculations'
import { calculatePurchasingPower } from '@/utils/purchasingPowerComparisons'
import { getCategoryExamples } from '@/constants/purchasingPowerExamples'

/**
 * Custom hook for corpus simulator calculations
 * Handles corpus and purchasing power calculations automatically
 * @param {Object} params
 * @param {Array<string>} params.selectedInstruments - Selected instruments
 * @param {Object} params.investments - Investment data
 * @param {Object} params.settings - Settings object
 * @param {Function} params.setResults - Function to set results
 * @param {Function} params.setPurchasingPower - Function to set purchasing power
 * @returns {Object} - { loading: boolean }
 */
const useCorpusCalculator = ({
  selectedInstruments,
  investments,
  settings,
  setResults,
  setPurchasingPower,
}) => {
  useEffect(() => {
    if (selectedInstruments.length > 0 && Object.keys(investments).length > 0) {
      const corpusResults = calculateCorpusFromInstruments(
        selectedInstruments, 
        investments,
        settings.timeHorizon || 10
      )
      setResults(corpusResults)

      // Calculate purchasing power if we have corpus
      if (corpusResults.nominalCorpus > 0 && settings.selectedCity && settings.timeHorizon) {
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
            settings.timeHorizon,
            settings.selectedCity,
            {
              education: (settings.inflationRates?.education || 10) / 100,
              healthcare: (settings.inflationRates?.healthcare || 8) / 100,
              realEstate: (settings.inflationRates?.realEstate || 7) / 100,
              luxuryGoods: (settings.inflationRates?.luxuryGoods || 6) / 100,
              consumerGoodsRetail: (settings.inflationRates?.consumerGoodsRetail || 5) / 100,
              general: (settings.generalInflationRate || 6) / 100,
            }
          )
          setPurchasingPower(purchasingPowerResults)
        } catch (error) {
          console.error('Error calculating purchasing power:', error)
        }
      }
    }
  }, [selectedInstruments, investments, settings, setResults, setPurchasingPower])
}

export default useCorpusCalculator

