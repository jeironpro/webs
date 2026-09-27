import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameOver from "./GameOver.jsx";

describe("GameOver", () => {
  it("shows the winner name", () => {
    render(
      <GameOver winnerName="TÚ" onPlayAgain={() => {}} onMenu={() => {}} />,
    );
    expect(
      screen.getByRole("heading", { name: "Gana TÚ" }),
    ).toBeInTheDocument();
  });

  it("shows a tie when there is no winner", () => {
    render(
      <GameOver winnerName={null} onPlayAgain={() => {}} onMenu={() => {}} />,
    );
    expect(screen.getByRole("heading", { name: "Empate" })).toBeInTheDocument();
  });

  it("triggers the play again and menu actions", async () => {
    const user = userEvent.setup();
    const onPlayAgain = vi.fn();
    const onMenu = vi.fn();
    render(
      <GameOver winnerName="BOT" onPlayAgain={onPlayAgain} onMenu={onMenu} />,
    );
    await user.click(screen.getByRole("button", { name: "Jugar de nuevo" }));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Menú" }));
    expect(onMenu).toHaveBeenCalledTimes(1);
  });
});
