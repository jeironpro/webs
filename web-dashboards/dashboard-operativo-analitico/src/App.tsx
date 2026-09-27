import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Base de las rutas: el directorio del index.html actual. Sirve igual en dev
// ("/") que en produccion bajo la subruta del monorepo (/webs/web-dashboards/...).
const base = new URL('.', document.baseURI).pathname
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'
import { AppShell } from '@/features/layout/AppShell'
import { ScrollManager } from '@/features/layout/ScrollManager'
import { HeroSection } from '@/features/layout/HeroSection'
import { KpiGrid } from '@/features/kpis/KpiGrid'
import { TrendsSection } from '@/features/charts/TrendsSection'
import { FilterBar } from '@/features/filters/FilterBar'
import { OrdersSection } from '@/features/orders/OrdersSection'
import { ReportsSection } from '@/features/reports/ReportsSection'
import { ProfilePage } from '@/features/profile/ProfilePage'

function Dashboard() {
    return (
        <div className="mx-auto w-full max-w-(--shell) px-4 pb-24 sm:px-6 lg:px-8">
            <HeroSection />
            <FilterBar />
            <KpiGrid />
            <TrendsSection />
            <OrdersSection />
            <ReportsSection />
        </div>
    )
}

function App() {
    return (
        <BrowserRouter basename={base}>
            <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
                <ScrollManager />
                <AppShell>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/perfil" element={<ProfilePage />} />
                    </Routes>
                </AppShell>
                <Toaster position="bottom-right" richColors closeButton />
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
