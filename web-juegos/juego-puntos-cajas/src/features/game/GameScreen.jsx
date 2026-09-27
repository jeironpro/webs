import Board from "@/features/board/Board.jsx";
import Scoreboard from "@/features/scoreboard/Scoreboard.jsx";
import Button from "@/components/ui/Button.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { countBoxes } from "@/features/game/board.js";
import { PLAYER_1, PLAYER_2 } from "@/features/game/constants.js";
import "./GameScreen.css";

// Pantalla de partida: marcador superior, tablero, controles (reiniciar y
// volver al menú) y un aviso de turno para lectores de pantalla.
function GameScreen({
  game,
  onMove,
  disabled = false,
  player1Name = "TÚ",
  player2Name = "BOT",
  badge = null,
  onRestart,
  onMenu,
}) {
  return (
    <section className="game-screen" aria-label="Pantalla de partida">
      <Scoreboard
        player1Name={player1Name}
        player2Name={player2Name}
        player1Count={countBoxes(game, PLAYER_1)}
        player2Count={countBoxes(game, PLAYER_2)}
        badge={badge}
        turn={game.turn}
      />
      <Board game={game} onMove={onMove} disabled={disabled} />
      {(onRestart !== undefined || onMenu !== undefined) && (
        <div className="game-screen__controls">
          {onRestart !== undefined && (
            <Button variant="ghost" onClick={onRestart}>
              <Icon name="restart_alt" />
              Reiniciar
            </Button>
          )}
          {onMenu !== undefined && (
            <Button variant="ghost" onClick={onMenu}>
              <Icon name="arrow_back" />
              Menú
            </Button>
          )}
        </div>
      )}
      <p className="sr-only" role="status">
        Turno del jugador {game.turn}
      </p>
    </section>
  );
}

export default GameScreen;
