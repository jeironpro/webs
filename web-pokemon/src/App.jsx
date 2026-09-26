// Componente raiz. Define las rutas: Splash (/), generaciones (con Layout), y 404 (*).
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Splash from './pages/Splash';
import GenerationPage from './pages/GenerationPage';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Splash />} />
            <Route element={<Layout />}>
                <Route path="/generation/:id" element={<GenerationPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
