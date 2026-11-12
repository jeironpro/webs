const currentScript = document.currentScript;
const BASE = new URL(".", currentScript ? currentScript.src : document.baseURI);
const BASE_PATH = BASE.pathname;

const LANGUAGES = [
    { id: "javascript", name: "JavaScript", color: "accent" },
    { id: "typescript", name: "TypeScript", color: "accent-2" },
    { id: "python", name: "Python", color: "accent-3" },
    { id: "html", name: "HTML", color: "lavender" },
    { id: "css", name: "CSS", color: "mint" },
    { id: "sql", name: "SQL", color: "accent-2" },
    { id: "java", name: "Java", color: "accent-3" },
    { id: "go", name: "Go", color: "mint" },
    { id: "rust", name: "Rust", color: "accent-3" },
    { id: "php", name: "PHP", color: "lavender" },
    { id: "csharp", name: "C#", color: "accent-2" },
    { id: "cpp", name: "C++", color: "accent-3" },
];

const DIFFICULTIES = {
    easy: { label: "Fácil", points: 1 },
    medium: { label: "Media", points: 2 },
    hard: { label: "Difícil", points: 3 },
};

const QUESTION_TYPES = {
    output: "¿Qué imprime?",
    syntax: "Sintaxis",
    bug: "Bug",
    concept: "Concepto",
};

const OPTIONS = ["A", "B", "C", "D"];
const QUESTION_TIME = 30;
const SCORE_KEY = "codelang-quiz:score";
const HISTORY_KEY = "codelang-quiz:history";

const ASPECT_RATIOS = {
    "4-5": { width: 1080, height: 1350 },
    "1-1": { width: 1080, height: 1080 },
    "9-16": { width: 1080, height: 1920 },
    "1-91": { width: 1200, height: 628 },
};

const PALETTE = {
    javascript: "accent",
    typescript: "accent-2",
    python: "accent-3",
    html: "lavender",
    css: "mint",
    sql: "accent-2",
    java: "accent-3",
    go: "mint",
    rust: "accent-3",
    php: "lavender",
    csharp: "accent-2",
    cpp: "accent-3",
};

const CAPTURE_TYPE_LABELS = {
    output: "Que imprime?",
    syntax: "Sintaxis",
    bug: "Bug",
    concept: "Concepto",
};

const CAPTURE_DIFFICULTY_LABELS = {
    easy: "Facil",
    medium: "Media",
    hard: "Dificil",
};

const elements = {
    app: document.getElementById("app"),
    main: document.getElementById("main-content"),
    capture: document.getElementById("capture"),
    modal: document.getElementById("modal-root"),
    navToggle: document.getElementById("nav-toggle"),
    navLinks: document.getElementById("nav-links"),
    menuInfo: document.getElementById("menu-info"),
    navInfo: document.getElementById("nav-info"),
};

let datasetPromise = null;
let homeFilters = { language: "", difficulty: "", type: "" };
let resultsFilters = {};
let isLoading = false;
let homeError = "";
let quiz = null;
let timer = null;
let startToken = 0;
let totalScore = readNumber(SCORE_KEY, 0);
let roundHistory = readHistory();
let modalState = null;

function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[character],
    );
}

function readNumber(key, fallback) {
    try {
        const stored = window.localStorage.getItem(key);
        return stored === null ? fallback : JSON.parse(stored);
    } catch {
        return fallback;
    }
}

function readHistory() {
    try {
        const stored = JSON.parse(window.localStorage.getItem(HISTORY_KEY));
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

function saveToStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* sin persistencia disponible */
    }
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function prepareQuestion(question) {
    const texts = shuffle(OPTIONS.map((letter) => question.options[letter]));
    const options = {};
    OPTIONS.forEach((letter, index) => {
        options[letter] = texts[index];
    });
    const answer = OPTIONS.find(
        (letter) => options[letter] === question.options[question.answer],
    );
    return { ...question, options, answer, order: OPTIONS };
}

function pointsFor(difficulty) {
    return DIFFICULTIES[difficulty]?.points || 0;
}

function applyAnswer(total, difficulty, isCorrect) {
    const delta = pointsFor(difficulty);
    return total + (isCorrect ? delta : -delta);
}

function scoreOf(answers) {
    return answers.reduce(
        (total, item) => applyAnswer(total, item.difficulty, item.isCorrect),
        0,
    );
}

function formatPoints(value) {
    return `${value} pt${Math.abs(value) === 1 ? "" : "s"}`;
}

function languageName(id) {
    return LANGUAGES.find((language) => language.id === id)?.name;
}

function saveRound({ correct, wrong, points, total, language, difficulty }) {
    const round = {
        date: new Date().toISOString(),
        correct,
        wrong,
        points,
        total,
        language,
        difficulty,
    };
    roundHistory = [round, ...roundHistory].slice(0, 20);
    totalScore += points;
    saveToStorage(HISTORY_KEY, roundHistory);
    saveToStorage(SCORE_KEY, totalScore);
}

async function loadAllQuestions() {
    if (!datasetPromise) {
        datasetPromise = Promise.allSettled(
            LANGUAGES.map(async (language) => {
                const response = await fetch(new URL(`public/data/${language.id}.json`, BASE));
                if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
                return { language: language.id, questions: await response.json() };
            }),
        ).then((results) =>
            results
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value),
        );
    }
    return datasetPromise;
}

function filterQuestions(dataset, filters) {
    return dataset.questions.filter((question) => {
        if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
        if (filters.type && question.type !== filters.type) return false;
        if (filters.language && dataset.language !== filters.language) return false;
        return true;
    });
}

function stopTimer() {
    if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
    }
}

function closeMenu() {
    elements.navLinks.classList.remove("is-open");
    elements.navToggle.setAttribute("aria-expanded", "false");
    elements.navToggle.setAttribute("aria-label", "Abrir menú");
}

