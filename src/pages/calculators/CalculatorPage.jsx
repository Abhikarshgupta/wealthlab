import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { routes } from '@/routes/routes'
import { investmentInfo } from '@/constants/investmentInfo'
import SIPCalculator from '@/components/calculators/SIPCalculator/SIPCalculator'
import FDCalculator from '@/components/calculators/FDCalculator/FDCalculator'
import NSCalculator from '@/components/calculators/NSCalculator/NSCalculator'
import SGBCalculator from '@/components/calculators/SGBCalculator/SGBCalculator'
import NPSCalculator from '@/components/calculators/NPSCalculator/NPSCalculator'
import SCSSCalculator from '@/components/calculators/SCSSCalculator/SCSSCalculator'
import POMISCalculator from '@/components/calculators/POMISCalculator/POMISCalculator'
import PPFCalculator from '@/components/calculators/PPFCalculator/PPFCalculator'
import ELSSCalculator from '@/components/calculators/ELSSCalculator/ELSSCalculator'
import SSYCalculator from '@/components/calculators/SSYCalculator/SSYCalculator'
import EquityCalculator from '@/components/calculators/EquityCalculator/EquityCalculator'
import ETFCalculator from '@/components/calculators/ETFCalculator/ETFCalculator'
import DebtMutualFundCalculator from '@/components/calculators/DebtMutualFundCalculator/DebtMutualFundCalculator'
import RDCalculator from '@/components/calculators/RDCalculator/RDCalculator'
import REITsCalculator from '@/components/calculators/REITsCalculator/REITsCalculator'
import IPOCalculator from '@/components/calculators/IPOCalculator/IPOCalculator'
import Bonds54ECCalculator from '@/components/calculators/54ECBondsCalculator/54ECBondsCalculator'
import ScrollToTop from '@/components/common/ScrollToTop'

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
  const calculators = [
    {
      id: 'ppf',
      name: 'PPF',
      fullName: 'Public Provident Fund',
      description: investmentInfo.ppf.description,
      route: routes.calculators.ppf,
      status: 'complete',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'sip',
      name: 'SIP',
      fullName: 'Systematic Investment Plan',
      description: investmentInfo.sip.description,
      route: routes.calculators.sip,
      status: 'complete',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'ipo',
      name: 'IPO/FPO',
      fullName: 'IPO/FPO',
      description: investmentInfo.ipo.description,
      route: routes.calculators.ipo,
      status: 'complete',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ]

  // If calculatorType is provided, render the specific calculator
  if (calculatorType) {
    switch (calculatorType) {
      case 'sip':
        return (
          <>
            <SIPCalculator />
            <ScrollToTop />
          </>
        )
      case 'fd':
        return (
          <>
            <FDCalculator />
            <ScrollToTop />
          </>
        )
      case 'nsc':
        return (
          <>
            <NSCalculator />
            <ScrollToTop />
          </>
        )
      case 'sgb':
        return (
          <>
            <SGBCalculator />
            <ScrollToTop />
          </>
        )
      case 'nps':
        return (
          <>
            <NPSCalculator />
            <ScrollToTop />
          </>
        )
      case 'scss':
        return (
          <>
            <SCSSCalculator />
            <ScrollToTop />
          </>
        )
      case 'ppf':
        return (
          <>
            <PPFCalculator />
            <ScrollToTop />
          </>
        )
      case 'elss':
        return (
          <>
            <ELSSCalculator />
            <ScrollToTop />
          </>
        )
      case 'ssy':
        return (
          <>
            <SSYCalculator />
            <ScrollToTop />
          </>
        )
      case 'equity':
        return (
          <>
            <EquityCalculator />
            <ScrollToTop />
          </>
        )
      case 'ipo':
        return (
          <>
            <IPOCalculator />
            <ScrollToTop />
          </>
        )
      case 'rd':
        return (
          <>
            <RDCalculator />
            <ScrollToTop />
          </>
        )
      case 'pomis':
        return (
          <>
            <POMISCalculator />
            <ScrollToTop />
          </>
        )
      case 'etf':
        return (
          <>
            <ETFCalculator />
            <ScrollToTop />
          </>
        )
      case 'debtMutualFund':
        return (
          <>
            <DebtMutualFundCalculator />
            <ScrollToTop />
          </>
        )
      case 'reits':
        return (
          <>
            <REITsCalculator />
            <ScrollToTop />
          </>
        )
      case 'bonds54EC':
        return (
          <>
            <Bonds54ECCalculator />
            <ScrollToTop />
          </>
        )
      default:
        // Fall through to card grid
        break
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
        {calculators.map((calculator) => {
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
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  p-3 rounded-xl
                  ${isComplete 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {calculator.icon}
                </div>
                {isComplete && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    Ready
                  </span>
                )}
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