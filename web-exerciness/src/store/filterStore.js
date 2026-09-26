// Store de los filtros del catálogo: búsqueda, filtros y ordenación.
// El estado vive en Zustand; las acciones actualizan un único campo cada una.

import { create } from 'zustand'
import { ALL } from '@/utils/constants.js'

// Valores iniciales compartidos por el estado inicial y reset().
const DEFAULT_FILTERS = {
  search: '',
  bodyPart: ALL,
  equipment: ALL,
  target: ALL,
  muscleGroup: ALL,
  sortBy: 'name',
}

export const useFilterStore = create((set) => ({
  ...DEFAULT_FILTERS,

  setSearch: (search) => set({ search }),
  setBodyPart: (bodyPart) => set({ bodyPart }),
  setEquipment: (equipment) => set({ equipment }),
  setTarget: (target) => set({ target }),
  setMuscleGroup: (muscleGroup) => set({ muscleGroup }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set(DEFAULT_FILTERS),
}))
