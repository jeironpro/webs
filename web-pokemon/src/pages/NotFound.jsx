// Pagina 404. Muestra un mensaje de error y un enlace para volver al inicio.
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '20px',
            }}
        >
            <h1>404 - Pagina no encontrada</h1>
            <p>La pagina que buscas no existe.</p>
            <Link to="/" style={{ color: '#ff5a5a', fontSize: '18px' }}>
                Volver al inicio
            </Link>
        </div>
    );
}

export default NotFound;
