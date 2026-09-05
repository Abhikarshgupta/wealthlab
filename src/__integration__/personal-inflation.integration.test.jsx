/**

 * Personal inflation — routes, interview nav, persist round-trip, results/apply (RED).

 */



import { describe, it, expect, beforeEach } from 'vitest'

import { render, screen, waitFor, within } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { MemoryRouter, Route, Routes } from 'react-router-dom'

import React from 'react'

import PersonalInflationPage from '@/pages/PersonalInflationPage/PersonalInflationPage'

import Home from '@/pages/Home/Home'

import Header from '@/components/common/Layout/Header'

import { ThemeProvider } from '@/contexts/ThemeContext'

import { routes } from '@/routes/routes'

import usePersonalInflationStore from '@/store/personalInflationStore'

import useUserPreferencesStore from '@/store/userPreferencesStore'

import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'

import { PI_STORAGE_KEY, PI_HISTORY_KEY } from '../../tests/fixtures/personal-inflation/ledger.js'

import { loadPiEngine } from '../../tests/fixtures/personal-inflation/loadEngine.js'

import goldenCases from '../../tests/fixtures/golden/personal-inflation.json'

import { renderWithProviders, resetUserPreferences } from '@/test/utils/testHelpers'

import { getUnlockedBeats } from '@/utils/personalInflationBeats'



const wrap = (ui, path = routes.personalInflation) =>

  render(

    <MemoryRouter initialEntries={[path]}>

      <ThemeProvider>

        <Routes>

          <Route path={routes.personalInflation} element={<PersonalInflationPage />} />

          <Route path="/" element={<Home />} />

          <Route path={routes.calculators.sip} element={<div>SIP page</div>} />

        </Routes>

      </ThemeProvider>

    </MemoryRouter>

  )



const resetPi = () => {

  localStorage.removeItem(PI_STORAGE_KEY)

  localStorage.removeItem(PI_HISTORY_KEY)

  usePersonalInflationStore.getState().reset()

}



const seedCompletedInterview = (goldenId = 'PI-23') => {

  const row = goldenCases.find((item) => item.id === goldenId)

  const inputs = row.inputs.ref ? goldenCases.find((i) => i.id === row.inputs.ref).inputs : row.inputs

  const care =

    inputs.care === 'public_esi'

      ? 'care_public_esi'

      : inputs.care === 'private'

        ? 'care_private'

        : inputs.care

  usePersonalInflationStore.setState({

    currentStep: 4,

    completedThrough: 3,

    answers: {

      geo: inputs.geo,

      roof: inputs.roof,

      who: inputs.who,

      commute: inputs.commute,

      dining: inputs.dining,

      cam: inputs.cam,

      care,

      premRetail: inputs.premRetail,

      premJump: inputs.premJump || [],

      lived: inputs.lived,

    },

  })

}



const pickCity = async (user, cityLabel) => {

  await user.type(screen.getByLabelText(/which city do you live in/i), cityLabel)

  await user.click(await screen.findByRole('button', { name: new RegExp(cityLabel, 'i') }))

}



