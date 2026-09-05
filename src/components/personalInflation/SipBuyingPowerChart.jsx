import { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useTheme } from '@/contexts/ThemeContext'
import { formatCurrency } from '@/utils/formatters'
import { SIP_BUYING_POWER } from '@/utils/personalInflationSip'

const axisRupee = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`
  return `₹${value}`
}

const SipBuyingPowerChart = ({ series, yourLabel, publishedLabel }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const options = useMemo(
    () => ({
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        height: 260,
        style: { fontFamily: 'Inter, Roboto, Nunito, sans-serif' },
      },
      title: { text: undefined },
      xAxis: {
        categories: series.map((p) => String(p.year)),
        title: {
          text: 'Years',
          style: { color: isDark ? '#9ca3af' : '#6b7280' },
        },
        labels: {
          style: { color: isDark ? '#d1d5db' : '#4b5563' },
        },
      },
      yAxis: {
        title: {
          text: 'Today’s rupees',
          style: { color: isDark ? '#9ca3af' : '#6b7280' },
        },
        labels: {
          style: { color: isDark ? '#d1d5db' : '#4b5563' },
          formatter() {
            return axisRupee(this.value)
          },
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: isDark ? '#ffffff' : '#1f2937',
          fontSize: '13px',
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        style: { color: isDark ? '#ffffff' : '#1f2937' },
        formatter() {
          const year = this.x
          const rows = this.points
            .map((pt) => `${pt.series.name}: <b>${formatCurrency(pt.y)}</b>`)
            .join('<br/>')
          return `<b>Year ${year}</b><br/>${rows}`
        },
      },
      credits: { enabled: false },
      plotOptions: {
        line: {
          marker: { radius: 3 },
        },
      },
      series: [
        {
          name: yourLabel,
          data: series.map((p) => Math.round(p.your)),
          color: '#16a34a',
        },
        {
          name: publishedLabel,
          data: series.map((p) => Math.round(p.published)),
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      ],
    }),
    [series, isDark, yourLabel, publishedLabel]
  )

  return (
    <div
      role="img"
      aria-label={`Corpus projection of ₹${SIP_BUYING_POWER.monthly.toLocaleString('en-IN')} a month at ${Math.round(SIP_BUYING_POWER.annualReturn * 100)}% return over ${SIP_BUYING_POWER.years} years`}
      data-testid="pi-sip-graph"
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default SipBuyingPowerChart
