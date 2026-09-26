import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Temas disponibles para la aplicación.
export const THEMES = { LIGHT: 'light', DARK: 'dark' }

// Tema por defecto: sigue la preferencia del sistema operativo.
const getSystemTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

// Aplica o quita la clase .dark en el elemento <html>.
const applyThemeClass = (theme) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === THEMES.DARK)
}

// Store del tema persistido en localStorage.
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: getSystemTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK })),
    }),
    { name: 'exerciness-theme' },
  ),
)

// Mantiene la clase del DOM sincronizada con el estado.
applyThemeClass(useThemeStore.getState().theme)
useThemeStore.subscribe((state) => applyThemeClass(state.theme))

// Selector: expone el tema activo.
export const selectTheme = (state) => state.theme
