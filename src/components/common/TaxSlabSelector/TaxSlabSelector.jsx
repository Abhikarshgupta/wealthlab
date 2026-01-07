import { useState } from 'react'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * TaxSlabSelector Component
 * Global tax slab selection for header
 * Similar to InflationToggle pattern
 */
const TaxSlabSelector = () => {
  const { incomeTaxSlab, setIncomeTaxSlab } = useUserPreferencesStore()
  const [showPopover, setShowPopover] = useState(false)

  const taxSlabs = [
    { value: 0, label: '0%', description: 'No tax' },
    { value: 0.05, label: '5%', description: 'Up to ₹3L' },
    { value: 0.10, label: '10%', description: '₹3L - ₹7L' },
    { value: 0.15, label: '15%', description: '₹7L - ₹10L' },
    { value: 0.20, label: '20%', description: '₹10L - ₹12L' },
    { value: 0.30, label: '30%', description: 'Above ₹12L' },
  ]

  const currentSlab = taxSlabs.find((slab) => slab.value === incomeTaxSlab) || taxSlabs[5]

  const handleSlabChange = (slab) => {
    setIncomeTaxSlab(slab)
    setShowPopover(false)
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative group">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {/* Icon */}
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>

          {/* Slab Badge */}
          <button
            onClick={() => setShowPopover(!showPopover)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            title="Click to change tax slab"
            aria-label={`Current tax slab: ${currentSlab.label}`}
          >
            {currentSlab.label}
          </button>
        </div>

        {/* Tooltip on hover */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Tax Slab: {currentSlab.label} ({currentSlab.description})
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0">
            <div className="border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
          </div>
        </div>
      </div>

      {/* Slab Selection Popover */}
      {showPopover && (
        <>
          <div
            className="fixed inset-0 z-[45]"
            onClick={() => setShowPopover(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-[60] min-w-[240px]">
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Select Tax Slab
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Used for FD, NSC, SCSS, Debt MFs
            </div>
            <div className="space-y-1">
              {taxSlabs.map((slab) => (
                <button
                  key={slab.value}
                  onClick={() => handleSlabChange(slab.value)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    incomeTaxSlab === slab.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Select ${slab.label} tax slab`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{slab.label}</span>
                    <span className="text-xs opacity-75">{slab.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TaxSlabSelector

