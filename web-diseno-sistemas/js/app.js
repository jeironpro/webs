import { courseModules, allLessons, lessonsById, quizQuestions } from "./data.js";
import { DEFAULTS, simulate, curveFor } from "./simulator.js";
import { renderScene, SCENE_KINDS } from "./scenes.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE_KEY = "a-escala:course:v2";
const TOTAL_LESSONS = allLessons.length;
const CHART_MAX = 400;
const PLAY_PATH = "M4 2.5v11l9-5.5z";
const PAUSE_PATH = "M4 2.5h3v11H4zM9 2.5h3v11H9z";

const app = $("#app");
const inspector = $(".inspector");
const views = $$("[data-view-panel]");
const topViewButtons = $$(".topnav__item[data-view]");
const validViews = new Set(views.map((view) => view.dataset.viewPanel));
const menuToggle = $("#menu-toggle");
const sidebar = $("#course-sidebar");
const sidebarBackdrop = $("#sidebar-backdrop");
const courseNav = $("#course-nav");
const cheatsheetGrid = $("#cheatsheet-grid");

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

/* Progreso del curso -------------------------------------------------------- */

const validVisitedKeys = new Set(
    allLessons.flatMap((lesson) => lesson.steps.map((_, index) => `${lesson.id}:${index}`))
);

function readProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
        if (!saved || typeof saved !== "object") return { visited: [], solved: [] };

        const visited = Array.isArray(saved.visited)
            ? saved.visited.filter((key) => validVisitedKeys.has(key))
            : [];
        const solved = Array.isArray(saved.solved)
            ? saved.solved.filter(
                  (question) =>
                      Number.isInteger(question) && question >= 0 && question < quizQuestions.length
              )
            : [];

        return { visited: [...new Set(visited)], solved: [...new Set(solved)] };
    } catch {
        return { visited: [], solved: [] };
    }
}

let progress = readProgress();

function saveProgress() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
        /* El navegador puede bloquear el almacenamiento; el curso sigue funcionando. */
    }
}

function completedLessonIds() {
    const visited = new Set(progress.visited);
    return new Set(
        allLessons
            .filter((lesson) =>
                lesson.steps.every((_, index) => visited.has(`${lesson.id}:${index}`))
            )
            .map((lesson) => lesson.id)
    );
}

function updateProgress() {
    const completed = completedLessonIds();
    const count = completed.size;
    const percent = (count / TOTAL_LESSONS) * 100;

    $("#progress-value").textContent = `${count}/${TOTAL_LESSONS}`;
    $("#progress-fill").style.width = `${percent}%`;

    const bar = $("#progressbar");
    bar.setAttribute("aria-valuemax", String(TOTAL_LESSONS));
    bar.setAttribute("aria-valuenow", String(count));
    bar.setAttribute("aria-valuetext", `${count} de ${TOTAL_LESSONS} lecciones completadas`);

    courseModules.forEach((module) => {
        const moduleCount = module.lessons.filter((lesson) => completed.has(lesson.id)).length;
        const element = $(`[data-group-count="${module.id}"]`);
        if (element) element.textContent = `${moduleCount}/${module.lessons.length}`;
    });

    const solved = Math.min(progress.solved.length, quizQuestions.length);
    $("#quiz-progress-value").textContent = `${solved}/${quizQuestions.length}`;
    $("#quiz-progress-fill").style.width = `${(solved / quizQuestions.length) * 100}%`;
    const quizBar = $("#quiz-progressbar");
    quizBar.setAttribute("aria-valuemax", String(quizQuestions.length));
    quizBar.setAttribute("aria-valuenow", String(solved));
    quizBar.setAttribute(
        "aria-valuetext",
        `${solved} de ${quizQuestions.length} respuestas correctas`
    );
    $("#quiz-saved").textContent = String(solved);
    $("#quiz-saved-total").textContent = String(quizQuestions.length);
}

