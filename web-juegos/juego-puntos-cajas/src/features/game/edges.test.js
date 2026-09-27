import { describe, it, expect } from "vitest";
import {
  edgeKey,
  boxKey,
  getBoxesAroundEdge,
  isBoxComplete,
  getAllEdges,
} from "./edges.js";
import { EDGE_HORIZONTAL, EDGE_VERTICAL, TOTAL_EDGES } from "./constants.js";

describe("edge keys", () => {
  it("builds canonical edge and box keys", () => {
    expect(edgeKey(EDGE_HORIZONTAL, 2, 3)).toBe("H-2-3");
    expect(edgeKey(EDGE_VERTICAL, 1, 4)).toBe("V-1-4");
    expect(boxKey(2, 3)).toBe("2-3");
  });
});

describe("getBoxesAroundEdge", () => {
  it("returns one box for edges on the outer border", () => {
    expect(getBoxesAroundEdge(EDGE_HORIZONTAL, 0, 0)).toEqual([
      { row: 0, col: 0 },
    ]);
    expect(getBoxesAroundEdge(EDGE_HORIZONTAL, 5, 4)).toEqual([
      { row: 4, col: 4 },
    ]);
    expect(getBoxesAroundEdge(EDGE_VERTICAL, 0, 0)).toEqual([
      { row: 0, col: 0 },
    ]);
    expect(getBoxesAroundEdge(EDGE_VERTICAL, 4, 5)).toEqual([
      { row: 4, col: 4 },
    ]);
  });

  it("returns two boxes for edges in the interior", () => {
    expect(getBoxesAroundEdge(EDGE_HORIZONTAL, 3, 2)).toEqual([
      { row: 2, col: 2 },
      { row: 3, col: 2 },
    ]);
    expect(getBoxesAroundEdge(EDGE_VERTICAL, 2, 3)).toEqual([
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ]);
  });
});

describe("isBoxComplete", () => {
  it("is false when any of the four edges is missing", () => {
    const edges = new Map([
      [edgeKey(EDGE_HORIZONTAL, 0, 0), 1],
      [edgeKey(EDGE_HORIZONTAL, 1, 0), 1],
      [edgeKey(EDGE_VERTICAL, 0, 0), 1],
    ]);
    expect(isBoxComplete(edges, 0, 0)).toBe(false);
  });

  it("is true when the four edges are placed", () => {
    const edges = new Map([
      [edgeKey(EDGE_HORIZONTAL, 0, 0), 1],
      [edgeKey(EDGE_HORIZONTAL, 1, 0), 1],
      [edgeKey(EDGE_VERTICAL, 0, 0), 1],
      [edgeKey(EDGE_VERTICAL, 0, 1), 1],
    ]);
    expect(isBoxComplete(edges, 0, 0)).toBe(true);
  });
});

describe("getAllEdges", () => {
  it("returns the 60 possible edges", () => {
    const edges = getAllEdges();
    expect(edges).toHaveLength(TOTAL_EDGES);
    const horizontal = edges.filter((edge) => edge.type === EDGE_HORIZONTAL);
    const vertical = edges.filter((edge) => edge.type === EDGE_VERTICAL);
    expect(horizontal).toHaveLength(30);
    expect(vertical).toHaveLength(30);
  });
});
