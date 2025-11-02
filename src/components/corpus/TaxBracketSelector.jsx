/**
 * Tax Bracket Selector Component
 * Allows user to select their current/projected income tax slab
 */
import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'

const TaxBracketSelector = () => {
  const { settings, updateSettings } = useCorpusCalculatorStore()
  const incomeTaxSlab = settings?.incomeTaxSlab || 0.30

  // Indian tax slabs (FY 2024-25)
  const taxSlabs = [
    { value: 0.0, label: '0% (No Tax)', description: 'Income up to ₹2.5L' },
    { value: 0.05, label: '5%', description: 'Income ₹2.5L - ₹5L' },
    { value: 0.20, label: '20%', description: 'Income ₹5L - ₹10L' },
    { value: 0.30, label: '30%', description: 'Income above ₹10L' },
  ]

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Income Tax Slab <span className="text-red-500">*</span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
          (Used for FD, NSC, SCSS, Real Estate taxation)
        </span>
      </label>
      <div className="space-y-2">
        {taxSlabs.map((slab) => (
          <label
            key={slab.value}
            className={`
              flex items-start p-3 border rounded-lg cursor-pointer transition-colors
              ${
                incomeTaxSlab === slab.value
                  ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <input
              type="radio"
              name="incomeTaxSlab"
              value={slab.value}
              checked={incomeTaxSlab === slab.value}
              onChange={(e) =>
                updateSettings({
                  incomeTaxSlab: parseFloat(e.target.value),
                })
              }
              className="mt-1 mr-3"
              required
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {slab.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {slab.description}
              </div>
            </div>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Select your current or projected income tax slab. This determines the tax rate applied to
        interest income (FD, NSC, SCSS) and capital gains from real estate.
      </p>
    </div>
  )
}

export default TaxBracketSelector

