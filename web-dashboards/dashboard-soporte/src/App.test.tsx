import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
    it('muestra la navegación principal del dashboard', () => {
        render(<App />)
        expect(screen.getByRole('link', { name: 'Panel' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /tickets/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Nuevo ticket' })).toBeInTheDocument()
    })
})
