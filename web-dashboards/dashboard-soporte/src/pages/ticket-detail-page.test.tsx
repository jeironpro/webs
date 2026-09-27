import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TicketDetailPage } from './ticket-detail-page'

function renderizar(ruta = '/tickets/TK-1042') {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
            </Routes>
        </MemoryRouter>,
    )
}

describe('TicketDetailPage', () => {
    it('muestra el encabezado del ticket y sus datos', () => {
        renderizar()

        expect(
            screen.getByText('El checkout devuelve error 500 al finalizar la compra'),
        ).toBeInTheDocument()
        expect(screen.getByText('En progreso')).toBeInTheDocument()
        expect(screen.getByText('Alta')).toBeInTheDocument()
        expect(screen.getByText('TK-1042')).toBeInTheDocument()
    })

    it('muestra el historial de conversaciones', () => {
        renderizar()

        expect(screen.getByText(/varios clientes nos reportan un error 500/i)).toBeInTheDocument()
        expect(screen.getByText(/5 mensajes/)).toBeInTheDocument()
        expect(screen.getByText('Nota interna · Martín Ríos')).toBeInTheDocument()
    })

    it('muestra datos del cliente y del agente asignado', () => {
        renderizar()

        expect(screen.getByText('Tecno Plaza')).toBeInTheDocument()
        expect(screen.getAllByText('Martín Ríos').length).toBeGreaterThan(0)
    })

    it('informa cuando el ticket no existe', () => {
        renderizar('/tickets/NO-EXISTE')

        expect(screen.getByText('Ticket no encontrado')).toBeInTheDocument()
        expect(screen.getByText(/NO-EXISTE/)).toBeInTheDocument()
    })

    it('no tiene violaciones de accesibilidad', async () => {
        const { container } = renderizar()

        const resultados = await axe(container)
        expect(resultados).toHaveNoViolations()
    })
})
