import {
  BOXES_PER_SIDE,
  EDGE_HORIZONTAL,
  EDGE_VERTICAL,
  GRID_SIZE,
} from "./constants.js";

// Clave canónica de una arista (ej. "H-2-3" o "V-1-4")
export function edgeKey(type, row, col) {
  return `${type}-${row}-${col}`;
}

// Clave canónica de una caja (ej. "2-3")
export function boxKey(row, col) {
  return `${row}-${col}`;
}

// Cajas adyacentes a una arista (1 o 2 según su posición en el borde)
export function getBoxesAroundEdge(type, row, col) {
  const boxes = [];
  if (type === EDGE_HORIZONTAL) {
    if (row > 0) boxes.push({ row: row - 1, col });
    if (row < BOXES_PER_SIDE) boxes.push({ row, col });
  } else {
    if (col > 0) boxes.push({ row, col: col - 1 });
    if (col < BOXES_PER_SIDE) boxes.push({ row, col });
  }
  return boxes;
}

// Una caja está completa cuando tiene sus cuatro aristas colocadas
export function isBoxComplete(edges, row, col) {
  return (
    edges.has(edgeKey(EDGE_HORIZONTAL, row, col)) &&
    edges.has(edgeKey(EDGE_HORIZONTAL, row + 1, col)) &&
    edges.has(edgeKey(EDGE_VERTICAL, row, col)) &&
    edges.has(edgeKey(EDGE_VERTICAL, row, col + 1))
  );
}

// Todas las aristas posibles del tablero, en orden de fila/columna
export function getAllEdges() {
  const edges = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < BOXES_PER_SIDE; col += 1) {
      edges.push({ type: EDGE_HORIZONTAL, row, col });
    }
  }
  for (let row = 0; row < BOXES_PER_SIDE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      edges.push({ type: EDGE_VERTICAL, row, col });
    }
  }
  return edges;
}
