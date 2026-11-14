const examCatalog = {
    BBDD: [
        "Introducción diseño",
        "Taller jedai",
        "Introduccion sql",
        "DDL 1",
        "DDL 2",
        "DDL 3",
        "DML",
        "DML 1",
        "DML 2",
        "DML 3",
        "DML 4",
        "DML 5",
        "DML 6",
        "DML 7",
        "Programación",
        "Diseño de base de datos",
        "Introduccion mongodb",
        "Base de datos mongodb",
        "Crud create mongodb",
        "Crud delete mongodb",
        "Crud update mongodb",
        "Crud read mongodb",
        "Crud read arreglos y objectes mongodb",
        "Crud read avanzado mongodb",
    ],
    SI: [
        "Componentes de sistemas informatics",
        "Licencias",
        "Sistemas numericos",
        "Programario",
        "Implantació de sistemes operatius (tvi-vb)",
        "Comandos linux",
        "Comandos windows",
        "Dominios windows",
        "Usuarios linux 1",
        "Usuarios linux 2",
        "Redes TCP",
        "Backup",
        "Peticiones 1",
        "Permisos linux",
        "Permisos windows",
        "Servicios NFS - SAMBA",
        "Aplicaciones",
    ],
    LMSGI: [
        "Introducción a lenguajes de marcas",
        "JSON",
        "XML",
        "CSS",
        "Posicionamiento + div",
        "HTML",
        "Javascript",
        "DTD",
        "Python",
        "Cloud",
        "ERPS",
    ],
    DIW: [
        "Guia de estilos",
        "HTML-CSS",
        "Recursos para la web",
        "Javascript",
        "Recursos multimedia",
        "Accesibilidad",
        "Usabilidad",
        "Fases de diseño",
    ],
    PED: {
        "Elementos basicos de la programación": [
            "Instrucciones secuenciales",
            "Variables y tipos de datos",
            "Operadores y expresiones",
            "Condicionales",
            "Mas sobre tipos de datos",
            "Bucles condicionales",
            "Recorridos (for)",
            "Strings",
            "Control de bucles",
        ],
        "Programación modular": [
            "Modulos",
            "Funciones",
            "Variables y modulos",
            "Arreglos",
            "Recursividad",
        ],
        Archivos: ["Gestión de archivos", "Excepciones y manejo de errores"],
        "Programación orientada a objetos": [
            "Clases y objectos",
            "Constructores",
            "Miembros de una instancias y de una clase",
            "Composición",
            "Heréncia",
        ],
        Bibliotecas: [
            "Bibliotecas estandar",
            "Gestion de dependencias",
            "APIs externas",
            "Documentacion javadoc",
            "Control de versiones git",
        ],
        "Validación de aplicaciones": [
            "Errores",
            "Pruebas",
            "Clases de pruebas",
            "Pruebas unitarias con JUnit",
        ],
        "Persistencia con base de datos": [
            "POO y el modelo relacional",
            "Sistemas de gestión de bases de datos",
            "JDBC de java",
            "Datos persistentes",
        ],
        "Diagramas clases": [
            "Elementos UML",
            "Relaciones UML",
            "Cardinalidad y visibilidad",
            "Diagramas de objetos",
            "Herramientas de modelado",
        ],
        "Diseño orientado a objetos": [
            "Principios SOLID",
            "Patrones de diseño creacionales",
            "Patrones de diseño estructurales",
            "Patrones de diseño de comportamiento",
            "Refactorizacion",
        ],
        "Diagrama de comportamiento": [
            "Diagramas de secuencia",
            "Diagramas de casos de uso",
            "Diagramas de actividad",
            "Diagramas de estado",
        ],
    },
};

const letters = ["A", "B", "C", "D"];
const storageKey = "testsDawProgress";
const defaultProgress = {
    completedTests: 0,
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
};
const pathAliases = new Map([
    ["implantacio_de_sistemes_operatius_(tvi-vb)", "implantacio_de_sistemes_operatius_tvi_vb"],
    ["recorridos_(for)", "recorridos_for"],
]);

