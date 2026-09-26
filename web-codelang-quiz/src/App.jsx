import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import AppRoutes from './routes';
import Captura from './pages/Captura';

// Rutas fuera del Layout: captura de preguntas para redes (ruta oculta).
// El resto de rutas normales se envuelven en Layout igual que antes.
export default function App() {
    return (
        <BrowserRouter>
            <QuizProvider>
                <Routes>
                    <Route path="/captura/:lenguaje/:id/:ratio" element={<Captura />} />
                    <Route path="*" element={<AppRoutes />} />
                </Routes>
            </QuizProvider>
        </BrowserRouter>
    );
}
