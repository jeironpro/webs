// Tests del hook useExercises: carga inicial única y estados loading/error.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useExercises } from '@/hooks/useExercises.js'
import { useExerciseStore } from '@/store/exerciseStore.js'
import { exercisesFixture } from '@/test/fixtures.js'

vi.mock('@/services/exerciseService.js', () => ({
  fetchExercises: vi.fn(),
}))

import { fetchExercises } from '@/services/exerciseService.js'

describe('useExercises', () => {
  beforeEach(() => {
    useExerciseStore.setState({ exercises: [], loading: false, error: null, loaded: false })
    vi.clearAllMocks()
    fetchExercises.mockResolvedValue(exercisesFixture())
  })

  it('carga el catálogo al montar si el store está vacío', async () => {
    const { result } = renderHook(() => useExercises())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.exercises).toHaveLength(3))
    expect(result.current.error).toBeNull()
  })

  it('no recarga si el catálogo ya está en memoria', () => {
    useExerciseStore.setState({
      exercises: exercisesFixture(),
      loading: false,
      error: null,
      loaded: true,
    })
    renderHook(() => useExercises())
    expect(fetchExercises).not.toHaveBeenCalled()
  })

  it('expone el error cuando la carga falla', async () => {
    fetchExercises.mockRejectedValue(new Error('sin conexión'))
    const { result } = renderHook(() => useExercises())
    await waitFor(() => expect(result.current.error).toBe('sin conexión'))
    expect(result.current.exercises).toHaveLength(0)
  })
})