const introTitle = document.getElementById("intro-title");
const introDescription = document.getElementById("intro-description");
const questionsSection = document.getElementById("questions");
const summary = document.getElementById("summary");
const progressFill = document.getElementById("progress-fill");
const progressWrapper = document.getElementById("progress-wrapper");
const progressText = document.getElementById("progress-text");
const scoreDisplay = document.getElementById("score");
const weakTopicsDisplay = document.getElementById("weak-topics");
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackText = document.getElementById("feedback-text");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const examList = document.getElementById("exam-list");
const menuToggle = document.getElementById("menu-toggle");
const menu = document.querySelector(".side-menu");
const totalExamsDisplay = document.getElementById("total-exams");
const totalQuestionsDisplay = document.getElementById("total-questions");
const quickProgressDisplay = document.getElementById("quick-progress");
const resultsChart = document.getElementById("results-chart");

let questions = [];
let currentQuestion = 0;
let score = 0;
let weakTopics = [];
let feedbackTimer = 0;

function toSlug(value) {
    const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "_")
        .replace(/\+/g, "_")
        .replace(/,/g, "")
        .replace(/\./g, "");
    return pathAliases.get(slug) ?? slug;
}

function readProgress() {
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
        if (stored && typeof stored === "object") {
            return {
                completedTests: Number(stored.completedTests) || 0,
                totalQuestionsAnswered: Number(stored.totalQuestionsAnswered) || 0,
                correctAnswers: Number(stored.correctAnswers) || 0,
            };
        }
    } catch {
        return { ...defaultProgress };
    }
    return { ...defaultProgress };
}

function saveProgress(progress) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
        return;
    }
    updateStatsUI();
}

function countExams() {
    return Object.values(examCatalog).reduce((total, content) => {
        if (Array.isArray(content)) {
            return total + content.length;
        }
        return (
            total +
            Object.values(content).reduce((sectionTotal, topics) => {
                return sectionTotal + topics.length;
            }, 0)
        );
    }, 0);
}

function updateStatsUI() {
    const progress = readProgress();
    const examsTotal = countExams();
    totalExamsDisplay.textContent = String(examsTotal);
    totalQuestionsDisplay.textContent = String(progress.totalQuestionsAnswered);
    const percentage =
        examsTotal > 0 ? Math.round((progress.completedTests / examsTotal) * 100) : 0;
    quickProgressDisplay.textContent = `${percentage}%`;
}

function closeSiblingSubmenus(item) {
    const parent = item.parentElement;
    if (!parent) {
        return;
    }
    parent.querySelectorAll(".has-submenu.is-open").forEach((openItem) => {
        if (openItem === item) {
            return;
        }
        openItem.classList.remove("is-open");
        openItem.querySelector(":scope > .submenu")?.classList.remove("is-open");
        openItem
            .querySelectorAll("button[aria-expanded]")
            .forEach((button) => button.setAttribute("aria-expanded", "false"));
    });
}

function toggleSubmenu(item, button, submenu) {
    const willOpen = !submenu.classList.contains("is-open");
    closeSiblingSubmenus(item);
    submenu.classList.toggle("is-open", willOpen);
    item.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
}

function createTopicItem(category, topic, section = null) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "topic-button";
    button.textContent = topic;
    button.addEventListener("click", () => {
        loadExam(category, topic, section);
        closeMobileMenu();
    });
    item.append(button);
    return item;
}

function createSectionItem(category, section, topics) {
    const item = document.createElement("li");
    item.className = "section-item has-submenu";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "section-button";
    button.textContent = section;
    button.setAttribute("aria-expanded", "false");
    const submenu = document.createElement("ul");
    submenu.className = "submenu";
    topics.forEach((topic) => {
        submenu.append(createTopicItem(category, topic, section));
    });
    item.append(button, submenu);
    button.addEventListener("click", () => {
        toggleSubmenu(item, button, submenu);
    });
    return item;
}

function buildMenu() {
    examList.replaceChildren();
    Object.entries(examCatalog).forEach(([category, content]) => {
        const item = document.createElement("li");
        item.className = "exam-category has-submenu";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-button";
        button.textContent = category;
        button.setAttribute("aria-expanded", "false");
        const submenu = document.createElement("ul");
        submenu.className = "submenu";
        if (Array.isArray(content)) {
            content.forEach((topic) => {
                submenu.append(createTopicItem(category, topic));
            });
        } else {
            Object.entries(content).forEach(([section, topics]) => {
                submenu.append(createSectionItem(category, section, topics));
            });
        }
        item.append(button, submenu);
        button.addEventListener("click", () => {
            toggleSubmenu(item, button, submenu);
        });
        examList.append(item);
    });
}

