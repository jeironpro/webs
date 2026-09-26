// Encabezado con el título principal "NARUTO" y decoración inferior. Componente puramente visual.
import './Header.css';

export function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">NARUTO</h1>
            </div>
            <div className="header-decor"></div>
        </header>
    );
}
