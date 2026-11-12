/* Catálogo canónico de los 73 libros de la Biblia (incluye deuterocanónicos).
   Fuente única para la generación de páginas de libro, la navegación y la
   importación de versículos. Cada libro declara:
     - id:        identificador normalizado (nombre de carpeta y prefijo de archivos)
     - name:      título visible en la interfaz
     - chapters:  número de capítulos
     - route:     archivo de la página del libro
   Este archivo es un script clásico de navegador (variable global) y también
   puede cargarse desde Node para la validación del pipeline de importación. */

const BIBLE_CATALOG = {
  "old_testament": [
    { "id": "genesis", "name": "Génesis", "chapters": 50, "route": "genesis.html" },
    { "id": "exodo", "name": "Éxodo", "chapters": 40, "route": "exodo.html" },
    { "id": "levitico", "name": "Levítico", "chapters": 27, "route": "levitico.html" },
    { "id": "numeros", "name": "Números", "chapters": 36, "route": "numeros.html" },
    { "id": "deuteronomio", "name": "Deuteronomio", "chapters": 34, "route": "deuteronomio.html" },
    { "id": "josue", "name": "Josué", "chapters": 24, "route": "josue.html" },
    { "id": "jueces", "name": "Jueces", "chapters": 21, "route": "jueces.html" },
    { "id": "rut", "name": "Rut", "chapters": 4, "route": "rut.html" },
    { "id": "1samuel", "name": "1 Samuel", "chapters": 31, "route": "1samuel.html" },
    { "id": "2samuel", "name": "2 Samuel", "chapters": 24, "route": "2samuel.html" },
    { "id": "1reyes", "name": "1 Reyes", "chapters": 22, "route": "1reyes.html" },
    { "id": "2reyes", "name": "2 Reyes", "chapters": 25, "route": "2reyes.html" },
    { "id": "1cronicas", "name": "1 Crónicas", "chapters": 29, "route": "1cronicas.html" },
    { "id": "2cronicas", "name": "2 Crónicas", "chapters": 36, "route": "2cronicas.html" },
    { "id": "esdras", "name": "Esdras", "chapters": 10, "route": "esdras.html" },
    { "id": "nehemias", "name": "Nehemías", "chapters": 13, "route": "nehemias.html" },
    { "id": "tobias", "name": "Tobías", "chapters": 14, "route": "tobias.html" },
    { "id": "judit", "name": "Judit", "chapters": 16, "route": "judit.html" },
    { "id": "ester", "name": "Ester", "chapters": 16, "route": "ester.html" },
    { "id": "1macabeos", "name": "1 Macabeos", "chapters": 16, "route": "1macabeos.html" },
    { "id": "2macabeos", "name": "2 Macabeos", "chapters": 15, "route": "2macabeos.html" },
    { "id": "job", "name": "Job", "chapters": 42, "route": "job.html" },
    { "id": "salmos", "name": "Salmos", "chapters": 150, "route": "salmos.html" },
    { "id": "proverbios", "name": "Proverbios", "chapters": 31, "route": "proverbios.html" },
    { "id": "eclesiastes", "name": "Eclesiastés", "chapters": 12, "route": "eclesiastes.html" },
    { "id": "cantar_de_los_cantares", "name": "Cantar de los Cantares", "chapters": 8, "route": "cantardeloscantares.html" },
    { "id": "sabiduria", "name": "Sabiduría", "chapters": 19, "route": "sabiduria.html" },
    { "id": "eclesiastico", "name": "Eclesiástico", "chapters": 51, "route": "eclesiastico.html" },
    { "id": "isaias", "name": "Isaías", "chapters": 66, "route": "isaias.html" },
    { "id": "jeremias", "name": "Jeremías", "chapters": 52, "route": "jeremias.html" },
    { "id": "lamentaciones", "name": "Lamentaciones", "chapters": 5, "route": "lamentaciones.html" },
    { "id": "baruc", "name": "Baruc", "chapters": 6, "route": "baruc.html" },
    { "id": "ezequiel", "name": "Ezequiel", "chapters": 48, "route": "ezequiel.html" },
    { "id": "daniel", "name": "Daniel", "chapters": 14, "route": "daniel.html" },
    { "id": "oseas", "name": "Oseas", "chapters": 14, "route": "oseas.html" },
    { "id": "joel", "name": "Joel", "chapters": 4, "route": "joel.html" },
    { "id": "amos", "name": "Amós", "chapters": 9, "route": "amos.html" },
    { "id": "abdias", "name": "Abdías", "chapters": 1, "route": "abdias.html" },
    { "id": "jonas", "name": "Jonás", "chapters": 4, "route": "jonas.html" },
    { "id": "miqueas", "name": "Miqueas", "chapters": 7, "route": "miqueas.html" },
    { "id": "nahum", "name": "Nahúm", "chapters": 3, "route": "nahum.html" },
    { "id": "habacuc", "name": "Habacuc", "chapters": 3, "route": "habacuc.html" },
    { "id": "sofonias", "name": "Sofonías", "chapters": 3, "route": "sofonias.html" },
    { "id": "ageo", "name": "Ageo", "chapters": 2, "route": "ageo.html" },
    { "id": "zacarias", "name": "Zacarías", "chapters": 14, "route": "zacarias.html" },
    { "id": "malaquias", "name": "Malaquías", "chapters": 3, "route": "malaquias.html" }
  ],
  "new_testament": [
    { "id": "mateo", "name": "Mateo", "chapters": 28, "route": "mateo.html" },
    { "id": "marcos", "name": "Marcos", "chapters": 16, "route": "marcos.html" },
    { "id": "lucas", "name": "Lucas", "chapters": 24, "route": "lucas.html" },
    { "id": "juan", "name": "Juan", "chapters": 21, "route": "juan.html" },
    { "id": "hechos_de_los_apostoles", "name": "Hechos", "chapters": 28, "route": "hechosdelosapostoles.html" },
    { "id": "romanos", "name": "Romanos", "chapters": 16, "route": "romanos.html" },
    { "id": "1corintios", "name": "1 Corintios", "chapters": 16, "route": "1corintios.html" },
    { "id": "2corintios", "name": "2 Corintios", "chapters": 13, "route": "2corintios.html" },
    { "id": "galatas", "name": "Gálatas", "chapters": 6, "route": "galatas.html" },
    { "id": "efesios", "name": "Efesios", "chapters": 6, "route": "efesios.html" },
    { "id": "filipenses", "name": "Filipenses", "chapters": 4, "route": "filipenses.html" },
    { "id": "colosenses", "name": "Colosenses", "chapters": 4, "route": "colosenses.html" },
    { "id": "1tesalonicenses", "name": "1 Tesalonicenses", "chapters": 5, "route": "1tesalonicenses.html" },
    { "id": "2tesalonicenses", "name": "2 Tesalonicenses", "chapters": 3, "route": "2tesalonicenses.html" },
    { "id": "1timoteo", "name": "1 Timoteo", "chapters": 6, "route": "1timoteo.html" },
    { "id": "2timoteo", "name": "2 Timoteo", "chapters": 4, "route": "2timoteo.html" },
    { "id": "tito", "name": "Tito", "chapters": 3, "route": "tito.html" },
    { "id": "filemon", "name": "Filemón", "chapters": 1, "route": "filemon.html" },
    { "id": "hebreos", "name": "Hebreos", "chapters": 13, "route": "hebreos.html" },
    { "id": "santiago", "name": "Santiago", "chapters": 5, "route": "santiago.html" },
    { "id": "1pedro", "name": "1 Pedro", "chapters": 5, "route": "1pedro.html" },
    { "id": "2pedro", "name": "2 Pedro", "chapters": 3, "route": "2pedro.html" },
    { "id": "1juan", "name": "1 Juan", "chapters": 5, "route": "1juan.html" },
    { "id": "2juan", "name": "2 Juan", "chapters": 1, "route": "2juan.html" },
    { "id": "3juan", "name": "3 Juan", "chapters": 1, "route": "3juan.html" },
    { "id": "judas", "name": "Judas", "chapters": 1, "route": "judas.html" },
    { "id": "apocalipsis", "name": "Apocalipsis", "chapters": 22, "route": "apocalipsis.html" }
  ]
};
