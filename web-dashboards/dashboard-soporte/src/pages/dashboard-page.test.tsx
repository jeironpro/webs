import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { DashboardPage } from './dashboard-page'

describe('DashboardPage', () => {
    it('muestra los KPIs principales', () => {
        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>,
        )

        expect(screen.getByText('Tickets abiertos')).toBeInTheDocument()
        expect(screen.getByText('Tiempo de respuesta promedio')).toBeInTheDocument()
        expect(screen.getAllByText('Cerrados').length).toBeGreaterThan(0)
        expect(screen.getAllByText('En progreso').length).toBeGreaterThan(0)
    })

    it('no tiene violaciones de accesibilidad', async () => {
        const { container } = render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>,
        )

        const resultados = await axe(container)
        expect(resultados).toHaveNoViolations()
    })
})
