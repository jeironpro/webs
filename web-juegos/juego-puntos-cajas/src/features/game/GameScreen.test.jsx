import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameScreen from "./GameScreen.jsx";
import { createInitialGame } from "@/features/game/board.js";
import { TOTAL_EDGES } from "@/features/game/constants.js";

describe("GameScreen", () => {
  it("renders the scoreboard and the board", () => {
    render(<GameScreen game={createInitialGame()} onMove={() => {}} />);
    expect(
      screen.getByRole("region", { name: "Marcador de la partida" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Tablero de puntos y cajas" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(TOTAL_EDGES);
  });

  it("calls onRestart and onMenu from the controls", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    const onMenu = vi.fn();
    render(
      <GameScreen
        game={createInitialGame()}
        onMove={() => {}}
        onRestart={onRestart}
        onMenu={onMenu}
      />,
    );
    await user.click(screen.getByRole("button", { name: /reiniciar/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: /menú/i }));
    expect(onMenu).toHaveBeenCalledTimes(1);
  });

  it("omits the controls when the callbacks are not provided", () => {
    render(<GameScreen game={createInitialGame()} onMove={() => {}} />);
    expect(
      screen.queryByRole("button", { name: /reiniciar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /menú/i }),
    ).not.toBeInTheDocument();
  });
});
