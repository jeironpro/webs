// Pantalla de bienvenida. Muestra el logo y redirige automaticamente a la generacion 1 tras 5 segundos.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// BASE_URL resuelve a '/' en desarrollo y a la subruta del despliegue en el build.
import logoUrl from '/pokemon-logo.png';
import '../styles/splash.css';

function Splash() {
  const navigate = useNavigate();

  // Redirige a /generation/1 despues de 5s; limpia el timeout al desmontar.
  useEffect(() => {
    const temporizador = setTimeout(() => {
      navigate('/generation/1');
    }, 5000);

    return () => clearTimeout(temporizador);
  }, [navigate]);

  return (
    <div className="splash-body">
      <div className="contenedor-logo-titulo">
        <img src={logoUrl} alt="Logo Pokemon" />
        <h1>Pokémon</h1>
        <p className="splash-subtitulo">Todas las generaciones</p>
        <div className="pokemones">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="pokemon" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Splash;
