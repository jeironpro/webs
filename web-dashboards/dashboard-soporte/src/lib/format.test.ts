import { describe, expect, it } from 'vitest'
import {
    formatearDuracionHoras,
    formatearFecha,
    formatearFechaHora,
    formatearIniciales,
} from './format'

describe('formatearDuracionHoras', () => {
    it('formatea menos de una hora en minutos', () => {
        expect(formatearDuracionHoras(0.5)).toBe('30 min')
    })

    it('formatea horas con minutos', () => {
        expect(formatearDuracionHoras(2.11)).toBe('2 h 7 min')
    })

    it('formatea horas exactas', () => {
        expect(formatearDuracionHoras(3)).toBe('3 h')
    })

    it('devuelve un guion cuando no hay duración', () => {
        expect(formatearDuracionHoras(null)).toBe('—')
    })
})

describe('formatearFecha', () => {
    it('formatea una fecha ISO en español', () => {
        expect(formatearFecha('2026-08-18T09:02:00-03:00')).toBe('18 ago 2026')
    })

    it('devuelve un guion cuando no hay fecha', () => {
        expect(formatearFecha(null)).toBe('—')
    })
})

describe('formatearFechaHora', () => {
    it('incluye la hora con minutos', () => {
        expect(formatearFechaHora('2026-08-18T09:02:00-03:00')).toBe('18 ago 2026, 09:02')
    })
})

describe('formatearIniciales', () => {
    it('genera iniciales a partir del nombre', () => {
        expect(formatearIniciales('Lucía Fernández')).toBe('LF')
        expect(formatearIniciales('Ana Torres')).toBe('AT')
        expect(formatearIniciales('ana torres')).toBe('AT')
    })
})
