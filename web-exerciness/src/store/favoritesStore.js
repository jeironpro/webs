import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store de favoritos persistido en localStorage.
export const useFavoritesStore = create(
  persist(
    (set) => ({
      ids: [],
      toggleFavorite: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'exerciness-favorites' },
  ),
)

// Selector: comprueba si un ejercicio es favorito.
export const selectIsFavorite = (id) => (state) => state.ids.includes(id)

// Selector: número de favoritos.
export const selectFavoritesCount = (state) => state.ids.length
