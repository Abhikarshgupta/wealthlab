import { useState } from 'react'
import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'
import { getAllCities, CITY_TIERS } from '@/constants/purchasingPowerExamples'

/**
 * City Selector Component
 * Allows users to select a city for purchasing power calculations
 * Groups cities by tier (Metros, Tier-1, Tier-2)
 */
const CitySelector = () => {
  const { settings, setSelectedCity } = useCorpusCalculatorStore()
  const selectedCity = settings?.selectedCity
  const [isOpen, setIsOpen] = useState(false)

  const allCities = getAllCities()

  // Group cities by tier
  const metroCities = allCities.filter((city) => city.tier === CITY_TIERS.METRO)
  const tier1Cities = allCities.filter((city) => city.tier === CITY_TIERS.TIER_1)
  const tier2Cities = allCities.filter((city) => city.tier === CITY_TIERS.TIER_2)

  const selectedCityInfo = allCities.find((city) => city.key === selectedCity)

  const handleCitySelect = (cityKey) => {
    setSelectedCity(cityKey)
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (e, cityKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCitySelect(cityKey)
    }
  }

  const renderCityGroup = (cities, tierLabel) => {
    if (cities.length === 0) return null

    return (
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-3">
          {tierLabel}
        </div>
        <div className="space-y-1">
          {cities.map((city) => (
            <button
              key={city.key}
              type="button"
              onClick={() => handleCitySelect(city.key)}
              onKeyDown={(e) => handleKeyDown(e, city.key)}
              className={`
                w-full text-left px-3 py-2 rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                ${
                  selectedCity === city.key
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
              aria-selected={selectedCity === city.key}
              role="option"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select City for Purchasing Power Analysis <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Prices vary by city tier. This selection affects education, real estate, and healthcare cost estimates.
      </p>

      {/* Selected City Display */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={`
          w-full px-4 py-3 rounded-lg border transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          hover:border-green-500 dark:hover:border-green-500
          flex items-center justify-between
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select city"
      >
        <span className="text-gray-900 dark:text-white font-medium">
          {selectedCityInfo ? selectedCityInfo.name : 'Select a city'}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div
            className="
              absolute z-20 mt-2 w-full max-h-96 overflow-y-auto
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg shadow-lg
              py-2
            "
            role="listbox"
            aria-label="City selection"
            onClick={(e) => e.stopPropagation()}
          >
            {renderCityGroup(metroCities, 'Metros')}
            {renderCityGroup(tier1Cities, 'Tier-1 Cities')}
            {renderCityGroup(tier2Cities, 'Tier-2 Cities')}
          </div>
        </>
      )}

      {/* Selected City Info */}
      {selectedCityInfo && (
        <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              Tier: <span className="font-medium">{selectedCityInfo.tier.toUpperCase()}</span>
            </span>
            <span className="text-gray-500 dark:text-gray-500">
              {selectedCityInfo.tier === CITY_TIERS.METRO
                ? 'Highest cost of living'
                : selectedCityInfo.tier === CITY_TIERS.TIER_1
                ? 'Moderate cost of living'
                : 'Lower cost of living'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CitySelector

