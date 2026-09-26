// Tests de la navegación (escritorio y menú móvil).
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils.jsx'
import Navbar from './Navbar.jsx'
import { useFavoritesStore } from '@/store/favoritesStore.js'

const renderNavbar = () => renderWithRouter(<Navbar />)

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
    useFavoritesStore.setState({ ids: [] })
  })

  it('muestra los enlaces de navegación', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ejercicios/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /favoritos/i })).toBeInTheDocument()
  })

  it('no muestra contador sin favoritos', () => {
    renderNavbar()
    expect(screen.queryByLabelText(/favoritos/i)).not.toBeInTheDocument()
  })

  it('muestra el contador de favoritos', () => {
    useFavoritesStore.setState({ ids: ['0001', '0002', '0003'] })
    renderNavbar()
    expect(screen.getByLabelText('3 favoritos')).toHaveTextContent('3')
  })
})
