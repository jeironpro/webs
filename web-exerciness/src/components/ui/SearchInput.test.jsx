// Tests del campo de búsqueda.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchInput from './SearchInput.jsx'

describe('SearchInput', () => {
  it('refleja el valor y propaga los cambios', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<SearchInput value="press" onChange={handleChange} />)
    const input = screen.getByRole('searchbox')
    await user.type(input, 'a')
    expect(handleChange).toHaveBeenCalled()
  })
})
