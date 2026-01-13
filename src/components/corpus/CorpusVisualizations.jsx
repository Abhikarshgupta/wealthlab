import { useMemo } from 'react'
import PieChart from '@/components/common/PieChart'
import { useTheme } from '@/contexts/ThemeContext'
import { formatCurrency } from '@/utils/formatters'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

/**
 * Corpus Visualizations Component
 * Displays charts for corpus breakdown and comparisons
 */
const CorpusVisualizations = ({ results, settings }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Prepare pie chart data for instrument breakdown
  const pieChartData = useMemo(() => {
    if (!results?.byInstrument) return []

    const colors = [
      '#10b981', // green
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#f59e0b', // amber
      '#ef4444', // red
      '#06b6d4', // cyan
      '#ec4899', // pink
      '#84cc16', // lime
      '#f97316', // orange
      '#6366f1', // indigo
    ]

    return Object.entries(results.byInstrument).map(([instrumentType, data], index) => ({
      name: instrumentType.toUpperCase(),
      y: data.maturityValue || 0,
      color: colors[index % colors.length],
    }))
  }, [results?.byInstrument])

  // Prepare bar chart data for comparison
  const barChartData = useMemo(() => {
    if (!results) return null

    const data = []
    const categories = []

    // Nominal Corpus
    categories.push('Nominal Corpus')
    data.push(results.nominalCorpus || 0)

    // Inflation-Adjusted Corpus
    if (settings?.generalInflationRate && settings?.timeHorizon) {
      const inflationRateDecimal = settings.generalInflationRate / 100
      const inflationAdjusted =
        (results.nominalCorpus || 0) /
        Math.pow(1 + inflationRateDecimal, settings.timeHorizon)
      categories.push(`Inflation-Adjusted\n(${settings.timeHorizon} years)`)
      data.push(inflationAdjusted)
    }

    return { categories, data }
  }, [results, settings])

  // Bar chart options
  const barChartOptions = useMemo(() => {
    if (!barChartData) return null

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 400,
        style: {
          fontFamily: 'Inter, Roboto, Nunito, sans-serif',
        },
      },
      title: {
        text: 'Corpus Comparison',
        style: {
          color: isDark ? '#ffffff' : '#1f2937',
          fontSize: '18px',
          fontWeight: '600',
        },
      },
      xAxis: {
        categories: barChartData.categories,
        labels: {
          style: {
            color: isDark ? '#ffffff' : '#1f2937',
            fontSize: '14px',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Amount (₹)',
          style: {
            color: isDark ? '#ffffff' : '#1f2937',
          },
        },
        labels: {
          style: {
            color: isDark ? '#ffffff' : '#1f2937',
          },
          formatter: function () {
            const value = this.value
            if (value >= 10000000) {
              return `₹${(value / 10000000).toFixed(2)}Cr`
            } else if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`
            }
            return `₹${value.toLocaleString('en-IN')}`
          },
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          colorByPoint: true,
          colors: ['#10b981', '#f59e0b'],
          dataLabels: {
            enabled: true,
            formatter: function () {
              return formatCurrency(this.y, false)
            },
            style: {
              color: isDark ? '#ffffff' : '#1f2937',
              fontSize: '12px',
              fontWeight: '600',
            },
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        style: {
          color: isDark ? '#ffffff' : '#1f2937',
        },
        formatter: function () {
          return `<b>${this.x}</b><br/>${formatCurrency(this.y)}`
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Corpus',
          data: barChartData.data,
        },
      ],
    }
  }, [barChartData, isDark])

  if (!results || pieChartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No visualization data available.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Visualizations</h3>

      {/* Instrument Breakdown Pie Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <PieChart
          data={pieChartData}
          title="Instrument-Wise Corpus Breakdown"
          height={400}
        />
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Shows the contribution of each instrument to your total corpus
        </p>
      </div>

      {/* Comparison Bar Chart */}
      {barChartData && barChartOptions && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <HighchartsReact
            highcharts={Highcharts}
            options={barChartOptions}
          />
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            Compares nominal corpus with inflation-adjusted corpus to show purchasing power
          </p>
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Instruments</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {pieChartData.length}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Invested</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(results.totalInvested || 0)}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Returns</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {formatCurrency(results.totalReturns || 0)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CorpusVisualizations

