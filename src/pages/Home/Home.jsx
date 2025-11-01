import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          WealthLab
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Your personal finance experimentation lab
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          to={routes.calculators.index}
          className="card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Investment Calculators
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate returns for PPF, FD, SIP, NPS, and more
          </p>
        </Link>

        <Link
          to={routes.goalPlanning}
          className="card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Goal Planning
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Plan your financial goals with risk-based recommendations
          </p>
        </Link>

        <Link
          to={routes.corpusCalculator}
          className="card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Corpus Calculator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Project your portfolio across multiple investment instruments
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Home