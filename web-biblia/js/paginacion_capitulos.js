const libros = [
    {"nombre": "genesis", "capitulos": 50},
    {"nombre": "exodo", "capitulos": 40},
    {"nombre": "levitico", "capitulos": 27},
    {"nombre": "numeros", "capitulos": 36},
    {"nombre": "deuteronomio", "capitulos": 34},
    {"nombre": "josue", "capitulos": 24},
    {"nombre": "jueces", "capitulos": 21},
    {"nombre": "rut", "capitulos": 4},
    {"nombre": "1samuel", "capitulos": 31},
    {"nombre": "2samuel", "capitulos": 24},
    {"nombre": "1reyes", "capitulos": 22},
    {"nombre": "2reyes", "capitulos": 25},
    {"nombre": "1cronicas", "capitulos": 29},
    {"nombre": "2cronicas", "capitulos": 36},
    {"nombre": "esdras", "capitulos": 10},
    {"nombre": "nehemias", "capitulos": 13},
    {"nombre": "tobias", "capitulos": 14},
    {"nombre": "judit", "capitulos": 16},
    {"nombre": "ester", "capitulos": 16},
    {"nombre": "1macabeos", "capitulos": 16},
    {"nombre": "2macabeos", "capitulos": 15},
    {"nombre": "job", "capitulos": 42},
    {"nombre": "salmos", "capitulos": 150},
    {"nombre": "proverbios", "capitulos": 31},
    {"nombre": "eclesiastes", "capitulos": 12},
    {"nombre": "cantar_de_los_cantares", "capitulos": 8},
    {"nombre": "sabiduria", "capitulos": 19},
    {"nombre": "eclesiastico", "capitulos": 51},
    {"nombre": "isaias", "capitulos": 66},
    {"nombre": "jeremias", "capitulos": 52},
    {"nombre": "lamentaciones", "capitulos": 5},
    {"nombre": "baruc", "capitulos": 6},
    {"nombre": "ezequiel", "capitulos": 48},
    {"nombre": "daniel", "capitulos": 14},
    {"nombre": "oseas", "capitulos": 14},
    {"nombre": "joel", "capitulos": 4},
    {"nombre": "amos", "capitulos": 9},
    {"nombre": "abdias", "capitulos": 1},
    {"nombre": "jonas", "capitulos": 4},
    {"nombre": "miqueas", "capitulos": 7},
    {"nombre": "nahum", "capitulos": 3},
    {"nombre": "habacuc", "capitulos": 3},
    {"nombre": "sofonias", "capitulos": 3},
    {"nombre": "ageo", "capitulos": 2},
    {"nombre": "zacarias", "capitulos": 14},
    {"nombre": "malaquias", "capitulos": 3},
    {"nombre": "mateo", "capitulos": 28},
    {"nombre": "marcos", "capitulos": 16},
    {"nombre": "lucas", "capitulos": 24},
    {"nombre": "juan", "capitulos": 21},
    {"nombre": "hechos_de_los_apostoles", "capitulos": 28},
    {"nombre": "romanos", "capitulos": 16},
    {"nombre": "1corintios", "capitulos": 16},
    {"nombre": "2corintios", "capitulos": 13},
    {"nombre": "galatas", "capitulos": 6},
    {"nombre": "efesios", "capitulos": 6},
    {"nombre": "filipenses", "capitulos": 4},
    {"nombre": "colosenses", "capitulos": 4},
    {"nombre": "1tesalonicenses", "capitulos": 5},
    {"nombre": "2tesalonicenses", "capitulos": 3},
    {"nombre": "1timoteo", "capitulos": 6},
    {"nombre": "2timoteo", "capitulos": 4},
    {"nombre": "tito", "capitulos": 3},
    {"nombre": "filemon", "capitulos": 1},
    {"nombre": "hebreos", "capitulos": 13},
    {"nombre": "santiago", "capitulos": 5},
    {"nombre": "1pedro", "capitulos": 5},
    {"nombre": "2pedro", "capitulos": 3},
    {"nombre": "1juan", "capitulos": 5},
    {"nombre": "2juan", "capitulos": 1},
    {"nombre": "3juan", "capitulos": 1},
    {"nombre": "judas", "capitulos": 1},
    {"nombre": "apocalipsis", "capitulos": 22}
]
const ruta = window.location.pathname.toLowerCase();
const partes = ruta.split('/');
const nombreLibro = partes[partes.length - 2];
const archivo = partes[partes.length - 1];
const capituloActual = parseInt(archivo.replace('.html', '').split('_').pop(), 10);

const indiceLibro = libros.findIndex(l => l.nombre === nombreLibro);
const libro = libros[indiceLibro];

const btnAnterior = document.getElementById("anterior");
const btnSiguiente = document.getElementById("siguiente");
const libroSpan = document.getElementById("libro-actual");

function irA(libroNombre, capitulo) {
    window.location.href = `../${libroNombre}/${libroNombre}_${capitulo}.html`;
}

function actualizarLibro() {
    if (libroSpan) libroSpan.textContent = `${libro.nombre} ${capituloActual}`;

    // Anterior
    if (capituloActual > 1) {
        btnAnterior.onclick = () => irA(libro.nombre, capituloActual - 1);
    } else if (indiceLibro > 0) {
        const anterior = libros[indiceLibro - 1];
        btnAnterior.onclick = () => irA(anterior.nombre, anterior.capitulos);
    } else {
        btnAnterior.disabled = true;
    }

    // Siguiente
    if (capituloActual < libro.capitulos) {
        btnSiguiente.onclick = () => irA(libro.nombre, capituloActual + 1);
    } else if (indiceLibro < libros.length - 1) {
        const siguiente = libros[indiceLibro + 1];
        btnSiguiente.onclick = () => irA(siguiente.nombre, 1);
    } else {
        btnSiguiente.disabled = true;
    }
}

actualizarLibro();

(function () {
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();