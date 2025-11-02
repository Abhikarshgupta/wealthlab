import { forwardRef } from 'react'
import './InputField.css'

/**
 * InputField - Reusable input component with React Hook Form integration
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string} props.type - Input type (text, number, etc.)
 * @param {string} props.error - Error message to display
 * @param {boolean} props.showCurrency - Show ₹ symbol prefix
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 */
const InputField = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  showCurrency = false,
  placeholder,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {showCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 font-medium pointer-events-none">
            ₹
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            input-field w-full
            ${showCurrency ? 'pl-10' : 'pl-3'}
            ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500' : ''}
          `}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.name}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p 
          id={`${props.name}-error`}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
})

InputField.displayName = 'InputField'

export default InputField