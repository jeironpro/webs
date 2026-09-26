/* Hallmark · component: card · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
// Contenedor de superficie con sombra. Si la clase pasada ya define un hover,
// se respeta (p. ej. la elevación al pasar el ratón en las tarjetas del catálogo)
// y se evita duplicar el `hover:shadow-lift` por defecto.
const Card = ({ className = '', children, ...props }) => (
  <div
    className={`rounded-card bg-paper shadow-soft transition-shadow duration-220 ${
      className.includes('hover:') ? '' : 'hover:shadow-lift'
    } ${className}`}
    {...props}
  >
    {children}
  </div>
)

export default Card