function markVisited(lesson, index) {
    let changed = false;
    for (let stepIndex = 0; stepIndex <= index; stepIndex += 1) {
        const key = `${lesson.id}:${stepIndex}`;
        if (!progress.visited.includes(key)) {
            progress.visited.push(key);
            changed = true;
        }
    }
    if (changed) {
        saveProgress();
        updateProgress();
    }
}

function markSolved(index) {
    if (progress.solved.includes(index)) return;
    progress.solved = [...progress.solved, index];
    saveProgress();
    updateProgress();
}

/* Navegación ---------------------------------------------------------------- */

function closeMenu() {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir el índice del curso");
    sidebarBackdrop.hidden = true;
}

function openMenu() {
    sidebar.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar el índice del curso");
    sidebarBackdrop.hidden = false;
}

function writeHash(hash) {
    try {
        window.history.replaceState(null, "", hash);
    } catch {
        /* file:// puede bloquear history; la navegación sigue funcionando. */
    }
}

function setView(name, { updateHash = true } = {}) {
    const target = validViews.has(name) ? name : "learn";
    app.dataset.view = target;

    views.forEach((view) => {
        view.hidden = view.dataset.viewPanel !== target;
    });

    topViewButtons.forEach((button) => {
        const active = button.dataset.view === target;
        button.classList.toggle("is-active", active);
        if (active) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
    });

    inspector.hidden = target !== "learn";
    if (target !== "learn") stopPlayback();
    closeMenu();

    if (updateHash) {
        writeHash(target === "learn" ? `#/${currentLesson.id}` : `#${target}`);
    }
}

/* Índice del curso ---------------------------------------------------------- */

function renderSidebar() {
    courseNav.replaceChildren();

    courseModules.forEach((module) => {
        const section = createElement("section", "course-group");
        section.dataset.module = module.id;
        section.classList.toggle("is-open", module.id === currentLesson.moduleId);

        const head = createElement("button", "course-group__head");
        head.type = "button";
        head.setAttribute("aria-expanded", String(module.id === currentLesson.moduleId));
        head.append(
            createElement(
                "span",
                `course-group__num course-group__num--${module.tone}`,
                module.num
            ),
            createElement("span", "course-group__title", module.title),
            createElement("span", "course-group__count", `0/${module.lessons.length}`),
            createElement("span", "course-group__toggle", "+")
        );
        head.querySelector(".course-group__count").dataset.groupCount = module.id;
        head.addEventListener("click", () => {
            const open = section.classList.toggle("is-open");
            head.setAttribute("aria-expanded", String(open));
        });
        section.append(head);

        const list = createElement("ul", "course-lessons");
        module.lessons.forEach((lesson) => {
            const item = document.createElement("li");
            const button = createElement("button", "course-lesson");
            button.type = "button";
            button.dataset.lesson = lesson.id;
            button.append(
                createElement("span", "course-lesson__dot"),
                document.createTextNode(lesson.title)
            );
            button.addEventListener("click", () => {
                if (currentLesson.id !== lesson.id) showLesson(lesson.id);
                else setView("learn");
                closeMenu();
            });
            item.append(button);
            list.append(item);
        });
        section.append(list);
        courseNav.append(section);
    });

    updateProgress();
    markActiveLesson();
}

function markActiveLesson() {
    $$(".course-group").forEach((group) => {
        const active = group.dataset.module === currentLesson.moduleId;
        group.querySelector(".course-group__head").classList.toggle("is-active", active);
        if (active) {
            group.classList.add("is-open");
            group.querySelector(".course-group__head").setAttribute("aria-expanded", "true");
        }
    });

    $$(".course-lesson").forEach((button) => {
        const active = button.dataset.lesson === currentLesson.id;
        button.classList.toggle("is-active", active);
        if (active) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
    });
}

/* Chuleta ------------------------------------------------------------------- */

