// Tests del alternador de tema claro/oscuro.
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/utils.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useThemeStore, THEMES } from '@/store/themeStore.js'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ theme: THEMES.LIGHT })
    document.documentElement.classList.remove('dark')
  })

  it('muestra el estado por defecto en modo claro', () => {
    renderWithRouter(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Activar modo oscuro' })).toBeInTheDocument()
  })

  it('alterna el tema al hacer clic', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: 'Activar modo oscuro' }))
    expect(screen.getByRole('button', { name: 'Activar modo claro' })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('respeta un tema oscuro ya activo', () => {
    useThemeStore.setState({ theme: THEMES.DARK })
    renderWithRouter(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Activar modo claro' })).toBeInTheDocument()
  })
})
