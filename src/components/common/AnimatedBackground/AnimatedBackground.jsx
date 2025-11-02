import { useTheme } from '@/contexts/ThemeContext'

/**
 * AnimatedBackground Component
 * Creates a futuristic animated background with floating money symbols and grid pattern
 */
const AnimatedBackground = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Money symbols to display
  const moneySymbols = ['₹', '$', '€', '£', '¥', '₿', '₹', '$', '€', '£', '¥', '₿']
  
  // Generate random positions and delays for symbols
  const symbols = moneySymbols.map((symbol, index) => ({
    symbol,
    left: `${10 + (index * 8) % 80}%`,
    top: `${15 + (index * 7) % 70}%`,
    delay: `${index * 0.5}s`,
    duration: `${6 + (index % 3)}s`
  }))

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid pattern background */}
      <div 
        className={`absolute inset-0 opacity-20 ${
          isDark 
            ? 'bg-[linear-gradient(to_right,#4b5563_1px,transparent_1px),linear-gradient(to_bottom,#4b5563_1px,transparent_1px)] bg-[size:50px_50px]' 
            : 'bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:50px_50px]'
        } animate-grid`}
      />

      {/* Gradient overlay */}
      <div 
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20'
            : 'bg-gradient-to-br from-white via-blue-50/30 to-green-50/30'
        }`}
      />

      {/* Floating money symbols */}
      {symbols.map((item, index) => (
        <div
          key={index}
          className={`absolute text-4xl md:text-5xl font-bold animate-float ${
            isDark 
              ? 'text-green-400/30' 
              : 'text-green-600/20'
          }`}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Animated gradient orbs */}
      <div 
        className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse-custom ${
          isDark 
            ? 'bg-green-500/10' 
            : 'bg-green-400/20'
        }`}
      />
      <div 
        className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-custom ${
          isDark 
            ? 'bg-blue-500/10' 
            : 'bg-blue-400/20'
        }`}
        style={{ animationDelay: '1.5s' }}
      />
    </div>
  )
}

export default AnimatedBackground

