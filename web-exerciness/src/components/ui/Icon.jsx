/* Hallmark · component: icon · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
// Icono de Material Symbols (Google Icons) renderizado de forma accesible.
// Se prohíbe el uso de emojis en el código; cualquier símbolo pasa por este componente.
// Con `label` se expone como imagen accesible; sin él, se oculta del lector de pantalla.
const Icon = ({ name, size = 24, label, className = '', ...props }) => (
  <span
    className={`material-symbols-rounded select-none ${className}`}
    style={{ fontSize: size }}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    {...props}
  >
    {name}
  </span>
)

export default Icon
