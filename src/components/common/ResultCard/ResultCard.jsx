/**
 * ResultCard - Display calculated results with icon
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string|number} props.value - Value to display
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {string} props.className - Additional CSS classes
 */
const ResultCard = ({ 
  label, 
  value, 
  icon,
  className = '' 
}) => {
  return (
    <div className={`
      bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900
      rounded-xl p-4 border border-gray-200 dark:border-gray-700
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
