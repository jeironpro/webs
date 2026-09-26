// Tests del badge (etiqueta de clasificación).
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge.jsx'

describe('Badge', () => {
  it('renderiza la etiqueta', () => {
    render(<Badge>Cardio</Badge>)
    expect(screen.getByText('Cardio')).toBeInTheDocument()
  })

  it('aplica el tono primario', () => {
    render(<Badge tone="primary">Cardio</Badge>)
    expect(screen.getByText('Cardio').className).toContain('text-accent')
  })
})
