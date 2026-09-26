// Tests de la tarjeta de superficie.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card.jsx'

describe('Card', () => {
  it('renderiza sus hijos', () => {
    render(<Card>Contenido de la tarjeta</Card>)
    expect(screen.getByText('Contenido de la tarjeta')).toBeInTheDocument()
  })
})
