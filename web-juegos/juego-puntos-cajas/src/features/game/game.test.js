import { describe, it, expect } from "vitest";
import { applyMove, getLegalEdges, isGameOver, getWinner } from "./game.js";
import { createInitialGame, switchPlayer, countBoxes } from "./board.js";
import { edgeKey, getAllEdges } from "./edges.js";
import {
  EDGE_HORIZONTAL,
  EDGE_VERTICAL,
  PLAYER_1,
  PLAYER_2,
  TOTAL_BOXES,
  TOTAL_EDGES,
} from "./constants.js";

describe("createInitialGame", () => {
  it("starts empty with player 1 to move", () => {
    const game = createInitialGame();
    expect(game.edges.size).toBe(0);
    expect(game.boxes.size).toBe(0);
    expect(game.turn).toBe(PLAYER_1);
    expect(countBoxes(game, PLAYER_1)).toBe(0);
    expect(countBoxes(game, PLAYER_2)).toBe(0);
  });
});

describe("applyMove", () => {
  it("switches the turn when no box is completed", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    expect(game).not.toBeNull();
    expect(game.edges.has(edgeKey(EDGE_HORIZONTAL, 0, 0))).toBe(true);
    expect(game.turn).toBe(PLAYER_2);
  });

  it("does not mutate the previous state", () => {
    const game = createInitialGame();
    const next = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    expect(game.edges.size).toBe(0);
    expect(next.edges.size).toBe(1);
  });

  it("rejects an already placed edge", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    const invalid = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_2);
    expect(invalid).toBeNull();
  });

  it("rejects a move made out of turn", () => {
    const game = createInitialGame();
    const invalid = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_2);
    expect(invalid).toBeNull();
  });

  it("completes a box, scores a point and grants an extra turn", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_VERTICAL, 0, 1, PLAYER_2);
    expect(game.boxes.has("0-0")).toBe(true);
    expect(game.boxes.get("0-0")).toBe(PLAYER_2);
    expect(countBoxes(game, PLAYER_2)).toBe(1);
    expect(countBoxes(game, PLAYER_1)).toBe(0);
    // el jugador que completó la caja vuelve a jugar
    expect(game.turn).toBe(PLAYER_2);
  });

  it("grants an extra turn after each completed box", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_VERTICAL, 0, 1, PLAYER_2); // completa 0-0: conserva el turno
    expect(game.turn).toBe(PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 2, PLAYER_2); // sin caja: cambia el turno
    expect(game.turn).toBe(PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 0, 1, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 1, PLAYER_2); // completa 0-1: conserva el turno
    expect(countBoxes(game, PLAYER_2)).toBe(2);
    expect(game.turn).toBe(PLAYER_2);
  });

  it("scores two points when an edge completes two boxes at once", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_VERTICAL, 0, 1, PLAYER_2); // completa 0-0
    game = applyMove(game, EDGE_HORIZONTAL, 0, 1, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 2, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 2, 1, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 1, 1, PLAYER_1);
    game = applyMove(game, EDGE_VERTICAL, 1, 2, PLAYER_2);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 1, PLAYER_1); // completa 0-1 y 1-1
    expect(countBoxes(game, PLAYER_1)).toBe(2);
    expect(countBoxes(game, PLAYER_2)).toBe(1);
    expect(game.boxes.get("0-1")).toBe(PLAYER_1);
    expect(game.boxes.get("1-1")).toBe(PLAYER_1);
    expect(game.turn).toBe(PLAYER_1);
  });
});

describe("getLegalEdges", () => {
  it("returns every edge at the start", () => {
    const game = createInitialGame();
    expect(getLegalEdges(game)).toHaveLength(TOTAL_EDGES);
  });

  it("shrinks after placing edges", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_VERTICAL, 2, 3, PLAYER_2);
    expect(getLegalEdges(game)).toHaveLength(TOTAL_EDGES - 2);
  });
});

describe("game over and winner", () => {
  it("is not over at the start", () => {
    expect(isGameOver(createInitialGame())).toBe(false);
  });

  it("ends when all edges are placed and scores are consistent", () => {
    let game = createInitialGame();
    for (const edge of getAllEdges()) {
      game = applyMove(game, edge.type, edge.row, edge.col, game.turn);
    }
    expect(isGameOver(game)).toBe(true);
    expect(game.edges.size).toBe(TOTAL_EDGES);
    expect(game.boxes.size).toBe(TOTAL_BOXES);
    const total = countBoxes(game, PLAYER_1) + countBoxes(game, PLAYER_2);
    expect(total).toBe(TOTAL_BOXES);
    const winner = getWinner(game);
    if (winner === PLAYER_1) {
      expect(countBoxes(game, PLAYER_1)).toBeGreaterThan(
        countBoxes(game, PLAYER_2),
      );
    } else if (winner === PLAYER_2) {
      expect(countBoxes(game, PLAYER_2)).toBeGreaterThan(
        countBoxes(game, PLAYER_1),
      );
    }
  });

  it("declares the player with more boxes as winner", () => {
    expect(getWinner({ scores: { [PLAYER_1]: 15, [PLAYER_2]: 10 } })).toBe(
      PLAYER_1,
    );
    expect(getWinner({ scores: { [PLAYER_1]: 10, [PLAYER_2]: 15 } })).toBe(
      PLAYER_2,
    );
  });

  it("returns null on a tie", () => {
    expect(
      getWinner({ scores: { [PLAYER_1]: 12, [PLAYER_2]: 12 } }),
    ).toBeNull();
  });

  it("switchPlayer alternates between players", () => {
    expect(switchPlayer(PLAYER_1)).toBe(PLAYER_2);
    expect(switchPlayer(PLAYER_2)).toBe(PLAYER_1);
  });
});