function closeMobileMenu() {
    if (window.matchMedia("(max-width: 900px)").matches) {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
}

async function loadExam(category, topic, section = null) {
    const path = section
        ? `data/${toSlug(category)}/${toSlug(section)}/${toSlug(topic)}.json`
        : `data/${toSlug(category)}/${toSlug(topic)}.json`;
    questions = [];
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("No se pudo cargar el test");
        }
        const payload = await response.json();
        if (!Array.isArray(payload) || payload.length === 0) {
            throw new Error("El test no contiene preguntas");
        }
        questions = payload;
        currentQuestion = 0;
        score = 0;
        weakTopics = [];
        introTitle.textContent = topic;
        introDescription.textContent = `Test de ${category} - ${questions.length} preguntas. ¡Buena suerte!`;
        startButton.classList.remove("is-hidden");
        startButton.classList.add("is-active");
        summary.classList.add("is-hidden");
        summary.classList.remove("is-active");
        questionsSection.classList.add("is-hidden");
        questionsSection.classList.remove("is-active");
        progressWrapper.classList.add("is-hidden");
        progressFill.style.setProperty("--progress", "0%");
        progressText.textContent = "0%";
        progressWrapper.setAttribute("aria-valuenow", "0");
        hideFeedback();
    } catch {
        showFeedback("No se pudo cargar el test. Verifica que el archivo exista.");
    }
}

startButton.addEventListener("click", () => {
    if (questions.length === 0) {
        showFeedback("Primero selecciona un test del menú.");
        return;
    }
    startButton.classList.add("is-hidden");
    startButton.classList.remove("is-active");
    questionsSection.classList.remove("is-hidden");
    questionsSection.classList.add("is-active");
    progressWrapper.classList.remove("is-hidden");
    questionsSection.scrollIntoView({ behavior: "smooth" });
    renderQuestion();
    updateProgress();
});

restartButton.addEventListener("click", () => {
    if (questions.length === 0) {
        showFeedback("Primero selecciona un test del menú.");
        return;
    }
    currentQuestion = 0;
    score = 0;
    weakTopics = [];
    summary.classList.add("is-hidden");
    summary.classList.remove("is-active");
    questionsSection.classList.remove("is-hidden");
    questionsSection.classList.add("is-active");
    progressWrapper.classList.remove("is-hidden");
    hideFeedback();
    renderQuestion();
    updateProgress();
});

function renderQuestion() {
    questionsSection.replaceChildren();
    const question = questions[currentQuestion];
    let answered = false;
    const panel = document.createElement("div");
    panel.id = "question-panel";
    const heading = document.createElement("h3");
    heading.textContent = `${currentQuestion + 1}. ${question.question}`;
    panel.append(heading);
    question.options.forEach((optionText, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";
        button.textContent = `${letters[index] ?? index + 1}. ${optionText}`;
        button.addEventListener("click", () => {
            if (answered) {
                return;
            }
            answered = true;
            evaluateAnswer(index, question, button);
        });
        panel.append(button);
    });
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "button next-button";
    nextButton.textContent = currentQuestion === questions.length - 1 ? "Finalizar" : "Siguiente";
    nextButton.addEventListener("click", () => {
        if (!answered) {
            showFeedback("Por favor selecciona una respuesta antes de continuar.");
            return;
        }
        advanceQuestion();
    });
    panel.append(nextButton);
    questionsSection.append(panel);
}

function evaluateAnswer(index, question, selectedButton) {
    const optionButtons = questionsSection.querySelectorAll(".option");
    optionButtons.forEach((button) => {
        button.disabled = true;
    });
    const isCorrect = index === question.answer;
    if (isCorrect) {
        selectedButton.classList.add("is-correct");
        score += 1;
        launchConfetti(false);
    } else {
        selectedButton.classList.add("is-incorrect");
        optionButtons[question.answer]?.classList.add("is-correct");
        weakTopics.push(question.question);
    }
    showFeedback(question.explanation || (isCorrect ? "¡Correcto!" : "Incorrecto"));
    const progress = readProgress();
    progress.totalQuestionsAnswered += 1;
    if (isCorrect) {
        progress.correctAnswers += 1;
    }
    saveProgress(progress);
}

function advanceQuestion() {
    currentQuestion += 1;
    if (currentQuestion < questions.length) {
        renderQuestion();
        updateProgress();
        hideFeedback();
        return;
    }
    showSummary();
}

