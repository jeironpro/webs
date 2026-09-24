// Carga los versículos desde el dataset estático local.
// El libro y el capítulo se derivan de la ruta, lo que soporta nombres
// multi-palabra como hechos_de_los_apostoles o cantar_de_los_cantares.

const RUTA_DATOS = (function () {
  const script = document.currentScript;
  if (script && script.src) {
    return new URL("data/versiculos.json", script.src).href;
  }
  return new URL("../../../js/data/versiculos.json", window.location.href).href;
})();

function mostrarMensaje(contenedor, mensaje) {
  contenedor.innerHTML = "";
  const aviso = document.createElement("p");
  aviso.textContent = mensaje;
  contenedor.appendChild(aviso);
}

// Esqueleto de carga: simula líneas de texto mientras se descarga el dataset.
function mostrarSkeleton(contenedor) {
  contenedor.innerHTML = "";
  const esqueleto = document.createElement("div");
  esqueleto.className = "skeleton";
  esqueleto.setAttribute("role", "status");
  esqueleto.setAttribute("aria-label", "Cargando versículos");
  for (let i = 0; i < 12; i++) {
    const linea = document.createElement("div");
    linea.className = "skeleton-linea";
    // Anchuras variables para imitar el ritmo del texto real.
    linea.style.width = `${38 + ((i * 17) % 56)}%`;
    esqueleto.appendChild(linea);
  }
  contenedor.appendChild(esqueleto);
}

async function main() {
  const contenedorVersiculos = document.querySelector(".versiculos");
  if (!contenedorVersiculos) return;

  const partes = window.location.pathname.split("/").filter(Boolean);
  const archivo = partes.pop() || "";
  const nombreLibro = partes.pop() || "";
  const numeroCapitulo = parseInt(archivo.replace(".html", "").split("_").pop(), 10);

  if (!nombreLibro || !Number.isInteger(numeroCapitulo)) {
    mostrarMensaje(contenedorVersiculos, "No se pudo identificar este capítulo.");
    return;
  }

  mostrarSkeleton(contenedorVersiculos);

  try {
    const respuesta = await fetch(RUTA_DATOS);
    if (!respuesta.ok) throw new Error("Dataset no disponible");
    const datos = await respuesta.json();
    const versiculos = datos[nombreLibro] && datos[nombreLibro][numeroCapitulo];

    if (!versiculos || !versiculos.length) {
      mostrarMensaje(contenedorVersiculos, "Contenido en preparación.");
      return;
    }

    const contenedorTexto = document.createElement("pre");
    contenedorTexto.textContent = versiculos
      .map((v) => `${v.numero}. ${v.texto}`)
      .join("\n");
    contenedorVersiculos.innerHTML = "";
    contenedorVersiculos.appendChild(contenedorTexto);
  } catch (err) {
    console.log("Error:", err);
    mostrarMensaje(contenedorVersiculos, "Contenido en preparación.");
  }
}

main();
