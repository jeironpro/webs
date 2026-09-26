/* Hallmark · component: button · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import Spinner from './Spinner.jsx'

// Clases base de cada variante visual del botón.
const variants = {
  primary: 'btn',
  secondary: 'btn btn--soft',
  outline: 'btn btn--outline',
  ghost: 'btn btn--outline !shadow-none !border-rule',
}

// Tamaños disponibles: controlan el padding y el cuerpo de la fuente.
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
  xl: 'px-8 py-4 text-lg',
}

// Botón reutilizable con variantes y tamaño configurables.
// En modo `loading` muestra un spinner y se deshabilita.
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={`${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading && <Spinner className="h-4 w-4" />}
    {children}
  </button>
)

export default Button
