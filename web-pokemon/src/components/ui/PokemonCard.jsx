// Tarjeta individual de pokemon. Muestra imagen, nombre, tipos, descripcion y estadisticas con animacion escalonada.
import { formatearNombre, formatearId } from '../../utils/helpers';
import TypeBadge from './TypeBadge';
import StatBar from './StatBar';
import '../../styles/components/card.css';

// Props: pokemon (datos del pokemon), indice (id global), retraso (ms para animacion de entrada).
function PokemonCard({ pokemon, indice, retraso }) {
  const id = formatearId(indice);
  const nombreFormateado = formatearNombre(pokemon.nombre);
  const colorTipo = pokemon.tipos?.[0]?.color || '#f0f0f0';

  return (
    <article
      className="carta"
      style={{
        animationDelay: `${retraso || 0}ms`,
        background: `linear-gradient(135deg, ${colorTipo}22 0%, ${colorTipo}11 100%)`,
      }}
    >
      <div className="carta-imagen">
        {pokemon.imagen_url ? (
          <img src={pokemon.imagen_url} alt={nombreFormateado} loading="lazy" />
        ) : (
          <div style={{ color: '#999', fontSize: '14px' }}>Sin imagen</div>
        )}
      </div>
      <div className="carta-contenido">
        <div className="carta-encabezado">
          <h3 className="carta-nombre">{nombreFormateado}</h3>
          <span className="carta-id">N.{'\u00A0'}{id}</span>
        </div>
        <div className="carta-tipos">
          {pokemon.tipos?.map((tipo, i) => (
            <TypeBadge key={i} tipo={tipo} />
          ))}
        </div>
        <p className="carta-descripcion">{pokemon.descripcion}</p>
        <div className="carta-estadisticas">
          {pokemon.estadisticas && (
            <>
              <StatBar label="PS" valor={pokemon.estadisticas.punto_salud} className="ps" />
              <StatBar label="Ataque" valor={pokemon.estadisticas.ataque} className="ataque" />
              <StatBar label="Defensa" valor={pokemon.estadisticas.defensa} className="defensa" />
              <StatBar label="At.Esp" valor={pokemon.estadisticas.ataque_especial} className="at-esp" />
              <StatBar label="Def.Esp" valor={pokemon.estadisticas.defensa_especial} className="def-esp" />
              <StatBar label="Vel." valor={pokemon.estadisticas.velocidad} className="velocidad" />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default PokemonCard;