function updateNav(view) {
    document.querySelectorAll("[data-route]").forEach((link) => {
        const isActive = link.dataset.route === view;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
}

function setupLinks() {
    document.querySelectorAll("[data-route]").forEach((link) => {
        const route = link.dataset.route;
        link.href = route === "home" ? BASE_PATH : new URL(route, BASE).pathname;
        link.addEventListener("click", (event) => {
            event.preventDefault();
            closeMenu();
            navigate(route === "home" ? "" : route);
        });
    });
    elements.navToggle.addEventListener("click", () => {
        const isOpen = elements.navLinks.classList.toggle("is-open");
        elements.navToggle.setAttribute("aria-expanded", String(isOpen));
        elements.navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });
    elements.menuInfo.addEventListener("click", openInfo);
    elements.navInfo.addEventListener("click", openInfo);
}

function openInfo() {
    closeMenu();
    openModal({
        title: "Tus datos se guardan en este navegador",
        content: `<p>Tu progreso se almacena con <strong>localStorage</strong> en este navegador: el score acumulado y el historial de las últimas 20 partidas.</p>
            <p>Los datos viven solo en tu dispositivo: no se envían a ningún servidor. Puedes borrarlos cuando quieras desde la configuración de tu navegador (opción «limpiar datos» o «borrar el almacenamiento local»).</p>`,
        actions: [{ text: "Entendido", onClick: closeModal }],
    });
}

function openModal({ title, content, actions = [] }) {
    closeModal();
    const previous = document.activeElement;
    elements.modal.classList.remove("is-hidden");
    elements.modal.innerHTML = `<div class="modal__overlay" data-modal-overlay>
        <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
            <h2 id="modal-title" class="modal__title">${escapeHtml(title)}</h2>
            <div class="modal__text">${content}</div>
            <div class="modal__actions"></div>
        </div>
    </div>`;

    const overlay = elements.modal.querySelector("[data-modal-overlay]");
    const dialog = elements.modal.querySelector(".modal__dialog");
    const actionsContainer = elements.modal.querySelector(".modal__actions");
    const close = () => closeModal();

    if (actions.length === 0) actions = [{ text: "Entendido", onClick: close }];
    actions.forEach((action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = action.className || "btn";
        button.textContent = action.text;
        button.addEventListener("click", action.onClick);
        actionsContainer.appendChild(button);
    });

    overlay.addEventListener("click", close);
    dialog.addEventListener("click", (event) => event.stopPropagation());
    document.body.style.overflow = "hidden";
    elements.modal.querySelectorAll(".nav__info, .nav__menu-info").forEach((button) => {
        button.setAttribute("aria-expanded", "true");
    });

    const onKeyDown = (event) => {
        if (event.key === "Escape") {
            close();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = dialog.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    document.addEventListener("keydown", onKeyDown);
    modalState = { previous, onKeyDown };
    dialog.focus();
}

function closeModal() {
    if (!modalState) {
        elements.modal.classList.add("is-hidden");
        elements.modal.innerHTML = "";
        return;
    }
    document.removeEventListener("keydown", modalState.onKeyDown);
    document.body.style.overflow = "";
    elements.modal.classList.add("is-hidden");
    elements.modal.innerHTML = "";
    elements.menuInfo.setAttribute("aria-expanded", "false");
    elements.navInfo.setAttribute("aria-expanded", "false");
    const previous = modalState.previous;
    modalState = null;
    if (previous && typeof previous.focus === "function") previous.focus();
}

function navigate(route) {
    const destination = route ? new URL(route, BASE) : BASE;
    window.history.pushState(null, "", destination.pathname);
    renderRoute();
}

function currentRoute() {
    const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
    let route = decodeURIComponent(window.location.pathname);
    if (route === base.replace(/\/$/, "")) route = "";
    else if (route.startsWith(base)) route = route.slice(base.length);
    route = route.replace(/^\/+|\/+$/g, "");

    // GitHub Pages sirve el 404.html raiz en subrutas de la SPA y redirige aqui
    // con la subruta en la query (?/quiz). Se resuelve antes de mirar el path
    // para que la app cargue sus scripts desde la base del proyecto.
    const query = window.location.search.match(/^\?\/([^&]+)/);
    if (query) {
        const subroute = decodeURIComponent(query[1]).replace(/\/+$/, "");
        if (subroute === "quiz" || subroute === "results") {
            window.history.replaceState(null, "", `${base}${subroute}`);
            return { view: subroute };
        }
        const captureQuery = subroute.match(/^capture\/([^/]+)\/([^/]+)\/([^/]+)$/);
        if (captureQuery) {
            window.history.replaceState(null, "", `${base}${subroute}`);
            return {
                view: "capture",
                language: decodeURIComponent(captureQuery[1]),
                id: decodeURIComponent(captureQuery[2]),
                ratio: decodeURIComponent(captureQuery[3]),
            };
        }
        return { view: "404" };
    }

    if (route === "" || route === "index.html") return { view: "home" };
    if (route === "quiz") return { view: "quiz" };
    if (route === "results") return { view: "results" };

    const capture = route.match(/^capture\/([^/]+)\/([^/]+)\/([^/]+)$/);
    if (capture) {
        return {
            view: "capture",
            language: decodeURIComponent(capture[1]),
            id: decodeURIComponent(capture[2]),
            ratio: decodeURIComponent(capture[3]),
        };
    }

    return { view: "404" };
}

function renderRoute() {
    startToken += 1;
    stopTimer();
    closeMenu();
    const route = currentRoute();

    if (route.view === "capture") {
        showCapture(route);
        return;
    }

    elements.app.classList.remove("is-hidden");
    elements.capture.classList.add("is-hidden");
    updateNav(route.view === "home" ? "home" : route.view === "results" ? "results" : "");

    if (route.view === "home") showHome();
    else if (route.view === "quiz") showQuiz();
    else if (route.view === "results") showResults();
    else showNotFound();
}

function showHome() {
    document.title = "Codelang Quiz";
    resultsFilters = {};
    homeError = "";
    homeFilters = { language: "", difficulty: "", type: "" };
    renderHome();
}

function renderHome() {
    const languageChips = LANGUAGES.map((language) => {
        const isActive = homeFilters.language === language.id;
        return `<button type="button" class="chip chip--${language.color}${isActive ? " is-active" : ""}" data-filter="language" data-value="${language.id}">${language.name}</button>`;
    }).join("");
    const difficultyChips = Object.entries(DIFFICULTIES)
        .map(([key, item]) => {
            const isActive = homeFilters.difficulty === key;
            return `<button type="button" class="chip${isActive ? " is-active" : ""}" data-filter="difficulty" data-value="${key}">${item.label} · ${item.points} pt</button>`;
        })
        .join("");
    const typeChips = Object.entries(QUESTION_TYPES)
        .map(([key, label]) => {
            const isActive = homeFilters.type === key;
            return `<button type="button" class="chip${isActive ? " is-active" : ""}" data-filter="type" data-value="${key}">${label}</button>`;
        })
        .join("");

    elements.main.innerHTML = `<div class="home">
        <section class="section home__hero">
            <p class="eyebrow mono-label">Practica con código real</p>
            <h1 class="hero-title">Pon a prueba lo que <em>sabes</em> de código.</h1>
            <p class="home__lead">Elige tu lenguaje y nivel. Resuelve problemáticas de código con opciones de respuesta y gana puntos según la dificultad.</p>
        </section>
        <section class="section home__config" aria-label="Configuración de la partida">
            <fieldset class="filter"><legend class="mono-label">Lenguaje</legend>
                <div class="filter__chips">
                    <button type="button" class="chip${!homeFilters.language ? " is-active" : ""}" data-filter="language" data-value="">Todos</button>
                    ${languageChips}
                </div>
            </fieldset>
            <fieldset class="filter"><legend class="mono-label">Dificultad</legend>
                <div class="filter__chips">
                    <button type="button" class="chip${!homeFilters.difficulty ? " is-active" : ""}" data-filter="difficulty" data-value="">Cualquiera</button>
                    ${difficultyChips}
                </div>
            </fieldset>
            <fieldset class="filter"><legend class="mono-label">Tipo de problema</legend>
                <div class="filter__chips">
                    <button type="button" class="chip${!homeFilters.type ? " is-active" : ""}" data-filter="type" data-value="">Cualquiera</button>
                    ${typeChips}
                </div>
            </fieldset>
            ${homeError ? `<p class="home__error" role="alert">${escapeHtml(homeError)}</p>` : ""}
            <button type="button" class="btn btn--lg" id="start" ${isLoading ? "disabled" : ""}>${isLoading ? "Preparando..." : "Empezar partida"}</button>
        </section>
    </div>`;

    elements.main.querySelectorAll("[data-filter]").forEach((button) => {
        button.addEventListener("click", () => {
            homeFilters[button.dataset.filter] = button.dataset.value;
            homeError = "";
            renderHome();
        });
    });
    document.getElementById("start").addEventListener("click", startGame);
}

async function startGame() {
    if (isLoading) return;
    isLoading = true;
    homeError = "";
    const token = ++startToken;
    renderHome();

    try {
        const dataset = await loadAllQuestions();
        if (token !== startToken || currentRoute().view !== "home") return;
        if (dataset.length === 0) throw new Error("sin datos");
        const available = dataset.flatMap((entry) =>
            filterQuestions(entry, homeFilters).map((question) => ({
                ...question,
                language: entry.language,
            })),
        );
        if (available.length === 0) {
            isLoading = false;
            homeError = "No hay preguntas que coincidan con esos filtros. Prueba con otros.";
            renderHome();
            return;
        }
        isLoading = false;
        resultsFilters = { ...homeFilters };
        quiz = {
            questions: available.map(prepareQuestion),
            filters: { ...homeFilters },
            index: 0,
            answers: [],
            selected: null,
            locked: false,
            timeLeft: QUESTION_TIME,
            timeExpired: false,
        };
        navigate("quiz");
    } catch {
        if (token !== startToken) return;
        isLoading = false;
        homeError = "No se pudo cargar el catálogo de preguntas.";
        renderHome();
    }
}

function renderQuiz() {
    const previous = quiz;
    if (!previous || !previous.questions.length) {
        elements.main.innerHTML = `<div class="home"><section class="section">
            <p class="home__error">Aún no has configurado una partida.</p>
            <button type="button" class="btn" id="back-home">Volver al inicio</button>
        </section></div>`;
        document.getElementById("back-home").addEventListener("click", () => navigate(""));
        return;
    }

    const question = previous.questions[previous.index];
    if (!question) {
        elements.main.innerHTML = '<div class="section mono-label">Partida terminada.</div>';
        return;
    }

    const roundScore = scoreOf(previous.answers);
    const currentLanguage = languageName(question.language);
    const urgentTime = previous.timeLeft <= 5;

    const options = question.order
        .map((letter) => {
            const isCorrect = letter === question.answer;
            let className = "option";
            if (previous.selected === letter) className += " is-selected";
            if (previous.locked && isCorrect) className += " is-correct";
            if (previous.locked && previous.selected === letter && !isCorrect) {
                className += " is-wrong";
            }
            return `<button type="button" data-letter="${letter}" class="${className}" ${previous.locked ? "disabled" : ""}>
                <span class="option__letter mono-label">${letter}</span>
                <span class="option__text">${escapeHtml(question.options[letter])}</span>
            </button>`;
        })
        .join("");

    let feedback = "";
    if (previous.locked) {
        if (previous.timeExpired) {
            feedback = `<p class="feedback feedback--ko"><strong>Se acabó el tiempo.</strong> La correcta era la opción ${question.answer}. ${escapeHtml(question.explanation)}</p>`;
        } else if (previous.selected === question.answer) {
            const points = pointsFor(question.difficulty);
            feedback = `<p class="feedback feedback--ok"><strong>Acertaste. +${points} punto${points === 1 ? "" : "s"}.</strong> ${escapeHtml(question.explanation)}</p>`;
        } else {
            feedback = `<p class="feedback feedback--ko"><strong>No acertaste.</strong> La correcta era la opción ${question.answer}. ${escapeHtml(question.explanation)}</p>`;
        }
        feedback += `<button type="button" class="btn btn--coral" id="continue">${previous.index >= previous.questions.length - 1 ? "Ver resultados" : "Siguiente"}</button>`;
    }

    elements.main.innerHTML = `<div class="quiz">
        <section class="section quiz__header" aria-label="Progreso">
            <div class="quiz__progress">
                <span class="mono-label">Pregunta ${previous.index + 1} de ${previous.questions.length}</span>
                <span id="time" class="quiz__time${urgentTime ? " is-urgent" : ""}" role="timer" aria-label="Tiempo restante para responder">⏱ ${previous.timeLeft}s</span>
            </div>
            <span class="quiz__score" aria-label="Score de la partida">${formatPoints(roundScore)}</span>
        </section>
        <section class="section quiz__body">
            <div class="card quiz__question">
                <span class="mono-label quiz__tag">${currentLanguage ? `${currentLanguage} · ` : ""}${QUESTION_TYPES[question.type] || question.type} · ${DIFFICULTIES[question.difficulty]?.label || question.difficulty}</span>
                <h2 class="quiz__question-text">${escapeHtml(question.question)}</h2>
                ${question.code ? `<div class="code-card">${previous.filters.language ? `<span class="code-card__lang mono-label">${escapeHtml(previous.filters.language)}</span>` : ""}<pre class="code-card__pre"><code>${escapeHtml(question.code)}</code></pre></div>` : ""}
            </div>
            <div class="quiz__options" role="group" aria-label="Opciones de respuesta">${options}</div>
            <div class="quiz__feedback">
                <button type="button" class="btn btn--mint quiz__stop" id="stop" ${previous.answers.length === 0 ? "disabled" : ""}>Detener partida</button>
            </div>
            ${feedback ? `<div class="quiz__feedback">${feedback}</div>` : ""}
        </section>
    </div>`;

    elements.main.querySelectorAll("[data-letter]").forEach((button) => {
        button.addEventListener("click", () => answer(button.dataset.letter));
    });
    document.getElementById("stop").addEventListener("click", openStopConfirmation);
    const continueButton = document.getElementById("continue");
    if (continueButton) continueButton.addEventListener("click", continueGame);

    if (!previous.locked) startTimer();
    else stopTimer();
}

function startTimer() {
    stopTimer();
    if (!quiz || quiz.locked) return;
    timer = window.setInterval(() => {
        if (!quiz || quiz.locked) return;
        quiz.timeLeft = Math.max(0, quiz.timeLeft - 1);
        const time = document.getElementById("time");
        if (time) {
            time.textContent = `⏱ ${quiz.timeLeft}s`;
            time.classList.toggle("is-urgent", quiz.timeLeft <= 5);
        }
        if (quiz.timeLeft === 0) {
            stopTimer();
            quiz.locked = true;
            quiz.timeExpired = true;
            quiz.answers.push({
                ...quiz.questions[quiz.index],
                letter: null,
                isCorrect: false,
            });
            renderQuiz();
        }
    }, 1000);
}

function answer(letter) {
    if (!quiz || quiz.locked) return;
    const question = quiz.questions[quiz.index];
    quiz.selected = letter;
    quiz.answers.push({
        ...question,
        letter,
        isCorrect: letter === question.answer,
    });
    quiz.locked = true;
    stopTimer();
    renderQuiz();
}

function continueGame() {
    if (!quiz) return;
    if (quiz.index >= quiz.questions.length - 1) {
        finishGame();
        return;
    }
    quiz.index += 1;
    quiz.selected = null;
    quiz.locked = false;
    quiz.timeExpired = false;
    quiz.timeLeft = QUESTION_TIME;
    renderQuiz();
}

function finishGame() {
    if (!quiz) return;
    const correct = quiz.answers.filter((item) => item.isCorrect).length;
    const wrong = quiz.answers.length - correct;
    saveRound({
        correct,
        wrong,
        points: scoreOf(quiz.answers),
        total: quiz.questions.length,
        language: quiz.filters.language,
        difficulty: quiz.filters.difficulty,
    });
    resultsFilters = quiz.filters;
    quiz = null;
    navigate("results");
}

function openStopConfirmation() {
    if (!quiz) return;
    const points = scoreOf(quiz.answers);
    openModal({
        title: "¿Detener la partida?",
        content: `<p>Tu puntuación actual (<strong>${formatPoints(points)}</strong>) se guardará y no podrás continuar esta partida.</p>`,
        actions: [
            { text: "Continuar jugando", className: "btn", onClick: closeModal },
            {
                text: "Detener y guardar",
                className: "btn btn--coral",
                onClick: () => {
                    closeModal();
                    stopGame();
                },
            },
        ],
    });
}

function stopGame() {
    if (!quiz) return;
    const correct = quiz.answers.filter((item) => item.isCorrect).length;
    const wrong = quiz.answers.length - correct;
    saveRound({
        correct,
        wrong,
        points: scoreOf(quiz.answers),
        total: quiz.answers.length,
        language: quiz.filters.language,
        difficulty: quiz.filters.difficulty,
    });
    resultsFilters = quiz.filters;
    quiz = null;
    navigate("results");
}

function showQuiz() {
    document.title = "Quiz · Codelang Quiz";
    renderQuiz();
}

function showResults() {
    document.title = "Resultados · Codelang Quiz";
    const last = roundHistory[0];
    const language = resultsFilters.language || "todos los lenguajes";
    const historyHtml =
        roundHistory.length > 0
            ? `<ul class="history">${roundHistory
                  .map(
                      (round) => `<li class="history__item">
                        <span class="mono-label history__date">${escapeHtml(new Date(round.date).toLocaleString())}</span>
                        <span class="history__summary">${round.correct}/${round.total} aciertos</span>
                        <span class="history__points">${round.points} pt</span>
                    </li>`,
                  )
                  .join("")}</ul>`
            : "";

    elements.main.innerHTML = `<div class="results">
        <section class="section results__hero">
            <p class="eyebrow mono-label">Resultados</p>
            <h1 class="hero-title">Tu rendimiento, de un vistazo.</h1>
        </section>
        <section class="section results__stats" aria-label="Estadísticas">
            <div class="card card__tint stat stat--pear"><span class="mono-label">Score acumulado</span><strong class="stat__num">${totalScore}</strong></div>
            <div class="card card__tint stat stat--cyan"><span class="mono-label">Partidas</span><strong class="stat__num">${roundHistory.length}</strong></div>
        </section>
        <section class="section" aria-label="Historial de partidas">
            <h2 class="section-title">Historial</h2>
            ${
                last
                    ? `<div class="card results__last"><p class="mono-label">Última partida · ${escapeHtml(language)}</p><p class="results__summary">${last.correct} aciertos · ${last.wrong} fallos · ${last.points} puntos</p></div>`
                    : '<p class="results__empty">Aún no has jugado ninguna partida.</p>'
            }
            ${historyHtml}
            <button type="button" class="btn btn--lg" id="new-game">Nueva partida</button>
        </section>
    </div>`;
    document.getElementById("new-game").addEventListener("click", () => navigate(""));
}

function showNotFound() {
    document.title = "Página no encontrada · Codelang Quiz";
    elements.main.innerHTML = `<div class="home"><section class="section">
        <p class="mono-label">404</p>
        <h1 class="hero-title">Esa ruta no existe.</h1>
        <p>La página que buscas no está en esta app.</p>
        <a href="${BASE_PATH}" class="btn btn--mint" id="back-home">Volver al inicio</a>
    </section></div>`;
    document.getElementById("back-home").addEventListener("click", (event) => {
        event.preventDefault();
        navigate("");
    });
}

function captureOptionsHtml(question, columns) {
    return `<div class="capture__options${columns === 2 ? " capture__options--cols2" : ""}" role="group" aria-label="Opciones">
        ${OPTIONS.map(
            (letter) => `<div class="option"><span class="option__letter mono-label">${letter}</span><span class="option__text">${escapeHtml(question.options[letter])}</span></div>`,
        ).join("")}
    </div>`;
}

async function showCapture({ language, id, ratio }) {
    document.title = "Captura · Codelang Quiz";
    stopTimer();
    closeMenu();
    const target = ASPECT_RATIOS[ratio] || ASPECT_RATIOS["4-5"];
    elements.app.classList.add("is-hidden");
    elements.capture.classList.remove("is-hidden");
    elements.capture.className = "capture capture--loading";
    elements.capture.style.width = `${target.width}px`;
    elements.capture.style.height = `${target.height}px`;
    elements.capture.innerHTML = "";

    try {
        const dataset = await loadAllQuestions();
        const entry = dataset.find((item) => item.language === language);
        const question = entry?.questions.find((item) => item.id === id);
        if (!question) {
            elements.capture.className = "capture capture--error";
            elements.capture.innerHTML = '<p class="mono-label">No encontrada</p>';
            return;
        }
        const languageMeta = LANGUAGES.find((item) => item.id === language);
        const chipColor = PALETTE[language] || "accent";
        const columns = ratio === "1-91" ? 2 : 1;
        elements.capture.className = "capture";
        elements.capture.dataset.fit = "busy";
        elements.capture.innerHTML = `<div class="capture__frame"><div class="capture__fill">
            <header class="capture__header">
                <span class="capture__brand mono-label">Codelang · Quiz</span>
                <span class="capture__chip mono-label" style="background:var(--color-${chipColor});color:var(--color-ink)">${escapeHtml(languageMeta?.name || language)} · ${CAPTURE_TYPE_LABELS[question.type] || question.type} · ${CAPTURE_DIFFICULTY_LABELS[question.difficulty] || question.difficulty}</span>
            </header>
            <div class="capture__columns">
                <article class="capture__question">
                    <h2 class="capture__text">${escapeHtml(question.question)}</h2>
                    ${
                        question.code
                            ? `<div class="capture__code code-card"><span class="code-card__lang mono-label">${escapeHtml(language)}</span><pre class="capture__pre code-card__pre"><code>${escapeHtml(question.code)}</code></pre></div>`
                            : ""
                    }
                </article>
                ${captureOptionsHtml(question, columns)}
            </div>
            <footer class="capture__footer mono-label" aria-hidden="true">codelang.quiz</footer>
        </div></div>`;
        await document.fonts.ready;
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                if (elements.capture.classList.contains("capture")) {
                    elements.capture.dataset.fit = "ready";
                }
            });
        });
    } catch {
        elements.capture.className = "capture capture--error";
        elements.capture.innerHTML = '<p class="mono-label">No encontrada</p>';
    }
}

window.addEventListener("popstate", renderRoute);
setupLinks();
renderRoute();
