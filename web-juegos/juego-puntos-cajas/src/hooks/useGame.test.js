import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGame } from "./useGame.js";
import {
  EDGE_HORIZONTAL,
  EDGE_VERTICAL,
  PLAYER_1,
  PLAYER_2,
} from "@/features/game/constants.js";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useGame", () => {
  it("applies a move and switches the turn", () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    expect(result.current.game.edges.size).toBe(1);
    expect(result.current.game.turn).toBe(PLAYER_2);
  });

  it("ignores a move on an already placed edge", () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    expect(result.current.game.edges.size).toBe(1);
  });

  it("restarts the game", () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    act(() => result.current.restart());
    expect(result.current.game.edges.size).toBe(0);
    expect(result.current.game.turn).toBe(PLAYER_1);
  });
});

describe("useGame with bot", () => {
  it("lets the bot play after a delay when it is its turn", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useGame({ botDifficulty: "easy" }));
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    expect(result.current.game.turn).toBe(PLAYER_2);
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.game.edges.size).toBe(2);
    expect(result.current.game.turn).toBe(PLAYER_1);
  });

  it("does not schedule the bot when there is no bot difficulty", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useGame());
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.game.edges.size).toBe(1);
  });

  it("cancels a pending bot move when restarting", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useGame({ botDifficulty: "easy" }));
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    act(() => result.current.restart());
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.game.edges.size).toBe(0);
  });

  it("lets the bot keep the turn after completing a box", () => {
    vi.useFakeTimers();
    // el bot (dificultad fácil) siempre elige su mejor jugada inmediata
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useGame({ botDifficulty: "easy" }));
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 0, 0));
    act(() => vi.advanceTimersByTime(500)); // el bot coloca H-0-1
    act(() => result.current.makeMove(EDGE_HORIZONTAL, 1, 0));
    act(() => vi.advanceTimersByTime(500)); // el bot coloca H-0-2
    act(() => result.current.makeMove(EDGE_VERTICAL, 0, 0));
    // turno del bot con la caja 0-0 a una arista de completarse
    expect(result.current.game.turn).toBe(PLAYER_2);
    act(() => vi.advanceTimersByTime(500)); // el bot completa la caja 0-0
    expect(result.current.game.boxes.has("0-0")).toBe(true);
    expect(result.current.game.turn).toBe(PLAYER_2);
    // con el turno extra el bot juega otra vez y termina cediendo el turno
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.game.turn).toBe(PLAYER_1);
  });
});
