// Test del componente raíz App (renderizado del enrutador).
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App.jsx'

// Smoke test: verifica que el shell de la aplicación se monta correctamente.
describe('App', () => {
  it('renderiza el shell con cabecera, navegación y pie', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('muestra la página de inicio en la ruta raíz', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /seis para empezar/i })).toBeInTheDocument()
  })
})
