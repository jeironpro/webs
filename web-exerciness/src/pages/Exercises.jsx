/* Hallmark · genre: playful · macrostructure: 11-catalogue · theme: Hum · design-system: design.md · designed-as-app */
import { useExercises } from '@/hooks/useExercises.js'
import { useFilterStore } from '@/store/filterStore.js'
import { filterExercises, sortExercises } from '@/utils/helpers.js'
import ExerciseCard from '@/components/common/ExerciseCard.jsx'
import ExerciseFilters from '@/components/common/ExerciseFilters.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'

// Catálogo completo: filtros, ordenación y cuadrícula de ejercicios.
export default function Exercises() {
  const { exercises, loading, error, load } = useExercises()
  const filters = useFilterStore()

  // Carga en curso sin datos previos: pantalla de carga.
  if (loading && exercises.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-24" aria-live="polite">
        <Spinner className="h-8 w-8 text-accent" />
        <p className="font-body text-ink-2">Cargando el catálogo...</p>
      </section>
    )
  }

  // Error de carga sin datos previos: mensaje con opción de reintentar.
  if (error && exercises.length === 0) {
    return (
      <EmptyState
        icon="error"
        title="No se pudo cargar"
        description={error}
        action={
          <button type="button" className="btn" onClick={() => load()}>
            Reintentar
          </button>
        }
      />
    )
  }

  // Aplica búsqueda + filtros y luego ordena el resultado visible.
  const visible = sortExercises(filterExercises(exercises, filters), filters.sortBy)

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-ink-2">
          CATÁLOGO
        </span>
        <h1 className="font-display text-3xl font-semibold text-ink">Ejercicios</h1>
        <p className="mt-1 font-body text-sm text-ink-2">{exercises.length} ejercicios en total.</p>
      </header>

      <ExerciseFilters exercises={exercises} />

      {visible.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="Sin resultados"
          description="Prueba a cambiar los filtros o el término de búsqueda."
        />
      ) : (
        <>
          <p
            className="mb-4 mt-6 font-mono text-xs uppercase tracking-widest text-ink-2"
            aria-live="polite"
          >
            {visible.length} {visible.length === 1 ? 'ejercicio' : 'ejercicios'} encontrados
          </p>
          {/* Cuadrícula de tarjetas del resultado filtrado. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
