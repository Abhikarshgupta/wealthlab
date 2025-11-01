import { create } from 'zustand'

const useCorpusCalculatorStore = create((set) => ({
  // Step 1: Selected instruments
  selectedInstruments: [],
  
  // Step 2: Investment data for each selected instrument
  investments: {},
  
  // Step 3: Calculated results
  results: null,
  
  // Current step
  currentStep: 1,
  
  // Actions
  setSelectedInstruments: (instruments) => set({ selectedInstruments: instruments }),
  updateInvestment: (instrumentType, data) => set((state) => ({
    investments: {
      ...state.investments,
      [instrumentType]: data
    }
  })),
  setResults: (results) => set({ results }),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set({
    selectedInstruments: [],
    investments: {},
    results: null,
    currentStep: 1,
  }),
}))

export default useCorpusCalculatorStore