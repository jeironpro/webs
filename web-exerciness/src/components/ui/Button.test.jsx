// Tests del botón reutilizable (variantes y estado de carga).
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button.jsx'

describe('Button', () => {
  it('renderiza el contenido y responde al clic', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Aceptar</Button>)
    const button = screen.getByRole('button', { name: 'Aceptar' })
    expect(button).toBeEnabled()
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('muestra un spinner, marca el estado de carga y se deshabilita', () => {
    render(<Button loading>Aceptar</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
    const button = screen.getByRole('button', { name: /aceptar/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('respeta la prop disabled', () => {
    render(<Button disabled>Aceptar</Button>)
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeDisabled()
  })
})
