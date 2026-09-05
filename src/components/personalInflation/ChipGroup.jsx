/**
 * Multi-select chips. school_1 / school_2plus exclusivity is handled in the store.
 */
const ChipGroup = ({ legend, hint, options, selectedIds, onToggle }) => (
  <fieldset className="mb-8">
    <legend className="text-base font-semibold text-gray-900 dark:text-white mb-1">
      {legend}
    </legend>
    {hint && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{hint}</p>
    )}
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = selectedIds.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggle(option.id)}
            className={`
              inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border-2 transition-all
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              dark:focus:ring-offset-gray-800
              ${
                selected
                  ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-400'
              }
            `}
          >
            <span
              className={`
                flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border
                ${selected
                  ? 'border-green-600 bg-green-600 text-white dark:border-green-400 dark:bg-green-500'
                  : 'border-gray-400 dark:border-gray-500'}
              `}
              aria-hidden
            >
              {selected ? '✓' : ''}
            </span>
            {option.label}
          </button>
        )
      })}
    </div>
  </fieldset>
)

export default ChipGroup
