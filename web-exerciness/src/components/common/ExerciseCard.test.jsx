// Tests de la tarjeta de ejercicio del catálogo.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils.jsx'
import ExerciseCard from './ExerciseCard.jsx'
import { exerciseFixture } from '@/test/fixtures.js'

describe('ExerciseCard', () => {
  it('muestra la miniatura, el nombre y las etiquetas', () => {
    renderWithRouter(<ExerciseCard exercise={exerciseFixture()} />)
    expect(screen.getByRole('img', { name: '3/4 sit-up' })).toBeInTheDocument()
    expect(screen.getByText('3/4 sit-up')).toBeInTheDocument()
    expect(screen.getByText('Cintura')).toBeInTheDocument()
    expect(screen.getByText('Peso corporal')).toBeInTheDocument()
  })

  it('enlaza a la página de detalle', () => {
    renderWithRouter(<ExerciseCard exercise={exerciseFixture()} />)
    expect(screen.getByRole('link', { name: /3\/4 sit-up/i })).toHaveAttribute(
      'href',
      '/ejercicio/0001',
    )
  })
})
