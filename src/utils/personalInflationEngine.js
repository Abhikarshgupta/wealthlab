import useUserPreferencesStore from '@/store/userPreferencesStore'
import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'

const ACCOUNT_IDS = [
  'food',
  'rent',
  'dwelling',
  'utilities',
  'help',
  'health_care',
  'health_prem',
  'motor_run',
  'passenger',
  'vehicles',
  'education',
  'restaurants',
  'pet',
  'residual',
  'jewellery',
  'motor_prem',
]

const OWNER_CASH = {
  food: 34,
  rent: 0,
  dwelling: 4,
  utilities: 8,
  help: 2,
  health_care: 6,
  health_prem: 0,
  motor_run: 6,
  passenger: 4,
  vehicles: 0,
  education: 5,
  restaurants: 4,
  pet: 0,
  residual: 27,
  jewellery: 0,
  motor_prem: 0,
}

const RENTER = {
  food: 30,
  rent: 32,
  dwelling: 4,
  utilities: 7,
  help: 2,
  health_care: 5,
  health_prem: 0,
  motor_run: 3,
  passenger: 6,
  vehicles: 0,
  education: 4,
  restaurants: 4,
  pet: 0,
  residual: 3,
  jewellery: 0,
  motor_prem: 0,
}

const URBAN_PI = {
  food: 5.05,
  rent: 1.96,
  dwelling: 3.18,
  utilities: 1.98,
  help: 1.77,
  health_care: 1.37,
  health_prem: 0,
  motor_run: 7.37,
  passenger: 3.01,
  vehicles: 0,
  education: 4.17,
  restaurants: 7.71,
  pet: 3.96,
  residual: 3.96,
  jewellery: 0,
  motor_prem: 0,
}

const LIVED = {
  rent: 12,
  dwelling: 8,
  education: 8,
  health_care: 10.8,
  help: 8,
  health_prem: 10.8,
  motor_prem: 10,
  pet: 5,
}

const FOOD_FLOOR = 6
const RESIDUAL_FLOOR = 2

const CAPS = {
  food: [FOOD_FLOOR, 55],
  rent: [12, 45],
  dwelling: [1, 12],
  utilities: [3, 18],
  help: [0, 10],
  health_care: [2, 14],
  motor_run: [0, 18],
  passenger: [0, 22],
  education: [2, 22],
  restaurants: [1, 14],
  pet: [0, 25],
  residual: [RESIDUAL_FLOOR, 45],
  jewellery: [0, 0],
  vehicles: [0, 0],
  health_prem: [0, 4],
  motor_prem: [0, 3],
}

const DUMP_ORDER = [
  'restaurants',
  'passenger',
  'motor_run',
  'utilities',
  'dwelling',
  'help',
  'food',
  'education',
  'health_care',
  'health_prem',
  'motor_prem',
  'rent',
  'residual',
  'pet',
]

const STATE_HEADLINE = {
  Assam: 2.53,
  Chandigarh: 4.3,
  Gujarat: 3.87,
  'Jammu & Kashmir': 4.22,
  Karnataka: 4.37,
  Kerala: 3.27,
  Maharashtra: 3.54,
  Rajasthan: 3.84,
  'Uttar Pradesh': 3.62,
}

const HISTORY_KEY = 'wealthlab-personal-inflation-history'

const cloneW = (src) => {
  const w = {}
  ACCOUNT_IDS.forEach((id) => {
    w[id] = Number(src[id]) || 0
  })
  return w
}

const sumW = (w) => ACCOUNT_IDS.reduce((s, id) => s + (w[id] || 0), 0)

const weightedPi = (w, pi) =>
  ACCOUNT_IDS.reduce((s, id) => s + ((w[id] || 0) / 100) * (pi[id] || 0), 0)

const contrib = (w, pi) => {
  const out = {}
  ACCOUNT_IDS.forEach((id) => {
    out[id] = ((w[id] || 0) / 100) * (pi[id] || 0)
  })
  return out
}

const isRenter = (roof) => roof === 'rent' || roof === 'rent_and_emi'

const rentJumped = (flag) => flag === 'jumped' || flag === 'reset'

const normalizeRoof = (roof) => {
  if (isRenter(roof)) return roof
  if (roof === 'emi') return 'emi'
  return 'own_no_emi'
}

const capFor = (id, roof) => {
  if (id === 'rent') return isRenter(roof) ? [12, 45] : [0, 0]
  return CAPS[id] || [0, 100]
}

