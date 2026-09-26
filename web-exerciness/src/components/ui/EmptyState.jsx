/* Hallmark · component: empty-state · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import Icon from './Icon.jsx'

// Estado vacío con icono, título, descripción opcional y acción (enlace/botón).
// Se usa en páginas sin resultados o sin datos cargados.
const EmptyState = ({ icon = 'fitness_center', title, description, action }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    <Icon name={icon} size={40} className="text-ink-2" />
    <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
    {description && <p className="max-w-md font-body text-sm text-ink-2">{description}</p>}
    {action}
  </div>
)

export default EmptyState
