// Tests del store del tema claro/oscuro.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThemeStore, selectTheme, THEMES } from './themeStore.js'

describe('themeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ theme: THEMES.LIGHT })
    document.documentElement.classList.remove('dark')
  })

  it('alterna entre claro y oscuro', () => {
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe(THEMES.DARK)
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe(THEMES.LIGHT)
  })

  it('aplica la clase .dark en el documento', () => {
    useThemeStore.getState().toggleTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    useThemeStore.getState().toggleTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('fija un tema con setTheme', () => {
    useThemeStore.getState().setTheme(THEMES.DARK)
    expect(useThemeStore.getState().theme).toBe(THEMES.DARK)
  })

  it('persiste el tema en localStorage', () => {
    useThemeStore.getState().setTheme(THEMES.DARK)
    const stored = JSON.parse(localStorage.getItem('exerciness-theme'))
    expect(stored.state.theme).toBe(THEMES.DARK)
  })

  it('expone el tema activo con el selector', () => {
    expect(selectTheme(useThemeStore.getState())).toBe(THEMES.LIGHT)
  })

  it('respeta la preferencia del sistema sin tema persistido', async () => {
    vi.resetModules()
    localStorage.clear()
    window.matchMedia = vi.fn().mockImplementation((query) => ({ matches: query.includes('dark') }))
    const { useThemeStore: systemStore, THEMES: themes } = await import('./themeStore.js')
    expect(systemStore.getState().theme).toBe(themes.DARK)
    delete window.matchMedia
  })
})