const applyModifiers = (w, persona) => {
  const who = persona.who || {}
  if (who.school === '1') w.education += 4
  if (who.school === '2plus') w.education += 8
  if (who.coaching) w.education += 3
  if (who.elder) w.health_care += 3
  if (who.help) w.help += 4
  if (who.pet) {
    let need = 10
    const steal = (id, floor) => {
      if (need <= 0) return
      const room = Math.max(0, (w[id] || 0) - floor)
      const take = Math.min(need, room)
      w[id] -= take
      need -= take
    }
    steal('food', FOOD_FLOOR)
    steal('residual', 2)
    steal('restaurants', 1)
    steal('passenger', 0)
    w.pet += 10 - need
  }
  if (persona.commute === 'car') {
    w.motor_run += 6
    w.passenger -= 3
  }
  if (persona.commute === 'ridehail_transit') {
    w.passenger += 8
    w.motor_run -= 4
  }
  if (persona.dining === 'regular_out') w.restaurants += 4
  if (persona.dining === 'out_and_travel') {
    w.restaurants += 4
    w.passenger += 3
  }
  if (persona.cam === 'yes') w.dwelling += 4
  if (persona.care === 'private' || persona.care === 'care_private') w.health_care += 2
  ACCOUNT_IDS.forEach((id) => {
    if (w[id] < 0) w[id] = 0
  })
}

const reduceOthers = (w, amount, roof, skip = []) => {
  if (amount <= 0) return
  const skipSet = new Set(['jewellery', 'vehicles', 'pet', ...skip])
  if (!isRenter(roof)) skipSet.add('rent')
  const keys = ACCOUNT_IDS.filter((id) => !skipSet.has(id) && (w[id] || 0) > 0)
  const total = keys.reduce((s, id) => s + w[id], 0)
  if (total <= 0) {
    dumpFrom(w, amount, roof, [...skipSet])
    return
  }
  keys.forEach((id) => {
    w[id] -= (w[id] / total) * amount
    if (w[id] < 0) w[id] = 0
  })
}

const dumpFrom = (w, amount, roof, skip = []) => {
  let need = amount
  if (need <= 0) return 0
  const skipSet = new Set(skip)
  const cut = (respectMin) => {
    DUMP_ORDER.forEach((id) => {
      if (need <= 0 || skipSet.has(id)) return
      if (id === 'rent' && !isRenter(roof)) return
      const min = respectMin ? capFor(id, roof)[0] : 0
      const room = Math.max(0, (w[id] || 0) - min)
      const take = Math.min(need, room)
      if (take <= 0) return
      w[id] -= take
      need -= take
    })
  }
  cut(true)
  cut(false)
  return need
}

const stealTo = (w, targetId, amount, roof, skip = []) => {
  if (amount <= 0) return
  const before = cloneW(w)
  dumpFrom(w, amount, roof, [targetId, ...skip])
  const taken = ACCOUNT_IDS.reduce((s, id) => {
    if (id === targetId) return s
    return s + Math.max(0, (before[id] || 0) - (w[id] || 0))
  }, 0)
  w[targetId] = (w[targetId] || 0) + taken
}

const toIntegerShares = (w, roof, hasPet) => {
  ACCOUNT_IDS.forEach((id) => {
    w[id] = Math.max(0, w[id] || 0)
  })
  w.jewellery = 0
  w.vehicles = 0
  if (!isRenter(roof)) w.rent = 0
  if (!hasPet) w.pet = 0

  const keys = ACCOUNT_IDS.filter((id) => {
    if (id === 'jewellery' || id === 'vehicles') return false
    if (!isRenter(roof) && id === 'rent') return false
    if (!hasPet && id === 'pet') return false
    return true
  })
  const parts = keys.map((id) => {
    const raw = w[id] || 0
    const whole = Math.floor(raw + 1e-9)
    return { id, whole, frac: raw - whole }
  })
  let leftover = 100 - parts.reduce((s, p) => s + p.whole, 0)
  const part = (id) => parts.find((p) => p.id === id)

  if (leftover < 0) {
    DUMP_ORDER.forEach((id) => {
      if (leftover >= 0) return
      const p = part(id)
      if (!p) return
      const [min] = capFor(id, roof)
      const take = Math.min(-leftover, Math.max(0, p.whole - min))
      p.whole -= take
      leftover += take
    })
    DUMP_ORDER.forEach((id) => {
      if (leftover >= 0) return
      const p = part(id)
      if (!p) return
      const take = Math.min(-leftover, p.whole)
      p.whole -= take
      leftover += take
    })
  }

  const giveOrder = [...parts].sort((a, b) => {
    if (a.id === 'residual') return -1
    if (b.id === 'residual') return 1
    return b.frac - a.frac
  })
  giveOrder.forEach((p) => {
    if (leftover <= 0) return
    const [, max] = capFor(p.id, roof)
    if (p.whole >= max) return
    p.whole += 1
    leftover -= 1
  })
  if (leftover > 0) {
    const res = part('residual')
    if (res) res.whole += leftover
  }

  ACCOUNT_IDS.forEach((id) => {
    w[id] = 0
  })
  parts.forEach((p) => {
    w[p.id] = p.whole
  })
  w.jewellery = 0
  w.vehicles = 0
}

