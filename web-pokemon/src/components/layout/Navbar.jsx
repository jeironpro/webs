// Barra de navegacion superior. Menu responsive con hamburguesa y enlaces a las 9 generaciones.
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
// BASE_URL resuelve a '/' en desarrollo y a la subruta del despliegue en el build.
import logoUrl from '/pokemon-logo.png';
import '../../styles/components/navbar.css';

const GENERACIONES = [
  { id: 1, label: '1 Generación' },
  { id: 2, label: '2 Generación' },
  { id: 3, label: '3 Generación' },
  { id: 4, label: '4 Generación' },
  { id: 5, label: '5 Generación' },
  { id: 6, label: '6 Generación' },
  { id: 7, label: '7 Generación' },
  { id: 8, label: '8 Generación' },
  { id: 9, label: '9 Generación' },
];

function Navbar() {
  // Estado del menu hamburguesa en mobile.
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header>
      <nav>
        <div className="contenedor-logo">
          <Link to="/" onClick={cerrarMenu}>
            <img src={logoUrl} alt="Logo Pokemon" />
            <h1>Pokémon</h1>
          </Link>
        </div>
        <button
          className="hamburger"
          onClick={() => setMenuAbierto((prev) => !prev)}
          aria-label="Menu de navegacion"
        >
          <span className="material-icons">
            {menuAbierto ? 'close' : 'menu'}
          </span>
        </button>
        <div
          className={`nav-generaciones${menuAbierto ? ' abierto' : ''}`}
          onClick={cerrarMenu}
        >
          {GENERACIONES.map((gen) => (
            <NavLink
              key={gen.id}
              to={`/generation/${gen.id}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {gen.label}
            </NavLink>
          ))}
        </div>
        {menuAbierto && <div className="overlay" onClick={cerrarMenu} />}
      </nav>
    </header>
  );
}

export default Navbar;
