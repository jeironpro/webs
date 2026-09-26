/* Hallmark · component: compare-bar · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import { Link } from 'react-router-dom'
import { useExerciseStore } from '@/store/exerciseStore.js'
import { useCompareStore } from '@/store/compareStore.js'

// Barra flotante fija al pie de la pantalla con los ejercicios seleccionados
// para comparar. No se muestra hasta que hay al menos una selección.
const CompareBar = () => {
  const ids = useCompareStore((state) => state.ids)
  const clear = useCompareStore((state) => state.clear)
  const exercises = useExerciseStore((state) => state.exercises)

  if (ids.length === 0) return null

  // Resuelve los ejercicios completos a partir de los ids seleccionados.
  const selected = exercises.filter((exercise) => ids.includes(exercise.id))

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-rule bg-paper-2 shadow-lift">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        {/* Avatares apilados de los seleccionados (solo desktop). */}
        <div className="hidden -space-x-2 sm:flex" aria-hidden="true">
          {selected.slice(0, 4).map((exercise) => (
            <img
              key={exercise.id}
              src={exercise.image}
              alt=""
              className="h-10 w-10 rounded-full border-2 border-paper object-cover"
            />
          ))}
        </div>
        <span className="font-body text-sm font-medium text-ink">
          {ids.length} {ids.length === 1 ? 'seleccionado' : 'seleccionados'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="btn btn--outline px-3 py-1.5 text-sm" onClick={clear}>
            Limpiar
          </button>
          <Link to="/comparar" className="btn px-3 py-1.5 text-sm no-underline">
            Comparar
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompareBar
