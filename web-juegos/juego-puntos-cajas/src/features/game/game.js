import { PLAYER_1, PLAYER_2, TOTAL_EDGES } from "./constants.js";
import { switchPlayer } from "./board.js";
import {
  edgeKey,
  getBoxesAroundEdge,
  isBoxComplete,
  boxKey,
  getAllEdges,
} from "./edges.js";

// Aplica una jugada de forma inmutable y devuelve el nuevo estado de la partida.
// Si la arista ya está colocada o la juega alguien que no tiene el turno, devuelve null.
// Al completar una o más cajas, el mismo jugador vuelve a jugar (regla clásica del juego).
export function applyMove(game, type, row, col, player) {
  const key = edgeKey(type, row, col);
  if (game.edges.has(key) || player !== game.turn) return null;

  const nextEdges = new Map(game.edges);
  nextEdges.set(key, player);

  const nextBoxes = new Map(game.boxes);
  const nextScores = { ...game.scores };
  let completed = 0;

  for (const box of getBoxesAroundEdge(type, row, col)) {
    const keyBox = boxKey(box.row, box.col);
    if (nextBoxes.has(keyBox)) continue;
    if (isBoxComplete(nextEdges, box.row, box.col)) {
      nextBoxes.set(keyBox, player);
      completed += 1;
    }
  }

  if (completed > 0) {
    nextScores[player] += completed;
  }

  return {
    edges: nextEdges,
    boxes: nextBoxes,
    turn: completed > 0 ? player : switchPlayer(player),
    scores: nextScores,
  };
}

// Aristas legales: todas las que aún no han sido colocadas
export function getLegalEdges(game) {
  return getAllEdges().filter(
    (edge) => !game.edges.has(edgeKey(edge.type, edge.row, edge.col)),
  );
}

// La partida termina cuando se han colocado todas las aristas
export function isGameOver(game) {
  return game.edges.size === TOTAL_EDGES;
}

// Devuelve el ganador o null en caso de empate
export function getWinner(game) {
  const player1Boxes = game.scores[PLAYER_1];
  const player2Boxes = game.scores[PLAYER_2];
  if (player1Boxes === player2Boxes) return null;
  return player1Boxes > player2Boxes ? PLAYER_1 : PLAYER_2;
}
