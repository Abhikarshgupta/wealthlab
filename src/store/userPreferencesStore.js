import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_INFLATION_RATES } from '@/constants/inflationRates'

const useUserPreferencesStore = create(
  persist(
    (set, get) => ({
      // Global preferences
      defaultInflationRate: 6, // Default 6% as per RBI data
      currencyFormat: 'INR',
      numberFormat: 'en-IN', // Indian number format

      // Global inflation adjustment toggle
      adjustInflation: false, // Default OFF

      // Usage tracking for inflation toggle
      inflationToggleClicks: 0,
      inflationOverlayDismissed: false,
      lastInflationRateChange: null,

      // Global income tax slab (as decimal, e.g., 0.30 for 30%)
      incomeTaxSlab: 0.30, // Default 30% slab

      // Category-specific inflation rates (as percentages)
      educationInflationRate: DEFAULT_INFLATION_RATES.education,
      healthcareInflationRate: DEFAULT_INFLATION_RATES.healthcare,
      realEstateInflationRate: DEFAULT_INFLATION_RATES.realEstate,
      luxuryGoodsInflationRate: DEFAULT_INFLATION_RATES.luxuryGoods,
      consumerGoodsWholesaleRate: DEFAULT_INFLATION_RATES.consumerGoodsWholesale,
      consumerGoodsRetailRate: DEFAULT_INFLATION_RATES.consumerGoodsRetail,

      // Actions
      setDefaultInflationRate: (rate) => {
        set({ defaultInflationRate: rate, lastInflationRateChange: Date.now() })
      },
      setCurrencyFormat: (format) => set({ currencyFormat: format }),
      setNumberFormat: (format) => set({ numberFormat: format }),

      // Inflation toggle actions
      setAdjustInflation: (enabled) => {
        const currentClicks = get().inflationToggleClicks
        set({
          adjustInflation: enabled,
          inflationToggleClicks: currentClicks + 1,
        })
      },
      setInflationOverlayDismissed: (dismissed) =>
        set({ inflationOverlayDismissed: dismissed }),

      // Tax slab actions
      setIncomeTaxSlab: (slab) => set({ incomeTaxSlab: slab }),

      // Category-specific inflation rate actions
      setEducationInflationRate: (rate) => set({ educationInflationRate: rate }),
      setHealthcareInflationRate: (rate) => set({ healthcareInflationRate: rate }),
      setRealEstateInflationRate: (rate) => set({ realEstateInflationRate: rate }),
      setLuxuryGoodsInflationRate: (rate) => set({ luxuryGoodsInflationRate: rate }),
      setConsumerGoodsWholesaleRate: (rate) =>
        set({ consumerGoodsWholesaleRate: rate }),
      setConsumerGoodsRetailRate: (rate) => set({ consumerGoodsRetailRate: rate }),

      // Reset all category rates to defaults
      resetCategoryInflationRates: () =>
        set({
          educationInflationRate: DEFAULT_INFLATION_RATES.education,
          healthcareInflationRate: DEFAULT_INFLATION_RATES.healthcare,
          realEstateInflationRate: DEFAULT_INFLATION_RATES.realEstate,
          luxuryGoodsInflationRate: DEFAULT_INFLATION_RATES.luxuryGoods,
          consumerGoodsWholesaleRate: DEFAULT_INFLATION_RATES.consumerGoodsWholesale,
          consumerGoodsRetailRate: DEFAULT_INFLATION_RATES.consumerGoodsRetail,
        }),
    }),
    {
      name: 'user-preferences-storage',
      partialize: (state) => ({
        defaultInflationRate: state.defaultInflationRate,
        adjustInflation: state.adjustInflation,
        inflationToggleClicks: state.inflationToggleClicks,
        inflationOverlayDismissed: state.inflationOverlayDismissed,
        lastInflationRateChange: state.lastInflationRateChange,
        incomeTaxSlab: state.incomeTaxSlab,
      }),
    }
  )
)

export default useUserPreferencesStore