function renderCheatsheet() {
    cheatsheetGrid.replaceChildren();

    courseModules.forEach((module) => {
        const article = createElement("article", "cheat-card");
        const top = createElement("div", "cheat-card__top");
        top.append(
            createElement("span", "cheat-card__num", module.num),
            createElement("span", "cheat-card__count", `${module.lessons.length} lecciones`)
        );
        article.append(top, createElement("h3", "", module.title));

        const list = document.createElement("ul");
        module.cheatsheet.forEach((point) => {
            list.append(createElement("li", "", point));
        });
        article.append(list);
        cheatsheetGrid.append(article);
    });
}

/* Lección ------------------------------------------------------------------ */

let currentLesson = allLessons[0];
let stepIndex = 0;
let playbackTimer = null;
let isPlaying = false;
let lessonTotal = null;
let lessonProgress = null;

const lessonPlay = $("#lesson-play");
const lessonReset = $("#lesson-reset");
const lessonNext = $("#lesson-next");
const lessonPrev = $("#lesson-prev");
const stepList = $("#step-list");
const scene = $("#scene");
const sceneStage = $("#scene-stage");

function stopPlayback() {
    if (playbackTimer !== null) {
        window.clearInterval(playbackTimer);
        playbackTimer = null;
    }
    isPlaying = false;
    lessonPlay.classList.remove("is-playing");
    lessonPlay.setAttribute("aria-label", "Reproducir la lección");
    lessonPlay.querySelector("svg path").setAttribute("d", PLAY_PATH);
}

