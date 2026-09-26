import { create } from 'zustand'
import { fetchExercises } from '@/services/exerciseService.js'

// Store global del catálogo de ejercicios.
// Carga una única vez el dataset (17 MB) y lo cachea en memoria.
export const useExerciseStore = create((set) => ({
  exercises: [],
  loading: false,
  error: null,
  loaded: false,

  load: async () => {
    set({ loading: true, error: null })
    try {
      const exercises = await fetchExercises()
      set({ exercises, loading: false, loaded: true })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))
