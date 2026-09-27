import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BoxCell from "./BoxCell.jsx";
import { PLAYER_1, PLAYER_2 } from "@/features/game/constants.js";

describe("BoxCell", () => {
  it("is empty when the box has no owner", () => {
    render(<BoxCell owner={undefined} />);
    const cell = document.querySelector(".box-cell");
    expect(cell.className).toBe("box-cell");
  });

  it("applies the player 1 color class to its owner", () => {
    render(<BoxCell owner={PLAYER_1} />);
    const cell = document.querySelector(".box-cell");
    expect(cell.className).toContain("box-cell--player-1");
  });

  it("applies the player 2 color class to its owner", () => {
    render(<BoxCell owner={PLAYER_2} />);
    const cell = document.querySelector(".box-cell");
    expect(cell.className).toContain("box-cell--player-2");
  });
});
