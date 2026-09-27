import { useState } from "react";
import { useGame } from "@/hooks/useGame.js";
import GameScreen from "@/features/game/GameScreen.jsx";
import HomeScreen from "@/features/menu/HomeScreen.jsx";
import GameOver from "@/features/menu/GameOver.jsx";
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTY_LABELS,
} from "@/features/bot/difficulty.js";
import { getWinner, isGameOver } from "@/features/game/game.js";
import { PLAYER_1, PLAYER_2 } from "@/features/game/constants.js";
import "./App.css";

// Composición raíz: alterna entre el menú de inicio y la partida, maneja el
// modo (contra el bot o dos jugadores) y muestra el panel de fin de partida.
function App() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("bot");
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const { game, makeMove, restart } = useGame({
    botDifficulty: mode === "bot" ? difficulty : null,
  });

  const startGame = (nextMode, nextDifficulty) => {
    setMode(nextMode);
    setDifficulty(nextDifficulty);
    restart();
    setScreen("game");
  };

  const goHome = () => {
    // se reinicia la partida para cancelar turnos pendientes del bot al salir
    restart();
    setScreen("home");
  };

  const playAgain = () => {
    restart();
  };

  const botTurn = mode === "bot" && game.turn === PLAYER_2;
  const gameOver = isGameOver(game);
  const player1Name = mode === "bot" ? "TÚ" : "Jugador 1";
  const player2Name = mode === "bot" ? "BOT" : "Jugador 2";
  const badge = mode === "bot" ? DIFFICULTY_LABELS[difficulty] : "2 jugadores";
  const winner = gameOver ? getWinner(game) : null;
  const winnerName =
    winner === null ? null : winner === PLAYER_1 ? player1Name : player2Name;

  return (
    <main className="app">
      {screen === "home" ? (
        <HomeScreen onStart={startGame} />
      ) : (
        <>
          <header className="app__header">
            <h1 className="app__title">Puntos y Cajas</h1>
          </header>
          <GameScreen
            game={game}
            onMove={makeMove}
            disabled={botTurn}
            player1Name={player1Name}
            player2Name={player2Name}
            badge={badge}
            onRestart={restart}
            onMenu={goHome}
          />
          {gameOver && (
            <GameOver
              winnerName={winnerName}
              onPlayAgain={playAgain}
              onMenu={goHome}
            />
          )}
        </>
      )}
    </main>
  );
}

export default App;
