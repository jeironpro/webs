// Tests del store de favoritos.
import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesStore, selectIsFavorite, selectFavoritesCount } from './favoritesStore.js'

describe('favoritesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useFavoritesStore.setState({ ids: [] })
  })

  it('añade un favorito', () => {
    useFavoritesStore.getState().toggleFavorite('0001')
    expect(useFavoritesStore.getState().ids).toEqual(['0001'])
  })

  it('elimina un favorito existente', () => {
    useFavoritesStore.setState({ ids: ['0001'] })
    useFavoritesStore.getState().toggleFavorite('0001')
    expect(useFavoritesStore.getState().ids).toEqual([])
  })

  it('persiste los favoritos en localStorage', () => {
    useFavoritesStore.getState().toggleFavorite('0001')
    const stored = JSON.parse(localStorage.getItem('exerciness-favorites'))
    expect(stored.state.ids).toEqual(['0001'])
  })

  it('expone selectores de favorito y contador', () => {
    useFavoritesStore.setState({ ids: ['0001', '0002'] })
    expect(selectIsFavorite('0001')(useFavoritesStore.getState())).toBe(true)
    expect(selectIsFavorite('0009')(useFavoritesStore.getState())).toBe(false)
    expect(selectFavoritesCount(useFavoritesStore.getState())).toBe(2)
  })
})
