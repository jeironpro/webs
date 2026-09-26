// Insignia de tipo de pokemon. Se renderiza con el color del tipo como fondo.
// Props: tipo — objeto con { nombre, color }.
function TypeBadge({ tipo }) {
  return (
    <span
      className="tipo-badge"
      style={{
        backgroundColor: tipo.color || '#666',
      }}
    >
      {tipo.nombre}
    </span>
  );
}

export default TypeBadge;
