/**
 * ToggleSwitch - Toggle switch component
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.description - Optional description text
 */
const ToggleSwitch = ({ 
  label, 
  checked = false, 
  onChange, 
  description,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          {label}
        </label>
        {description && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${checked ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  )
}

export default ToggleSwitch
