import { useMemo, useState } from 'react'
import usePersonalInflationStore from '@/store/personalInflationStore'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import NotificationToast from '@/components/common/InflationToggle/NotificationToast'
import SipBuyingPowerChart from '@/components/personalInflation/SipBuyingPowerChart'
import { isRenterRoof, toPersona } from '@/utils/personalInflationBeats'
import {
  applyYourEstimate,
  computePersonalInflation,
  saveInflationRun,
} from '@/utils/personalInflationEngine'
import {
  RAISE_TAX_SLABS,
  afterTaxMath,
  realRaiseCopy,
  realRaisePct,
} from '@/utils/personalInflationRaise'
import { SIP_BUYING_POWER, sipBuyingPowerSeries } from '@/utils/personalInflationSip'
import { formatCurrency } from '@/utils/formatters'
import {
  PUBLISHED_INFLATION_LINKS,
  vintageMonthLabel,
} from '@/constants/personalInflationCopy'

const BILLS = [
  { id: 'rent', label: 'Rent' },
  { id: 'food', label: 'Groceries' },
  { id: 'education', label: 'School' },
  { id: 'dwelling', label: 'Society' },
  { id: 'utilities', label: 'Power' },
  { id: 'help', label: 'Help' },
  { id: 'pet', label: 'Pet' },
  { id: 'health_care', label: 'Health' },
  { id: 'motor_run', label: 'Car' },
  { id: 'passenger', label: 'Cabs/metro' },
  { id: 'restaurants', label: 'Eating out' },
  { id: 'residual', label: 'Everything else', shareLocked: true },
]

const fmt1 = (n) => (Math.round(n * 10) / 10).toFixed(1)

const parsePct = (raw) => {
  const text = String(raw ?? '').trim()
  if (text === '' || text === '-' || text === '.') return null
  const n = Number(text)
  return Number.isFinite(n) ? n : null
}

const PercentField = ({ label, ariaLabel, value, onChange, onFocus, onBlur, disabled }) => (
  <label className="block text-xs text-gray-600 dark:text-gray-400">
    {label ? <span>{label}</span> : null}
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      disabled={disabled}
      aria-label={ariaLabel}
      className="mt-0.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1.5 tabular-nums text-sm disabled:opacity-60"
      value={value}
      onFocus={(event) => {
        event.target.select()
        onFocus?.()
      }}
      onBlur={onBlur}
      onChange={(event) => {
        const next = event.target.value
        if (next === '' || /^-?\d*\.?\d*$/.test(next)) onChange(next)
      }}
    />
  </label>
)

const RaiseOutcome = ({ realChange, testId }) => {
  const copy = realRaiseCopy(realChange)
  return (
    <div data-testid={testId} className="space-y-1">
      <p className="font-semibold text-gray-900 dark:text-white">{copy.outcome}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{copy.gap}</p>
    </div>
  )
}

