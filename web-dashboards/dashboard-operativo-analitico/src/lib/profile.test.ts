import { describe, expect, it } from 'vitest'

import type { UserProfile } from '@/types'

describe('perfil mock', () => {
    it('carga los datos de la persona con los campos obligatorios', async () => {
        const profile = (await import('@/data/profile.json')).default as UserProfile

        expect(profile.name.length).toBeGreaterThan(0)
        expect(profile.initials.length).toBeGreaterThanOrEqual(2)
        expect(profile.role.length).toBeGreaterThan(0)
        expect(profile.email).toMatch(/@nebula\.mx$/)
        expect(profile.phone).toMatch(/^\+52/)
        expect(profile.location.length).toBeGreaterThan(0)
        expect(profile.joined).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('tiene estadísticas y actividad coherentes', async () => {
        const profile = (await import('@/data/profile.json')).default as UserProfile

        expect(profile.stats.length).toBeGreaterThanOrEqual(3)
        for (const stat of profile.stats) {
            expect(stat.value).toBeGreaterThan(0)
            expect(['number', 'percent']).toContain(stat.format)
        }

        expect(profile.activity.length).toBeGreaterThan(0)
        for (const item of profile.activity) {
            expect(item.id.length).toBeGreaterThan(0)
            expect(item.title.length).toBeGreaterThan(0)
            expect(new Date(item.date).getTime()).not.toBeNaN()
        }
    })

    it('tiene habilidades e idiomas no vacíos', async () => {
        const profile = (await import('@/data/profile.json')).default as UserProfile

        expect(profile.skills.length).toBeGreaterThanOrEqual(3)
        expect(profile.languages.length).toBeGreaterThanOrEqual(1)
    })
})
