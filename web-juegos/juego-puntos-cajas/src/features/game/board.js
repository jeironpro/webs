import { PLAYER_1, PLAYER_2 } from "./constants.js";

// Cambia el turno al otro jugador
export function switchPlayer(player) {
  return player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
}

// Estado inicial de la partida: sin aristas ni cajas, empieza el jugador 1
// - edges: aristas colocadas (clave -> jugador que la colocó)
// - boxes: cajas completadas (clave -> jugador propietario)
// - turn: jugador al que le toca mover
// - scores: cajas completadas por cada jugador
export function createInitialGame() {
  return {
    edges: new Map(),
    boxes: new Map(),
    turn: PLAYER_1,
    scores: { [PLAYER_1]: 0, [PLAYER_2]: 0 },
  };
}

// Cajas completadas por el jugador indicado (para el marcador)
export function countBoxes(game, player) {
  return game.scores[player];
}
