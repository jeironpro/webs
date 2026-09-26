/* Hallmark · component: navbar · genre: playful · macrostructure: N7 · theme: Hum · design-system: design.md · designed-as-app */
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from '@/components/ui/Icon.jsx'
import ThemeToggle from '@/components/ui/ThemeToggle.jsx'
import { useFavoritesStore, selectFavoritesCount } from '@/store/favoritesStore.js'

// Enlaces del menú principal, compartidos por las versiones desktop y móvil.
const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/ejercicios', label: 'Ejercicios' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/comparar', label: 'Comparar' },
]

// Contador de favoritos mostrado junto al enlace correspondiente.
const FavoritesBadge = ({ count }) => (
  <span
    className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-3 px-1 text-xs font-bold text-paper"
    aria-label={`${count} ${count === 1 ? 'favorito' : 'favoritos'}`}
  >
    {count}
  </span>
)

// Enlace con estilo activo; resalta el enlace de la ruta actual.
const NavLinkItem = ({ link, favoritesCount }) => (
  <NavLink
    to={link.to}
    className={({ isActive }) =>
      `text-sm font-medium uppercase tracking-wider no-underline transition-colors ${
        isActive ? 'text-accent' : 'text-ink-2 hover:text-accent'
      }`
    }
  >
    {link.label}
    {link.to === '/favoritos' && favoritesCount > 0 && <FavoritesBadge count={favoritesCount} />}
  </NavLink>
)

// Navegación superior con menú hamburguesa en pantallas pequeñas.
export default function Navbar() {
  const favoritesCount = useFavoritesStore(selectFavoritesCount)
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b-2 border-rule bg-paper">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider text-ink no-underline"
        >
          <Icon name="fitness_center" size={22} className="text-accent" />
          <span>EXERCINESS</span>
        </NavLink>

        {/* Menú de escritorio: enlaces + alternador de tema. */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLinkItem link={link} favoritesCount={favoritesCount} />
            </li>
          ))}
          <li className="ml-2">
            <ThemeToggle />
          </li>
        </ul>

        {/* Controles móviles: tema + botón del menú hamburguesa. */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-input border border-rule bg-paper text-ink-2 transition-colors hover:border-accent hover:text-accent"
            aria-expanded={open}
            aria-controls="nav-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon
              name={open ? 'close' : 'menu'}
              size={20}
              label={open ? 'Cerrar menú' : 'Abrir menú'}
            />
          </button>
        </div>
      </nav>

      {/* Panel desplegable móvil: se muestra solo cuando el menú está abierto. */}
      {open && (
        <div
          id="nav-mobile-menu"
          className="border-t border-rule bg-paper md:hidden"
          data-testid="nav-mobile-menu"
        >
          <ul className="flex flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.to} className="border-b border-rule last:border-b-0">
                <NavLink
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 text-sm font-medium uppercase tracking-wider no-underline transition-colors ${
                      isActive ? 'text-accent' : 'text-ink-2 hover:text-accent'
                    }`
                  }
                >
                  {link.label}
                  {link.to === '/favoritos' && favoritesCount > 0 && (
                    <FavoritesBadge count={favoritesCount} />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
