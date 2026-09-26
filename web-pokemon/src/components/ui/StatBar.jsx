// Barra de estadistica individual. Muestra label, representacion visual con estrellas y valor numerico.
import { generarEstrellas } from '../../utils/helpers';

// Props: label (nombre de la estadistica), valor (numerico), className (color de la barra).
function StatBar({ label, valor, className }) {
  return (
    <div className={`estadistica ${className}`}>
      <span className="estadistica-label">{label}</span>
      <span className="estadistica-estrellas">{generarEstrellas(valor)}</span>
      <span className="estadistica-valor">{valor}</span>
    </div>
  );
}

export default StatBar;
