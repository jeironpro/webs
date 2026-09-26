// Tests del select de filtro.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterSelect from './FilterSelect.jsx'

const options = [
  { value: 'chest', label: 'Pecho' },
  { value: 'back', label: 'Espalda' },
]

describe('FilterSelect', () => {
  it('muestra la etiqueta y las opciones', () => {
    render(
      <FilterSelect label="Grupo muscular" value="chest" onChange={vi.fn()} options={options} />,
    )
    expect(screen.getByLabelText('Grupo muscular')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Espalda' })).toBeInTheDocument()
  })

  it('propaga la selección del usuario', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(
      <FilterSelect
        label="Grupo muscular"
        value="chest"
        onChange={handleChange}
        options={options}
      />,
    )
    await user.selectOptions(screen.getByLabelText('Grupo muscular'), 'back')
    expect(handleChange).toHaveBeenCalled()
  })
})
