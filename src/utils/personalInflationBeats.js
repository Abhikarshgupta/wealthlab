/**
 * Chapter 3 beats unlocked from Chapter 2 (questionnaire PRD §8–9).
 */

export const isRenterRoof = (roof) => roof === 'rent' || roof === 'rent_and_emi'

export const getUnlockedBeats = (answers) => {
  const who = answers.who || {}
  const beats = [{ id: 'care' }, { id: 'prem' }]

  if (answers.premRetail) {
    beats.push({ id: 'premWho' })
  }
  if (isRenterRoof(answers.roof)) {
    beats.push({ id: 'lease' })
  }
  if (answers.cam === 'yes') {
    beats.push({ id: 'cam' })
  }
  if (who.school === '1' || who.school === '2plus') {
    beats.push({ id: 'school' })
  }
  if (who.coaching) {
    beats.push({ id: 'coach' })
  }
  if (who.elder) {
    beats.push({ id: 'elder' })
  }
  if (who.help) {
    beats.push({ id: 'help' })
  }
  if (who.pet) {
    beats.push({ id: 'pet' })
  }
  if (answers.commute === 'car') {
    beats.push({ id: 'motor' })
  }

  return beats
}

export const getPremWhoRoles = (answers) => {
  const who = answers.who || {}
  const roles = [{ id: 'self', label: 'Mine' }]
  if (who.school === '1' || who.school === '2plus' || who.coaching) {
    roles.push({ id: 'child', label: 'A child’s' })
  }
  if (who.elder) {
    roles.push({ id: 'elder', label: 'An elder’s' })
  }
  return roles
}

export const isChapter1Valid = (answers) =>
  Boolean(answers.geo?.cityId || answers.geo?.stateUt)

export const isChapter2Valid = (answers) =>
  Boolean(answers.roof && answers.commute && answers.dining && answers.cam)

export const isChapter3Valid = (answers) => {
  const lived = answers.lived || {}
  if (!answers.care || answers.premRetail === null || answers.premRetail === undefined) {
    return false
  }
  if (answers.premRetail && !Array.isArray(answers.premJump)) {
    return false
  }

  const beats = getUnlockedBeats(answers)
  for (const beat of beats) {
    if (beat.id === 'care' || beat.id === 'prem' || beat.id === 'premWho') continue
    const key = {
      lease: 'rent',
      cam: 'cam',
      school: 'schoolFees',
      coach: 'coachingFees',
      elder: 'elderCare',
      help: 'helpCosts',
      pet: 'petCosts',
      motor: 'motorPrem',
    }[beat.id]
    if (key && lived[key] == null) return false
  }
  return true
}

export const chapterValidationErrors = (step, answers) => {
  if (step === 1 && !isChapter1Valid(answers)) {
    return ['Pick a city, or a state if yours is not listed.']
  }
  if (step === 2) {
    const errors = []
    if (!answers.roof) errors.push('Do you pay rent?')
    if (!answers.commute) errors.push('How you get around.')
    if (!answers.dining) errors.push('Eating out.')
    if (!answers.cam) errors.push('Society or maintenance charges.')
    return errors
  }
  if (step === 3 && !isChapter3Valid(answers)) {
    return ['Answer each bill on this page — Yes or No.']
  }
  return []
}

export const toPersona = (answers) => {
  const who = answers.who || {}
  return {
    geo: {
      cityId: answers.geo?.cityId || null,
      stateUt: answers.geo?.stateUt || null,
    },
    roof: answers.roof,
    who: {
      school: who.school || 'none',
      coaching: Boolean(who.coaching),
      elder: Boolean(who.elder),
      help: Boolean(who.help),
      pet: Boolean(who.pet),
    },
    commute: answers.commute,
    dining: answers.dining,
    cam: answers.cam,
    care:
      answers.care === 'care_public_esi' || answers.care === 'public_esi'
        ? 'public_esi'
        : answers.care === 'care_private' || answers.care === 'private'
          ? 'private'
          : null,
    premRetail: Boolean(answers.premRetail),
    premJump: answers.premJump || [],
    lived: { ...answers.lived },
  }
}