describe('personal inflation system integration', () => {

  beforeEach(() => {

    resetPi()

    resetUserPreferences()

  })



  it('PI-01: /personal-inflation loads the interview stepper', () => {

    wrap(<PersonalInflationPage />)

    expect(screen.getByRole('heading', { name: /what’s my inflation/i })).toBeInTheDocument()

    expect(screen.getByLabelText(/step 1: place/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/step 4: your number/i)).toBeInTheDocument()

  })



  it('PI-02: personal inflation route is /personal-inflation (home CTA covered in Gherkin)', () => {

    expect(routes.personalInflation).toBe('/personal-inflation')

  })



  it('PI-SYS-06: header My inflation uses the personal-inflation route', () => {

    renderWithProviders(<Header />)

    expect(screen.getByRole('link', { name: /my inflation/i })).toHaveAttribute(

      'href',

      routes.personalInflation

    )

  })



  it('PI-05 / PI-12: results step stays blocked until chapters 1–3 are valid', async () => {

    wrap(<PersonalInflationPage />)

    expect(screen.getByLabelText(/step 4: your number/i)).toBeDisabled()

    expect(screen.queryByRole('button', { name: /use .* in calculators/i })).not.toBeInTheDocument()

  })



  it('PI-05: first missing field shows helper text not a modal', async () => {

    const user = userEvent.setup()

    wrap(<PersonalInflationPage />)

    expect(screen.getByText(/pick a city/i)).toBeInTheDocument()

    await pickCity(user, 'Bengaluru')

    await user.click(screen.getByRole('button', { name: /continue to household/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    expect(screen.getAllByText(/do you pay rent/i).length).toBeGreaterThan(0)

  })



  it('PI-06: chapters 1–3 have no range sliders and no rupee inputs', async () => {

    const user = userEvent.setup()

    wrap(<PersonalInflationPage />)

    const assertNoSlidersOrRupees = () => {

      expect(document.querySelectorAll('input[type="range"]').length).toBe(0)

      expect(document.querySelectorAll('input[inputmode="numeric"]').length).toBe(0)

      expect(screen.queryByLabelText(/tier/i)).not.toBeInTheDocument()

    }

    assertNoSlidersOrRupees()

    await pickCity(user, 'Bengaluru')

    await user.click(screen.getByRole('button', { name: /continue to household/i }))

    assertNoSlidersOrRupees()

    await user.click(screen.getByRole('radio', { name: /do you pay rent\? no$/i }))

    await user.click(screen.getByRole('radio', { name: /get around\? mix$/i }))

    await user.click(screen.getByRole('radio', { name: /mostly cook at home/i }))

    await user.click(screen.getByRole('radio', { name: /society or maintenance\? no$/i }))

    await user.click(screen.getByRole('button', { name: /continue to bills/i }))

    assertNoSlidersOrRupees()

    await user.click(screen.getByRole('radio', { name: /where do you usually get treated\? public$/i }))

    await user.click(screen.getByRole('radio', { name: /health policy you pay for\? no$/i }))

    assertNoSlidersOrRupees()

  })



  it('PI-07: EMI option shows repayment helper copy', async () => {

    const user = userEvent.setup()

    wrap(<PersonalInflationPage />)

    await pickCity(user, 'Bengaluru')

    await user.click(screen.getByRole('button', { name: /continue to household/i }))

    expect(screen.getByText(/EMI is loan repayment, not a price/i)).toBeInTheDocument()

  })



  it('PI-04: unlisted city uses state/UT select', async () => {

    const user = userEvent.setup()

    wrap(<PersonalInflationPage />)

    await user.click(screen.getByRole('button', { name: /my city isn’t listed/i }))

    await user.selectOptions(screen.getByLabelText(/which state or ut/i), 'Assam')

    expect(screen.getByText(/We use Assam urban prices/i)).toBeInTheDocument()

  })



  it('PI-08: school chips are exclusive in the UI', async () => {

    const user = userEvent.setup()

    wrap(<PersonalInflationPage />)

    await pickCity(user, 'Bengaluru')

    await user.click(screen.getByRole('button', { name: /continue to household/i }))

    const one = screen.getByRole('button', { name: /one school-age child/i })

    const two = screen.getByRole('button', { name: /two or more school-age children/i })

    await user.click(one)

    await user.click(two)

    expect(one).toHaveAttribute('aria-pressed', 'false')

    expect(two).toHaveAttribute('aria-pressed', 'true')

  })



  it('PI-09: quiet path Chapter 3 shows only care and prem beats', async () => {

    const user = userEvent.setup()

    wrap(<PersonalInflationPage />)

    await pickCity(user, 'Bengaluru')

    await user.click(screen.getByRole('button', { name: /continue to household/i }))

    await user.click(screen.getByRole('radio', { name: /do you pay rent\? no$/i }))

    await user.click(screen.getByRole('radio', { name: /get around\? mix$/i }))

    await user.click(screen.getByRole('radio', { name: /mostly cook at home/i }))

    await user.click(screen.getByRole('radio', { name: /society or maintenance\? no$/i }))

    await user.click(screen.getByRole('button', { name: /continue to bills/i }))

    const beats = getUnlockedBeats(usePersonalInflationStore.getState().answers).map((b) => b.id)

    expect(beats).toEqual(['care', 'prem'])

    expect(screen.queryByText(/did rent jump/i)).not.toBeInTheDocument()

    expect(screen.queryByText(/did school fees jump/i)).not.toBeInTheDocument()

  })



  it('PI-10: loaded household unlocks matching Chapter 3 beats in UI', async () => {

    const user = userEvent.setup()

    wrap(<PersonalInflationPage />)

    await pickCity(user, 'Bengaluru')

    await user.click(screen.getByRole('button', { name: /continue to household/i }))

    await user.click(screen.getByRole('radio', { name: /^do you pay rent\? yes$/i }))

    await user.click(screen.getByRole('button', { name: /one school-age child/i }))

    await user.click(screen.getByRole('button', { name: /^a pet$/i }))

    await user.click(screen.getByRole('radio', { name: /get around\? car$/i }))

    await user.click(screen.getByRole('radio', { name: /mostly cook at home/i }))

    await user.click(screen.getByRole('radio', { name: /society or maintenance\? yes$/i }))

    await user.click(screen.getByRole('button', { name: /continue to bills/i }))

    expect(screen.getByText(/did rent jump this year/i)).toBeInTheDocument()

    expect(screen.getByText(/did school fees jump this year/i)).toBeInTheDocument()

    expect(screen.getByText(/did pet costs jump this year/i)).toBeInTheDocument()

    expect(screen.getByText(/did car insurance jump this year/i)).toBeInTheDocument()

  })



  it('PI-SYS-07: leaving the route and returning keeps persisted answers', async () => {

    const user = userEvent.setup()

    const { unmount } = wrap(<PersonalInflationPage />)

    await pickCity(user, 'Chennai')

    unmount()

    wrap(<PersonalInflationPage />, '/')

    await user.click(screen.getAllByRole('link', { name: /what’s my inflation/i })[0])

    expect(screen.getAllByText(/We use Tamil Nadu urban prices/i).length).toBeGreaterThan(0)

    expect(usePersonalInflationStore.getState().answers.geo.cityId).toBe('chennai')

  })



  it('PI-66: start over from results resets to chapter 1', async () => {

    const user = userEvent.setup()

    seedCompletedInterview()

    wrap(<PersonalInflationPage />)

    await user.click(screen.getByRole('button', { name: /start over/i }))

    expect(screen.getByLabelText(/which city do you live in/i)).toBeInTheDocument()

    expect(usePersonalInflationStore.getState().currentStep).toBe(1)

    expect(usePersonalInflationStore.getState().answers.geo.cityId).toBeNull()

  })



  it('PI-68: results shell uses single column max-w-2xl with independent drawers', () => {

    seedCompletedInterview()

    const { container } = wrap(<PersonalInflationPage />)

    expect(container.querySelector('.max-w-2xl')).toBeTruthy()

    const sipDrawer = screen.getByText(/corpus projection/i).closest('details')

    const billsDrawer = screen.getByText(/change this/i).closest('details')

    expect(sipDrawer?.open).toBe(false)

    expect(billsDrawer?.open).toBe(false)

    expect(screen.getByText(/did your raise keep up/i).closest('details')?.open).toBe(true)

  })



  it('PI-60: results hero shows your inflation at 1 decimal from golden PI-23', async () => {

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    const row = goldenCases.find((item) => item.id === 'PI-23')

    expect(screen.getByTestId('pi-published-rate')).toHaveTextContent('4.5%')

    expect(screen.getByText(`${row.expected.display}%`)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: new RegExp(`use ${row.expected.display}%`, 'i') })).toBeEnabled()

  })



  it('PI-61: published vs your inflation; mix table names A, B, and I = A × (B / 100)', async () => {

    const user = userEvent.setup()

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    expect(screen.getByTestId('pi-published-rate')).toHaveTextContent('4.5%')

    expect(screen.getByTestId('pi-hero-rate')).toHaveTextContent('6.7%')

    expect(screen.queryByText(/loud bill/i)).not.toBeInTheDocument()

    expect(screen.queryByTestId('pi-published-info')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /know more about published inflation/i }))

    expect(screen.getByTestId('pi-published-info')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /cpi press note/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/pib\.gov\.in/i)
    )

    await user.click(screen.getByText(/change this 6\.7%/i))

    expect(screen.getByTestId('pi-mix-formula')).toHaveTextContent('I = A × (B / 100)')

    expect(screen.getByTestId('pi-col-a')).toBeInTheDocument()

    expect(screen.getByTestId('pi-col-b')).toBeInTheDocument()

  })



  it('PI-62: raise drawer is hike minus hero inflation (12 − 6.6 = +5.4)', async () => {

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    const hike = screen.getByLabelText(/salary increase|what the letter/i)

    await userEvent.clear(hike)

    await userEvent.type(hike, '12')

    expect(screen.getByTestId('pi-real-raise')).toHaveTextContent(/raise bigger than your inflation by 5\.3%/i)

    expect(screen.getByTestId('pi-hero-rate')).toHaveTextContent('6.7%')

  })



  it('PI-63: after tax uses hike times one minus this year’s slab', async () => {

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    const hike = screen.getByLabelText(/salary increase|what the letter/i)

    await userEvent.clear(hike)

    await userEvent.type(hike, '12')

    await userEvent.click(screen.getByRole('button', { name: /^after tax$/i }))

    await userEvent.click(screen.getByRole('radio', { name: /tax slab 30%/i }))

    expect(screen.getByTestId('pi-real-raise-after-tax')).toHaveTextContent(
      /raise bigger than your inflation by 1\.7%/i
    )

    await userEvent.click(screen.getByRole('button', { name: /how we calculated this/i }))

    expect(screen.getByTestId('pi-after-tax-math')).toHaveTextContent('12.0% × (1 − 30%) = 8.4%')

  })



  it('PI-64: SIP graph is not in the document until that drawer opens', async () => {

    const user = userEvent.setup()

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    expect(screen.queryByTestId('pi-sip-graph')).not.toBeInTheDocument()

    expect(screen.queryByRole('link', { name: /open sip calculator/i })).not.toBeInTheDocument()

    await user.click(screen.getByText(/corpus projection/i))

    expect(screen.getByTestId('pi-sip-graph')).toBeInTheDocument()

    expect(screen.getByRole('img', { name: /corpus projection/i })).toBeInTheDocument()

    expect(screen.getByText(/12% assumed return/i)).toBeInTheDocument()

    expect(screen.queryByRole('link', { name: /open sip calculator/i })).not.toBeInTheDocument()

    expect(screen.getByTestId('pi-sip-your-end').textContent).toMatch(/₹/)

    const yourBefore = screen.getByTestId('pi-sip-your-end').textContent

    const hike = screen.getByLabelText(/salary increase|what the letter/i)

    await user.type(hike, '12')

    expect(screen.getByTestId('pi-hero-rate')).toHaveTextContent('6.7%')

    expect(screen.getByTestId('pi-sip-your-end').textContent).toBe(yourBefore)

    await user.click(screen.getByText(/change this/i))

    const rentRise = screen.getByLabelText(/rent.*went up/i)

    await user.clear(rentRise)

    await user.type(rentRise, '40')

    await user.tab()

    expect(screen.getByTestId('pi-sip-your-end').textContent).not.toBe(yourBefore)

  })



  it('PI-65: rent bill row only for renters', async () => {

    const user = userEvent.setup()

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    await user.click(screen.getByText(/change this/i))

    expect(screen.getByText(/^rent$/i)).toBeInTheDocument()



    resetPi()

    seedCompletedInterview('PI-20')

    wrap(<PersonalInflationPage />)

    await user.click(screen.getAllByText(/change this/i).at(-1))

    expect(screen.queryByText(/^rent$/i)).not.toBeInTheDocument()

  })



  it('PI-80: apply button writes estimate into preferences (no manual apply helper)', async () => {

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    const row = goldenCases.find((item) => item.id === 'PI-23')

    await userEvent.click(

      screen.getByRole('button', { name: new RegExp(`use ${row.expected.display}%`, 'i') })

    )

    await waitFor(() => {

      expect(useUserPreferencesStore.getState().adjustInflation).toBe(true)

      expect(useUserPreferencesStore.getState().defaultInflationRate).toBe(6.7)

      expect(useCorpusCalculatorStore.getState().settings.generalInflationRate).toBe(6.7)

    })

    expect(screen.getByTestId('pi-apply-toast')).toHaveTextContent(/using 6\.7% in calculators/i)

  })



  it('PI-81: finishing the interview without apply leaves the 6% planning default', () => {

    seedCompletedInterview()

    wrap(<PersonalInflationPage />)

    expect(useUserPreferencesStore.getState().defaultInflationRate).toBe(6)

    expect(useUserPreferencesStore.getState().adjustInflation).toBe(false)

  })



  it('PI-82: apply does not write CII / DA / Residex keys to preferences storage', async () => {

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    await userEvent.click(screen.getByRole('button', { name: /use .* in calculators/i }))

    const raw = localStorage.getItem('user-preferences-storage') || ''

    expect(raw).not.toMatch(/cii|residex|daRate/i)

  })



  it('PI-83: completing a run can persist under the history key', async () => {

    const { saveInflationRun, listInflationHistory } = await loadPiEngine()

    seedCompletedInterview('PI-23')

    wrap(<PersonalInflationPage />)

    const row = goldenCases.find((item) => item.id === 'PI-23')

    saveInflationRun({ pi_your_estimate: row.expected.pi_your_estimate, vintage: { month: '2026-07' } })

    expect(listInflationHistory()).toHaveLength(1)

    expect(JSON.parse(localStorage.getItem(PI_HISTORY_KEY)).length).toBeLessThanOrEqual(10)

  })

})


