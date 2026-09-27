import { useCallback, useEffect, useRef, useState } from "react";
import { createInitialGame } from "@/features/game/board.js";
import { applyMove, isGameOver } from "@/features/game/game.js";
import { chooseMove } from "@/features/bot/bot.js";
import { PLAYER_2 } from "@/features/game/constants.js";

// Retardo antes de la jugada del bot para que se perciba su turno
const BOT_MOVE_DELAY_MS = 450;

// Maneja el estado de la partida: aplica jugadas del jugador en turno, reinicia
// y, cuando el modo es contra el bot, programa su jugada con un pequeño retardo.
export function useGame({ botDifficulty = null } = {}) {
  const [game, setGame] = useState(() => createInitialGame());
  const botTimeoutRef = useRef(null);

  const makeMove = useCallback((type, row, col) => {
    setGame((current) => {
      const next = applyMove(current, type, row, col, current.turn);
      return next === null ? current : next;
    });
  }, []);

  // Jugada del bot: se programa cuando le toca mover y se cancela al cambiar el
  // estado (reinicio, salida al menú); al completar cajas conserva el turno y
  // el efecto se vuelve a ejecutar con el nuevo estado
  useEffect(() => {
    if (botDifficulty === null || game.turn !== PLAYER_2 || isGameOver(game))
      return undefined;

    botTimeoutRef.current = setTimeout(() => {
      const edge = chooseMove(game, botDifficulty);
      if (edge !== null) {
        setGame((current) => {
          const next = applyMove(
            current,
            edge.type,
            edge.row,
            edge.col,
            current.turn,
          );
          return next === null ? current : next;
        });
      }
    }, BOT_MOVE_DELAY_MS);

    return () => clearTimeout(botTimeoutRef.current);
  }, [game, botDifficulty]);

  const restart = useCallback(() => {
    setGame(createInitialGame());
  }, []);

  return { game, makeMove, restart };
}
