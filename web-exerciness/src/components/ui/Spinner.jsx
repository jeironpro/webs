/* Hallmark · component: spinner · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
// Indicador de carga circular reutilizable. El color se hereda de `currentColor`
// salvo que se pase una clase específica (p. ej. text-accent).
const Spinner = ({ className = '', ...props }) => (
  <span
    className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    role="status"
    aria-label="Cargando"
    {...props}
  />
)

export default Spinner
