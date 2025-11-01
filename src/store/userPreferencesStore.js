import { create } from 'zustand'

const useUserPreferencesStore = create((set) => ({
  // Global preferences
  defaultInflationRate: 6, // Default 6% as per RBI data
  currencyFormat: 'INR',
  numberFormat: 'en-IN', // Indian number format
  
  // Actions
  setDefaultInflationRate: (rate) => set({ defaultInflationRate: rate }),
  setCurrencyFormat: (format) => set({ currencyFormat: format }),
  setNumberFormat: (format) => set({ numberFormat: format }),
}))

export default useUserPreferencesStore