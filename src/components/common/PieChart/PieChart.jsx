import { useMemo, useState, useEffect, Suspense } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner'

// Lazy load Highcharts components
let Highcharts = null
let HighchartsReact = null

const loadHighcharts = async () => {
  if (!Highcharts || !HighchartsReact) {
    const [highchartsModule, reactModule] = await Promise.all([
      import('highcharts'),
      import('highcharts-react-official')
    ])
    Highcharts = highchartsModule.default
    HighchartsReact = reactModule.default
  }
  return { Highcharts, HighchartsReact }
}

/**
 * PieChart - Highcharts donut chart wrapper
 * @param {Object} props
 * @param {Array} props.data - Chart data [{ name, y, color }]
 * @param {string} props.title - Chart title
 * @param {number} props.height - Chart height
 */
const PieChart = ({ 
  data = [], 
  title = '',
  height = 400,
  className = '' 
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [highchartsComponents, setHighchartsComponents] = useState(null)

  useEffect(() => {
    loadHighcharts().then((components) => {
      setHighchartsComponents(components)
    })
  }, [])

  const options = useMemo(() => ({
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: height,
      style: {
        fontFamily: 'Inter, Roboto, Nunito, sans-serif',
      },
    },
    title: {
      text: title,
      style: {
        color: isDark ? '#ffffff' : '#1f2937',
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: isDark ? '#ffffff' : '#1f2937',
            fontSize: '14px',
            fontWeight: '500',
          },
          distance: -30,
        },
        innerSize: '50%',
        showInLegend: true,
        borderWidth: 2,
        borderColor: isDark ? '#18181b' : '#ffffff',
      },
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: isDark ? '#ffffff' : '#1f2937',
        fontSize: '14px',
      },
      itemHoverStyle: {
        color: isDark ? '#14b8a6' : '#059669',
      },
    },
    series: [{
      name: title || 'Value',
      colorByPoint: true,
      data: data,
    }],
    tooltip: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      style: {
        color: isDark ? '#ffffff' : '#1f2937',
      },
      pointFormat: '<b>{point.name}</b>: <b>₹{point.y:,.0f}</b> ({point.percentage:.1f}%)',
    },
    credits: {
      enabled: false,
    },
  }), [data, title, height, isDark])

  if (!highchartsComponents) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ minHeight: `${height}px` }}>
        <LoadingSpinner />
      </div>
    )
  }

  const { Highcharts: HC, HighchartsReact: HCReact } = highchartsComponents

  return (
    <div className={`${className}`}>
      <HCReact
        highcharts={HC}
        options={options}
      />
    </div>
  )
}

export default PieChart
