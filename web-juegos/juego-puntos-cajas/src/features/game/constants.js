// Constantes del juego de puntos y cajas (grilla de 6x6 puntos que forma 5x5 cajas)
export const GRID_SIZE = 6;
export const BOXES_PER_SIDE = GRID_SIZE - 1;
export const TOTAL_BOXES = BOXES_PER_SIDE * BOXES_PER_SIDE;
// Total de aristas: horizontales (5 filas x 6 columnas) + verticales (6 filas x 5 columnas)
export const TOTAL_EDGES = BOXES_PER_SIDE * GRID_SIZE * 2;

export const PLAYER_1 = 1;
export const PLAYER_2 = 2;

// Tipos de arista según su orientación en la grilla
export const EDGE_HORIZONTAL = "H";
export const EDGE_VERTICAL = "V";
