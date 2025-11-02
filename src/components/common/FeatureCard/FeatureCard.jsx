import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * FeatureCard Component
 * Enhanced card component with glassmorphism, animations, and money-themed decorations
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.route - Route path for navigation
 * @param {string} props.icon - Money symbol or icon to display
 * @param {number} props.delay - Animation delay in seconds
 */
const FeatureCard = ({ title, description, route, icon = '💰', delay = 0 }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Link
      to={route}
      className="group relative block"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl p-8
          backdrop-blur-md bg-white/80 dark:bg-gray-800/80
          border-2 transition-all duration-300
          hover:scale-105 hover:-translate-y-2
          animate-fade-in-up opacity-0
          ${
            isDark
              ? 'border-gray-700/50 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'
              : 'border-gray-200/50 hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]'
          }
        `}
      >
        {/* Gradient border effect on hover */}
        <div
          className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
            ${
              isDark
                ? 'bg-gradient-to-br from-green-500/20 via-blue-500/20 to-green-500/20'
                : 'bg-gradient-to-br from-green-400/10 via-blue-400/10 to-green-400/10'
            }
          `}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon/Money Symbol */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-5xl md:text-6xl animate-float" style={{ animationDelay: `${delay + 0.5}s` }}>
              {icon}
            </span>
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${isDark ? 'bg-green-500/20' : 'bg-green-100'}
                group-hover:scale-110 transition-transform duration-300
              `}
            >
              <svg
                className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2
            className={`
              text-2xl font-bold mb-3
              ${isDark ? 'text-white' : 'text-gray-900'}
              group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300
            `}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            className={`
              text-base leading-relaxed
              ${isDark ? 'text-gray-300' : 'text-gray-600'}
            `}
          >
            {description}
          </p>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
            <div className="flex space-x-1">
              {['₹', '$', '€'].map((symbol, idx) => (
                <span
                  key={idx}
                  className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}
                  style={{ animationDelay: `${delay + idx * 0.2}s` }}
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>

          {/* Shimmer effect on hover */}
          <div
            className={`
              absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-r from-transparent via-white/10 to-transparent
              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000
            `}
          />
        </div>
      </div>
    </Link>
  )
}

export default FeatureCard