function updateProgress() {
    const percentage = Math.round((currentQuestion / questions.length) * 100);
    progressFill.style.setProperty("--progress", `${percentage}%`);
    progressText.textContent = `${percentage}%`;
    progressWrapper.setAttribute("aria-valuenow", String(percentage));
}

function showFeedback(message) {
    window.clearTimeout(feedbackTimer);
    feedbackText.textContent = message;
    feedbackPanel.classList.remove("is-hidden");
    requestAnimationFrame(() => {
        feedbackPanel.classList.add("is-active");
    });
    feedbackTimer = window.setTimeout(() => {
        feedbackPanel.classList.remove("is-active");
        feedbackTimer = window.setTimeout(() => {
            feedbackPanel.classList.add("is-hidden");
        }, 300);
    }, 4000);
}

function hideFeedback() {
    window.clearTimeout(feedbackTimer);
    feedbackPanel.classList.remove("is-active");
    feedbackPanel.classList.add("is-hidden");
}

function showSummary() {
    questionsSection.classList.add("is-hidden");
    questionsSection.classList.remove("is-active");
    summary.classList.remove("is-hidden");
    summary.classList.add("is-active");
    progressWrapper.classList.add("is-hidden");
    hideFeedback();
    progressFill.style.setProperty("--progress", "100%");
    progressText.textContent = "100%";
    progressWrapper.setAttribute("aria-valuenow", "100");
    scoreDisplay.textContent = `Puntaje: ${score}/${questions.length}`;
    const percentage = (score / questions.length) * 100;
    const badge =
        percentage >= 90 ? "Maestro DAW" : percentage >= 70 ? "Avanzado DAW" : "Principiante DAW";
    weakTopicsDisplay.replaceChildren();
    if (weakTopics.length > 0) {
        const title = document.createElement("strong");
        title.textContent = "Temas a repasar:";
        weakTopicsDisplay.append(title, document.createElement("br"));
        weakTopics.forEach((topic) => {
            weakTopicsDisplay.append(`• ${topic}`, document.createElement("br"));
        });
        weakTopicsDisplay.append(document.createElement("br"));
        const badgeLabel = document.createElement("strong");
        badgeLabel.textContent = badge;
        weakTopicsDisplay.append(badgeLabel);
    } else {
        const excellent = document.createElement("strong");
        excellent.textContent = "¡Excelente! Has respondido todo correctamente.";
        weakTopicsDisplay.append(excellent, document.createElement("br"), badge);
    }
    summary.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(drawChart, 200);
    launchConfetti(true);
    const progress = readProgress();
    progress.completedTests += 1;
    saveProgress(progress);
}

function launchConfetti(isLarge) {
    const amount = isLarge ? 60 : 30;
    const colors = ["#00ff99", "#ffdd00", "#ff4d4d", "#00dfff"];
    for (let index = 0; index < amount; index += 1) {
        const piece = document.createElement("span");
        const size = (6 + Math.random() * 10) / 16;
        piece.className = "confetti-piece";
        piece.style.setProperty("--left", `${Math.random() * 100}%`);
        piece.style.setProperty("--size", `${size.toFixed(3)}rem`);
        piece.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
        piece.style.setProperty("--duration", `${(1.5 + Math.random() * 2).toFixed(2)}s`);
        document.body.append(piece);
        window.setTimeout(() => {
            piece.remove();
        }, 3600);
    }
}

function drawChart() {
    const context = resultsChart.getContext("2d");
    if (!context) {
        return;
    }
    const total = questions.length;
    if (total === 0) {
        return;
    }
    const correct = score;
    const incorrect = total - correct;
    const centerX = resultsChart.width / 2;
    const centerY = resultsChart.height / 2;
    const radius = 100;
    const colors = ["#00ff99", "#ff4d4d"];
    let startAngle = -0.5 * Math.PI;
    context.clearRect(0, 0, resultsChart.width, resultsChart.height);
    [correct, incorrect].forEach((value, index) => {
        if (value === 0) {
            return;
        }
        const slice = (value / total) * Math.PI * 2;
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startAngle, startAngle + slice);
        context.closePath();
        context.fillStyle = colors[index];
        context.fill();
        startAngle += slice;
    });
}

menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        return;
    }
    if (!questionsSection.classList.contains("is-active") || !questions[currentQuestion]) {
        return;
    }
    const optionIndex = letters.indexOf(event.key.toUpperCase());
    if (optionIndex >= 0) {
        document.querySelectorAll(".option")[optionIndex]?.click();
    }
});

buildMenu();
updateStatsUI();
