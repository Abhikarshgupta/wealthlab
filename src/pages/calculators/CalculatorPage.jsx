import { useNavigate } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import { routes } from '@/routes/routes'
import { investmentInfo } from '@/constants/investmentInfo'
import ScrollToTop from '@/components/common/ScrollToTop'
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner'

// Lazy load calculator components
const SIPCalculator = lazy(() => import('@/components/calculators/SIPCalculator/SIPCalculator'))
const FDCalculator = lazy(() => import('@/components/calculators/FDCalculator/FDCalculator'))
const NSCalculator = lazy(() => import('@/components/calculators/NSCalculator/NSCalculator'))
const SGBCalculator = lazy(() => import('@/components/calculators/SGBCalculator/SGBCalculator'))
const NPSCalculator = lazy(() => import('@/components/calculators/NPSCalculator/NPSCalculator'))
const SCSSCalculator = lazy(() => import('@/components/calculators/SCSSCalculator/SCSSCalculator'))
const POMISCalculator = lazy(() => import('@/components/calculators/POMISCalculator/POMISCalculator'))
const PPFCalculator = lazy(() => import('@/components/calculators/PPFCalculator/PPFCalculator'))
const ELSSCalculator = lazy(() => import('@/components/calculators/ELSSCalculator/ELSSCalculator'))
const SSYCalculator = lazy(() => import('@/components/calculators/SSYCalculator/SSYCalculator'))
const EquityCalculator = lazy(() => import('@/components/calculators/EquityCalculator/EquityCalculator'))
const ETFCalculator = lazy(() => import('@/components/calculators/ETFCalculator/ETFCalculator'))
const DebtMutualFundCalculator = lazy(() => import('@/components/calculators/DebtMutualFundCalculator/DebtMutualFundCalculator'))
const RDCalculator = lazy(() => import('@/components/calculators/RDCalculator/RDCalculator'))
const REITsCalculator = lazy(() => import('@/components/calculators/REITsCalculator/REITsCalculator'))
const Bonds54ECCalculator = lazy(() => import('@/components/calculators/54ECBondsCalculator/54ECBondsCalculator'))

// Calculator component mapping
const calculatorComponents = {
  sip: SIPCalculator,
  fd: FDCalculator,
  nsc: NSCalculator,
  sgb: SGBCalculator,
  nps: NPSCalculator,
  scss: SCSSCalculator,
  pomis: POMISCalculator,
  ppf: PPFCalculator,
  elss: ELSSCalculator,
  ssy: SSYCalculator,
  equity: EquityCalculator,
  rd: RDCalculator,
  etf: ETFCalculator,
  debtMutualFund: DebtMutualFundCalculator,
  reits: REITsCalculator,
  bonds54EC: Bonds54ECCalculator,
}

/**
 * CalculatorPage Component
 * 
 * Displays calculator cards grid when no calculatorType is specified
 * Renders specific calculator component when calculatorType is provided
 */
