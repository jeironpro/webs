import "./Button.css";

// Botón genérico con las variantes del libro de estilo: primario, secundario y ghost
function Button({
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      type={type}
      className={`button button--${variant}${className ? ` ${className}` : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
