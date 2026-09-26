// Tests de la página del comparador.
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/utils.jsx'
import Compare from '@/pages/Compare.jsx'
import { useExerciseStore } from '@/store/exerciseStore.js'
import { useCompareStore } from '@/store/compareStore.js'
import { exercisesFixture } from '@/test/fixtures.js'

const renderCompare = () => renderWithRouter(<Compare />, { route: '/comparar', path: '/comparar' })

describe('Compare', () => {
  beforeEach(() => {
    localStorage.clear()
    useExerciseStore.setState({
      exercises: exercisesFixture(),
      loading: false,
      error: null,
      loaded: true,
    })
    useCompareStore.setState({ ids: [] })
  })

  it('muestra el estado vacío con menos de dos ejercicios', () => {
    useCompareStore.setState({ ids: ['0002'] })
    renderCompare()
    expect(
      screen.getByRole('heading', { name: 'Selecciona al menos dos ejercicios' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ir al catálogo/i })).toHaveAttribute(
      'href',
      '/ejercicios',
    )
  })

  it('muestra la tabla lado a lado con los atributos', () => {
    useCompareStore.setState({ ids: ['0002', '0003'] })
    renderCompare()
    expect(screen.getByText('Bicep curl')).toBeInTheDocument()
    expect(screen.getByText('Bench press')).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Grupo corporal' })).toBeInTheDocument()
    expect(screen.getByText('Brazos')).toBeInTheDocument()
    expect(screen.getAllByText('Pecho').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('link', { name: /bicep curl/i })).toHaveAttribute(
      'href',
      '/ejercicio/0002',
    )
  })

  it('elimina un ejercicio de la tabla', async () => {
    const user = userEvent.setup()
    useCompareStore.setState({ ids: ['0001', '0002', '0003'] })
    renderCompare()
    await user.click(screen.getAllByRole('button', { name: /quitar/i })[0])
    expect(screen.queryByText('3/4 sit-up')).not.toBeInTheDocument()
    expect(screen.getByText('Bicep curl')).toBeInTheDocument()
    expect(screen.getByText('Bench press')).toBeInTheDocument()
  })
})
