import { describe, expect, it } from 'vitest'
import { aqiCategoryEU, aqiCategoryUS } from '@/utils/aqi'

describe('aqi', () => {
    it('categoriza el índice europeo por tramos', () => {
        expect(aqiCategoryEU(12)).toEqual({ key: 'good', label: 'Muy buena' })
        expect(aqiCategoryEU(45)).toEqual({ key: 'fair', label: 'Aceptable' })
        expect(aqiCategoryEU(120)).toEqual({
            key: 'extremely-poor',
            label: 'Extremadamente deficiente',
        })
    })

    it('categoriza el índice de EE.UU. por tramos', () => {
        expect(aqiCategoryUS(80)).toEqual({ key: 'moderate', label: 'Moderada' })
        expect(aqiCategoryUS(160)).toEqual({ key: 'unhealthy', label: 'Insalubre' })
        expect(aqiCategoryUS(320)).toEqual({ key: 'hazardous', label: 'Peligrosa' })
    })

    it('devuelve null sin valor', () => {
        expect(aqiCategoryEU(null)).toBeNull()
        expect(aqiCategoryUS(undefined)).toBeNull()
    })
})
