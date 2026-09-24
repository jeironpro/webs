/* Genera la grilla de capítulos de la página de libro actual a partir de
   CATALOGO_BIBLIA (js/data/catalogo.js). El libro se identifica mediante el
   atributo data-libro del contenedor #capitulos, por lo que ninguna página
   repite el conteo de capítulos en su propio HTML. */
(function () {
  const contenedor = document.getElementById("capitulos");
  if (!contenedor || typeof CATALOGO_BIBLIA === "undefined") return;

  const libroId = contenedor.getAttribute("data-libro");
  const libro = Object.values(CATALOGO_BIBLIA)
    .flat()
    .find((l) => l.id === libroId);
  if (!libro) return;

  for (let i = 1; i <= libro.capitulos; i++) {
    const capitulo = document.createElement("div");
    capitulo.classList.add("capitulo");

    const enlace = document.createElement("a");
    enlace.href = `${libro.id}/${libro.id}_${i}.html`;
    enlace.textContent = i;
    capitulo.appendChild(enlace);

    contenedor.appendChild(capitulo);
  }
})();