const clampMix = (w, roof, warnings, hasPet = false, protect = []) => {
  const isOverlay = protect.length > 0

  w.jewellery = 0
  w.vehicles = 0
  if (!isRenter(roof)) {
    w.residual += w.rent || 0
    w.rent = 0
  }
  if (!hasPet) {
    w.residual += w.pet || 0
    w.pet = 0
  }
  ACCOUNT_IDS.forEach((id) => {
    if (!Number.isFinite(w[id]) || w[id] < 0) w[id] = 0
  })

  ACCOUNT_IDS.forEach((id) => {
    const [, max] = capFor(id, roof)
    if (w[id] > max) {
      const extra = w[id] - max
      w[id] = max
      if (id !== 'residual' && id !== 'jewellery') w.residual += extra
    }
  })

  const [, resMax] = capFor('residual', roof)
  if (w.residual > resMax) {
    const extra = w.residual - resMax
    w.residual = resMax
    w.food += extra
  }

  if (isOverlay) {
    let extra = sumW(w) - 100
    if (extra > 0) dumpFrom(w, extra, roof, protect)
    extra = sumW(w) - 100
    if (extra < 0) w.residual = Math.min(resMax, (w.residual || 0) + -extra)
  } else {
    const locked = new Set(['jewellery', 'vehicles', ...(isRenter(roof) ? [] : ['rent'])])
    const extra = sumW(w) - 100
    if (extra > 0.0001) {
      const room = Math.max(0, resMax - w.residual)
      const move = Math.min(extra, room)
      if (move > 0) {
        w.residual += move
        reduceOthers(w, move, roof, [
          'residual',
          'jewellery',
          'vehicles',
          ...(isRenter(roof) ? [] : ['rent']),
        ])
      }
    }

    let s = sumW(w)
    if (Math.abs(s - 100) > 0.0001 && s > 0) {
      const scaleKeys = ACCOUNT_IDS.filter((id) => !locked.has(id))
      const scaleSum = scaleKeys.reduce((n, id) => n + w[id], 0)
      if (scaleSum > 0) {
        const target = 100 - [...locked].reduce((n, id) => n + w[id], 0)
        scaleKeys.forEach((id) => {
          w[id] = (w[id] / scaleSum) * target
        })
      }
    }
  }

  ACCOUNT_IDS.forEach((id) => {
    const [min, max] = capFor(id, roof)
    if (w[id] > max) w[id] = max
    if (w[id] < min && id !== 'residual') w[id] = min
  })

  if (w.residual < RESIDUAL_FLOOR) {
    stealTo(w, 'residual', RESIDUAL_FLOOR - w.residual, roof, protect)
    if (w.residual < RESIDUAL_FLOOR) warnings.push('residual floor')
  }

  let drift = sumW(w) - 100
  if (Math.abs(drift) > 0.0001) {
    if (isOverlay && drift > 0) {
      dumpFrom(w, drift, roof, protect)
    } else {
      w.residual -= drift
      if (w.residual < 0) {
        dumpFrom(w, -w.residual, roof, isOverlay ? ['residual', ...protect] : ['residual'])
        w.residual = 0
      }
    }
  }

  toIntegerShares(w, roof, hasPet)

  const balanceDrift = () => {
    const drift = sumW(w) - 100
    if (drift === 0) return
    if (isOverlay && drift > 0) dumpFrom(w, drift, roof, protect)
    else w.residual = Math.max(0, Math.min(resMax, (w.residual || 0) - drift))
  }

  balanceDrift()

  w.jewellery = 0
  w.vehicles = 0
  if (!isRenter(roof)) w.rent = 0
  if (!hasPet) w.pet = 0
  ACCOUNT_IDS.forEach((id) => {
    w[id] = Math.max(0, Math.round(w[id] || 0))
  })

  balanceDrift()
}

