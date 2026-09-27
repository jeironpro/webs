import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Base de las rutas: el directorio del index.html actual. Sirve igual en dev
// ("/") que en produccion bajo la subruta del monorepo (/webs/web-dashboards/...).
const base = new URL('.', document.baseURI).pathname
import { AppShell } from '@/components/layout/app-shell'
import { DashboardPage } from '@/pages/dashboard-page'
import { TicketsPage } from '@/pages/tickets-page'
import { TicketDetailPage } from '@/pages/ticket-detail-page'
import { ProfilePage } from '@/pages/profile-page'

function App() {
    return (
        <BrowserRouter basename={base}>
            <Routes>
                <Route element={<AppShell />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="tickets" element={<TicketsPage />} />
                    <Route path="tickets/:ticketId" element={<TicketDetailPage />} />
                    <Route path="perfil" element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