const SlabRow = ({ legend, value, onChange }) => (
  <fieldset>
    <legend className="text-sm text-gray-700 dark:text-gray-300 mb-2">{legend}</legend>
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={legend}>
      {RAISE_TAX_SLABS.map((slab) => {
        const selected = value === slab.value
        return (
          <button
            key={slab.label}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${legend} ${slab.label}`}
            onClick={() => onChange(slab.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium border-2 ${
              selected
                ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            {slab.label}
          </button>
        )
      })}
    </div>
  </fieldset>
)

const Chapter4ResultsStub = ({ onPrevious, onStartOver }) => {
  const answers = usePersonalInflationStore((s) => s.answers)
  const overlay = usePersonalInflationStore((s) => s.overlay)
  const setOverlay = usePersonalInflationStore((s) => s.setOverlay)
  const incomeTaxSlab = useUserPreferencesStore((s) => s.incomeTaxSlab)
  const [hike, setHike] = useState('')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const [showTax, setShowTax] = useState(false)
  const [showTaxMath, setShowTaxMath] = useState(false)
  const [thisYearSlab, setThisYearSlab] = useState(incomeTaxSlab ?? 0.3)
  const [sipOpen, setSipOpen] = useState(false)
  const [showPublishedInfo, setShowPublishedInfo] = useState(false)
  const [showApplyToast, setShowApplyToast] = useState(false)

  const result = useMemo(() => {
    const persona = toPersona(answers)
    return computePersonalInflation(persona, overlay)
  }, [answers, overlay])

  const display = fmt1(result.pi_your_estimate)
  const published = fmt1(result.contrast.combined)
  const vintageLabel = vintageMonthLabel(result.vintage?.month)
  const sipYourLabel = `Corpus at ${display}%`
  const sipPublishedLabel = `Corpus at ${published}%`
  const hikeNum = parsePct(hike)
  const realChange = realRaisePct(hikeNum, result.pi_your_estimate)
  const taxMath =
    showTax && hikeNum != null
      ? afterTaxMath({
          hikePct: hikeNum,
          thisYearSlab,
          inflationPct: result.pi_your_estimate,
        })
      : null

  const visibleBills = BILLS.filter((row) => {
    if (row.id === 'rent') return isRenterRoof(answers.roof)
    if (row.id === 'pet') return Boolean(answers.who?.pet)
    return true
  })

  const sipSeries = useMemo(
    () =>
      sipBuyingPowerSeries({
        yourInflationPct: Number(display),
        publishedInflationPct: Number(published),
      }),
    [display, published]
  )
  const sipEnd = sipSeries[sipSeries.length - 1]

  const onShare = (id, value) => {
    const n = parsePct(value)
    if (n == null) return
    setOverlay({ w: { ...(overlay.w || {}), [id]: Math.max(0, Math.round(n)) } })
  }

  const onWentUp = (id, value) => {
    const n = parsePct(value)
    if (n == null) return
    setOverlay({ pi_i_estimate: { ...(overlay.pi_i_estimate || {}), [id]: n } })
  }

  const fieldKey = (id, side) => `${id}:${side}`

  const committedA = (id) =>
    result.pi_i_estimate[id] != null ? String(result.pi_i_estimate[id]) : ''

  const committedB = (id) => String(Math.round(result.w[id] ?? 0))

  const displayA = (id) => (editing === fieldKey(id, 'a') ? draft : committedA(id))

  const displayB = (id) => (editing === fieldKey(id, 'b') ? draft : committedB(id))

  const beginEdit = (id, side, current) => {
    setEditing(fieldKey(id, side))
    setDraft(current)
  }

  const finishEdit = (id, side) => {
    if (editing !== fieldKey(id, side)) return
    if (side === 'a') onWentUp(id, draft)
    else onShare(id, draft)
    setEditing(null)
    setDraft('')
  }

  const onApply = () => {
    applyYourEstimate(result)
    saveInflationRun({
      pi_your_estimate: result.pi_your_estimate,
      vintage: result.vintage,
    })
    setShowApplyToast(true)
  }

  return (
    <>
      {showApplyToast && (
        <div data-testid="pi-apply-toast">
          <NotificationToast
            message={`Using ${display}% in calculators`}
            onClose={() => setShowApplyToast(false)}
          />
        </div>
      )}
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-6 lg:items-start">
      <div className="lg:sticky lg:top-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your inflation</p>
          <p
            data-testid="pi-hero-rate"
            className="text-5xl font-extrabold text-gray-900 dark:text-white tabular-nums"
          >
            {display}%
          </p>
          <button
            type="button"
            onClick={onApply}
            aria-label={`Use ${display}% in calculators`}
            className="mt-4 w-full px-5 py-3 rounded-lg font-semibold bg-green-600 text-white"
          >
            Use in calculators
          </button>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Published inflation</p>
          <p
            data-testid="pi-published-rate"
            className="text-3xl font-bold text-gray-500 dark:text-gray-400 tabular-nums"
          >
            {published}%
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            India Combined, {vintageLabel}
          </p>
          <button
            type="button"
            className="mt-3 text-left text-sm font-semibold text-green-700 dark:text-green-400 hover:underline"
            aria-expanded={showPublishedInfo}
            onClick={() => setShowPublishedInfo((v) => !v)}
          >
            {showPublishedInfo ? 'Hide published info' : 'Know more about published inflation'}
          </button>
        </div>
        {showPublishedInfo && (
          <div
            data-testid="pi-published-info"
            className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-3"
          >
            <p>
              The {published}% is India’s Combined consumer price index for {vintageLabel}{' '}
              (provisional) — one official headline for the whole country.
            </p>
            <p>
              We do not average that headline with your answers. Your {display}% is your mix of
              bills, using urban category price changes, then the jumps you marked.
            </p>
            <p>
              Category prices come from the same CPI release. Spending shares start from the
              2023–24 household survey, then your household answers.
            </p>
            <ul className="space-y-2">
              {PUBLISHED_INFLATION_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-green-700 dark:text-green-400 hover:underline"
                  >
                    {item.label}
                  </a>
                  <span className="block text-xs mt-0.5">{item.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>

      <div className="flex flex-col gap-4 min-w-0">
      <details
        open
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
      >
        <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
          Did your raise keep up?
        </summary>
        <div className="mt-3 space-y-3">
          <PercentField
            label="Hike on the letter / CTC, %"
            ariaLabel="Salary increase"
            value={hike}
            onChange={setHike}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Minus the inflation figure above
          </p>
          {realChange == null ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter a hike to compare.</p>
          ) : (
            <RaiseOutcome realChange={realChange} testId="pi-real-raise" />
          )}
          <button
            type="button"
            className="text-green-700 dark:text-green-400"
            onClick={() => {
              setShowTax((open) => !open)
              setShowTaxMath(false)
            }}
          >
            After tax
          </button>
          {showTax && (
            <div className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-600 p-3">
              <SlabRow
                legend="Tax slab"
                value={thisYearSlab}
                onChange={setThisYearSlab}
              />
              {taxMath ? (
                <>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    In-hand hike about{' '}
                    <span className="tabular-nums font-medium">{fmt1(taxMath.inHand)}%</span>
                  </p>
                  <RaiseOutcome realChange={taxMath.real} testId="pi-real-raise-after-tax" />
                  <button
                    type="button"
                    className="text-sm text-green-700 dark:text-green-400 underline-offset-2 hover:underline"
                    aria-expanded={showTaxMath}
                    aria-controls="pi-after-tax-math"
                    onClick={() => setShowTaxMath((open) => !open)}
                  >
                    How we calculated this
                  </button>
                  {showTaxMath && (
                    <ul
                      id="pi-after-tax-math"
                      data-testid="pi-after-tax-math"
                      className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-5"
                    >
                      {taxMath.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter a hike to see the after-tax figure.
                </p>
              )}
            </div>
          )}
        </div>
      </details>

      <details
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        onToggle={(event) => setSipOpen(event.currentTarget.open)}
      >
        <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
          Corpus projection
        </summary>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          ₹{SIP_BUYING_POWER.monthly.toLocaleString('en-IN')} a month at{' '}
          {Math.round(SIP_BUYING_POWER.annualReturn * 100)}% assumed return, over{' '}
          {SIP_BUYING_POWER.years} years. {sipYourLabel} vs {sipPublishedLabel}.
        </p>
        {sipOpen && (
          <div className="mt-4 space-y-3">
            <SipBuyingPowerChart
              series={sipSeries}
              yourLabel={sipYourLabel}
              publishedLabel={sipPublishedLabel}
            />
            <p
              data-testid="pi-sip-end-copy"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              After {SIP_BUYING_POWER.years} years, {sipYourLabel.toLowerCase()} is about{' '}
              <span data-testid="pi-sip-your-end" className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(sipEnd.your)}
              </span>{' '}
              today, versus{' '}
              <span data-testid="pi-sip-published-end" className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(sipEnd.published)}
              </span>{' '}
              at {published}%.
            </p>
          </div>
        )}
      </details>

      <details className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 overflow-x-auto">
        <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
          Change this {display}%
        </summary>
        <table className="mt-3 w-full min-w-[28rem] text-sm text-left">
          <thead>
            <tr className="text-gray-600 dark:text-gray-400 align-top">
              <th scope="col" className="pb-2 pr-2 font-medium">
                Bill
              </th>
              <th scope="col" className="pb-2 pr-2 font-medium" data-testid="pi-col-a">
                A
                <span className="block text-xs font-normal">Went up %</span>
              </th>
              <th scope="col" className="pb-2 pr-2 font-medium" data-testid="pi-col-b">
                B
                <span className="block text-xs font-normal">Of living %</span>
              </th>
              <th scope="col" className="pb-2 font-medium">
                I
                <span
                  data-testid="pi-mix-formula"
                  className="block text-xs font-normal tabular-nums"
                >
                  I = A × (B / 100)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleBills.map((row) => {
              const points = result.contribution_estimate?.[row.id]
              return (
                <tr key={row.id} className="border-t border-gray-200 dark:border-gray-700">
                  <th
                    scope="row"
                    className="py-2 pr-2 font-medium text-gray-900 dark:text-white"
                  >
                    {row.label}
                  </th>
                  <td className="py-2 pr-2">
                    <PercentField
                      label=""
                      ariaLabel={`${row.label} A went up`}
                      value={displayA(row.id)}
                      onFocus={() => beginEdit(row.id, 'a', committedA(row.id))}
                      onBlur={() => finishEdit(row.id, 'a')}
                      onChange={setDraft}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <PercentField
                      label=""
                      ariaLabel={`${row.label} B of living`}
                      disabled={row.shareLocked}
                      value={displayB(row.id)}
                      onFocus={() => beginEdit(row.id, 'b', committedB(row.id))}
                      onBlur={() => finishEdit(row.id, 'b')}
                      onChange={setDraft}
                    />
                  </td>
                  <td className="py-2 tabular-nums text-gray-900 dark:text-white">
                    {points != null ? fmt1(points) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </details>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onPrevious}
          className="px-5 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          ← Back to bills
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="px-5 py-3 rounded-lg font-semibold text-green-700 dark:text-green-400 hover:underline"
        >
          Start over
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Not tax advice. Not HR advice. Saved on this device.
      </p>
      </div>
    </div>
    </>
  )
}

export default Chapter4ResultsStub