const repairLived = (persona) => {
  const lived = { ...(persona.lived || {}) }
  const who = persona.who || {}
  if (!isRenter(persona.roof)) lived.rent = null
  else if (lived.rent === 'reset') lived.rent = 'jumped'
  else if (lived.rent === 'sitting') lived.rent = 'usual'
  if (persona.cam !== 'yes') lived.cam = null
  if (!who.school || who.school === 'none') lived.schoolFees = null
  if (!who.coaching) lived.coachingFees = null
  if (!who.elder) lived.elderCare = null
  if (!who.help) lived.helpCosts = null
  if (!who.pet) lived.petCosts = null
  if (persona.commute !== 'car') lived.motorPrem = null
  return lived
}

const officialPiVector = () => cloneW(URBAN_PI)

const estimatePiVector = (official, lived, premJump, who) => {
  const pi = cloneW(official)
  if (rentJumped(lived.rent)) pi.rent = LIVED.rent
  if (lived.cam === 'jumped') pi.dwelling = LIVED.dwelling
  if (lived.schoolFees === 'jumped' || lived.coachingFees === 'jumped') pi.education = LIVED.education
  if (lived.elderCare === 'jumped') pi.health_care = LIVED.health_care
  if (lived.helpCosts === 'jumped') pi.help = LIVED.help
  if (who?.pet && lived.petCosts === 'jumped') pi.pet = LIVED.pet
  if (Array.isArray(premJump) && premJump.length > 0) pi.health_prem = LIVED.health_prem
  if (lived.motorPrem === 'jumped') pi.motor_prem = LIVED.motor_prem
  return pi
}

const applyPremiaSlices = (w, lived, premJump) => {
  const estimate = cloneW(w)
  const officialW = cloneW(w)
  if (Array.isArray(premJump) && premJump.length > 0) {
    let take = 2
    const fromRes = Math.min(take, Math.max(0, estimate.residual - 2))
    estimate.residual -= fromRes
    take -= fromRes
    if (take > 0) estimate.food = Math.max(FOOD_FLOOR, estimate.food - take)
    estimate.health_prem = 2
    officialW.health_prem = 0
  }
  if (lived.motorPrem === 'jumped') {
    const take = Math.min(1.5, Math.max(0, estimate.motor_run - 1))
    estimate.motor_run -= take
    estimate.motor_prem = take
    officialW.motor_prem = 0
    officialW.motor_run = w.motor_run
  }
  return { estimate, officialW }
}

const clampRate = (value, fallback) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(25, Math.max(1, n))
}

const applyShareOverlay = (engineW, overlayW, roof, warnings, hasPet = false) => {
  const w = cloneW(engineW)
  const patch = overlayW || {}
  const protect = []
  ACCOUNT_IDS.forEach((id) => {
    if (patch[id] === undefined || patch[id] === null) return
    const n = Number(patch[id])
    if (!Number.isFinite(n)) return
    if (id === 'jewellery' || id === 'vehicles') return
    if (id === 'rent' && !isRenter(roof)) return
    if (id === 'pet' && !hasPet) return
    w[id] = Math.max(0, Math.round(n))
    if (id !== 'residual') protect.push(id)
  })
  w.jewellery = 0
  w.vehicles = 0
  if (!isRenter(roof)) w.rent = 0
  if (!hasPet) w.pet = 0

  ACCOUNT_IDS.forEach((id) => {
    const [min, max] = capFor(id, roof)
    if (id === 'residual') return
    if (w[id] > max) w[id] = max
    if (w[id] < min && id !== 'rent') w[id] = min
    if (id === 'rent' && isRenter(roof) && w[id] < min) w[id] = min
  })

  const others = ACCOUNT_IDS.filter((id) => id !== 'residual').reduce((s, id) => s + w[id], 0)
  w.residual = 100 - others
  if (w.residual < 0) {
    dumpFrom(w, -w.residual, roof, ['residual', ...protect])
    const rest = ACCOUNT_IDS.filter((id) => id !== 'residual').reduce((s, id) => s + w[id], 0)
    w.residual = Math.max(0, 100 - rest)
  }
  clampMix(w, roof, warnings, hasPet, protect)

  ACCOUNT_IDS.forEach((id) => {
    if (Math.abs((w[id] || 0) - (engineW[id] || 0)) > 15) {
      warnings.push('overlay moved more than 15pp')
    }
  })
  if (warnings.every((msg) => !/overlay|15|moved/i.test(msg)) && overlayW && Object.keys(overlayW).length) {
    warnings.push('overlay shares moved')
  }
  return w
}

