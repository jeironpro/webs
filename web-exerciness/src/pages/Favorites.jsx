/* Hallmark · genre: playful · macrostructure: 11-catalogue · theme: Hum · design-system: design.md · designed-as-app */
import { Link } from 'react-router-dom'
import { useExercises } from '@/hooks/useExercises.js'
import { useFavoritesStore } from '@/store/favoritesStore.js'
import ExerciseCard from '@/components/common/ExerciseCard.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Spinner from '@/components/ui/Spinner.jsx'

// Página de favoritos: ejercicios guardados, persistidos en localStorage.
export default function Favorites() {
  const { exercises, loading, error, load } = useExercises()
  const ids = useFavoritesStore((state) => state.ids)

  if (loading && exercises.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-24" aria-live="polite">
        <Spinner className="h-8 w-8 text-accent" />
        <p className="font-body text-ink-2">Cargando tus favoritos...</p>
      </section>
    )
  }

  if (error && exercises.length === 0) {
    return (
      <EmptyState
        icon="error"
        title="No se pudieron cargar"
        description={error}
        action={
          <button type="button" className="btn" onClick={() => load()}>
            Reintentar
          </button>
        }
      />
    )
  }

  // Resuelve los ejercicios completos a partir de los ids guardados.
  const favorites = exercises.filter((exercise) => ids.includes(exercise.id))

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-ink-2">
          GUARDADOS
        </span>
        <h1 className="font-display text-3xl font-semibold text-ink">Mis favoritos</h1>
        <p className="mt-1 font-body text-sm text-ink-2">
          {favorites.length}{' '}
          {favorites.length === 1 ? 'ejercicio guardado' : 'ejercicios guardados'}.
        </p>
      </header>

      {favorites.length === 0 ? (
        <EmptyState
          icon="favorite_border"
          title="Aún no tienes favoritos"
          description="Marca ejercicios como favoritos para tenerlos siempre a mano."
          action={
            <Link to="/ejercicios" className="btn no-underline">
              Explorar ejercicios
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </section>
  )
}
