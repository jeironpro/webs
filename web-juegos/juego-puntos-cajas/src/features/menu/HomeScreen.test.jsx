import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeScreen from "./HomeScreen.jsx";
import { DEFAULT_DIFFICULTY } from "@/features/bot/difficulty.js";

describe("HomeScreen", () => {
  it("calls onStart with the default mode and difficulty", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<HomeScreen onStart={onStart} />);
    await user.click(screen.getByRole("button", { name: "Jugar" }));
    expect(onStart).toHaveBeenCalledWith("bot", DEFAULT_DIFFICULTY);
  });

  it("starts a two player game", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<HomeScreen onStart={onStart} />);
    await user.click(screen.getByRole("button", { name: /2 jugadores/i }));
    await user.click(screen.getByRole("button", { name: "Jugar" }));
    expect(onStart).toHaveBeenCalledWith("local", DEFAULT_DIFFICULTY);
  });

  it("lets the player choose the difficulty in bot mode", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<HomeScreen onStart={onStart} />);
    await user.click(screen.getByRole("button", { name: "Difícil" }));
    await user.click(screen.getByRole("button", { name: "Jugar" }));
    expect(onStart).toHaveBeenCalledWith("bot", "hard");
  });

  it("hides the difficulty selector in two player mode", async () => {
    const user = userEvent.setup();
    render(<HomeScreen onStart={() => {}} />);
    await user.click(screen.getByRole("button", { name: /2 jugadores/i }));
    expect(screen.queryByText("Dificultad")).not.toBeInTheDocument();
  });
});
