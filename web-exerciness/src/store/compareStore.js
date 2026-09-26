import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store del comparador: selección de hasta MAX_ITEMS ejercicios.
export const MAX_COMPARE_ITEMS = 4

export const useCompareStore = create(
  persist(
    (set) => ({
      ids: [],
      maxItems: MAX_COMPARE_ITEMS,
      toggleCompare: (id) =>
        set((state) => {
          if (state.ids.includes(id)) {
            return { ids: state.ids.filter((x) => x !== id) }
          }
          if (state.ids.length >= state.maxItems) return state
          return { ids: [...state.ids, id] }
        }),
      removeCompare: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'exerciness-compare' },
  ),
)

// Selector: comprueba si un ejercicio está en la comparación.
export const selectIsComparing = (id) => (state) => state.ids.includes(id)

// Selector: número de ejercicios seleccionados.
export const selectCompareCount = (state) => state.ids.length
