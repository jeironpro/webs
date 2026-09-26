// Pagina principal de exploracion. Muestra pokemon de una generacion con busqueda, filtro por tipo y paginacion.
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonData } from '../hooks/usePokemonData';
import PokemonCard from '../components/ui/PokemonCard';
import { GENERACIONES } from '../utils/constants';
import '../styles/generation.css';

const TIPOS_DISPONIBLES = [
  'Acero', 'Agua', 'Bicho', 'Dragón', 'Electrico',
  'Eléctrico', 'Fantasma', 'Fuego', 'Hada', 'Hielo',
  'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca',
  'Siniestro', 'Tierra', 'Veneno', 'Volador',
];

const POR_PAGINA = 24;

function GenerationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const generacion = GENERACIONES.find((g) => g.id === Number(id));
  const generacionActual = Number(id);
  const totalGeneraciones = GENERACIONES.length;
  const progreso = (generacionActual / totalGeneraciones) * 100;

  // Estado local para busqueda por nombre, filtro por tipo y paginacion.
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  // Hook personalizado que obtiene los datos segun generacion, pagina, busqueda y tipo.
  const { datos, total, totalPaginas, cargando, error } = usePokemonData({
    generacion: generacionActual,
    pagina: paginaActual,
    porPagina: POR_PAGINA,
    busqueda,
    tipo: tipoFiltro,
  });

  // Reinicia a pagina 1 al cambiar busqueda o filtro.
  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const manejarTipo = (e) => {
    setTipoFiltro(e.target.value);
    setPaginaActual(1);
  };

  if (!generacion) {
    return (
      <div className="generacion-contenido">
        <h2>Generacion no valida</h2>
        <p>Selecciona una generacion del menu de navegacion.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="generacion-contenido">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="generacion-contenido">
      <div className="generacion-navegacion">
        <button
          className="generacion-btn"
          disabled={generacionActual <= 1}
          onClick={() => navigate(`/generation/${generacionActual - 1}`)}
        >
          <span className="material-icons">arrow_back</span>
          <span>Anterior</span>
        </button>

        <div className="generacion-progreso">
          <span>Generacion {generacionActual} de {totalGeneraciones}</span>
          <div className="generacion-barra">
            <div
              className="generacion-barra-inner"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        <button
          className="generacion-btn"
          disabled={generacionActual >= totalGeneraciones}
          onClick={() => navigate(`/generation/${generacionActual + 1}`)}
        >
          <span>Siguiente</span>
          <span className="material-icons">arrow_forward</span>
        </button>
      </div>

      <h2>Pokemon de {generacion.nombre} generacion</h2>

      <div className="filtros">
        <input
          className="buscador"
          type="text"
          placeholder="Buscar pokemon..."
          value={busqueda}
          onChange={manejarBusqueda}
        />
        <select
          className="filtro-tipo"
          value={tipoFiltro}
          onChange={manejarTipo}
        >
          <option value="">Todos los tipos</option>
          {TIPOS_DISPONIBLES.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-imagen" />
              <div className="skeleton-contenido">
                <div className="skeleton-line short" />
                <div className="skeleton-line medium" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      ) : datos.length === 0 ? (
        <p className="sin-resultados">No se encontraron pokemon con esos filtros.</p>
      ) : (
        <>
          <div className="contenedor-cartas">
            {datos.map((pokemon, i) => (
              <PokemonCard
                key={pokemon.indice_global}
                pokemon={pokemon}
                indice={pokemon.indice_global}
                retraso={(i % 20) * 40}
              />
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacion">
              <button
                className="generacion-btn"
                disabled={paginaActual <= 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <span className="paginacion-info">
                {paginaActual} de {totalPaginas} ({total} pokemon)
              </span>
              <button
                className="generacion-btn"
                disabled={paginaActual >= totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GenerationPage;