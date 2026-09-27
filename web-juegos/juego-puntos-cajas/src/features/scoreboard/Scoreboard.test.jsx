import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Scoreboard from "./Scoreboard.jsx";
import { PLAYER_1, PLAYER_2 } from "@/features/game/constants.js";

describe("Scoreboard", () => {
  it("renders the names, counts and separator", () => {
    render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={3}
        player2Count={5}
        turn={PLAYER_1}
      />,
    );
    expect(screen.getByText("TÚ")).toBeInTheDocument();
    expect(screen.getByText("BOT")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("highlights the player in turn", () => {
    const { rerender } = render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={0}
        player2Count={0}
        turn={PLAYER_1}
      />,
    );
    expect(screen.getByText("TÚ").className).toContain(
      "scoreboard__name--player-1",
    );
    expect(screen.getByText("BOT").className).not.toContain(
      "scoreboard__name--player-2",
    );

    rerender(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={0}
        player2Count={0}
        turn={PLAYER_2}
      />,
    );
    expect(screen.getByText("BOT").className).toContain(
      "scoreboard__name--player-2",
    );
    expect(screen.getByText("TÚ").className).not.toContain(
      "scoreboard__name--player-1",
    );
  });

  it("renders the badge when provided", () => {
    render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={0}
        player2Count={0}
        turn={PLAYER_1}
        badge="Difícil"
      />,
    );
    expect(screen.getByText("Difícil")).toBeInTheDocument();
  });

  it("omits the badge row when no badge is provided", () => {
    render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={0}
        player2Count={0}
        turn={PLAYER_1}
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      document.querySelector(".scoreboard__badge"),
    ).not.toBeInTheDocument();
  });
});
