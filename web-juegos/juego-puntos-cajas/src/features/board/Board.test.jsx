import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Board from "./Board.jsx";
import { createInitialGame } from "@/features/game/board.js";
import { applyMove } from "@/features/game/game.js";
import {
  EDGE_HORIZONTAL,
  EDGE_VERTICAL,
  PLAYER_1,
  PLAYER_2,
  TOTAL_EDGES,
} from "@/features/game/constants.js";

describe("Board", () => {
  it("renders one button per edge", () => {
    render(<Board game={createInitialGame()} onMove={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(TOTAL_EDGES);
  });

  it("calls onMove with the edge coordinates when clicked", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<Board game={createInitialGame()} onMove={onMove} />);
    await user.click(
      screen.getByRole("button", {
        name: "Arista horizontal fila 0 columna 0",
      }),
    );
    expect(onMove).toHaveBeenCalledWith(EDGE_HORIZONTAL, 0, 0);
    await user.click(
      screen.getByRole("button", { name: "Arista vertical fila 2 columna 3" }),
    );
    expect(onMove).toHaveBeenCalledWith(EDGE_VERTICAL, 2, 3);
  });

  it("disables placed edges", () => {
    const game = createInitialGame();
    game.edges.set("H-0-0", 1);
    render(<Board game={game} onMove={() => {}} />);
    expect(
      screen.getByRole("button", {
        name: "Arista horizontal fila 0 columna 0",
      }),
    ).toBeDisabled();
  });

  it("ignores clicks when disabled", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<Board game={createInitialGame()} onMove={onMove} disabled />);
    await user.click(
      screen.getByRole("button", {
        name: "Arista horizontal fila 0 columna 0",
      }),
    );
    expect(onMove).not.toHaveBeenCalled();
  });

  it("marks the edges of a completed box as black", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_HORIZONTAL, 1, 0, PLAYER_2);
    game = applyMove(game, EDGE_VERTICAL, 0, 0, PLAYER_1);
    game = applyMove(game, EDGE_VERTICAL, 0, 1, PLAYER_2);
    const { container } = render(<Board game={game} onMove={() => {}} />);
    const names = [
      "Arista horizontal fila 0 columna 0",
      "Arista horizontal fila 1 columna 0",
      "Arista vertical fila 0 columna 0",
      "Arista vertical fila 0 columna 1",
    ];
    for (const name of names) {
      expect(screen.getByRole("button", { name })).toHaveClass(
        "edge-button--completed",
      );
    }
    expect(container.querySelectorAll(".edge-button--completed")).toHaveLength(
      4,
    );
  });

  it("keeps player colors on edges not bordering a completed box", () => {
    let game = createInitialGame();
    game = applyMove(game, EDGE_HORIZONTAL, 0, 0, PLAYER_1);
    const { container } = render(<Board game={game} onMove={() => {}} />);
    expect(
      screen.getByRole("button", {
        name: "Arista horizontal fila 0 columna 0",
      }),
    ).toHaveClass("edge-button--player-1");
    expect(container.querySelectorAll(".edge-button--completed")).toHaveLength(
      0,
    );
  });
});
