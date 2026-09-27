import { useCallback } from "react";
import {
  EDGE_HORIZONTAL,
  EDGE_VERTICAL,
  GRID_SIZE,
} from "@/features/game/constants.js";
import { boxKey, edgeKey, getBoxesAroundEdge } from "@/features/game/edges.js";
import EdgeButton from "./EdgeButton.jsx";
import BoxCell from "./BoxCell.jsx";
import "./Board.css";

// La grilla se compone de (2 * GRID_SIZE - 1) celdas por lado: las posiciones
// pares son puntos, entre punto y punto hay aristas y en el interior quedan las cajas
const CELLS = GRID_SIZE * 2 - 1;

// Tablero interactivo de puntos y cajas: clic en una arista libre para jugarla.
// Las aristas ya colocadas y el tablero deshabilitado ignoran los clics.
function Board({ game, onMove, disabled = false }) {
  const handleEdgeClick = useCallback(
    (type, row, col) => {
      if (!disabled) onMove(type, row, col);
    },
    [disabled, onMove],
  );

  const cells = [];
  for (let row = 0; row < CELLS; row += 1) {
    for (let col = 0; col < CELLS; col += 1) {
      const isDot = row % 2 === 0 && col % 2 === 0;
      const isHorizontalEdge = row % 2 === 0 && col % 2 === 1;
      const isVerticalEdge = row % 2 === 1 && col % 2 === 0;
      const key = `${row}-${col}`;

      if (isDot) {
        cells.push(
          <span key={key} className="board__dot" aria-hidden="true" />,
        );
        continue;
      }

      if (isHorizontalEdge || isVerticalEdge) {
        const type = isHorizontalEdge ? EDGE_HORIZONTAL : EDGE_VERTICAL;
        const edgeRow = Math.floor(row / 2);
        const edgeCol = Math.floor(col / 2);
        const placedBy = game.edges.get(edgeKey(type, edgeRow, edgeCol));
        // la arista pasa a tinta (negra) cuando alguna de las cajas que
        // delimita ya está completada
        const completed = getBoxesAroundEdge(type, edgeRow, edgeCol).some(
          (box) => game.boxes.has(boxKey(box.row, box.col)),
        );
        cells.push(
          <EdgeButton
            key={key}
            type={type}
            row={edgeRow}
            col={edgeCol}
            placedBy={placedBy}
            completed={completed}
            onClick={handleEdgeClick}
          />,
        );
        continue;
      }

      // celda de caja: fila y columna impares
      const boxRow = Math.floor(row / 2);
      const boxCol = Math.floor(col / 2);
      cells.push(
        <BoxCell key={key} owner={game.boxes.get(boxKey(boxRow, boxCol))} />,
      );
    }
  }

  return (
    <div className="board">
      <div
        className="board__grid"
        role="group"
        aria-label="Tablero de puntos y cajas"
        style={{ "--board-cells": CELLS }}
      >
        {cells}
      </div>
    </div>
  );
}

export default Board;
