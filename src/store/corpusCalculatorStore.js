import { create } from 'zustand'

// Load initial state from localStorage if available
const loadPersistedState = () => {
  try {
    const saved = localStorage.getItem('wealth-mngr-corpus-calculator-state')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading persisted state:', error)
  }
  return null
}

const defaultState = {
  selectedInstruments: [],
  investments: {},
  settings: {
    generalInflationRate: 6,
    taxMethod: 'withdrawal',
    timeHorizon: 10,
    selectedCity: 'mumbai',
    incomeTaxSlab: 0.30, // Default 30% tax slab (0.30 = 30%)
    inflationRates: {
      education: 10,
      healthcare: 8,
      realEstate: 7,
      luxuryGoods: 6,
      consumerGoodsWholesale: 4,
      consumerGoodsRetail: 5,
    },
  },
  results: null,
  purchasingPower: null,
  currentStep: 1,
}

const persistedState = loadPersistedState()
// Merge persisted state with defaults to ensure all required fields exist
const initialState = persistedState ? {
  ...persistedState,
  settings: {
    ...defaultState.settings, // Apply defaults first
    ...persistedState.settings, // Then override with persisted values
  },
} : defaultState

const useCorpusCalculatorStore = create((set, get) => ({
  // Step 1: Selected instruments
  selectedInstruments: initialState.selectedInstruments || [],
  
  // Step 2: Investment data for each selected instrument
  investments: initialState.investments || {},
  
  // Step 3: Settings and configuration
  settings: initialState.settings || defaultState.settings,
  
  // Step 4: Calculated results
  results: initialState.results,
  
  // Purchasing power analysis
  purchasingPower: initialState.purchasingPower,
  
  // Current step
  currentStep: initialState.currentStep,
  
  // Helper function to persist state
  persistState: () => {
    try {
      const state = get()
      const stateToSave = {
        selectedInstruments: state.selectedInstruments,
        investments: state.investments,
        settings: state.settings,
        currentStep: state.currentStep,
        // Don't persist results/purchasingPower to keep state lightweight
        // They'll be recalculated on load
      }
      localStorage.setItem('wealth-mngr-corpus-calculator-state', JSON.stringify(stateToSave))
    } catch (error) {
      console.error('Error persisting state:', error)
    }
  },
  
  // Actions
  setSelectedInstruments: (instruments) => {
    set({ selectedInstruments: instruments })
    get().persistState()
  },
  
  updateInvestment: (instrumentType, data) => {
    set((state) => ({
      investments: {
        ...state.investments,
        [instrumentType]: data
      }
    }))
    get().persistState()
  },
  
  updateSettings: (settings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    }))
    get().persistState()
  },
  
  updateInflationRate: (category, rate) => {
    set((state) => ({
      settings: {
        ...state.settings,
        inflationRates: {
          ...state.settings.inflationRates,
          [category]: rate,
        },
      },
    }))
    get().persistState()
  },
  
  setTaxMethod: (method) => {
    set((state) => ({
      settings: {
        ...state.settings,
        taxMethod: method,
      },
    }))
    get().persistState()
  },
  
  setSelectedCity: (city) => {
    set((state) => ({
      settings: {
        ...state.settings,
        selectedCity: city,
      },
    }))
    get().persistState()
  },
  
  setTimeHorizon: (years) => {
    set((state) => ({
      settings: {
        ...state.settings,
        timeHorizon: years,
      },
    }))
    get().persistState()
  },
  
  setResults: (results) => set({ results }),
  
  setPurchasingPower: (purchasingPower) => set({ purchasingPower }),
  
  setCurrentStep: (step) => {
    set({ currentStep: step })
    get().persistState()
  },
  
  // Load a saved calculation
  loadCalculation: (calculationData) => {
    set({
      selectedInstruments: calculationData.selectedInstruments || [],
      investments: calculationData.investments || {},
      settings: calculationData.settings || defaultState.settings,
      currentStep: calculationData.currentStep || 1,
      results: calculationData.results || null,
      purchasingPower: calculationData.purchasingPower || null,
    })
    get().persistState()
  },
  
  reset: () => {
    set(defaultState)
    try {
      localStorage.removeItem('wealth-mngr-corpus-calculator-state')
    } catch (error) {
      console.error('Error clearing persisted state:', error)
    }
  },
}))

export default useCorpusCalculatorStore