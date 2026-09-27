import Button from "@/components/ui/Button.jsx";
import Icon from "@/components/ui/Icon.jsx";
import "./GameOver.css";

// Panel de fin de partida: muestra el resultado (ganador o empate) y permite
// volver a jugar o regresar al menú de inicio
function GameOver({ winnerName = null, onPlayAgain, onMenu }) {
  const isTie = winnerName === null;
  return (
    <section className="game-over" aria-label="Fin de la partida">
      <div className="game-over__card">
        <Icon name="emoji_events" className="game-over__icon" />
        <h2 className="game-over__title">
          {isTie ? "Empate" : `Gana ${winnerName}`}
        </h2>
        <div className="game-over__actions">
          <Button onClick={onPlayAgain}>Jugar de nuevo</Button>
          <Button variant="secondary" onClick={onMenu}>
            Menú
          </Button>
        </div>
      </div>
    </section>
  );
}

export default GameOver;
