import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { TicketsPage } from './tickets-page'

function renderizar() {
    return render(
        <MemoryRouter>
            <TicketsPage />
        </MemoryRouter>,
    )
}

describe('TicketsPage', () => {
    it('muestra todos los tickets ordenados por fecha descendente', () => {
        renderizar()

        expect(screen.getByText('22 de 22 tickets')).toBeInTheDocument()

        const filas = screen.getAllByRole('row')
        expect(filas.length).toBe(23)

        expect(
            within(filas[1]).getByText('El checkout devuelve error 500 al finalizar la compra'),
        ).toBeInTheDocument()
    })

    it('filtra por búsqueda', async () => {
        const usuario = userEvent.setup()
        renderizar()

        await usuario.type(screen.getByRole('searchbox', { name: 'Buscar tickets' }), 'checkout')

        expect(screen.getByText('1 ticket')).toBeInTheDocument()
        expect(
            screen.getByText('El checkout devuelve error 500 al finalizar la compra'),
        ).toBeInTheDocument()
    })

    it('filtra por estado', async () => {
        const usuario = userEvent.setup()
        renderizar()

        await usuario.click(screen.getByRole('combobox', { name: 'Estado' }))
        await usuario.click(await screen.findByRole('option', { name: 'Abierto' }))

        expect(screen.getByText('6 de 22 tickets')).toBeInTheDocument()
        const tabla = screen.getByRole('table')
        expect(within(tabla).getAllByText('Abierto').length).toBe(6)
        expect(within(tabla).queryByText('Cerrado')).not.toBeInTheDocument()
    })

    it('muestra un estado vacío y limpia los filtros', async () => {
        const usuario = userEvent.setup()
        renderizar()

        await usuario.type(
            screen.getByRole('searchbox', { name: 'Buscar tickets' }),
            'texto inexistente',
        )

        expect(screen.getByText('No se encontraron tickets')).toBeInTheDocument()

        await usuario.click(screen.getAllByRole('button', { name: 'Limpiar filtros' })[0])

        expect(screen.queryByText('No se encontraron tickets')).not.toBeInTheDocument()
        expect(screen.getByText('22 de 22 tickets')).toBeInTheDocument()
    })

    it('no tiene violaciones de accesibilidad', async () => {
        const { container } = renderizar()

        const resultados = await axe(container)
        expect(resultados).toHaveNoViolations()
    })
})
