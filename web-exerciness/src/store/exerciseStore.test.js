// Tests del store del catálogo de ejercicios.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useExerciseStore } from './exerciseStore.js'
import { exercisesFixture } from '@/test/fixtures.js'

vi.mock('@/services/exerciseService.js', () => ({
  fetchExercises: vi.fn(),
}))

import { fetchExercises } from '@/services/exerciseService.js'

describe('exerciseStore', () => {
  beforeEach(() => {
    useExerciseStore.setState({ exercises: [], loading: false, error: null, loaded: false })
    vi.clearAllMocks()
  })

  it('carga los ejercicios y marca el estado como cargado', async () => {
    fetchExercises.mockResolvedValue(exercisesFixture())
    await useExerciseStore.getState().load()
    const state = useExerciseStore.getState()
    expect(state.exercises).toHaveLength(3)
    expect(state.loaded).toBe(true)
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('guarda el mensaje de error si la carga falla', async () => {
    fetchExercises.mockRejectedValue(new Error('no hay datos'))
    await useExerciseStore.getState().load()
    const state = useExerciseStore.getState()
    expect(state.error).toBe('no hay datos')
    expect(state.exercises).toHaveLength(0)
    expect(state.loading).toBe(false)
  })
})
