import {
  applyMove,
  getLegalEdges,
  isGameOver,
  getWinner,
} from "@/features/game/game.js";
import { switchPlayer, countBoxes } from "@/features/game/board.js";
import { getBoxesAroundEdge, edgeKey } from "@/features/game/edges.js";
import { EDGE_HORIZONTAL, EDGE_VERTICAL } from "@/features/game/constants.js";
import { DIFFICULTY_DEPTHS } from "./difficulty.js";

// Puntuación que representa una victoria segura (muy por encima del material)
const WIN_SCORE = 1_000_000;
// Valor de cada caja para la heurística de material
const BOX_VALUE = 100;
// Probabilidad de elegir la mejor jugada inmediata en dificultad fácil
const GREEDY_RATIO = 0.7;
// Límite de jugadas consideradas por nodo: acota el árbol y hace viable
// la profundidad alta sin sacrificar las jugadas que completan cajas
const MAX_MOVES_PER_NODE = 12;

// Evalúa el tablero como diferencia de cajas entre el bot y el rival
function evaluate(game, botPlayer) {
  return (
    (countBoxes(game, botPlayer) - countBoxes(game, switchPlayer(botPlayer))) *
    BOX_VALUE
  );
}

// Cajas que completaría una arista si se colocara ahora mismo (sin copiar estado)
function immediateBoxes(game, type, row, col) {
  let count = 0;
  for (const box of getBoxesAroundEdge(type, row, col)) {
    if (game.boxes.has(`${box.row}-${box.col}`)) continue;
    const { row: r, col: c } = box;
    const placed =
      (game.edges.has(edgeKey(EDGE_HORIZONTAL, r, c)) ? 1 : 0) +
      (game.edges.has(edgeKey(EDGE_HORIZONTAL, r + 1, c)) ? 1 : 0) +
      (game.edges.has(edgeKey(EDGE_VERTICAL, r, c)) ? 1 : 0) +
      (game.edges.has(edgeKey(EDGE_VERTICAL, r, c + 1)) ? 1 : 0);
    // la arista que se está colocando completa la cuarta
    if (placed === 3) count += 1;
  }
  return count;
}

// Ordena las jugadas poniendo primero las que completan cajas (mejora la poda alfa-beta)
function orderMoves(game) {
  return getLegalEdges(game).sort(
    (a, b) =>
      immediateBoxes(game, b.type, b.row, b.col) -
      immediateBoxes(game, a.type, a.row, a.col),
  );
}

// Búsqueda minimax con poda alfa-beta; maximiza cuando el turno es del bot
function search(game, botPlayer, depth, alpha, beta) {
  if (isGameOver(game)) {
    const winner = getWinner(game);
    if (winner === botPlayer) return WIN_SCORE;
    if (winner === null) return 0;
    return -WIN_SCORE;
  }
  if (depth === 0) return evaluate(game, botPlayer);

  const maximizing = game.turn === botPlayer;
  let best = maximizing ? -Infinity : Infinity;

  for (const edge of orderMoves(game).slice(0, MAX_MOVES_PER_NODE)) {
    const next = applyMove(game, edge.type, edge.row, edge.col, game.turn);
    const score = search(next, botPlayer, depth - 1, alpha, beta);
    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

// Dificultad fácil: elige entre la mejor jugada inmediata y una aleatoria, con sesgo hacia la mejor
function pickGreedyMove(game, edges, random) {
  const scored = edges.map((edge) => ({
    edge,
    score: evaluate(
      applyMove(game, edge.type, edge.row, edge.col, game.turn),
      game.turn,
    ),
  }));
  const bestScore = Math.max(...scored.map((entry) => entry.score));
  const bestEdges = scored
    .filter((entry) => entry.score === bestScore)
    .map((entry) => entry.edge);
  if (random() < GREEDY_RATIO) {
    return bestEdges[Math.floor(random() * bestEdges.length)];
  }
  return edges[Math.floor(random() * edges.length)];
}

// Elige la jugada del bot según la dificultad; devuelve null si no hay jugadas
export function chooseMove(game, difficulty, random = Math.random) {
  const edges = getLegalEdges(game);
  if (edges.length === 0) return null;

  const depth = DIFFICULTY_DEPTHS[difficulty];
  if (depth <= 1) {
    return pickGreedyMove(game, edges, random);
  }

  let bestScore = -Infinity;
  let bestEdges = [];
  for (const edge of orderMoves(game).slice(0, MAX_MOVES_PER_NODE)) {
    const next = applyMove(game, edge.type, edge.row, edge.col, game.turn);
    const score = search(next, game.turn, depth - 1, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestEdges = [edge];
    } else if (score === bestScore) {
      bestEdges.push(edge);
    }
  }
  // pequeña variedad entre jugadas igualmente buenas
  return bestEdges[Math.floor(random() * bestEdges.length)];
}
