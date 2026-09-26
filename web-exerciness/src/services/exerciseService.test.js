// Tests del servicio de datos del catálogo.
import { describe, it, expect, afterEach, vi } from 'vitest'
import { fetchExercises } from './exerciseService.js'

const rawExercise = () => ({
  id: '0001',
  name: '3/4 sit-up',
  body_part: 'waist',
  equipment: 'body weight',
  target: 'abs',
  muscle_group: 'hip flexors',
  secondary_muscles: ['hip flexors'],
  image: 'images/0001-2gPfomN.jpg',
  gif_url: 'videos/0001-2gPfomN.gif',
  instructions: { es: 'Instrucciones en español.' },
})

describe('fetchExercises', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('normaliza las rutas de media a absolutas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [rawExercise()] }),
    )
    const result = await fetchExercises()
    expect(result[0].image).toBe('/images/0001-2gPfomN.jpg')
    expect(result[0].gif_url).toBe('/videos/0001-2gPfomN.gif')
  })

  it('lanza un error si la respuesta HTTP falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(fetchExercises()).rejects.toThrow(/HTTP 500/)
  })

  it('lanza un error si el dataset no es un array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }))
    await expect(fetchExercises()).rejects.toThrow(/formato esperado/)
  })

  it('lanza un error si hay registros inválidos', async () => {
    const invalid = { ...rawExercise(), id: undefined }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [invalid] }))
    await expect(fetchExercises()).rejects.toThrow(/registros inválidos/)
  })
})
