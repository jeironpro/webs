const books = [
    { id: "genesis", chapters: 50 },
    { id: "exodo", chapters: 40 },
    { id: "levitico", chapters: 27 },
    { id: "numeros", chapters: 36 },
    { id: "deuteronomio", chapters: 34 },
    { id: "josue", chapters: 24 },
    { id: "jueces", chapters: 21 },
    { id: "rut", chapters: 4 },
    { id: "1samuel", chapters: 31 },
    { id: "2samuel", chapters: 24 },
    { id: "1reyes", chapters: 22 },
    { id: "2reyes", chapters: 25 },
    { id: "1cronicas", chapters: 29 },
    { id: "2cronicas", chapters: 36 },
    { id: "esdras", chapters: 10 },
    { id: "nehemias", chapters: 13 },
    { id: "tobias", chapters: 14 },
    { id: "judit", chapters: 16 },
    { id: "ester", chapters: 16 },
    { id: "1macabeos", chapters: 16 },
    { id: "2macabeos", chapters: 15 },
    { id: "job", chapters: 42 },
    { id: "salmos", chapters: 150 },
    { id: "proverbios", chapters: 31 },
    { id: "eclesiastes", chapters: 12 },
    { id: "cantar_de_los_cantares", chapters: 8 },
    { id: "sabiduria", chapters: 19 },
    { id: "eclesiastico", chapters: 51 },
    { id: "isaias", chapters: 66 },
    { id: "jeremias", chapters: 52 },
    { id: "lamentaciones", chapters: 5 },
    { id: "baruc", chapters: 6 },
    { id: "ezequiel", chapters: 48 },
    { id: "daniel", chapters: 14 },
    { id: "oseas", chapters: 14 },
    { id: "joel", chapters: 4 },
    { id: "amos", chapters: 9 },
    { id: "abdias", chapters: 1 },
    { id: "jonas", chapters: 4 },
    { id: "miqueas", chapters: 7 },
    { id: "nahum", chapters: 3 },
    { id: "habacuc", chapters: 3 },
    { id: "sofonias", chapters: 3 },
    { id: "ageo", chapters: 2 },
    { id: "zacarias", chapters: 14 },
    { id: "malaquias", chapters: 3 },
    { id: "mateo", chapters: 28 },
    { id: "marcos", chapters: 16 },
    { id: "lucas", chapters: 24 },
    { id: "juan", chapters: 21 },
    { id: "hechos_de_los_apostoles", chapters: 28 },
    { id: "romanos", chapters: 16 },
    { id: "1corintios", chapters: 16 },
    { id: "2corintios", chapters: 13 },
    { id: "galatas", chapters: 6 },
    { id: "efesios", chapters: 6 },
    { id: "filipenses", chapters: 4 },
    { id: "colosenses", chapters: 4 },
    { id: "1tesalonicenses", chapters: 5 },
    { id: "2tesalonicenses", chapters: 3 },
    { id: "1timoteo", chapters: 6 },
    { id: "2timoteo", chapters: 4 },
    { id: "tito", chapters: 3 },
    { id: "filemon", chapters: 1 },
    { id: "hebreos", chapters: 13 },
    { id: "santiago", chapters: 5 },
    { id: "1pedro", chapters: 5 },
    { id: "2pedro", chapters: 3 },
    { id: "1juan", chapters: 5 },
    { id: "2juan", chapters: 1 },
    { id: "3juan", chapters: 1 },
    { id: "judas", chapters: 1 },
    { id: "apocalipsis", chapters: 22 },
];

const currentPath = window.location.pathname.toLowerCase();
const parts = currentPath.split("/");
const bookId = parts[parts.length - 2];
const file = parts[parts.length - 1];
const currentChapter = parseInt(file.replace(".html", "").split("_").pop(), 10);

const bookIndex = books.findIndex((b) => b.id === bookId);
const book = books[bookIndex];

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const currentBookLabel = document.getElementById("current-book");

function goTo(targetBook, chapter) {
    window.location.href = `../${targetBook}/${targetBook}_${chapter}.html`;
}

function updateBook() {
    if (currentBookLabel) currentBookLabel.textContent = `${book.id} ${currentChapter}`;

    if (currentChapter > 1) {
        previousButton.onclick = () => goTo(book.id, currentChapter - 1);
    } else if (bookIndex > 0) {
        const previous = books[bookIndex - 1];
        previousButton.onclick = () => goTo(previous.id, previous.chapters);
    } else {
        previousButton.disabled = true;
    }

    if (currentChapter < book.chapters) {
        nextButton.onclick = () => goTo(book.id, currentChapter + 1);
    } else if (bookIndex < books.length - 1) {
        const next = books[bookIndex + 1];
        nextButton.onclick = () => goTo(next.id, 1);
    } else {
        nextButton.disabled = true;
    }
}

updateBook();

(function () {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
})();
