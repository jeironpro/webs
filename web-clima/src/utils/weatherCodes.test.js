import { describe, expect, it } from 'vitest'
import { getWeatherCode } from '@/utils/weatherCodes'

describe('getWeatherCode', () => {
    it('mapea un código WMO conocido', () => {
        expect(getWeatherCode(0)).toMatchObject({ label: 'Despejado', group: 'clear' })
        expect(getWeatherCode(95)).toMatchObject({ label: 'Tormenta', group: 'storm' })
    })

    it('agrupa códigos de lluvia y nieve en su categoría', () => {
        expect(getWeatherCode(63).group).toBe('rain')
        expect(getWeatherCode(75).group).toBe('snow')
        expect(getWeatherCode(55).group).toBe('drizzle')
    })

    it('devuelve un genérico para códigos desconocidos', () => {
        expect(getWeatherCode(999)).toMatchObject({ label: 'Desconocido', group: 'unknown' })
    })
})
