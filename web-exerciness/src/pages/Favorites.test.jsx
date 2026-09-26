// Tests de la página de favoritos.
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils.jsx'
import Favorites from '@/pages/Favorites.jsx'
import { useExerciseStore } from '@/store/exerciseStore.js'
import { useFavoritesStore } from '@/store/favoritesStore.js'
import { exercisesFixture } from '@/test/fixtures.js'

describe('Favorites', () => {
  beforeEach(() => {
    useExerciseStore.setState({
      exercises: exercisesFixture(),
      loading: false,
      error: null,
      loaded: true,
    })
    useFavoritesStore.setState({ ids: [] })
  })

  it('muestra los ejercicios marcados como favoritos', () => {
    useFavoritesStore.setState({ ids: ['0002', '0003'] })
    renderWithRouter(<Favorites />, { route: '/favoritos', path: '/favoritos' })
    expect(screen.getByText('Bicep curl')).toBeInTheDocument()
    expect(screen.getByText('Bench press')).toBeInTheDocument()
    expect(screen.queryByText('3/4 sit-up')).not.toBeInTheDocument()
    expect(screen.getByText(/2 ejercicios guardados/i)).toBeInTheDocument()
  })

  it('muestra el estado vacío cuando no hay favoritos', () => {
    renderWithRouter(<Favorites />, { route: '/favoritos', path: '/favoritos' })
    expect(screen.getByRole('heading', { name: 'Aún no tienes favoritos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explorar ejercicios/i })).toHaveAttribute(
      'href',
      '/ejercicios',
    )
  })
})
