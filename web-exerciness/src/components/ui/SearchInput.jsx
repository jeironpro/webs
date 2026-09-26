/* Hallmark · component: search-input · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import Icon from './Icon.jsx'

// Campo de búsqueda con icono de lupa superpuesto a la izquierda.
const SearchInput = ({
  value = '',
  onChange,
  placeholder = 'Buscar...',
  className = '',
  ...props
}) => (
  <div className={`relative ${className}`}>
    <Icon
      name="search"
      size={20}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-2"
    />
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-10 w-full rounded-input border border-rule bg-paper pl-10 pr-3 font-body text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:ring-2 focus:ring-focus"
      {...props}
    />
  </div>
)

export default SearchInput
