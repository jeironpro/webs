// Tests del estado vacío.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState.jsx'

describe('EmptyState', () => {
  it('muestra el título y la descripción', () => {
    render(<EmptyState title="Sin resultados" description="Prueba otros filtros." />)
    expect(screen.getByRole('heading', { name: 'Sin resultados' })).toBeInTheDocument()
    expect(screen.getByText('Prueba otros filtros.')).toBeInTheDocument()
  })
})
