const books = [
    { name: "Génesis", route: "genesis.html" },
    { name: "Éxodo", route: "exodo.html" },
    { name: "Levítico", route: "levitico.html" },
    { name: "Números", route: "numeros.html" },
    { name: "Deuteronomio", route: "deuteronomio.html" },
    { name: "Josué", route: "josue.html" },
    { name: "Jueces", route: "jueces.html" },
    { name: "Rut", route: "rut.html" },
    { name: "1 Samuel", route: "1samuel.html" },
    { name: "2 Samuel", route: "2samuel.html" },
    { name: "1 Reyes", route: "1reyes.html" },
    { name: "2 Reyes", route: "2reyes.html" },
    { name: "1 Crónicas", route: "1cronicas.html" },
    { name: "2 Crónicas", route: "2cronicas.html" },
    { name: "Esdras", route: "esdras.html" },
    { name: "Nehemías", route: "nehemias.html" },
    { name: "Tobías", route: "tobias.html" },
    { name: "Judit", route: "judit.html" },
    { name: "Ester", route: "ester.html" },
    { name: "1 Macabeos", route: "1macabeos.html" },
    { name: "2 Macabeos", route: "2macabeos.html" },
    { name: "Job", route: "job.html" },
    { name: "Salmos", route: "salmos.html" },
    { name: "Proverbios", route: "proverbios.html" },
    { name: "Eclesiastés", route: "eclesiastes.html" },
    { name: "Cantar de los Cantares", route: "cantardeloscantares.html" },
    { name: "Sabiduría", route: "sabiduria.html" },
    { name: "Eclesiástico", route: "eclesiastico.html" },
    { name: "Isaías", route: "isaias.html" },
    { name: "Jeremías", route: "jeremias.html" },
    { name: "Lamentaciones", route: "lamentaciones.html" },
    { name: "Baruc", route: "baruc.html" },
    { name: "Ezequiel", route: "ezequiel.html" },
    { name: "Daniel", route: "daniel.html" },
    { name: "Oseas", route: "oseas.html" },
    { name: "Joel", route: "joel.html" },
    { name: "Amós", route: "amos.html" },
    { name: "Abdías", route: "abdias.html" },
    { name: "Jonás", route: "jonas.html" },
    { name: "Miqueas", route: "miqueas.html" },
    { name: "Nahúm", route: "nahum.html" },
    { name: "Habacuc", route: "habacuc.html" },
    { name: "Sofonías", route: "sofonias.html" },
    { name: "Ageo", route: "ageo.html" },
    { name: "Zacarías", route: "zacarias.html" },
    { name: "Malaquías", route: "malaquias.html" },
    { name: "Mateo", route: "mateo.html" },
    { name: "Marcos", route: "marcos.html" },
    { name: "Lucas", route: "lucas.html" },
    { name: "Juan", route: "juan.html" },
    { name: "Hechos", route: "hechosdelosapostoles.html" },
    { name: "Romanos", route: "romanos.html" },
    { name: "1 Corintios", route: "1corintios.html" },
    { name: "2 Corintios", route: "2corintios.html" },
    { name: "Gálatas", route: "galatas.html" },
    { name: "Efesios", route: "efesios.html" },
    { name: "Filipenses", route: "filipenses.html" },
    { name: "Colosenses", route: "colosenses.html" },
    { name: "1 Tesalonicenses", route: "1tesalonicenses.html" },
    { name: "2 Tesalonicenses", route: "2tesalonicenses.html" },
    { name: "1 Timoteo", route: "1timoteo.html" },
    { name: "2 Timoteo", route: "2timoteo.html" },
    { name: "Tito", route: "tito.html" },
    { name: "Filemón", route: "filemon.html" },
    { name: "Hebreos", route: "hebreos.html" },
    { name: "Santiago", route: "santiago.html" },
    { name: "1 Pedro", route: "1pedro.html" },
    { name: "2 Pedro", route: "2pedro.html" },
    { name: "1 Juan", route: "1juan.html" },
    { name: "2 Juan", route: "2juan.html" },
    { name: "3 Juan", route: "3juan.html" },
    { name: "Judas", route: "judas.html" },
    { name: "Apocalipsis", route: "apocalipsis.html" },
];

const currentFile = window.location.pathname.split("/").pop().toLowerCase();
let currentIndex = books.findIndex((book) => book.route.toLowerCase() === currentFile);

if (currentIndex === -1) currentIndex = 0;

const currentBookLabel = document.getElementById("current-book");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

function updateUI() {
    if (currentBookLabel) currentBookLabel.textContent = books[currentIndex].name;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === books.length - 1;
}

previousButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        window.location.href = books[currentIndex].route;
    }
});

nextButton.addEventListener("click", () => {
    if (currentIndex < books.length - 1) {
        currentIndex++;
        window.location.href = books[currentIndex].route;
    }
});

updateUI();

(function () {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
})();
