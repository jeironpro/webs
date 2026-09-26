// Tests de la barra flotante del comparador.
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/utils.jsx'
import CompareBar from './CompareBar.jsx'
import { useExerciseStore } from '@/store/exerciseStore.js'
import { useCompareStore } from '@/store/compareStore.js'
import { exercisesFixture } from '@/test/fixtures.js'

describe('CompareBar', () => {
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

  it('no se muestra sin ejercicios seleccionados', () => {
    renderWithRouter(<CompareBar />)
    expect(screen.queryByText(/seleccionado/i)).not.toBeInTheDocument()
  })

  it('muestra el contador y los enlaces con selección', () => {
    useCompareStore.setState({ ids: ['0001', '0002'] })
    renderWithRouter(<CompareBar />)
    expect(screen.getByText(/2 seleccionados/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /comparar/i })).toHaveAttribute('href', '/comparar')
  })

  it('limpia la selección', async () => {
    const user = userEvent.setup()
    useCompareStore.setState({ ids: ['0001'] })
    renderWithRouter(<CompareBar />)
    await user.click(screen.getByRole('button', { name: /limpiar/i }))
    expect(screen.queryByText(/seleccionado/i)).not.toBeInTheDocument()
  })
})
