const libros = [
  // Antiguo Testamento
  { nombre: "Génesis", ruta: "genesis.html" },
  { nombre: "Éxodo", ruta: "exodo.html" },
  { nombre: "Levítico", ruta: "levitico.html" },
  { nombre: "Números", ruta: "numeros.html" },
  { nombre: "Deuteronomio", ruta: "deuteronomio.html" },
  { nombre: "Josué", ruta: "josue.html" },
  { nombre: "Jueces", ruta: "jueces.html" },
  { nombre: "Rut", ruta: "rut.html" },
  { nombre: "1 Samuel", ruta: "1samuel.html" },
  { nombre: "2 Samuel", ruta: "2samuel.html" },
  { nombre: "1 Reyes", ruta: "1reyes.html" },
  { nombre: "2 Reyes", ruta: "2reyes.html" },
  { nombre: "1 Crónicas", ruta: "1cronicas.html" },
  { nombre: "2 Crónicas", ruta: "2cronicas.html" },
  { nombre: "Esdras", ruta: "esdras.html" },
  { nombre: "Nehemías", ruta: "nehemias.html" },
  { nombre: "Tobías", ruta: "tobias.html" },
  { nombre: "Judit", ruta: "judit.html" },
  { nombre: "Ester", ruta: "ester.html" },
  { nombre: "1 Macabeos", ruta: "1macabeos.html" },
  { nombre: "2 Macabeos", ruta: "2macabeos.html" },
  { nombre: "Job", ruta: "job.html" },
  { nombre: "Salmos", ruta: "salmos.html" },
  { nombre: "Proverbios", ruta: "proverbios.html" },
  { nombre: "Eclesiastés", ruta: "eclesiastes.html" },
  { nombre: "Cantar de los Cantares", ruta: "cantardeloscantares.html" },
  { nombre: "Sabiduría", ruta: "sabiduria.html" },
  { nombre: "Eclesiástico", ruta: "eclesiastico.html" },
  { nombre: "Isaías", ruta: "isaias.html" },
  { nombre: "Jeremías", ruta: "jeremias.html" },
  { nombre: "Lamentaciones", ruta: "lamentaciones.html" },
  { nombre: "Baruc", ruta: "baruc.html" },
  { nombre: "Ezequiel", ruta: "ezequiel.html" },
  { nombre: "Daniel", ruta: "daniel.html" },
  { nombre: "Oseas", ruta: "oseas.html" },
  { nombre: "Joel", ruta: "joel.html" },
  { nombre: "Amós", ruta: "amos.html" },
  { nombre: "Abdías", ruta: "abdias.html" },
  { nombre: "Jonás", ruta: "jonas.html" },
  { nombre: "Miqueas", ruta: "miqueas.html" },
  { nombre: "Nahúm", ruta: "nahum.html" },
  { nombre: "Habacuc", ruta: "habacuc.html" },
  { nombre: "Sofonías", ruta: "sofonias.html" },
  { nombre: "Ageo", ruta: "ageo.html" },
  { nombre: "Zacarías", ruta: "zacarias.html" },
  { nombre: "Malaquías", ruta: "malaquias.html" },

  // Nuevo Testamento
  { nombre: "Mateo", ruta: "mateo.html" },
  { nombre: "Marcos", ruta: "marcos.html" },
  { nombre: "Lucas", ruta: "lucas.html" },
  { nombre: "Juan", ruta: "juan.html" },
  { nombre: "Hechos", ruta: "hechosdelosapostoles.html" },
  { nombre: "Romanos", ruta: "romanos.html" },
  { nombre: "1 Corintios", ruta: "1corintios.html" },
  { nombre: "2 Corintios", ruta: "2corintios.html" },
  { nombre: "Gálatas", ruta: "galatas.html" },
  { nombre: "Efesios", ruta: "efesios.html" },
  { nombre: "Filipenses", ruta: "filipenses.html" },
  { nombre: "Colosenses", ruta: "colosenses.html" },
  { nombre: "1 Tesalonicenses", ruta: "1tesalonicenses.html" },
  { nombre: "2 Tesalonicenses", ruta: "2tesalonicenses.html" },
  { nombre: "1 Timoteo", ruta: "1timoteo.html" },
  { nombre: "2 Timoteo", ruta: "2timoteo.html" },
  { nombre: "Tito", ruta: "tito.html" },
  { nombre: "Filemón", ruta: "filemon.html" },
  { nombre: "Hebreos", ruta: "hebreos.html" },
  { nombre: "Santiago", ruta: "santiago.html" },
  { nombre: "1 Pedro", ruta: "1pedro.html" },
  { nombre: "2 Pedro", ruta: "2pedro.html" },
  { nombre: "1 Juan", ruta: "1juan.html" },
  { nombre: "2 Juan", ruta: "2juan.html" },
  { nombre: "3 Juan", ruta: "3juan.html" },
  { nombre: "Judas", ruta: "judas.html" },
  { nombre: "Apocalipsis", ruta: "apocalipsis.html" },
];

const rutaActual = window.location.pathname.toLowerCase();
let indiceActual = libros.findIndex(libro => rutaActual.includes(libro.ruta.toLowerCase()));

if (indiceActual === -1) indiceActual = 0;

const libroSpan = document.getElementById("libro-actual");
const btnAnterior = document.getElementById("anterior");
const btnSiguiente = document.getElementById("siguiente");

function actualizarUI() {
  if (libroSpan) libroSpan.textContent = libros[indiceActual].nombre;
  btnAnterior.disabled = indiceActual === 0;
  btnSiguiente.disabled = indiceActual === libros.length - 1;
}

btnAnterior.addEventListener("click", () => {
  if (indiceActual > 0) {
    indiceActual--;
    window.location.href = libros[indiceActual].ruta;
  }
});

btnSiguiente.addEventListener("click", () => {
  if (indiceActual < libros.length - 1) {
    indiceActual++;
    window.location.href = libros[indiceActual].ruta;
  }
});

actualizarUI();

(function () {
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();