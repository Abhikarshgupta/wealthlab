import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getInflationCity } from '@/constants/personalInflationGeo'

const emptyLived = {
  rent: null,
  cam: null,
  schoolFees: null,
  coachingFees: null,
  elderCare: null,
  helpCosts: null,
  petCosts: null,
  motorPrem: null,
}

const defaultAnswers = {
  geo: { cityId: null, stateUt: null },
  roof: null,
  who: {
    school: 'none',
    coaching: false,
    elder: false,
    help: false,
    pet: false,
  },
  commute: null,
  dining: null,
  cam: null,
  care: null,
  premRetail: null,
  premJump: [],
  lived: { ...emptyLived },
}

const usePersonalInflationStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,
      answers: defaultAnswers,
      completedThrough: 0,
      overlay: {},
      setOverlay: (overlay) => set({ overlay: { ...get().overlay, ...overlay } }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setCity: (cityId) => {
        if (!cityId) {
          set({
            answers: {
              ...get().answers,
              geo: { cityId: null, stateUt: null },
            },
          })
          return
        }
        const city = getInflationCity(cityId)
        if (!city) return
        set({
          answers: {
            ...get().answers,
            geo: { cityId: city.id, stateUt: city.stateUt },
          },
        })
      },

      setStateUt: (stateUt) => {
        set({
          answers: {
            ...get().answers,
            geo: { cityId: null, stateUt },
          },
        })
      },

      setRoof: (roof) => {
        const answers = get().answers
        const lived = { ...answers.lived }
        if (roof !== 'rent' && roof !== 'rent_and_emi') lived.rent = null
        set({ answers: { ...answers, roof, lived } })
      },

      toggleWho: (id) => {
        const who = { ...get().answers.who }
        const lived = { ...get().answers.lived }

        if (id === 'school_1') {
          who.school = who.school === '1' ? 'none' : '1'
        } else if (id === 'school_2plus') {
          who.school = who.school === '2plus' ? 'none' : '2plus'
        } else if (id === 'coaching_or_college') {
          who.coaching = !who.coaching
        } else if (id === 'elder_in_care') {
          who.elder = !who.elder
        } else if (id === 'help_paid') {
          who.help = !who.help
        } else if (id === 'pet') {
          who.pet = !who.pet
        }

        if (who.school === 'none') lived.schoolFees = null
        if (!who.coaching) lived.coachingFees = null
        if (!who.elder) lived.elderCare = null
        if (!who.help) lived.helpCosts = null
        if (!who.pet) lived.petCosts = null

        let premJump = [...(get().answers.premJump || [])]
        if (who.school === 'none' && !who.coaching) {
          premJump = premJump.filter((role) => role !== 'child')
        }
        if (!who.elder) {
          premJump = premJump.filter((role) => role !== 'elder')
        }

        set({ answers: { ...get().answers, who, lived, premJump } })
      },

      setCommute: (commute) => {
        const lived = { ...get().answers.lived }
        if (commute !== 'car') lived.motorPrem = null
        set({ answers: { ...get().answers, commute, lived } })
      },

      setDining: (dining) => set({ answers: { ...get().answers, dining } }),

      setCam: (cam) => {
        const lived = { ...get().answers.lived }
        if (cam !== 'yes') lived.cam = null
        set({ answers: { ...get().answers, cam, lived } })
      },

      setCare: (care) => set({ answers: { ...get().answers, care } }),

      setPremRetail: (premRetail) => {
        set({
          answers: {
            ...get().answers,
            premRetail,
            premJump: premRetail ? get().answers.premJump : [],
          },
        })
      },

      togglePremJump: (role) => {
        const current = get().answers.premJump || []
        const next = current.includes(role)
          ? current.filter((item) => item !== role)
          : [...current, role]
        set({ answers: { ...get().answers, premJump: next } })
      },

      clearPremJump: () => set({ answers: { ...get().answers, premJump: [] } }),

      setLived: (key, value) => {
        set({
          answers: {
            ...get().answers,
            lived: { ...get().answers.lived, [key]: value },
          },
        })
      },

      markChapterComplete: (chapter) => {
        const through = get().completedThrough
        if (chapter > through) set({ completedThrough: chapter })
      },

      reset: () =>
        set({
          currentStep: 1,
          answers: {
            ...defaultAnswers,
            who: { ...defaultAnswers.who },
            lived: { ...emptyLived },
            geo: { cityId: null, stateUt: null },
            premJump: [],
          },
          completedThrough: 0,
          overlay: {},
        }),
    }),
    {
      name: 'wealthlab-personal-inflation',
      partialize: (state) => ({
        currentStep: state.currentStep,
        answers: state.answers,
        completedThrough: state.completedThrough,
      }),
    }
  )
)

export default usePersonalInflationStore