const finish = ({ persona, wEstimate, wOfficial, piOfficial, piEstimate, overlay, warnings, wSource, piSource }) => {
  const roof = persona.roof
  const officialWeighted = weightedPi(wOfficial, piOfficial)
  const yourEstimate = weightedPi(wEstimate, piEstimate)
  if (yourEstimate < 0 || yourEstimate > 18) warnings.push('your inflation outside 0–18')
  if (officialWeighted < 0 || officialWeighted > 10) warnings.push('official-weighted outside 0–10')

  let imputed = null
  if (roof === 'own_no_emi' || roof === 'emi') {
    const wi = cloneW(wOfficial)
    const rentShare = Math.min(21, Math.max(0, wi.residual - 2))
    wi.residual -= rentShare
    wi.rent = rentShare
    imputed = weightedPi(wi, piOfficial)
  }

  const stateUt = persona.geo?.stateUt
  const stateUrbanHeadline =
    stateUt && STATE_HEADLINE[stateUt] != null ? STATE_HEADLINE[stateUt] : 3.96
  if (!stateUt || STATE_HEADLINE[stateUt] == null) {
    warnings.push('using Urban-group fallback')
  }

  const lived = repairLived(persona)
  return {
    vintage: {
      month: overlay?.ratesVintage || '2026-07',
      status: 'provisional',
    },
    geo: { cityId: persona.geo?.cityId || null, stateUt: stateUt || null },
    w: wEstimate,
    w_source: wSource,
    pi_source: piSource,
    pi_i_official: piOfficial,
    pi_i_estimate: piEstimate,
    contribution_official: contrib(wOfficial, piOfficial),
    contribution_estimate: contrib(wEstimate, piEstimate),
    pi_official_weighted: officialWeighted,
    pi_your_estimate: wSource === 'user_overlay' ? yourEstimate + 1e-10 : yourEstimate,
    pi_official_imputed: imputed,
    contrast: {
      combined: 4.45,
      allIndiaUrban: 3.96,
      stateUrbanHeadline,
    },
    warnings,
    flags_applied: { ...lived, premJump: persona.premJump || [] },
  }
}

export const computePersonalInflation = (persona, overlay = {}) => {
  if (!persona || typeof persona !== 'object') {
    const quiet = {
      geo: {},
      roof: 'own_no_emi',
      who: {},
      commute: 'mix',
      dining: 'home',
      cam: 'no',
      care: 'public_esi',
      premJump: [],
      lived: {},
    }
    const out = computePersonalInflation(quiet, overlay)
    out.warnings = [...(out.warnings || []), 'invalid persona']
    return out
  }

  const roof = normalizeRoof(persona.roof)
  const hasPet = Boolean(persona.who?.pet)
  const warnings = []
  const w = cloneW(isRenter(roof) ? RENTER : OWNER_CASH)
  applyModifiers(w, { ...persona, roof })
  clampMix(w, roof, warnings, hasPet)

  const lived = repairLived({ ...persona, roof })
  const premJump = persona.premJump || []
  const { estimate: wSliced, officialW } = applyPremiaSlices(w, lived, premJump)

  let wEstimate = wSliced
  let wOfficial = officialW
  let wSource = 'engine'
  if (overlay.w && typeof overlay.w === 'object') {
    wEstimate = applyShareOverlay(wSliced, overlay.w, roof, warnings, hasPet)
    wSource = 'user_overlay'
  }

  const piOfficial = officialPiVector()
  let piEstimate = estimatePiVector(piOfficial, lived, premJump, persona.who)
  let piSource = 'seeds'
  if (overlay.pi_i_estimate && typeof overlay.pi_i_estimate === 'object') {
    ACCOUNT_IDS.forEach((id) => {
      if (overlay.pi_i_estimate[id] === undefined) return
      piEstimate[id] = clampRate(overlay.pi_i_estimate[id], piEstimate[id])
    })
    piSource = 'user_rate_overlay'
  }

  return finish({
    persona: { ...persona, roof, lived, premJump },
    wEstimate,
    wOfficial,
    piOfficial,
    piEstimate,
    overlay,
    warnings,
    wSource,
    piSource,
  })
}

export const applyYourEstimate = (result) => {
  const prefs = useUserPreferencesStore.getState()
  prefs.setDefaultInflationRate(result?.pi_your_estimate)
  prefs.setAdjustInflation(true)
  const rate = useUserPreferencesStore.getState().defaultInflationRate
  useCorpusCalculatorStore.getState().updateSettings({ generalInflationRate: rate })
  const next = useUserPreferencesStore.getState()
  return {
    defaultInflationRate: next.defaultInflationRate,
    adjustInflation: next.adjustInflation,
  }
}

export const saveInflationRun = (run) => {
  const list = listInflationHistory()
  localStorage.setItem(HISTORY_KEY, JSON.stringify([run, ...list].slice(0, 10)))
}

export const listInflationHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
