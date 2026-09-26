// Punto de entrada de la app. Renderiza el component App dentro de BrowserRouter y StrictMode.
// El basename se deriva en runtime del src del bundle para que el router funcione
// servido desde un subdirectorio (p. ej. /webs/web-pokemon/ en el monorepo).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { basename } from './services/api';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter basename={basename}>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
