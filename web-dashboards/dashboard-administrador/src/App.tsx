import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Base de las rutas: el directorio del index.html actual. Sirve igual en dev
// ("/") que en produccion bajo la subruta del monorepo (/webs/web-dashboards/...).
const base = new URL(".", document.baseURI).pathname;

import { AppShell } from "@/components/layout/AppShell";
import { Placeholder } from "@/pages/Placeholder";

// Rutas principales en carga perezosa para mantener el bundle inicial pequeño.
const Overview = lazy(() => import("@/pages/Overview"));
const Users = lazy(() => import("@/pages/Users"));
const Content = lazy(() => import("@/pages/Content"));
const Logs = lazy(() => import("@/pages/Logs"));
const Settings = lazy(() => import("@/pages/Settings"));
const Health = lazy(() => import("@/pages/Health"));
const Reports = lazy(() => import("@/pages/Reports"));
const Profile = lazy(() => import("@/pages/Profile"));

function PageLoader() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center" aria-live="polite">
            <span className="mono-label text-muted-foreground">cargando…</span>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter basename={base}>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route element={<AppShell />}>
                        <Route index element={<Overview />} />
                        <Route path="usuarios" element={<Users />} />
                        <Route path="contenido" element={<Content />} />
                        <Route path="auditoria" element={<Logs />} />
                        <Route path="configuracion" element={<Settings />} />
                        <Route path="salud" element={<Health />} />
                        <Route path="reportes" element={<Reports />} />
                        <Route path="perfil" element={<Profile />} />
                    </Route>
                    <Route
                        path="*"
                        element={<Placeholder title="Página no encontrada" />}
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
