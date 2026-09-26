// Tests del icono accesible.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Icon from './Icon.jsx'

describe('Icon', () => {
  it('se oculta a lectores de pantalla sin etiqueta', () => {
    render(<Icon name="search" />)
    expect(screen.getByText('search')).toHaveAttribute('aria-hidden', 'true')
  })

  it('expone el nombre accesible cuando se proporciona label', () => {
    render(<Icon name="favorite" label="Añadir a favoritos" />)
    expect(screen.getByRole('img', { name: 'Añadir a favoritos' })).toBeInTheDocument()
  })
})
