// Tests del indicador de carga.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Spinner from './Spinner.jsx'

describe('Spinner', () => {
  it('indica el estado de carga de forma accesible', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
  })
})
