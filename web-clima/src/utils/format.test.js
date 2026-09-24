import { describe, expect, it } from 'vitest'
import {
    round,
    formatWind,
    windDirection,
    formatTime,
    formatDayLabel,
    toUserTemp,
    tempLabel,
    formatHourLabel,
    formatDateTime,
    formatOffset,
    formatNumber,
} from '@/utils/format'

describe('format', () => {
    it('redondea al entero más cercano', () => {
        expect(round(28.4)).toBe(28)
        expect(round(-1.5)).toBe(-1)
    })

    it('convierte km/h a mph cuando se pide', () => {
        expect(formatWind(10)).toBe('10 km/h')
        expect(formatWind(10, 'mph')).toBe('6 mph')
        expect(formatWind(undefined)).toBeNull()
    })

    it('traduce grados a punto de brújula', () => {
        expect(windDirection(0)).toBe('N')
        expect(windDirection(90)).toBe('E')
        expect(windDirection(225)).toBe('SO')
    })

    it('formatea la hora local con zona horaria', () => {
        const date = new Date('2026-05-01T12:00:00Z')
        expect(formatTime('UTC', date)).toBe('12:00')
    })

    it('etiqueta los días del pronóstico', () => {
        expect(formatDayLabel('2026-08-09', 0)).toBe('Hoy')
        expect(formatDayLabel('2026-08-10', 1)).toBe('Mañana')
        expect(formatDayLabel('2026-08-11', 2)).toBe('Martes')
    })

    it('convierte Celsius a Fahrenheit', () => {
        expect(toUserTemp(0, 'C')).toBe(0)
        expect(toUserTemp(0, 'F')).toBe(32)
        expect(toUserTemp(100, 'C')).toBe(100)
        expect(toUserTemp(100, 'F')).toBe(212)
        expect(toUserTemp(null, 'F')).toBeNull()
    })

    it('formatea temperatura con unidad', () => {
        expect(tempLabel(21, 'C')).toBe('21°C')
        expect(tempLabel(21, 'F')).toBe('70°F')
        expect(tempLabel(0, 'C')).toBe('0°C')
        expect(tempLabel(0, 'F')).toBe('32°F')
    })

    it('formatea la hora del día', () => {
        expect(formatHourLabel('2026-08-09T18:00:00Z', 'UTC')).toBe('18:00')
        expect(formatHourLabel(null, 'UTC')).toBeNull()
    })

    it('formatea fecha y hora local', () => {
        expect(formatDateTime('UTC', new Date('2026-08-10T08:19:00Z'))).toBe(
            'lunes, 10 ago · 08:19'
        )
        expect(formatDateTime('UTC', null)).toBeNull()
    })

    it('formatea desplazamiento UTC', () => {
        expect(formatOffset(7200)).toBe('UTC+02:00')
        expect(formatOffset(-5100)).toBe('UTC-01:25')
        expect(formatOffset(0)).toBe('UTC+00:00')
    })

    it('formatea número con separador de miles', () => {
        expect(formatNumber(1000)).toBe('1.000')
        expect(formatNumber(34250)).toBe('34.250')
        expect(formatNumber(null)).toBeNull()
    })
})
