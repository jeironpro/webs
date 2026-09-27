import "./Icon.css";

// Icono de la librería Material Symbols (variante Rounded), siempre decorativo
function Icon({ name, className = "" }) {
  return (
    <span
      className={`material-symbols-rounded icon${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default Icon;
