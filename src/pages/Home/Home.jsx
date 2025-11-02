import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes'
import { useTheme } from '@/contexts/ThemeContext'
import AnimatedBackground from '@/components/common/AnimatedBackground/AnimatedBackground'
import FeatureCard from '@/components/common/FeatureCard/FeatureCard'
import HeroVisual from '@/components/common/HeroVisual/HeroVisual'

/**
 * Home Component
 * Modern landing page with scrollable full-width sections, hero split layout, and enhanced visuals
 */
const Home = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const heroRef = useRef(null)

  useEffect(() => {
    // Trigger fade-in animation on mount
    if (heroRef.current) {
      heroRef.current.style.opacity = '0'
      heroRef.current.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        heroRef.current.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out'
        heroRef.current.style.opacity = '1'
        heroRef.current.style.transform = 'translateY(0)'
      }, 100)
    }
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background - only for hero section */}
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
      </div>

      {/* Hero Section - Full Width Split Layout */}
      <section className="relative min-h-screen flex items-center py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div ref={heroRef} className="space-y-8">
              <div className="space-y-6">
                <h1
                  className={`
                    text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight
                    bg-gradient-to-r bg-clip-text text-transparent
                    ${isDark 
                      ? 'from-green-400 via-blue-400 to-green-500' 
                      : 'from-green-600 via-blue-600 to-green-700'
                    }
                  `}
                >
                  Unleash the power of intuitive finance
                </h1>
                <p
                  className={`
                    text-xl md:text-2xl leading-relaxed
                    ${isDark ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Say goodbye to outdated financial tools. Every investor, regardless of background, can now manage their finances like a pro. Simple. Intuitive. And never boring.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to={routes.calculators.index}
                  className={`
                    inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg
                    transition-all duration-300 hover:scale-105
                    ${isDark 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/50' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/50'
                    }
                  `}
                >
                  Explore Calculators
                </Link>
                <Link
                  to={routes.corpusCalculator}
                  className={`
                    inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg
                    transition-all duration-300 hover:scale-105
                    ${isDark 
                      ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-green-500/50 text-white' 
                      : 'bg-white/80 border-2 border-gray-200 hover:border-green-500/50 text-gray-900'
                    }
                    backdrop-blur-sm
                  `}
                >
                  Try Corpus Simulator
                </Link>
              </div>

              {/* Stats or Features */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    15+
                  </div>
                  <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Calculators
                  </div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    100%
                  </div>
                  <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Free Tools
                  </div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    🇮🇳
                  </div>
                  <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Made in India
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block relative h-[500px] lg:h-[600px]">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Full Width */}
      <section className={`relative py-20 md:py-32 ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`
                text-4xl md:text-5xl font-bold mb-4
                ${isDark ? 'text-white' : 'text-gray-900'}
              `}
            >
              Everything you need. Nothing you don't
            </h2>
            <p
              className={`
                text-xl md:text-2xl
                ${isDark ? 'text-gray-400' : 'text-gray-600'}
              `}
            >
              Financial management and visibility in one place. Experience a flexible toolkit that makes every task feel like a breeze.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              title="Investment Calculators"
              description="Calculate returns for PPF, FD, SIP, NPS, NSC, SSY, SCSS, SGB, ELSS, Equity, ETFs, Debt Mutual Funds, REITs, 54EC Bonds, and more with precision and detailed breakdowns"
              route={routes.calculators.index}
              icon="📊"
              delay={0.1}
            />
            <FeatureCard
              title="Goal Planning"
              description="Plan your financial goals with risk-based recommendations and personalized strategies"
              route={routes.goalPlanning}
              icon="🎯"
              delay={0.2}
            />
            <FeatureCard
              title="Corpus Simulator"
              description="Simulate your future corpus across multiple investment instruments with advanced projections"
              route={routes.corpusCalculator}
              icon="🚀"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Detailed Feature Section - Full Width Split */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Visual */}
            <div className="order-2 lg:order-1">
              <div
                className={`
                  relative rounded-2xl p-8 lg:p-12
                  ${isDark ? 'bg-gray-800/80' : 'bg-gray-50'}
                  backdrop-blur-md border-2
                  ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
                `}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      📈
                    </div>
                    <div>
                      <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Revenue Growth Alert
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        27% increase detected
                      </div>
                    </div>
                  </div>
                  <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      💳
                    </div>
                    <div>
                      <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Investment Tracking
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Real-time portfolio updates
                      </div>
                    </div>
                  </div>
                  <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      🎯
                    </div>
                    <div>
                      <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Goal Progress
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Track your financial milestones
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <h2
                className={`
                  text-4xl md:text-5xl font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}
              >
                Insights at your fingertips
              </h2>
              <p
                className={`
                  text-xl md:text-2xl leading-relaxed
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                All your data and finances in one place to provide quick answers and make decisions instantly. Track your investments, monitor growth, and plan ahead with confidence.
              </p>
              <Link
                to={routes.corpusCalculator}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                  transition-all duration-300 hover:gap-4
                  ${isDark 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-green-600 hover:text-green-700'
                  }
                `}
              >
                Explore Insights
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Another Feature Section - Reversed Split */}
      <section className={`relative py-20 md:py-32 ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2
                className={`
                  text-4xl md:text-5xl font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}
              >
                Plan with precision
              </h2>
              <p
                className={`
                  text-xl md:text-2xl leading-relaxed
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Harness the power of advanced financial planning to map out your financial future. Calculate returns, simulate scenarios, and make informed decisions.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Multiple investment calculators
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Tax-optimized calculations
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Detailed breakdowns and projections
                  </span>
                </div>
              </div>
              <Link
                to={routes.goalPlanning}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                  transition-all duration-300 hover:gap-4
                  ${isDark 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-green-600 hover:text-green-700'
                  }
                `}
              >
                Start Planning
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right Visual */}
            <div>
              <div
                className={`
                  relative rounded-2xl p-8 lg:p-12
                  ${isDark ? 'bg-gray-800/80' : 'bg-gray-50'}
                  backdrop-blur-md border-2
                  ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
                `}
              >
                <div className="space-y-4">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Corpus Projection
                  </div>
                  <div className="space-y-3">
                    {[75, 60, 45, 30].map((percent, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Year {idx + 1}
                          </span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            ₹{percent}L
                          </span>
                        </div>
                        <div
                          className={`
                            h-3 rounded-full overflow-hidden
                            ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                          `}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              isDark ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-green-600 to-blue-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`
              text-4xl md:text-5xl font-bold mb-6
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
          >
            The first financial tool you'll love
          </h2>
          <p
            className={`
              text-xl md:text-2xl mb-8
              ${isDark ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            And the last one you'll ever need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={routes.calculators.index}
              className={`
                inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg
                transition-all duration-300 hover:scale-105
                ${isDark 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/50' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/50'
                }
              `}
            >
              Get Started
            </Link>
            <Link
              to={routes.corpusCalculator}
              className={`
                inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg
                transition-all duration-300 hover:scale-105
                ${isDark 
                  ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-green-500/50 text-white' 
                  : 'bg-white/80 border-2 border-gray-200 hover:border-green-500/50 text-gray-900'
                }
                backdrop-blur-sm
              `}
            >
              Try Simulator
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home