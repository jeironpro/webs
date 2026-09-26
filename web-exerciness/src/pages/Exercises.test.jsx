import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/utils.jsx'
import Exercises from '@/pages/Exercises.jsx'
import { useExerciseStore } from '@/store/exerciseStore.js'
import { useFilterStore } from '@/store/filterStore.js'
import { exercisesFixture } from '@/test/fixtures.js'
import { ALL } from '@/utils/constants.js'

vi.mock('@/services/exerciseService.js', () => ({
  fetchExercises: vi.fn(),
}))

import { fetchExercises } from '@/services/exerciseService.js'

describe('Exercises', () => {
  beforeEach(() => {
    useExerciseStore.setState({ exercises: [], loading: false, error: null, loaded: false })
    useFilterStore.setState({
      search: '',
      bodyPart: ALL,
      equipment: ALL,
      target: ALL,
      muscleGroup: ALL,
      sortBy: 'name',
    })
    vi.clearAllMocks()
    fetchExercises.mockResolvedValue(exercisesFixture())
  })

  it('muestra el catálogo tras cargar los datos', async () => {
    renderWithRouter(<Exercises />, { route: '/ejercicios', path: '/ejercicios' })
    expect(await screen.findByText('Bench press')).toBeInTheDocument()
    expect(screen.getByText(/3 ejercicios encontrados/i)).toBeInTheDocument()
  })

  it('filtra por el término de búsqueda', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Exercises />, { route: '/ejercicios', path: '/ejercicios' })
    await screen.findByText('Bench press')
    await user.type(screen.getByRole('searchbox'), 'bicep')
    expect(screen.getByText('Bicep curl')).toBeInTheDocument()
    expect(screen.queryByText('Bench press')).not.toBeInTheDocument()
  })

  it('muestra el estado vacío cuando no hay resultados', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Exercises />, { route: '/ejercicios', path: '/ejercicios' })
    await screen.findByText('Bench press')
    await user.type(screen.getByRole('searchbox'), 'inexistente')
    expect(screen.getByRole('heading', { name: 'Sin resultados' })).toBeInTheDocument()
  })

  it('filtra por grupo corporal', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Exercises />, { route: '/ejercicios', path: '/ejercicios' })
    await screen.findByText('Bench press')
    await user.selectOptions(screen.getByLabelText('Grupo corporal'), 'chest')
    expect(screen.getByText('Bench press')).toBeInTheDocument()
    expect(screen.queryByText('Bicep curl')).not.toBeInTheDocument()
  })

  it('muestra el error con opción de reintentar', async () => {
    fetchExercises.mockRejectedValue(new Error('sin conexión'))
    renderWithRouter(<Exercises />, { route: '/ejercicios', path: '/ejercicios' })
    expect(await screen.findByText('No se pudo cargar')).toBeInTheDocument()
    expect(screen.getByText('sin conexión')).toBeInTheDocument()
  })

  it('cuenta los resultados visibles', async () => {
    renderWithRouter(<Exercises />, { route: '/ejercicios', path: '/ejercicios' })
    await screen.findByText('Bench press')
    expect(screen.getByText(/3 ejercicios encontrados/i)).toBeInTheDocument()
  })
})
