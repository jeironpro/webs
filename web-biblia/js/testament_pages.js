const slugify = (name) =>
    name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");

const oldTestamentSections = [
    { title: "Pentateuco", books: ["Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio"] },
    {
        title: "Históricos",
        books: [
            "Josué",
            "Jueces",
            "Rut",
            "1 Samuel",
            "2 Samuel",
            "1 Reyes",
            "2 Reyes",
            "1 Crónicas",
            "2 Crónicas",
            "Esdras",
            "Nehemías",
            "Tobías",
            "Judit",
            "Ester",
            "1 Macabeos",
            "2 Macabeos",
        ],
    },
    {
        title: "Poéticos y sapienciales",
        books: [
            "Job",
            "Salmos",
            "Proverbios",
            "Eclesiastés",
            "Cantar de los Cantares",
            "Sabiduría",
            "Eclesiástico",
        ],
    },
    {
        title: "Proféticos",
        books: [
            "Isaías",
            "Jeremías",
            "Lamentaciones",
            "Baruc",
            "Ezequiel",
            "Daniel",
            "Oseas",
            "Joel",
            "Amós",
            "Abdías",
            "Jonás",
            "Miqueas",
            "Nahúm",
            "Habacuc",
            "Sofonías",
            "Ageo",
            "Zacarías",
            "Malaquías",
        ],
    },
];

const newTestamentSections = [
    { title: "Evangelios", books: ["Mateo", "Marcos", "Lucas", "Juan"] },
    { title: "Hechos", books: ["Hechos de los Apóstoles"] },
    {
        title: "Epístolas paulinas",
        books: [
            "Romanos",
            "1 Corintios",
            "2 Corintios",
            "Gálatas",
            "Efesios",
            "Filipenses",
            "Colosenses",
            "1 Tesalonicenses",
            "2 Tesalonicenses",
            "1 Timoteo",
            "2 Timoteo",
            "Tito",
            "Filemón",
        ],
    },
    {
        title: "Epístolas generales",
        books: ["Hebreos", "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas"],
    },
    { title: "Apocalipsis", books: ["Apocalipsis"] },
];

const oldTestamentContainer = document.getElementById("books-ot");
const newTestamentContainer = document.getElementById("books-nt");
const testamentContainer = oldTestamentContainer || newTestamentContainer;

if (testamentContainer) {
    const isOldTestament = Boolean(oldTestamentContainer);
    const sections = isOldTestament ? oldTestamentSections : newTestamentSections;
    const basePath = isOldTestament ? "html/old_testament" : "html/new_testament";

    sections.forEach((section) => {
        const heading = document.createElement("h2");
        heading.className = "section-title";
        heading.textContent = section.title;
        testamentContainer.appendChild(heading);

        section.books.forEach((name) => {
            const book = document.createElement("div");
            book.classList.add("book");
            const link = document.createElement("a");
            link.href = `${basePath}/${slugify(name)}.html`;
            link.textContent = name;
            book.appendChild(link);
            testamentContainer.appendChild(book);
        });
    });
}

const yearFooter = document.getElementById("year");
if (yearFooter) yearFooter.textContent = new Date().getFullYear();
