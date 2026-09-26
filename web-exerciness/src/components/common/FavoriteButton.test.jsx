// Tests del botón de favoritos.
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FavoriteButton from './FavoriteButton.jsx'
import { useFavoritesStore } from '@/store/favoritesStore.js'

describe('FavoriteButton', () => {
  beforeEach(() => {
    localStorage.clear()
    useFavoritesStore.setState({ ids: [] })
  })

  it('muestra el estado de no favorito', () => {
    render(<FavoriteButton exerciseId="0001" />)
    const button = screen.getByRole('button', { name: /favorito/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('añade el ejercicio al pulsar', async () => {
    const user = userEvent.setup()
    render(<FavoriteButton exerciseId="0001" />)
    await user.click(screen.getByRole('button', { name: /favorito/i }))
    expect(useFavoritesStore.getState().ids).toEqual(['0001'])
    expect(screen.getByRole('button', { name: /en favoritos/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('quita el ejercicio al pulsar de nuevo', async () => {
    const user = userEvent.setup()
    useFavoritesStore.setState({ ids: ['0001'] })
    render(<FavoriteButton exerciseId="0001" />)
    await user.click(screen.getByRole('button', { name: /en favoritos/i }))
    expect(useFavoritesStore.getState().ids).toEqual([])
  })
})
