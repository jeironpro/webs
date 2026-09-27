import {
  EDGE_HORIZONTAL,
  PLAYER_1,
  PLAYER_2,
} from "@/features/game/constants.js";

// Botón que representa una arista de la grilla. Libre: hairline tenue con
// resaltado en hover. Colocada: color del jugador que la jugó. Cuando una de
// las cajas que delimita se completa, la arista pasa a tinta (negra).
function EdgeButton({ type, row, col, placedBy, completed = false, onClick }) {
  const handleClick = () => onClick(type, row, col);
  const orientationClass =
    type === EDGE_HORIZONTAL
      ? "edge-button--horizontal"
      : "edge-button--vertical";
  const playerClass =
    placedBy === PLAYER_1
      ? " edge-button--player-1"
      : placedBy === PLAYER_2
        ? " edge-button--player-2"
        : "";
  const completedClass = completed ? " edge-button--completed" : "";
  const orientationLabel = type === EDGE_HORIZONTAL ? "horizontal" : "vertical";

  return (
    <button
      type="button"
      className={`edge-button ${orientationClass}${playerClass}${completedClass}`}
      aria-label={`Arista ${orientationLabel} fila ${row} columna ${col}`}
      disabled={placedBy !== undefined}
      onClick={handleClick}
    />
  );
}

export default EdgeButton;
