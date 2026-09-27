import { PLAYER_1, PLAYER_2 } from "@/features/game/constants.js";
import "./Scoreboard.css";

// Marcador superior: badge (modo/dificultad), nombres de los jugadores y
// contadores de cajas; el jugador en turno queda resaltado con su color.
function Scoreboard({
  player1Name,
  player2Name,
  player1Count,
  player2Count,
  badge = null,
  turn,
}) {
  const player1Active = turn === PLAYER_1;
  const player2Active = turn === PLAYER_2;

  return (
    <section className="scoreboard" aria-label="Marcador de la partida">
      {badge !== null && (
        <div className="scoreboard__badge-row">
          <span className="scoreboard__badge">{badge}</span>
        </div>
      )}
      <div className="scoreboard__names">
        <span
          className={`scoreboard__name${player1Active ? " scoreboard__name--player-1" : ""}`}
        >
          {player1Name}
        </span>
        <span
          className={`scoreboard__name${player2Active ? " scoreboard__name--player-2" : ""}`}
        >
          {player2Name}
        </span>
      </div>
      <div className="scoreboard__counts">
        <span
          className={`scoreboard__count${player1Active ? " scoreboard__count--player-1" : ""}`}
        >
          {player1Count}
        </span>
        <span className="scoreboard__vs" aria-hidden="true">
          VS
        </span>
        <span
          className={`scoreboard__count${player2Active ? " scoreboard__count--player-2" : ""}`}
        >
          {player2Count}
        </span>
      </div>
    </section>
  );
}

export default Scoreboard;
