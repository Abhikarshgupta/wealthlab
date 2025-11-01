import { create } from 'zustand'

const useGoalPlanningStore = create((set) => ({
  // Form data
  targetCorpus: 0,
  timeHorizon: 0,
  riskAppetite: null,
  currentSavings: 0,
  monthlySIP: 0,
  
  // Results
  recommendations: [],
  shortfall: null,
  projectedCorpus: 0,
  
  // Actions
  updateFormData: (data) => set((state) => ({ ...state, ...data })),
  setRecommendations: (recommendations) => set({ recommendations }),
  setShortfall: (shortfall) => set({ shortfall }),
  setProjectedCorpus: (corpus) => set({ projectedCorpus: corpus }),
  reset: () => set({
    targetCorpus: 0,
    timeHorizon: 0,
    riskAppetite: null,
    currentSavings: 0,
    monthlySIP: 0,
    recommendations: [],
    shortfall: null,
    projectedCorpus: 0,
  }),
}))

export default useGoalPlanningStore