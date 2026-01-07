/**
 * ToggleSwitch - Toggle switch component
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.description - Optional description text
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} props.className - Additional CSS classes
 */
const ToggleSwitch = ({
  label,
  checked = false,
  onChange,
  description,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'h-5 w-9',
      thumb: 'h-3 w-3',
      translate: checked ? 'translate-x-5' : 'translate-x-0.5',
    },
    md: {
      container: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: checked ? 'translate-x-6' : 'translate-x-1',
    },
    lg: {
      container: 'h-7 w-13',
      thumb: 'h-5 w-5',
      translate: checked ? 'translate-x-7' : 'translate-x-1',
    },
  }

  const sizeConfig = sizeClasses[size] || sizeClasses.md

  if (label || description) {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
        <div className="flex flex-col flex-1 min-w-0">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              {label}
            </label>
          )}
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
            relative inline-flex ${sizeConfig.container} items-center rounded-full transition-colors flex-shrink-0
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            ${checked ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
            self-start sm:self-center
          `}
        >
          <span
            className={`
              inline-block ${sizeConfig.thumb} transform rounded-full bg-white transition-transform
              ${sizeConfig.translate}
            `}
          />
        </button>
      </div>
    )
  }

  // Standalone toggle without label
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex ${sizeConfig.container} items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${checked ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block ${sizeConfig.thumb} transform rounded-full bg-white transition-transform
          ${sizeConfig.translate}
        `}
      />
    </button>
  )
}

export default ToggleSwitch
