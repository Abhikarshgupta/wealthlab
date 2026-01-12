import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getInstrumentDefaults, initializeDefaultsForInstruments, needsDefaultInitialization } from './corpusDefaults'
import { investmentRates } from '@/constants/investmentRates'

describe('corpusDefaults', () => {
  describe('needsDefaultInitialization', () => {
    it('should return true for FD when tenureYears/tenureMonths are missing', () => {
      const data = { principal: 100000, rate: 6.5 }
      expect(needsDefaultInitialization('fd', data)).toBe(true)
    })

    it('should return false for FD when all required fields exist', () => {
      const data = { principal: 100000, tenureYears: 1, tenureMonths: 0, rate: 6.5 }
      expect(needsDefaultInitialization('fd', data)).toBe(false)
    })

    it('should return false for FD when legacy tenure format exists', () => {
      const data = { principal: 100000, tenure: 1, tenureUnit: 'years', rate: 6.5 }
      expect(needsDefaultInitialization('fd', data)).toBe(false)
    })

    it('should return true for SIP when tenureUnit is missing', () => {
      const data = { monthlySIP: 5000, tenure: 10, expectedReturn: 12 }
      expect(needsDefaultInitialization('sip', data)).toBe(true)
    })

    it('should return false for SIP when all required fields exist', () => {
      const data = { monthlySIP: 5000, tenure: 10, tenureUnit: 'years', expectedReturn: 12 }
      expect(needsDefaultInitialization('sip', data)).toBe(false)
    })
  })

  describe('getInstrumentDefaults', () => {
    describe('PPF', () => {
      it('should return default values for PPF when no existing data', () => {
        const defaults = getInstrumentDefaults('ppf', {})
        
        expect(defaults).toHaveProperty('yearlyInvestment', 10000)
        expect(defaults).toHaveProperty('tenure', 15)
        expect(defaults).toHaveProperty('rate', investmentRates.ppf?.rate || 7.1)
      })

      it('should not override existing values', () => {
        const existingData = {
          yearlyInvestment: 50000,
          tenure: 10,
          rate: 8.0
        }
        const defaults = getInstrumentDefaults('ppf', existingData)
        
        expect(defaults).not.toHaveProperty('yearlyInvestment')
        expect(defaults).not.toHaveProperty('tenure')
        expect(defaults).not.toHaveProperty('rate')
      })

      it('should set tenure to 15 years for PPF', () => {
        const defaults = getInstrumentDefaults('ppf', {})
        expect(defaults.tenure).toBe(15)
      })
    })

    describe('SSY', () => {
      it('should return default values for SSY when no existing data', () => {
        const defaults = getInstrumentDefaults('ssy', {})
        
        expect(defaults).toHaveProperty('yearlyInvestment', 10000)
        expect(defaults).toHaveProperty('tenure', 21)
        expect(defaults).toHaveProperty('rate', investmentRates.ssy?.rate || 7.1)
      })

      it('should set tenure to 21 years for SSY', () => {
        const defaults = getInstrumentDefaults('ssy', {})
        expect(defaults.tenure).toBe(21)
      })
    })

    describe('FD', () => {
      it('should return default values for FD when no existing data', () => {
        const defaults = getInstrumentDefaults('fd', {})
        
        expect(defaults).toHaveProperty('principal', 100000)
        expect(defaults).toHaveProperty('tenureYears', 1)
        expect(defaults).toHaveProperty('tenureMonths', 0)
        expect(defaults).toHaveProperty('rate', investmentRates.fd?.rate || 6.5)
      })

      it('should not override existing tenureYears/tenureMonths', () => {
        const existingData = {
          tenureYears: 2,
          tenureMonths: 6
        }
        const defaults = getInstrumentDefaults('fd', existingData)
        
        expect(defaults).not.toHaveProperty('tenureYears')
        expect(defaults).not.toHaveProperty('tenureMonths')
      })
    })

    describe('SIP', () => {
      it('should return default values for SIP when no existing data', () => {
        const defaults = getInstrumentDefaults('sip', {})
        
        expect(defaults).toHaveProperty('monthlySIP', 5000)
        expect(defaults).toHaveProperty('tenure', 10)
        expect(defaults).toHaveProperty('tenureUnit', 'years')
        expect(defaults).toHaveProperty('expectedReturn', investmentRates.sip?.expectedReturn || 12)
      })
    })

    describe('NSC', () => {
      it('should return default values for NSC when no existing data', () => {
        const defaults = getInstrumentDefaults('nsc', {})
        
        expect(defaults).toHaveProperty('principal', 100000)
        expect(defaults).toHaveProperty('tenure', 5) // Fixed 5-year tenure
        expect(defaults).toHaveProperty('rate', investmentRates.nsc?.rate || 7.7)
      })

      it('should set tenure to 5 years (fixed tenure)', () => {
        const defaults = getInstrumentDefaults('nsc', {})
        expect(defaults.tenure).toBe(5)
      })
    })

    describe('SCSS', () => {
      it('should return default values for SCSS when no existing data', () => {
        const defaults = getInstrumentDefaults('scss', {})
        
        expect(defaults).toHaveProperty('principal', 3000000)
        expect(defaults).toHaveProperty('tenure', 5)
        expect(defaults).toHaveProperty('rate', investmentRates.scss?.rate || 8.2)
      })
    })

    describe('SGB', () => {
      it('should return default values for SGB when no existing data', () => {
        const defaults = getInstrumentDefaults('sgb', {})
        
        expect(defaults).toHaveProperty('principal', 100000)
        expect(defaults).toHaveProperty('tenure', 5)
        expect(defaults).toHaveProperty('goldAppreciationRate', investmentRates.sgb?.goldAppreciation || 8)
      })

      it('should not override existing goldAppreciationRate if set to 0', () => {
        const existingData = { goldAppreciationRate: 0 }
        const defaults = getInstrumentDefaults('sgb', existingData)
        
        expect(defaults).not.toHaveProperty('goldAppreciationRate')
      })
    })

    describe('NPS', () => {
      it('should return default values for NPS when no existing data', () => {
        const defaults = getInstrumentDefaults('nps', {})
        
        expect(defaults).toHaveProperty('monthlyContribution', 5000)
        expect(defaults).toHaveProperty('tenure', 25)
        expect(defaults).toHaveProperty('equityAllocation', 50)
        expect(defaults).toHaveProperty('corporateBondsAllocation', 30)
        expect(defaults).toHaveProperty('governmentBondsAllocation', 20)
        expect(defaults).toHaveProperty('alternativeAllocation', 0)
      })
    })

    describe('Equity', () => {
      it('should return default values for Equity when no existing data', () => {
        const defaults = getInstrumentDefaults('equity', {})
        
        expect(defaults).toHaveProperty('investmentType', 'sip')
        expect(defaults).toHaveProperty('amount', 5000)
        expect(defaults).toHaveProperty('tenure', 10)
        expect(defaults).toHaveProperty('expectedReturn', investmentRates.equity?.defaultExpectedReturn || 12)
        expect(defaults).toHaveProperty('expectedCAGR', investmentRates.equity?.defaultExpectedReturn || 12)
      })
    })

    describe('ELSS', () => {
      it('should return default values for ELSS when no existing data', () => {
        const defaults = getInstrumentDefaults('elss', {})
        
        expect(defaults).toHaveProperty('investmentType', 'sip')
        expect(defaults).toHaveProperty('amount', 5000)
        expect(defaults).toHaveProperty('tenure', 3) // ELSS has 3-year lock-in
        expect(defaults).toHaveProperty('expectedReturn', investmentRates.elss?.expectedReturn || 14)
        expect(defaults).toHaveProperty('expectedCAGR', investmentRates.elss?.expectedReturn || 14)
      })

      it('should set tenure to 3 years for ELSS', () => {
        const defaults = getInstrumentDefaults('elss', {})
        expect(defaults.tenure).toBe(3)
      })
    })

    describe('RD', () => {
      it('should return default values for RD when no existing data', () => {
        const defaults = getInstrumentDefaults('rd', {})
        
        expect(defaults).toHaveProperty('monthlyDeposit', 5000)
        expect(defaults).toHaveProperty('tenureYears', 1)
        expect(defaults).toHaveProperty('tenureMonths', 0)
        expect(defaults).toHaveProperty('rate', investmentRates.rd?.rate || 6.5)
      })

      it('should not override existing tenureYears/tenureMonths', () => {
        const existingData = {
          tenureYears: 2,
          tenureMonths: 3
        }
        const defaults = getInstrumentDefaults('rd', existingData)
        
        expect(defaults).not.toHaveProperty('tenureYears')
        expect(defaults).not.toHaveProperty('tenureMonths')
      })
    })

    describe('Debt Mutual Fund', () => {
      it('should return default values for debtMutualFund when no existing data', () => {
        const defaults = getInstrumentDefaults('debtMutualFund', {})
        
        expect(defaults).toHaveProperty('investmentType', 'sip')
        expect(defaults).toHaveProperty('amount', 5000)
        expect(defaults).toHaveProperty('tenure', 5)
        expect(defaults).toHaveProperty('fundType', 'shortTerm')
        expect(defaults).toHaveProperty('expectedReturn', investmentRates.debtMutualFund?.shortTerm || 7.5)
      })
    })

    describe('ETF', () => {
      it('should return default values for ETF when no existing data', () => {
        const defaults = getInstrumentDefaults('etf', {})
        
        expect(defaults).toHaveProperty('investmentType', 'sip')
        expect(defaults).toHaveProperty('amount', 5000)
        expect(defaults).toHaveProperty('tenure', 10)
        expect(defaults).toHaveProperty('etfType', 'equity')
        expect(defaults).toHaveProperty('expectedCAGR', investmentRates.etf?.equity || 12)
        expect(defaults).toHaveProperty('expectedReturn', investmentRates.etf?.equity || 12)
      })
    })

    describe('REITs', () => {
      it('should return default values for REITs when no existing data', () => {
        const defaults = getInstrumentDefaults('reits', {})
        
        expect(defaults).toHaveProperty('investmentAmount', 100000)
        expect(defaults).toHaveProperty('tenure', 10)
        expect(defaults).toHaveProperty('dividendYield', investmentRates.reits?.dividendYield || 7)
        expect(defaults).toHaveProperty('capitalAppreciation', investmentRates.reits?.capitalAppreciation || 6)
      })

      it('should not override existing dividendYield if set to 0', () => {
        const existingData = { dividendYield: 0 }
        const defaults = getInstrumentDefaults('reits', existingData)
        
        expect(defaults).not.toHaveProperty('dividendYield')
      })

      it('should not override existing capitalAppreciation if set to 0', () => {
        const existingData = { capitalAppreciation: 0 }
        const defaults = getInstrumentDefaults('reits', existingData)
        
        expect(defaults).not.toHaveProperty('capitalAppreciation')
      })
    })

    describe('54EC Bonds', () => {
      it('should return default values for bonds54EC when no existing data', () => {
        const defaults = getInstrumentDefaults('bonds54EC', {})
        
        expect(defaults).toHaveProperty('investmentAmount', 100000)
        expect(defaults).toHaveProperty('capitalGainAmount', 100000)
        expect(defaults).toHaveProperty('tenure', 5) // Fixed 5-year lock-in
        expect(defaults).toHaveProperty('rate', investmentRates.bonds54EC?.rate || 5.75)
      })

      it('should set tenure to 5 years (fixed lock-in)', () => {
        const defaults = getInstrumentDefaults('bonds54EC', {})
        expect(defaults.tenure).toBe(5)
      })
    })

    describe('Edge cases', () => {
      it('should return empty object for unknown instrument', () => {
        const defaults = getInstrumentDefaults('unknownInstrument', {})
        expect(defaults).toEqual({})
      })

      it('should handle null existingData', () => {
        const defaults = getInstrumentDefaults('ppf', null)
        expect(defaults).toHaveProperty('yearlyInvestment')
        expect(defaults).toHaveProperty('tenure')
      })

      it('should handle undefined existingData', () => {
        const defaults = getInstrumentDefaults('sip', undefined)
        expect(defaults).toHaveProperty('monthlySIP')
        expect(defaults).toHaveProperty('tenure')
      })
    })
  })

  describe('initializeDefaultsForInstruments', () => {
    let mockUpdateInvestment

    beforeEach(() => {
      mockUpdateInvestment = vi.fn()
    })

    it('should call updateInvestment for each instrument with defaults', () => {
      const investments = {}
      const instrumentIds = ['ppf', 'sip']

      initializeDefaultsForInstruments(instrumentIds, investments, mockUpdateInvestment)

      expect(mockUpdateInvestment).toHaveBeenCalledTimes(2)
      expect(mockUpdateInvestment).toHaveBeenCalledWith('ppf', expect.objectContaining({
        yearlyInvestment: 10000,
        tenure: 15,
        rate: expect.any(Number)
      }))
      expect(mockUpdateInvestment).toHaveBeenCalledWith('sip', expect.objectContaining({
        monthlySIP: 5000,
        tenure: 10,
        expectedReturn: expect.any(Number)
      }))
    })

    it('should merge defaults with existing data', () => {
      const investments = {
        ppf: {
          yearlyInvestment: 50000,
          someOtherField: 'preserved'
        }
      }
      const instrumentIds = ['ppf']

      initializeDefaultsForInstruments(instrumentIds, investments, mockUpdateInvestment)

      expect(mockUpdateInvestment).toHaveBeenCalledWith('ppf', expect.objectContaining({
        yearlyInvestment: 50000, // Preserved existing value
        someOtherField: 'preserved', // Preserved other fields
        tenure: 15, // Added default
        rate: expect.any(Number) // Added default
      }))
    })

      it('should not call updateInvestment if no defaults needed', () => {
        const investments = {
          ppf: {
            yearlyInvestment: 50000,
            tenure: 15,
            rate: 7.5
          }
        }
        const instrumentIds = ['ppf']

        initializeDefaultsForInstruments(instrumentIds, investments, mockUpdateInvestment)

        // Should not be called if no defaults are needed
        expect(mockUpdateInvestment).not.toHaveBeenCalled()
      })

    it('should handle empty instrumentIds array', () => {
      initializeDefaultsForInstruments([], {}, mockUpdateInvestment)
      expect(mockUpdateInvestment).not.toHaveBeenCalled()
    })

    it('should handle null instrumentIds', () => {
      initializeDefaultsForInstruments(null, {}, mockUpdateInvestment)
      expect(mockUpdateInvestment).not.toHaveBeenCalled()
    })

    it('should initialize all 15 instruments correctly', () => {
      const allInstruments = [
        'ppf', 'fd', 'sip', 'ssy', 'nsc', 'scss', 'sgb', 'nps',
        'equity', 'elss', 'rd', 'debtMutualFund', 'etf', 'reits', 'bonds54EC'
      ]
      const investments = {}

      initializeDefaultsForInstruments(allInstruments, investments, mockUpdateInvestment)

      expect(mockUpdateInvestment).toHaveBeenCalledTimes(15)
      
      // Verify each instrument has tenure or tenureYears/tenureMonths set
      allInstruments.forEach((instrumentId) => {
        const call = mockUpdateInvestment.mock.calls.find(c => c[0] === instrumentId)
        expect(call).toBeDefined()
        // FD and RD use tenureYears/tenureMonths instead of tenure
        if (instrumentId === 'fd' || instrumentId === 'rd') {
          expect(call[1]).toHaveProperty('tenureYears')
          expect(call[1]).toHaveProperty('tenureMonths')
        } else {
          expect(call[1]).toHaveProperty('tenure')
          expect(call[1].tenure).toBeGreaterThan(0)
        }
      })
    })

    it('should ensure all instruments have required tenure field', () => {
      const allInstruments = [
        'ppf', 'fd', 'sip', 'ssy', 'nsc', 'scss', 'sgb', 'nps',
        'equity', 'elss', 'rd', 'debtMutualFund', 'etf', 'reits', 'bonds54EC'
      ]
      const investments = {}

      initializeDefaultsForInstruments(allInstruments, investments, mockUpdateInvestment)

      allInstruments.forEach((instrumentId) => {
        const call = mockUpdateInvestment.mock.calls.find(c => c[0] === instrumentId)
        const defaults = getInstrumentDefaults(instrumentId, {})
        
        // For FD and RD, check tenureYears/tenureMonths instead
        if (instrumentId === 'fd' || instrumentId === 'rd') {
          expect(defaults).toHaveProperty('tenureYears')
          expect(defaults).toHaveProperty('tenureMonths')
        } else {
          expect(defaults).toHaveProperty('tenure')
          expect(defaults.tenure).toBeGreaterThan(0)
        }
      })
    })
  })
})
