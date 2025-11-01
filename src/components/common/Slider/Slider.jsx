import { useEffect, useState } from 'react'
import './Slider.css'

/**
 * Slider - Range input component with value display
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {number} props.step - Step increment
 * @param {Function} props.formatValue - Optional formatter function
 * @param {boolean} props.showCurrency - Format as currency
 */
const Slider = ({
  label,
  min = 0,
  max = 100,
  value,
  onChange,
  step = 1,
  formatValue,
  showCurrency = false,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value || min)

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setLocalValue(value)
    }
  }, [value])

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value)
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const displayValue = formatValue 
    ? formatValue(localValue)
    : showCurrency
    ? `₹${localValue.toLocaleString('en-IN')}`
    : localValue

  const percentage = ((localValue - min) / (max - min)) * 100

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <span className="text-lg font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-md">
            {displayValue}
          </span>
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={localValue}
          onChange={handleChange}
          step={step}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${percentage}%, rgb(229 231 235) ${percentage}%, rgb(229 231 235) 100%)`
          }}
        />
      </div>
    </div>
  )
}

export default Slider