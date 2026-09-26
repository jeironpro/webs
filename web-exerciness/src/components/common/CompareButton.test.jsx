// Tests del botón de añadir/quitar de la comparación.
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/utils.jsx'
import CompareButton from './CompareButton.jsx'
import { useCompareStore } from '@/store/compareStore.js'

describe('CompareButton', () => {
  beforeEach(() => {
    localStorage.clear()
    useCompareStore.setState({ ids: [] })
  })

  it('muestra el estado por defecto', () => {
    renderWithRouter(<CompareButton exerciseId="0001" />)
    expect(screen.getByRole('button', { name: /añadir a la comparación/i })).toBeInTheDocument()
    expect(screen.getByText('Comparar')).toBeInTheDocument()
  })

  it('alterna la selección al hacer clic', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CompareButton exerciseId="0001" />)
    await user.click(screen.getByRole('button', { name: /añadir a la comparación/i }))
    expect(screen.getByRole('button', { name: /quitar de la comparación/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('En comparación')).toBeInTheDocument()
  })

  it('indica el límite alcanzado', () => {
    useCompareStore.setState({ ids: ['0001', '0002', '0003', '0004'] })
    renderWithRouter(<CompareButton exerciseId="0009" />)
    expect(screen.getByRole('button', { name: /añadir a la comparación/i })).toHaveAttribute(
      'title',
      'Se alcanzó el máximo de ejercicios a comparar',
    )
  })

  it('en modo compacto solo muestra el icono', () => {
    renderWithRouter(<CompareButton exerciseId="0001" compact />)
    expect(screen.queryByText('Comparar')).not.toBeInTheDocument()
  })
})
