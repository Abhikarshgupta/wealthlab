/**
 * Exclusive radio cards — one choice, full-width on phone, grid when many.
 */
const RadioCardGroup = ({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  columns = 1,
}) => {
  const grid =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1'

  return (
    <fieldset className="mb-8">
      <legend className="text-base font-semibold text-gray-900 dark:text-white mb-1">
        {legend}
      </legend>
      {hint && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{hint}</p>
      )}
      <div className={`grid ${grid} gap-3`} role="radiogroup" aria-label={legend}>
        {options.map((option) => {
          const selected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${legend} ${option.label}`}
              onClick={() => onChange(option.id)}
              className={`
                text-left rounded-xl border-2 px-4 py-3.5 transition-all
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                dark:focus:ring-offset-gray-800
                ${
                  selected
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-600'
                }
              `}
            >
              <span className="flex items-start gap-3">
                <span
                  className={`
                    mt-0.5 h-4 w-4 shrink-0 rounded-full border-2
                    ${selected ? 'border-green-500 bg-green-500' : 'border-gray-400 dark:border-gray-500'}
                  `}
                  aria-hidden
                />
                <span>
                  <span className="block text-base font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </span>
                  {option.helper && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {option.helper}
                    </span>
                  )}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default RadioCardGroup
