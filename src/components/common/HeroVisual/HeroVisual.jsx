import { useTheme } from '@/contexts/ThemeContext'

/**
 * HeroVisual Component
 * Animated visual element for the hero section right side
 */
const HeroVisual = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Animated money symbols container */}
      <div className="relative w-full max-w-lg aspect-square">
        {/* Central orb */}
        <div
          className={`
            absolute inset-0 rounded-full m-auto
            ${isDark ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20' : 'bg-gradient-to-br from-green-400/30 to-blue-400/30'}
            blur-2xl animate-pulse-custom
          `}
          style={{ width: '60%', height: '60%', top: '20%', left: '20%' }}
        />

        {/* Rotating money symbols ring */}
        <div className="absolute inset-0 animate-spin-slow">
          {['₹', '$', '€', '£', '¥', '₿'].map((symbol, index) => {
            const angle = (index * 60) * (Math.PI / 180)
            const radius = 120
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            return (
              <div
                key={index}
                className={`absolute text-4xl md:text-5xl font-bold ${
                  isDark ? 'text-green-400/60' : 'text-green-600/50'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {symbol}
              </div>
            )
          })}
        </div>

        {/* Inner floating elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`
              text-6xl md:text-7xl font-bold animate-float
              ${isDark ? 'text-green-400' : 'text-green-600'}
            `}
            style={{ animationDelay: '1s', animationDuration: '4s' }}
          >
            💰
          </div>
        </div>

        {/* Decorative circles */}
        <div
          className={`
            absolute top-10 right-10 w-24 h-24 rounded-full border-2
            ${isDark ? 'border-green-500/30' : 'border-green-400/40'}
            animate-pulse-custom
          `}
        />
        <div
          className={`
            absolute bottom-10 left-10 w-16 h-16 rounded-full border-2
            ${isDark ? 'border-blue-500/30' : 'border-blue-400/40'}
            animate-pulse-custom
          `}
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`
            absolute w-2 h-2 rounded-full animate-float
            ${isDark ? 'bg-green-400/40' : 'bg-green-500/50'}
          `}
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + (i % 3)}s`
          }}
        />
      ))}
    </div>
  )
}

export default HeroVisual

