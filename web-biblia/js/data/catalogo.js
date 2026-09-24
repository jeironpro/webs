/* Catálogo canónico de los 73 libros de la Biblia (incluye deuterocanónicos).
   Fuente única para la generación de páginas de libro, la navegación y la
   importación de versículos. Cada libro declara:
     - id:        identificador normalizado (nombre de carpeta y prefijo de archivos)
     - nombre:    título visible en la interfaz
     - capitulos: número de capítulos
     - ruta:      archivo de la página del libro
   Este archivo es un script clásico de navegador (variable global) y también
   puede cargarse desde Node para la validación del pipeline de importación. */

const CATALOGO_BIBLIA = {
  "antiguo_testamento": [
    { "id": "genesis", "nombre": "Génesis", "capitulos": 50, "ruta": "genesis.html" },
    { "id": "exodo", "nombre": "Éxodo", "capitulos": 40, "ruta": "exodo.html" },
    { "id": "levitico", "nombre": "Levítico", "capitulos": 27, "ruta": "levitico.html" },
    { "id": "numeros", "nombre": "Números", "capitulos": 36, "ruta": "numeros.html" },
    { "id": "deuteronomio", "nombre": "Deuteronomio", "capitulos": 34, "ruta": "deuteronomio.html" },
    { "id": "josue", "nombre": "Josué", "capitulos": 24, "ruta": "josue.html" },
    { "id": "jueces", "nombre": "Jueces", "capitulos": 21, "ruta": "jueces.html" },
    { "id": "rut", "nombre": "Rut", "capitulos": 4, "ruta": "rut.html" },
    { "id": "1samuel", "nombre": "1 Samuel", "capitulos": 31, "ruta": "1samuel.html" },
    { "id": "2samuel", "nombre": "2 Samuel", "capitulos": 24, "ruta": "2samuel.html" },
    { "id": "1reyes", "nombre": "1 Reyes", "capitulos": 22, "ruta": "1reyes.html" },
    { "id": "2reyes", "nombre": "2 Reyes", "capitulos": 25, "ruta": "2reyes.html" },
    { "id": "1cronicas", "nombre": "1 Crónicas", "capitulos": 29, "ruta": "1cronicas.html" },
    { "id": "2cronicas", "nombre": "2 Crónicas", "capitulos": 36, "ruta": "2cronicas.html" },
    { "id": "esdras", "nombre": "Esdras", "capitulos": 10, "ruta": "esdras.html" },
    { "id": "nehemias", "nombre": "Nehemías", "capitulos": 13, "ruta": "nehemias.html" },
    { "id": "tobias", "nombre": "Tobías", "capitulos": 14, "ruta": "tobias.html" },
    { "id": "judit", "nombre": "Judit", "capitulos": 16, "ruta": "judit.html" },
    { "id": "ester", "nombre": "Ester", "capitulos": 16, "ruta": "ester.html" },
    { "id": "1macabeos", "nombre": "1 Macabeos", "capitulos": 16, "ruta": "1macabeos.html" },
    { "id": "2macabeos", "nombre": "2 Macabeos", "capitulos": 15, "ruta": "2macabeos.html" },
    { "id": "job", "nombre": "Job", "capitulos": 42, "ruta": "job.html" },
    { "id": "salmos", "nombre": "Salmos", "capitulos": 150, "ruta": "salmos.html" },
    { "id": "proverbios", "nombre": "Proverbios", "capitulos": 31, "ruta": "proverbios.html" },
    { "id": "eclesiastes", "nombre": "Eclesiastés", "capitulos": 12, "ruta": "eclesiastes.html" },
    { "id": "cantar_de_los_cantares", "nombre": "Cantar de los Cantares", "capitulos": 8, "ruta": "cantardeloscantares.html" },
    { "id": "sabiduria", "nombre": "Sabiduría", "capitulos": 19, "ruta": "sabiduria.html" },
    { "id": "eclesiastico", "nombre": "Eclesiástico", "capitulos": 51, "ruta": "eclesiastico.html" },
    { "id": "isaias", "nombre": "Isaías", "capitulos": 66, "ruta": "isaias.html" },
    { "id": "jeremias", "nombre": "Jeremías", "capitulos": 52, "ruta": "jeremias.html" },
    { "id": "lamentaciones", "nombre": "Lamentaciones", "capitulos": 5, "ruta": "lamentaciones.html" },
    { "id": "baruc", "nombre": "Baruc", "capitulos": 6, "ruta": "baruc.html" },
    { "id": "ezequiel", "nombre": "Ezequiel", "capitulos": 48, "ruta": "ezequiel.html" },
    { "id": "daniel", "nombre": "Daniel", "capitulos": 14, "ruta": "daniel.html" },
    { "id": "oseas", "nombre": "Oseas", "capitulos": 14, "ruta": "oseas.html" },
    { "id": "joel", "nombre": "Joel", "capitulos": 4, "ruta": "joel.html" },
    { "id": "amos", "nombre": "Amós", "capitulos": 9, "ruta": "amos.html" },
    { "id": "abdias", "nombre": "Abdías", "capitulos": 1, "ruta": "abdias.html" },
    { "id": "jonas", "nombre": "Jonás", "capitulos": 4, "ruta": "jonas.html" },
    { "id": "miqueas", "nombre": "Miqueas", "capitulos": 7, "ruta": "miqueas.html" },
    { "id": "nahum", "nombre": "Nahúm", "capitulos": 3, "ruta": "nahum.html" },
    { "id": "habacuc", "nombre": "Habacuc", "capitulos": 3, "ruta": "habacuc.html" },
    { "id": "sofonias", "nombre": "Sofonías", "capitulos": 3, "ruta": "sofonias.html" },
    { "id": "ageo", "nombre": "Ageo", "capitulos": 2, "ruta": "ageo.html" },
    { "id": "zacarias", "nombre": "Zacarías", "capitulos": 14, "ruta": "zacarias.html" },
    { "id": "malaquias", "nombre": "Malaquías", "capitulos": 3, "ruta": "malaquias.html" }
  ],
  "nuevo_testamento": [
    { "id": "mateo", "nombre": "Mateo", "capitulos": 28, "ruta": "mateo.html" },
    { "id": "marcos", "nombre": "Marcos", "capitulos": 16, "ruta": "marcos.html" },
    { "id": "lucas", "nombre": "Lucas", "capitulos": 24, "ruta": "lucas.html" },
    { "id": "juan", "nombre": "Juan", "capitulos": 21, "ruta": "juan.html" },
    { "id": "hechos_de_los_apostoles", "nombre": "Hechos", "capitulos": 28, "ruta": "hechosdelosapostoles.html" },
    { "id": "romanos", "nombre": "Romanos", "capitulos": 16, "ruta": "romanos.html" },
    { "id": "1corintios", "nombre": "1 Corintios", "capitulos": 16, "ruta": "1corintios.html" },
    { "id": "2corintios", "nombre": "2 Corintios", "capitulos": 13, "ruta": "2corintios.html" },
    { "id": "galatas", "nombre": "Gálatas", "capitulos": 6, "ruta": "galatas.html" },
    { "id": "efesios", "nombre": "Efesios", "capitulos": 6, "ruta": "efesios.html" },
    { "id": "filipenses", "nombre": "Filipenses", "capitulos": 4, "ruta": "filipenses.html" },
    { "id": "colosenses", "nombre": "Colosenses", "capitulos": 4, "ruta": "colosenses.html" },
    { "id": "1tesalonicenses", "nombre": "1 Tesalonicenses", "capitulos": 5, "ruta": "1tesalonicenses.html" },
    { "id": "2tesalonicenses", "nombre": "2 Tesalonicenses", "capitulos": 3, "ruta": "2tesalonicenses.html" },
    { "id": "1timoteo", "nombre": "1 Timoteo", "capitulos": 6, "ruta": "1timoteo.html" },
    { "id": "2timoteo", "nombre": "2 Timoteo", "capitulos": 4, "ruta": "2timoteo.html" },
    { "id": "tito", "nombre": "Tito", "capitulos": 3, "ruta": "tito.html" },
    { "id": "filemon", "nombre": "Filemón", "capitulos": 1, "ruta": "filemon.html" },
    { "id": "hebreos", "nombre": "Hebreos", "capitulos": 13, "ruta": "hebreos.html" },
    { "id": "santiago", "nombre": "Santiago", "capitulos": 5, "ruta": "santiago.html" },
    { "id": "1pedro", "nombre": "1 Pedro", "capitulos": 5, "ruta": "1pedro.html" },
    { "id": "2pedro", "nombre": "2 Pedro", "capitulos": 3, "ruta": "2pedro.html" },
    { "id": "1juan", "nombre": "1 Juan", "capitulos": 5, "ruta": "1juan.html" },
    { "id": "2juan", "nombre": "2 Juan", "capitulos": 1, "ruta": "2juan.html" },
    { "id": "3juan", "nombre": "3 Juan", "capitulos": 1, "ruta": "3juan.html" },
    { "id": "judas", "nombre": "Judas", "capitulos": 1, "ruta": "judas.html" },
    { "id": "apocalipsis", "nombre": "Apocalipsis", "capitulos": 22, "ruta": "apocalipsis.html" }
  ]
};
