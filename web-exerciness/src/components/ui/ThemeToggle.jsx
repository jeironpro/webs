/* Hallmark · component: theme-toggle · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import Icon from './Icon.jsx'
import { useThemeStore, selectTheme, THEMES } from '@/store/themeStore.js'

// Alternador de tema claro/oscuro. El estado vive en useThemeStore
// (persistido en localStorage) y aplica la clase .dark en el <html>.
const ThemeToggle = () => {
  const theme = useThemeStore(selectTheme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = theme === THEMES.DARK

  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-input border border-rule bg-paper text-ink-2 transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-focus"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={20} />
    </button>
  )
}

export default ThemeToggle
