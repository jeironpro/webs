/* Hallmark · genre: playful · macrostructure: spec-sheet · theme: Hum · design-system: design.md · designed-as-app */
import { Link } from 'react-router-dom'
import { useExercises } from '@/hooks/useExercises.js'
import { useCompareStore } from '@/store/compareStore.js'
import {
  getBodyPartLabel,
  getEquipmentLabel,
  getTargetLabel,
  getMuscleGroupLabel,
} from '@/utils/helpers.js'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import Icon from '@/components/ui/Icon.jsx'

// Comparador: tabla lado a lado con los atributos de los ejercicios elegidos.
export default function Compare() {
  const { exercises, loading, error, load } = useExercises()
  const ids = useCompareStore((state) => state.ids)
  const removeCompare = useCompareStore((state) => state.removeCompare)

  if (loading && exercises.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-24" aria-live="polite">
        <Spinner className="h-8 w-8 text-accent" />
        <p className="font-body text-ink-2">Cargando...</p>
      </section>
    )
  }

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

  // Ejercicios seleccionados, en el orden en que se añadieron.
  const selected = exercises.filter((exercise) => ids.includes(exercise.id))

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-ink-2">
          COMPARADOR
        </span>
        <h1 className="font-display text-3xl font-semibold text-ink">Comparar ejercicios</h1>
        <p className="mt-1 font-body text-sm text-ink-2">Hasta 4 ejercicios lado a lado.</p>
      </header>

      {/* Se necesitan al menos dos ejercicios para comparar. */}
      {selected.length < 2 ? (
        <EmptyState
          icon="compare_arrows"
          title="Selecciona al menos dos ejercicios"
          description="Añade ejercicios con el botón de comparación en el catálogo."
          action={
            <Link to="/ejercicios" className="btn no-underline">
              Ir al catálogo
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-rule bg-paper shadow-soft">
          <table className="w-full border-collapse font-body text-sm">
            <caption className="sr-only">Comparación de ejercicios seleccionados</caption>
            <thead>
              <tr className="border-b border-rule">
                {/* Primera columna fija con los nombres de atributo. */}
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-paper p-4 text-left font-mono text-xs font-medium uppercase tracking-widest text-ink-2"
                >
                  Atributo
                </th>
                {/* Una columna por ejercicio: miniatura, enlace y botón de quitar. */}
                {selected.map((exercise) => (
                  <th scope="col" key={exercise.id} className="min-w-40 p-4 text-left align-top">
                    <div className="flex flex-col gap-2">
                      <img
                        src={exercise.image}
                        alt=""
                        className="aspect-square w-full rounded-card object-cover"
                      />
                      <Link
                        to={`/ejercicio/${exercise.id}`}
                        className="font-display text-sm font-semibold text-accent-2 no-underline hover:underline"
                      >
                        {exercise.name}
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 self-start font-mono text-xs uppercase tracking-wider text-ink-2 hover:text-accent-3"
                        onClick={() => removeCompare(exercise.id)}
                      >
                        <Icon name="close" size={14} />
                        Quitar
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Filas de atributos traducidos, una por campo comparado. */}
            <tbody>
              <CompareRow
                label="Grupo corporal"
                values={selected.map((e) => getBodyPartLabel(e.body_part))}
              />
              <CompareRow
                label="Equipo"
                values={selected.map((e) => getEquipmentLabel(e.equipment))}
              />
              <CompareRow label="Objetivo" values={selected.map((e) => getTargetLabel(e.target))} />
              <CompareRow
                label="Músculo principal"
                values={selected.map((e) => getMuscleGroupLabel(e.muscle_group))}
              />
              <CompareRow
                label="Secundarios"
                values={selected.map((e) =>
                  e.secondary_muscles.map(getMuscleGroupLabel).join(', '),
                )}
              />
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

// Fila de la tabla: una etiqueta fija a la izquierda y un valor por ejercicio.
function CompareRow({ label, values }) {
  return (
    <tr className="border-b border-rule last:border-b-0">
      <th
        scope="row"
        className="sticky left-0 z-10 w-36 bg-paper p-4 text-left align-top font-mono text-xs font-medium uppercase tracking-widest text-ink-2"
      >
        {label}
      </th>
      {values.map((value, index) => (
        <td key={index} className="p-4 align-top font-body text-ink">
          {value}
        </td>
      ))}
    </tr>
  )
}
