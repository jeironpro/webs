import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import AppRoutes from './routes';
import Captura from './pages/Captura';

// Rutas fuera del Layout: captura de preguntas para redes (ruta oculta).
// El resto de rutas normales se envuelven en Layout igual que antes.
// La app se sirve desde un subdirectorio (p. ej. /web-codelang-quiz/ en el
// monorepo de webs), asi que el basename se deriva en runtime recortando el
// pathname del bundle desde /assets/. En desarrollo no hay script de assets
// y el basename es ''.
const scriptSrc = document.querySelector('script[src*="assets/"]')?.src ?? ''
const basename = scriptSrc.includes('/assets/')
  ? new URL(scriptSrc).pathname.replace(/\/assets\/.*$/, '')
  : ''

export default function App() {
    return (
        <BrowserRouter basename={basename}>
            <QuizProvider>
                <Routes>
                    <Route path="/captura/:lenguaje/:id/:ratio" element={<Captura />} />
                    <Route path="*" element={<AppRoutes />} />
                </Routes>
            </QuizProvider>
        </BrowserRouter>
    );
}
