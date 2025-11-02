import { create } from 'zustand'
import { DEFAULT_INFLATION_RATES } from '@/constants/inflationRates'

const useUserPreferencesStore = create((set) => ({
  // Global preferences
  defaultInflationRate: 6, // Default 6% as per RBI data
  currencyFormat: 'INR',
  numberFormat: 'en-IN', // Indian number format
  
  // Category-specific inflation rates (as percentages)
  educationInflationRate: DEFAULT_INFLATION_RATES.education,
  healthcareInflationRate: DEFAULT_INFLATION_RATES.healthcare,
  realEstateInflationRate: DEFAULT_INFLATION_RATES.realEstate,
  luxuryGoodsInflationRate: DEFAULT_INFLATION_RATES.luxuryGoods,
  consumerGoodsWholesaleRate: DEFAULT_INFLATION_RATES.consumerGoodsWholesale,
  consumerGoodsRetailRate: DEFAULT_INFLATION_RATES.consumerGoodsRetail,
  
  // Actions
  setDefaultInflationRate: (rate) => set({ defaultInflationRate: rate }),
  setCurrencyFormat: (format) => set({ currencyFormat: format }),
  setNumberFormat: (format) => set({ numberFormat: format }),
  
  // Category-specific inflation rate actions
  setEducationInflationRate: (rate) => set({ educationInflationRate: rate }),
  setHealthcareInflationRate: (rate) => set({ healthcareInflationRate: rate }),
  setRealEstateInflationRate: (rate) => set({ realEstateInflationRate: rate }),
  setLuxuryGoodsInflationRate: (rate) => set({ luxuryGoodsInflationRate: rate }),
  setConsumerGoodsWholesaleRate: (rate) => set({ consumerGoodsWholesaleRate: rate }),
  setConsumerGoodsRetailRate: (rate) => set({ consumerGoodsRetailRate: rate }),
  
  // Reset all category rates to defaults
  resetCategoryInflationRates: () => set({
    educationInflationRate: DEFAULT_INFLATION_RATES.education,
    healthcareInflationRate: DEFAULT_INFLATION_RATES.healthcare,
    realEstateInflationRate: DEFAULT_INFLATION_RATES.realEstate,
    luxuryGoodsInflationRate: DEFAULT_INFLATION_RATES.luxuryGoods,
    consumerGoodsWholesaleRate: DEFAULT_INFLATION_RATES.consumerGoodsWholesale,
    consumerGoodsRetailRate: DEFAULT_INFLATION_RATES.consumerGoodsRetail,
  }),
}))

export default useUserPreferencesStore