const CalculatorPage = ({ calculatorType }) => {
  const navigate = useNavigate()

  /**
   * Scroll to top when calculator type changes
   * Fixes issue where scroll position persists when navigating from calculator list
   */
  useEffect(() => {
    if (calculatorType) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [calculatorType])

  // Calculator configuration with icons and details
  // Popularity: Lower number = more popular (sorted ascending)
  const calculators = [
    {
      id: 'sip',
      name: 'SIP',
      fullName: 'Systematic Investment Plan',
      description: investmentInfo.sip.description,
      route: routes.calculators.sip,
      status: 'complete',
      popularity: 1,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'fd',
      name: 'FD',
      fullName: 'Fixed Deposit',
      description: investmentInfo.fd.description,
      route: routes.calculators.fd,
      status: 'complete',
      popularity: 2,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'ppf',
      name: 'PPF',
      fullName: 'Public Provident Fund',
      description: investmentInfo.ppf.description,
      route: routes.calculators.ppf,
      status: 'complete',
      popularity: 3,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'equity',
      name: 'Equity',
      fullName: 'Direct Equity',
      description: investmentInfo.equity.description,
      route: routes.calculators.equity,
      status: 'complete',
      popularity: 4,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'elss',
      name: 'ELSS',
      fullName: 'Equity-Linked Savings Scheme',
      description: investmentInfo.elss.description,
      route: routes.calculators.elss,
      status: 'complete',
      popularity: 5,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'rd',
      name: 'RD',
      fullName: 'Recurring Deposit',
      description: investmentInfo.rd.description,
      route: routes.calculators.rd,
      status: 'complete',
      popularity: 6,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'nps',
      name: 'NPS',
      fullName: 'National Pension System',
      description: investmentInfo.nps.description,
      route: routes.calculators.nps,
      status: 'complete',
      popularity: 7,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'ssy',
      name: 'SSY',
      fullName: 'Sukanya Samriddhi Yojana',
      description: investmentInfo.ssy.description,
      route: routes.calculators.ssy,
      status: 'complete',
      popularity: 8,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'nsc',
      name: 'NSC',
      fullName: 'National Savings Certificate',
      description: investmentInfo.nsc.description,
      route: routes.calculators.nsc,
      status: 'complete',
      popularity: 9,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'etf',
      name: 'ETF',
      fullName: 'Exchange Traded Funds',
      description: investmentInfo.etf.description,
      route: routes.calculators.etf,
      status: 'complete',
      popularity: 11,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'scss',
      name: 'SCSS',
      fullName: 'Senior Citizens Savings Scheme',
      description: investmentInfo.scss.description,
      route: routes.calculators.scss,
      status: 'complete',
      popularity: 12,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'sgb',
      name: 'SGB',
      fullName: 'Sovereign Gold Bonds',
      description: investmentInfo.sgb.description,
      route: routes.calculators.sgb,
      status: 'complete',
      popularity: 10,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 'pomis',
      name: 'POMIS',
      fullName: 'Post Office Monthly Income Scheme',
      description: investmentInfo.pomis.description,
      route: routes.calculators.pomis,
      status: 'complete',
      popularity: 13,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'debtMutualFund',
      name: 'Debt MF',
      fullName: 'Debt Mutual Funds',
      description: investmentInfo.debtMutualFund.description,
      route: routes.calculators.debtMutualFund,
      status: 'complete',
      popularity: 14,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'reits',
      name: 'REITs',
      fullName: 'Real Estate Investment Trusts',
      description: investmentInfo.reits.description,
      route: routes.calculators.reits,
      status: 'complete',
      popularity: 16,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'bonds54EC',
      name: '54EC Bonds',
      fullName: 'Capital Gain Bonds',
      description: investmentInfo.bonds54EC.description,
      route: routes.calculators.bonds54EC,
      status: 'complete',
      popularity: 17,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ]

  // Sort calculators by popularity (lower number = more popular)
  const sortedCalculators = [...calculators].sort((a, b) => {
    // First sort by status (complete first)
    if (a.status === 'complete' && b.status !== 'complete') return -1
    if (a.status !== 'complete' && b.status === 'complete') return 1
    // Then sort by popularity
    return (a.popularity || 999) - (b.popularity || 999)
  })

  // If calculatorType is provided, render the specific calculator
  if (calculatorType) {
    const CalculatorComponent = calculatorComponents[calculatorType]
    
    if (CalculatorComponent) {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <CalculatorComponent />
          <ScrollToTop />
        </Suspense>
      )
    }
  }

  // Render calculator cards grid
  const onCardClick = (route) => {
    navigate(route)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Investment Calculators
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a calculator to plan your investments and estimate returns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCalculators.map((calculator) => {
          const isComplete = calculator.status === 'complete'
          return (
            <div
              key={calculator.id}
              onClick={() => onCardClick(calculator.route)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onCardClick(calculator.route)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${calculator.fullName} calculator`}
              className={`
                card cursor-pointer transition-all duration-200
                hover:shadow-lg hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                ${isComplete 
                  ? 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700' 
                  : 'border-gray-200 dark:border-gray-700 opacity-75'
                }
              `}
            >
              <div className="mb-4">
                <div className={`
                  p-3 rounded-xl inline-block
                  ${isComplete 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {calculator.icon}
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {calculator.fullName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {calculator.description}
              </p>

              <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                <span>Open Calculator</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalculatorPage