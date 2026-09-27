import { describe, it, expect } from "vitest";
import { chooseMove } from "./bot.js";
import { applyMove, isGameOver } from "@/features/game/game.js";
import { createInitialGame } from "@/features/game/board.js";
import { edgeKey, getAllEdges } from "@/features/game/edges.js";
import {
  EDGE_HORIZONTAL,
  EDGE_VERTICAL,
  PLAYER_1,
  PLAYER_2,
  TOTAL_EDGES,
} from "@/features/game/constants.js";

describe("chooseMove", () => {
  it("returns a legal edge for every difficulty", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    for (const difficulty of ["easy", "medium", "hard"]) {
      const edge = chooseMove(game, difficulty, () => 0.5);
      expect(edge).not.toBeNull();
      expect(game.edges.has(edgeKey(edge.type, edge.row, edge.col))).toBe(
        false,
      );
    }
  });

  it("returns null when there are no legal edges", () => {
    let game = createInitialGame();
    for (const edge of getAllEdges()) {
      game = applyMove(game, edge.type, edge.row, edge.col, game.turn);
    }
    expect(isGameOver(game)).toBe(true);
    expect(chooseMove(game, "hard")).toBeNull();
  });

  it("easy difficulty favors the best immediate move with bias", () => {
    let game = createInitialGame();
    // el bot (jugador 2) puede completar la caja 0-0 colocando V-0-1
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    const edge = chooseMove(game, "easy", () => 0.5);
    expect(edge).toEqual({ type: EDGE_VERTICAL, row: 0, col: 1 });
  });

  it("easy difficulty may pick a random move", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    const edge = chooseMove(game, "easy", () => 0.99);
    expect(game.edges.has(edgeKey(edge.type, edge.row, edge.col))).toBe(false);
  });

  it("medium difficulty completes an available box", () => {
    let game = createInitialGame();
    // el bot (jugador 2) está en turno y puede completar la caja 0-0
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    const edge = chooseMove(game, "medium", () => 0.5);
    expect(edge).toEqual({ type: EDGE_VERTICAL, row: 0, col: 1 });
  });

  it("hard difficulty completes an available box too", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    const edge = chooseMove(game, "hard", () => 0.5);
    expect(edge).toEqual({ type: EDGE_VERTICAL, row: 0, col: 1 });
  });

  it("returns a legal move from a mid-game position", () => {
    let game = createInitialGame();
    const moves = [
      [EDGE_HORIZONTAL, 0, 0],
      [EDGE_HORIZONTAL, 1, 0],
      [EDGE_VERTICAL, 0, 0],
      [EDGE_VERTICAL, 0, 1],
      [EDGE_HORIZONTAL, 0, 1],
      [EDGE_HORIZONTAL, 1, 1],
      [EDGE_VERTICAL, 0, 2],
    ];
    for (const [type, row, col] of moves) {
      game = applyMove(game, type, row, col, game.turn);
    }
    const edge = chooseMove(game, "medium", () => 0.5);
    expect(game.edges.has(edgeKey(edge.type, edge.row, edge.col))).toBe(false);
    expect(TOTAL_EDGES).toBe(60);
  });
});
