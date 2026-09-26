// Tests de la página de detalle de un ejercicio.
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/utils.jsx'
import ExerciseDetail from '@/pages/ExerciseDetail.jsx'
import { useExerciseStore } from '@/store/exerciseStore.js'
import { useFavoritesStore } from '@/store/favoritesStore.js'
import { exercisesFixture } from '@/test/fixtures.js'

const renderDetail = (route = '/ejercicio/0001') =>
  renderWithRouter(<ExerciseDetail />, { route, path: '/ejercicio/:id' })

describe('ExerciseDetail', () => {
  beforeEach(() => {
    useExerciseStore.setState({
      exercises: exercisesFixture(),
      loading: false,
      error: null,
      loaded: true,
    })
    useFavoritesStore.setState({ ids: [] })
  })

  it('muestra el nombre, etiquetas e instrucciones del ejercicio', () => {
    renderDetail()
    expect(screen.getByRole('heading', { name: '3/4 sit-up' })).toBeInTheDocument()
    expect(screen.getByText('Cintura')).toBeInTheDocument()
    expect(screen.getByText('Peso corporal')).toBeInTheDocument()
    expect(screen.getByText('Abdominales')).toBeInTheDocument()
    expect(screen.getByText('Túmbate boca arriba.')).toBeInTheDocument()
    expect(screen.getByText('Sube el torso hacia delante.')).toBeInTheDocument()
  })

  it('muestra los músculos implicados', () => {
    renderDetail()
    expect(screen.getAllByText('Flexores de cadera').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Lumbar')).toBeInTheDocument()
  })

  it('muestra la atribución obligatoria de la media', () => {
    renderDetail()
    expect(screen.getByText(/Gym visual/)).toBeInTheDocument()
  })

  it('permite reproducir la animación bajo demanda', async () => {
    const user = userEvent.setup()
    renderDetail()
    const playButton = screen.getByRole('button', { name: /reproducir/i })
    await user.click(playButton)
    expect(screen.getByRole('img', { name: 'Animación de 3/4 sit-up' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pausar/i })).toBeInTheDocument()
  })

  it('añade y quita favoritos desde el detalle', async () => {
    const user = userEvent.setup()
    renderDetail()
    await user.click(screen.getByRole('button', { name: /favorito/i }))
    expect(useFavoritesStore.getState().ids).toEqual(['0001'])
    await user.click(screen.getByRole('button', { name: /en favoritos/i }))
    expect(useFavoritesStore.getState().ids).toEqual([])
  })

  it('muestra un estado cuando el ejercicio no existe', () => {
    renderDetail('/ejercicio/9999')
    expect(screen.getByRole('heading', { name: 'Ejercicio no encontrado' })).toBeInTheDocument()
  })

  it('enlaza de vuelta al catálogo', () => {
    renderDetail()
    expect(screen.getByRole('link', { name: /volver/i })).toHaveAttribute('href', '/ejercicios')
  })
})