function hostFromUrl(value) {
    return value.replace(/^[a-z]+:\/\//i, "").replace(/\/.*$/, "");
}

function renderBadges(lesson) {
    const badges = $("#lesson-badges");
    badges.replaceChildren(
        createElement("span", "badge badge--yellow", `${lesson.minutes} min`),
        createElement("span", "badge badge--green", lesson.level),
        createElement("span", "badge badge--blue", `${lesson.steps.length} pasos`)
    );
}

function renderMetrics(lesson) {
    const metrics = $("#lesson-metrics");
    metrics.replaceChildren();
    lessonTotal = null;
    lessonProgress = null;

    if (lesson.budget) {
        lesson.budget.costs.forEach(([key, label]) => {
            const card = createElement("div", "cost");
            card.dataset.cost = key;
            card.append(
                createElement("span", "cost__label", label),
                createElement("div", "cost__track"),
                createElement("output", "", "—")
            );
            card.querySelector(".cost__track").append(document.createElement("i"));
            metrics.append(card);
        });

        const totalCard = createElement("div", "total-card");
        totalCard.append(createElement("span", "cost__label", "Total"));
        const total = createElement("strong", "", "0 ms");
        total.id = "lesson-total";
        const track = createElement("div", "total-card__track");
        const fill = document.createElement("span");
        fill.id = "lesson-progress";
        track.append(fill);
        totalCard.append(total, track);
        metrics.append(totalCard);
        lessonTotal = total;
        lessonProgress = fill;
        return;
    }

    lesson.metrics.forEach(([label, value], index) => {
        const card = createElement(
            "div",
            `metric-card${index === lesson.metrics.length - 1 ? " metric-card--accent" : ""}`
        );
        card.append(
            createElement("span", "metric-card__label", label),
            createElement("span", "metric-card__value", value)
        );
        metrics.append(card);
    });
}

function updateBudget(index) {
    if (!currentLesson.budget || !lessonTotal || !lessonProgress) return;

    let total = 0;
    const budget = currentLesson.budget;

    $$(".cost", $("#lesson-metrics")).forEach((row) => {
        const cost = budget.costs.find(([key]) => key === row.dataset.cost);
        const costStep = currentLesson.steps.findIndex((step) => step.costKey === row.dataset.cost);
        const visible = costStep !== -1 && costStep <= index;
        row.classList.toggle("is-visible", visible);
        row.querySelector("i").style.width = visible
            ? `${Math.min((cost[2] / budget.max) * 100, 100)}%`
            : "0%";
        row.querySelector("output").textContent = visible ? `${cost[2]} ms` : "—";
        if (visible) total += cost[2];
    });

    lessonTotal.textContent = `${total} ms`;
    lessonProgress.style.width = `${Math.min((total / budget.max) * 100, 100)}%`;
}

function renderTimeline(lesson) {
    stepList.replaceChildren();

    lesson.steps.forEach((step, index) => {
        const item = document.createElement("li");
        const button = createElement("button", "step-list__item");
        button.type = "button";
        button.dataset.step = String(index);
        button.append(
            createElement("span", "step-list__num", String(index + 1).padStart(2, "0")),
            createElement("span", "step-list__label", step.title)
        );
        button.addEventListener("click", () => {
            stopPlayback();
            setStep(index);
        });
        item.append(button);
        stepList.append(item);
    });

    $("#lesson-step-total").textContent = String(lesson.steps.length).padStart(2, "0");
    $("#step-total").textContent = String(lesson.steps.length).padStart(2, "0");
}

function renderLearn(lesson) {
    const list = $("#learn-list");
    list.replaceChildren();
    lesson.learn.forEach((point) => {
        const item = document.createElement("li");
        item.append(createElement("span", "check"), document.createTextNode(point));
        list.append(item);
    });
}

function renderLesson(lesson) {
    currentLesson = lesson;
    stepIndex = 0;
    stopPlayback();
    document.title = `${lesson.title} · A Escala`;

    $("#lesson-crumb").replaceChildren(
        document.createTextNode(
            `${lesson.moduleNum}. ${lesson.moduleTitle} / Lección ${lesson.lessonIndex + 1} de ${lesson.lessonCount}`
        )
    );
    $("#lesson-title").textContent = lesson.title;
    $("#lesson-lede").textContent = lesson.lede;
    renderBadges(lesson);
    renderMetrics(lesson);
    renderTimeline(lesson);
    renderLearn(lesson);

    $("#scene-url-text").textContent = lesson.scene.url;
    $("#scene-browser-host").textContent = hostFromUrl(lesson.scene.url);
    $("#canvas-status-text").textContent = lesson.scene.status;
    $("#scene-label-dns").textContent = lesson.scene.labels[0];
    $("#scene-label-edge").textContent = lesson.scene.labels[1];
    $("#scene-label-api").textContent = lesson.scene.labels[2];
    $("#scene-label-db").textContent = lesson.scene.labels[3];

    scene.dataset.kind = SCENE_KINDS[lesson.id] ?? "flow";
    $("#scene-core-kicker").textContent = `${lesson.moduleNum}. ${lesson.moduleTitle}`;
    $("#scene-core-title").textContent = lesson.title;

    markActiveLesson();
    setStep(0, { remember: false });
}

function showLesson(id, { updateHash = true } = {}) {
    const lesson = lessonsById.get(id);
    if (!lesson) return;
    renderLesson(lesson);
    setView("learn", { updateHash: false });
    if (updateHash) writeHash(`#/${lesson.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function setStep(index, { remember = true } = {}) {
    const steps = currentLesson.steps;
    const nextIndex = Math.min(Math.max(index, 0), steps.length - 1);
    const step = steps[nextIndex];
    stepIndex = nextIndex;

    $$("[data-step-current]").forEach((element) => {
        element.textContent = String(nextIndex + 1).padStart(2, "0");
    });

    $("#step-title").textContent = step.title;
    $("#step-body").textContent = step.body;
    $("#step-insight").textContent = step.insight;
    $("#step-tag").textContent = step.tag;
    const tagClass =
        step.tag === "Caso"
            ? "tag--case"
            : step.tag === "Cálculo"
              ? "tag--calc"
              : step.tag === "Trade-off"
                ? "tag--tradeoff"
                : "tag--problem";
    $("#step-tag").className = `tag ${tagClass}`;
    $("#scene-core-note").textContent = `Paso ${String(nextIndex + 1).padStart(
        2,
        "0"
    )} · ${step.title}`;

    $$("#step-list [data-step]").forEach((button, buttonIndex) => {
        const active = buttonIndex === nextIndex;
        button.classList.toggle("is-active", active);
        button.classList.toggle("is-past", buttonIndex < nextIndex);
        if (active) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
    });

    scene.dataset.step = String(nextIndex);
    scene.dataset.final = String(nextIndex === steps.length - 1);
    const sceneNode = Number.isInteger(step.node) ? step.node : nextIndex % 5;
    $$(".scene-node", scene).forEach((node) => {
        node.classList.toggle("is-active", Number(node.dataset.node) === sceneNode);
    });
    if (scene.dataset.kind !== "request") {
        renderScene(sceneStage, currentLesson, step, nextIndex);
    }

    if (currentLesson.budget) updateBudget(nextIndex);

    lessonPrev.disabled = nextIndex === 0;
    lessonNext.disabled = nextIndex === steps.length - 1;

    if (remember) markVisited(currentLesson, nextIndex);
}

function startPlayback() {
    if (isPlaying) {
        stopPlayback();
        return;
    }

    if (stepIndex === currentLesson.steps.length - 1) setStep(0);
    isPlaying = true;
    lessonPlay.classList.add("is-playing");
    lessonPlay.setAttribute("aria-label", "Pausar la lección");
    lessonPlay.querySelector("svg path").setAttribute("d", PAUSE_PATH);

    playbackTimer = window.setInterval(() => {
        if (stepIndex >= currentLesson.steps.length - 1) {
            stopPlayback();
            return;
        }
        setStep(stepIndex + 1);
    }, 4500);
}

lessonPrev.addEventListener("click", () => {
    stopPlayback();
    setStep(stepIndex - 1);
});

lessonNext.addEventListener("click", () => {
    stopPlayback();
    setStep(stepIndex + 1);
});

lessonPlay.addEventListener("click", startPlayback);

lessonReset.addEventListener("click", () => {
    stopPlayback();
    setStep(0);
});

topViewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
});

menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) closeMenu();
    else openMenu();
});

sidebarBackdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
    if (app.dataset.view !== "learn") return;
    if (event.target.closest("button, input, select, textarea")) return;

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        stopPlayback();
        setStep(stepIndex + (event.key === "ArrowRight" ? 1 : -1));
        return;
    }

    if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        stopPlayback();
        setStep(0);
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();
        startPlayback();
    }
});

/* Laboratorio --------------------------------------------------------------- */

const labState = { ...DEFAULTS };
const trafficInput = $("#traffic");
const cacheInput = $("#cache");
const trafficValue = $("#traffic-value");
const cacheValue = $("#cache-value");
const latencyValue = $("#latency strong");
const statusValue = $("#status");
const capacityValue = $("#capacity-value");
const capacityFill = $("#capacity-fill");
const capacityMeter = $("#capacity-meter");
const diagnosis = $("#diagnosis");
const curveNote = $("#curve-note");
const curveSvg = $("#curve-svg");
const curveLine = $("#curve-line");
const curveArea = $("#curve-area");
const curveDot = $("#curve-dot");

function setRangeFill(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const percent = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.setProperty("--range-pct", `${percent}%`);
}

function syncRangeLabels() {
    trafficValue.textContent = `${labState.traffic}k req/min`;
    cacheValue.textContent = `${labState.cache} %`;
    setRangeFill(trafficInput);
    setRangeFill(cacheInput);
}

function syncSegmented(key) {
    $$(".segmented__option").forEach((button) => {
        if (button.dataset.control !== key) return;
        const active = Number(button.dataset.value) === labState[key];
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

function chartCoordinates(traffic, total) {
    const width = 420;
    const height = 150;
    const padding = 8;
    const x = padding + ((traffic - 2) / (120 - 2)) * (width - padding * 2);
    const y = height - padding - (Math.min(total, CHART_MAX) / CHART_MAX) * (height - padding * 2);
    return [x, y];
}

function renderCurve(result) {
    const points = curveFor(labState);
    const coordinates = points.map((point) => {
        const [x, y] = chartCoordinates(point.traffic, point.total);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    curveLine.setAttribute("points", coordinates.join(" "));
    const first = points[0];
    const last = points[points.length - 1];
    const [firstX] = chartCoordinates(first.traffic, first.total);
    const [lastX] = chartCoordinates(last.traffic, last.total);
    const bottom = 150 - 8;

    curveArea.setAttribute(
        "d",
        `M ${firstX.toFixed(1)} ${bottom} L ${coordinates.join(" L ")} L ${lastX.toFixed(1)} ${bottom} Z`
    );

    const [dotX, dotY] = chartCoordinates(result.traffic, result.total);
    curveDot.setAttribute("cx", dotX.toFixed(1));
    curveDot.setAttribute("cy", dotY.toFixed(1));
    curveNote.textContent = `ahora: ${Math.round(result.traffic)}k`;
    curveSvg.setAttribute(
        "aria-label",
        `Curva estimada de latencia: ${result.total} milisegundos con ${Math.round(result.traffic)} mil peticiones por minuto`
    );
}

function renderLab() {
    const result = simulate(labState);
    const rawTotal = Math.max(result.rawTotal, 1);

    latencyValue.textContent =
        result.rawTotal >= 999 ? "999+" : String(Math.round(result.rawTotal));
    statusValue.className = `status status--${result.status}`;
    statusValue.textContent = result.statusLabel;
    capacityValue.textContent = `${Math.round(result.utilization * 100)} %`;
    capacityFill.style.width = `${Math.min(result.utilization * 100, 100)}%`;
    capacityMeter.setAttribute(
        "aria-valuenow",
        String(Math.min(Math.round(result.utilization * 100), 100))
    );

    const segments = [
        ["#seg-network", result.network],
        ["#seg-app", result.app],
        ["#seg-db", result.database],
        ["#seg-queue", result.queue],
    ];
    segments.forEach(([selector, value]) => {
        $(selector).style.width = `${Math.max((value / rawTotal) * 100, 0)}%`;
    });

    $("#val-network").textContent = String(Math.round(result.network));
    $("#val-app").textContent = String(Math.round(result.app));
    $("#val-db").textContent = String(Math.round(result.database));
    $("#val-queue").textContent = String(Math.round(result.queue));
    diagnosis.textContent = result.diagnosis;
    renderCurve(result);
}

trafficInput.addEventListener("input", () => {
    labState.traffic = Number(trafficInput.value);
    syncRangeLabels();
    renderLab();
});

cacheInput.addEventListener("input", () => {
    labState.cache = Number(cacheInput.value);
    syncRangeLabels();
    renderLab();
});

$$(".segmented__option").forEach((button) => {
    button.addEventListener("click", () => {
        const key = button.dataset.control;
        labState[key] = Number(button.dataset.value);
        syncSegmented(key);
        renderLab();
    });
});

$("#lab-reset").addEventListener("click", () => {
    Object.assign(labState, DEFAULTS);
    trafficInput.value = String(DEFAULTS.traffic);
    cacheInput.value = String(DEFAULTS.cache);
    syncRangeLabels();
    syncSegmented("regions");
    syncSegmented("db");
    renderLab();
});

/* Checkpoint ---------------------------------------------------------------- */

const quizState = {
    index: 0,
    correct: 0,
    answered: false,
};
const quizContent = $("#quiz-content");
const quizOptions = $("#quiz-options");
const quizFeedback = $("#quiz-feedback");
const quizNext = $("#quiz-next");
const quizSummary = $("#quiz-summary");
const quizScore = $("#quiz-score");
const quizFinal = $("#quiz-final");
const quizVerdict = $("#quiz-verdict");
const quizHint = $("#quiz-hint");

function updateQuizScore() {
    quizScore.textContent = String(quizState.correct);
}

function renderQuestion() {
    const question = quizQuestions[quizState.index];
    quizState.answered = false;
    quizContent.hidden = false;
    quizSummary.hidden = true;
    quizFeedback.hidden = true;
    quizFeedback.classList.remove("is-wrong");
    quizNext.hidden = true;
    quizHint.textContent = "Una respuesta. Sin trampa.";
    $("#quiz-total").textContent = String(quizQuestions.length);
    $("#quiz-counter").textContent =
        `Pregunta ${String(quizState.index + 1).padStart(2, "0")} / ${String(
            quizQuestions.length
        ).padStart(2, "0")}`;
    $("#quiz-question").textContent = question.question;

    quizOptions.replaceChildren();
    question.options.forEach((option, index) => {
        const button = createElement("button", "quiz-option");
        button.type = "button";
        button.dataset.index = String(index);
        button.append(
            createElement("span", "quiz-option__letter", String.fromCharCode(65 + index)),
            createElement("span", "", option)
        );
        quizOptions.append(button);
    });

    updateQuizScore();
}

function answerQuestion(index) {
    if (quizState.answered) return;
    quizState.answered = true;
    const question = quizQuestions[quizState.index];
    const isCorrect = index === question.correct;

    if (isCorrect) {
        quizState.correct += 1;
        markSolved(quizState.index);
    }

    $$(".quiz-option", quizOptions).forEach((button, optionIndex) => {
        button.disabled = true;
        if (optionIndex === question.correct) button.classList.add("is-correct");
        if (optionIndex === index && !isCorrect) button.classList.add("is-wrong");
    });

    quizFeedback.hidden = false;
    quizFeedback.classList.toggle("is-wrong", !isCorrect);
    $("#feedback-title").textContent = isCorrect ? "Correcto." : "Casi.";
    $("#feedback-text").textContent = question.explanation;
    quizNext.hidden = false;
    quizNext.textContent =
        quizState.index === quizQuestions.length - 1 ? "Ver resultado" : "Siguiente";
    quizHint.textContent = "La explicación vale más que el marcador.";
    updateQuizScore();
}

function showSummary() {
    quizContent.hidden = true;
    quizSummary.hidden = false;
    quizNext.hidden = true;
    quizFinal.textContent = String(quizState.correct);
    $("#quiz-counter").textContent = "Checkpoint completado";
    quizHint.textContent = "Puedes repetirlo; las respuestas correctas no se pierden.";

    if (quizState.correct === quizQuestions.length) {
        quizVerdict.textContent =
            "Has mirado las señales correctas. Ahora lleva la misma pregunta a tu próximo diagrama.";
    } else if (quizState.correct >= quizQuestions.length - 2) {
        quizVerdict.textContent =
            "Buen ojo. Te falta afinar una decisión; vuelve a la señal que no miraste.";
    } else {
        quizVerdict.textContent =
            "Vuelve al laboratorio y a la chuleta. La respuesta suele estar en la cola, no en la herramienta.";
    }
}

function resetQuiz() {
    quizState.index = 0;
    quizState.correct = 0;
    quizState.answered = false;
    renderQuestion();
}

quizOptions.addEventListener("click", (event) => {
    const option = event.target.closest(".quiz-option");
    if (!option || quizState.answered) return;
    answerQuestion(Number(option.dataset.index));
});

quizNext.addEventListener("click", () => {
    if (quizState.index === quizQuestions.length - 1) {
        showSummary();
        return;
    }
    quizState.index += 1;
    renderQuestion();
});

$("#quiz-again").addEventListener("click", resetQuiz);
$("#quiz-reset").addEventListener("click", resetQuiz);

$("#reset-progress")?.addEventListener("click", () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* Sin almacenamiento no hay nada que borrar. */
    }
    window.location.reload();
});

/* Inicio -------------------------------------------------------------------- */

trafficInput.value = String(labState.traffic);
cacheInput.value = String(labState.cache);
syncRangeLabels();
syncSegmented("regions");
syncSegmented("db");
renderLab();
renderCheatsheet();

const initialHash = window.location.hash;
const initialLessonId = initialHash.startsWith("#/") ? initialHash.slice(2) : allLessons[0].id;

renderLesson(lessonsById.get(initialLessonId) ?? allLessons[0]);
renderSidebar();

const initialView = initialHash.replace("#", "").replace(/^\/.*$/, "");
if (validViews.has(initialView) && initialView !== "learn") {
    setView(initialView, { updateHash: false });
} else {
    setView("learn", { updateHash: false });
}

renderQuestion();
