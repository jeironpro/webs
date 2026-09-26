/* Hallmark · component: compare-button · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import Icon from '@/components/ui/Icon.jsx'
import { useCompareStore, selectIsComparing, selectCompareCount } from '@/store/compareStore.js'

// Botón para añadir/quitar un ejercicio de la comparación.
// Muestra su estado (pulsado = en comparación) y deshabilita la acción
// visualmente cuando se alcanza el máximo de elementos permitidos.
const CompareButton = ({ exerciseId, compact = false, className = '' }) => {
  const isComparing = useCompareStore(selectIsComparing(exerciseId))
  const compareCount = useCompareStore(selectCompareCount)
  const maxItems = useCompareStore((state) => state.maxItems)
  const toggleCompare = useCompareStore((state) => state.toggleCompare)
  // En el límite solo si el ejercicio NO está ya en la comparación.
  const atLimit = !isComparing && compareCount >= maxItems

  return (
    <button
      type="button"
      aria-pressed={isComparing}
      onClick={() => toggleCompare(exerciseId)}
      aria-label={isComparing ? 'Quitar de la comparación' : 'Añadir a la comparación'}
      title={atLimit ? 'Se alcanzó el máximo de ejercicios a comparar' : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-colors focus-visible:outline-2 focus-visible:outline-focus ${
        isComparing
          ? 'bg-accent/12 text-accent'
          : 'bg-paper-2 text-ink-2 hover:bg-accent/8 hover:text-accent'
      } ${compact ? 'h-8 w-8' : 'h-9 px-3 text-sm'} ${className}`}
    >
      <Icon name={isComparing ? 'check_circle' : 'compare_arrows'} size={20} />
      {!compact && (isComparing ? 'En comparación' : 'Comparar')}
    </button>
  )
}

export default CompareButton
