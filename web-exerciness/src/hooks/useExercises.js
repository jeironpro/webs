// Hook de acceso al catálogo de ejercicios.
//
// Encapsula la carga perezosa del dataset: al montar, si el store todavía no
// tiene datos (ni está cargando), dispara `load` una única vez. Expone el
// estado (exercises, loading, error) y la acción `load` para reintentos.
// Al usar este hook, las páginas no repiten el guard de carga inicial.

import { useEffect } from 'react'
import { useExerciseStore } from '@/store/exerciseStore.js'

export function useExercises() {
  const exercises = useExerciseStore((state) => state.exercises)
  const loading = useExerciseStore((state) => state.loading)
  const error = useExerciseStore((state) => state.error)
  const load = useExerciseStore((state) => state.load)

  useEffect(() => {
    const state = useExerciseStore.getState()
    // Solo se carga una vez: si ya hay datos o la carga está en curso, no se repite.
    if (state.exercises.length === 0 && !state.loading) state.load()
  }, [load])

  return { exercises, loading, error, load }
}
