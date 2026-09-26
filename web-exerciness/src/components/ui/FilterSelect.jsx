/* Hallmark · component: select · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import { useId } from 'react'
import Icon from './Icon.jsx'

// Select de filtro con etiqueta asociada y flecha personalizada.
// Las opciones se pasan como [{ value, label }].
const FilterSelect = ({ label, value, onChange, options = [], className = '', ...props }) => {
  // useId genera un id estable por instancia para asociar label y select.
  const selectId = useId()
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="font-mono text-xs font-medium uppercase tracking-wider text-ink-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className="h-10 w-full appearance-none rounded-input border border-rule bg-paper pl-3 pr-9 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-focus"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Flecha decorativa superpuesta; el select nativo oculta su aspecto. */}
        <Icon
          name="expand_more"
          size={20}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-2"
        />
      </div>
    </div>
  )
}

export default FilterSelect
