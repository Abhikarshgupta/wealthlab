import { useEffect, useMemo, useRef, useState } from 'react'
import { INFLATION_CITIES, INFLATION_STATES } from '@/constants/personalInflationGeo'

/**
 * Searchable city select with state/UT fallback. No geocode, no tier.
 */
const CitySelect = ({ cityId, stateUt, onCity, onState }) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [showState, setShowState] = useState(Boolean(stateUt && !cityId))
  const wrapRef = useRef(null)

  const selectedCity = INFLATION_CITIES.find((city) => city.id === cityId)

  useEffect(() => {
    if (selectedCity) setQuery(selectedCity.name)
    else if (!cityId) setQuery('')
  }, [cityId, selectedCity])

  useEffect(() => {
    const onDoc = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return INFLATION_CITIES
    return INFLATION_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(q) ||
        city.stateUt.toLowerCase().includes(q)
    )
  }, [query])

  const geoChip = selectedCity
    ? `We use ${selectedCity.stateUt} urban prices, not a ${selectedCity.name} index.`
    : stateUt
      ? `We use ${stateUt} urban prices.`
      : null

  return (
    <div className="mb-8">
      <label
        htmlFor="inflation-city"
        className="block text-base font-semibold text-gray-900 dark:text-white mb-1"
      >
        Which city do you live in?
      </label>

      <div ref={wrapRef} className="relative">
        <input
          id="inflation-city"
          type="text"
          autoComplete="off"
          value={query}
          placeholder="Search cities — e.g. Bengaluru"
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            if (cityId) onCity(null)
          }}
          onFocus={() => setOpen(true)}
          className="
            w-full rounded-xl border-2 border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white
            focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30
          "
        />
        {open && (
          <ul
            className="
              absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border
              border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg
            "
          >
            {matches.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">No match — use state below.</li>
            )}
            {matches.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-900 dark:text-white"
                  onClick={() => {
                    onCity(city.id)
                    setQuery(city.name)
                    setOpen(false)
                    setShowState(false)
                  }}
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-gray-500 dark:text-gray-400"> · {city.stateUt}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {geoChip && (
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
          {geoChip}
        </p>
      )}

      <button
        type="button"
        className="mt-4 text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
        onClick={() => {
          setShowState((prev) => !prev)
          if (cityId) onCity(null)
        }}
      >
        {showState ? 'Hide state list' : 'My city isn’t listed'}
      </button>

      {showState && (
        <div className="mt-3">
          <label
            htmlFor="inflation-state"
            className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
          >
            Which state or UT?
          </label>
          <select
            id="inflation-state"
            value={stateUt || ''}
            onChange={(event) => onState(event.target.value)}
            className="
              w-full rounded-xl border-2 border-gray-200 dark:border-gray-600
              bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white
              focus:outline-none focus:border-green-500
            "
          >
            <option value="">Select state or UT</option>
            {INFLATION_STATES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default CitySelect
