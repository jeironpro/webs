"use strict";

const EXERCISES = window.EXERCISES || [];
const PAGE_SIZE = 10;

const resultsEl = document.getElementById("results");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const statsEl = document.getElementById("stats");
const searchEl = document.getElementById("search");
const clearEl = document.getElementById("clear");
const langChipsEl = document.getElementById("lang-chips");
const catChipsEl = document.getElementById("cat-chips");
const paginationEls = [
    document.getElementById("pagination-top"),
    document.getElementById("pagination-bottom"),
].filter(Boolean);

const cmdkEl = document.getElementById("cmdk");
const cmdkInput = document.getElementById("cmdk-input");
const cmdkResults = document.getElementById("cmdk-results");
const searchpillEl = document.getElementById("searchpill");

const modalEl = document.getElementById("modal");
const modalBadge = document.getElementById("modal-badge");
const modalTitle = document.getElementById("modal-title");
const modalMeta = document.getElementById("modal-meta");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

const state = { q: "", lang: "all", cat: "all", page: 1 };

const prefersReduced = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
    }
}

const KEYWORDS = {
    java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null String Integer Boolean Character Long Double Float Math List ArrayList Map HashMap Set",
    python: "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield print len range abs str int float bool list dict set tuple sorted sum min max",
};

function tokenRules(lang) {
    const kw = new RegExp("\\b(" + KEYWORDS[lang].split(" ").join("|") + ")\\b");
    const comment = lang === "java" ? /\/\/[^\n]*|\/\*[\s\S]*?\*\// : /#[^\n]*|"""[\s\S]*?"""/;
    return [
        { cls: "c", re: comment },
        { cls: "s", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
        { cls: "k", re: kw },
        { cls: "n", re: /\b\d+(?:\.\d+)?\b/ },
        { cls: "f", re: /\b[A-Za-z_]\w*(?=\s*\()/ },
    ];
}

function createNode(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === "class") element.className = value;
        else if (key === "text") element.textContent = value;
        else if (key === "disabled" || key === "hidden") element[key] = value;
        else element.setAttribute(key, value === true ? "" : String(value));
    }
    for (const child of [].concat(children)) {
        if (child === undefined || child === null || child === false) continue;
        element.append(child);
    }
    return element;
}

function highlight(code, lang) {
    const rules = tokenRules(lang);
    const combined = new RegExp(rules.map((r) => "(" + r.re.source + ")").join("|"), "g");
    const parts = [];
    let pos = 0;
    let m;
    while ((m = combined.exec(code)) !== null) {
        if (m.index > pos) parts.push(document.createTextNode(code.slice(pos, m.index)));
        let cls = "k";
        for (let i = 0; i < rules.length; i++) {
            if (m[i + 1] !== undefined) {
                cls = rules[i].cls;
                break;
            }
        }
        parts.push(createNode("span", { class: "tok " + cls, text: m[0] }));
        pos = m.index + m[0].length;
    }
    if (pos < code.length) parts.push(document.createTextNode(code.slice(pos)));
    return parts;
}

function renderStats() {
    const languageCounts = { java: 0, python: 0 };
    EXERCISES.forEach((ex) => {
        languageCounts[ex.lang]++;
    });
    const categories = new Set(EXERCISES.map((ex) => ex.category)).size;
    const files = new Set(EXERCISES.map((ex) => ex.file)).size;
    const items = [
        [EXERCISES.length, "ejercicios resueltos"],
        [languageCounts.java, "en java"],
        [languageCounts.python, "en python"],
        [categories, "categorías"],
        [files, "archivos fuente"],
    ];
    statsEl.replaceChildren(
        ...items.map(([n, label]) =>
            createNode("div", { class: "stat" }, [
                createNode("b", { class: "tnum", text: String(n) }),
                createNode("span", { text: label }),
            ])
        )
    );
}

function previewLine(code) {
    const lines = code
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const signature = /^(public |private |protected |static |def |class )/;
    for (const line of lines) {
        if (/^[{}[\]]+$/.test(line)) continue;
        if (signature.test(line)) continue;
        return line;
    }
    return lines[0] || "";
}

function statementNodes(ex) {
    if (!ex.statement) return [createNode("p", { text: "Sin enunciado disponible." })];
    return ex.statement.split(/\n{2,}/).map((paragraph) => {
        const p = createNode("p", {});
        paragraph.split("\n").forEach((line, i) => {
            if (i) p.append(createNode("br"));
            p.append(document.createTextNode(line));
        });
        return p;
    });
}

function solutionNodes(ex, idx) {
    const nodes = [createNode("div", { class: "solution__stmt" }, statementNodes(ex))];

    if (ex.examples.length) {
        nodes.push(
            createNode("div", { class: "solution__examples" }, [
                createNode("h4", { text: "Ejemplos" }),
                createNode(
                    "ul",
                    {},
                    ex.examples.map((example) => {
                        const code = createNode("code", {});
                        const arrowIndex = example.indexOf("→");
                        if (arrowIndex === -1) {
                            code.append(document.createTextNode(example));
                        } else {
                            code.append(document.createTextNode(example.slice(0, arrowIndex)));
                            code.append(createNode("span", { class: "arrow", text: "→" }));
                            code.append(document.createTextNode(example.slice(arrowIndex + 1)));
                        }
                        return createNode("li", {}, [code]);
                    })
                ),
            ])
        );
    }

    nodes.push(
        createNode("div", { class: "solution__code" }, [
            createNode("div", { class: "solution__bar" }, [
                createNode("span", { class: "solution__label", text: "solución" }),
                createNode("button", {
                    class: "copy",
                    type: "button",
                    "data-idx": idx,
                    text: "copiar",
                }),
            ]),
            createNode("pre", {}, [createNode("code", {}, highlight(ex.code, ex.lang))]),
        ])
    );
    return nodes;
}

function cardNode(ex, idx) {
    return createNode("article", { class: "card reveal", id: "ex-" + idx }, [
        createNode("header", { class: "card__head" }, [
            createNode("span", { class: "card__badge", text: "[" + ex.lang + "]" }),
            createNode("span", {
                class: "card__meta",
                text: ex.category.toLowerCase() + " · " + ex.level.toLowerCase(),
            }),
        ]),
        createNode("h3", { class: "card__name", text: ex.name + "()" }),
        createNode("p", { class: "card__file", text: ex.file }),
        createNode("p", { class: "card__preview", text: previewLine(ex.code) }),
        createNode("button", {
            class: "card__view",
            type: "button",
            "data-idx": idx,
            text: "Ver solución →",
        }),
    ]);
}

function renderPagination(total) {
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    paginationEls.forEach((el) => {
        el.replaceChildren(
            createNode("button", {
                class: "page-btn",
                type: "button",
                "data-page": "prev",
                text: "‹ anterior",
                disabled: state.page <= 1,
            }),
            createNode("span", {
                class: "page-info",
                text: "página " + state.page + " de " + totalPages,
            }),
            createNode("button", {
                class: "page-btn",
                type: "button",
                "data-page": "next",
                text: "siguiente ›",
                disabled: state.page >= totalPages,
            })
        );
        el.hidden = totalPages < 2;
    });
}

function render() {
    const q = state.q.trim().toLowerCase();
    const filtered = EXERCISES.filter(
        (ex) =>
            (state.lang === "all" || ex.lang === state.lang) &&
            (state.cat === "all" || ex.category === state.cat) &&
            (!q ||
                ex.name.toLowerCase().includes(q) ||
                ex.statement.toLowerCase().includes(q) ||
                ex.code.toLowerCase().includes(q))
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    resultsEl.replaceChildren(...pageItems.map((ex) => cardNode(ex, EXERCISES.indexOf(ex))));
    emptyEl.hidden = filtered.length > 0;
    countEl.textContent =
        filtered.length === EXERCISES.length
            ? EXERCISES.length + " ejercicios"
            : filtered.length + " de " + EXERCISES.length + " ejercicios";
    renderPagination(filtered.length);
    observeReveals();
}

function createChip(label, value, active) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (active ? " active" : "");
    btn.textContent = label;
    btn.dataset.value = value;
    return btn;
}

function renderChips() {
    langChipsEl.replaceChildren();
    for (const [value, label] of [
        ["all", "todos"],
        ["java", "java"],
        ["python", "python"],
    ]) {
        langChipsEl.appendChild(createChip(label, value, state.lang === value));
    }

    const order = ["Calentamiento", "Cadenas", "Lógica", "Matrices", "Listas"];
    const cats = order.filter((c) => EXERCISES.some((ex) => ex.category === c));
    const extras = [...new Set(EXERCISES.map((ex) => ex.category))]
        .filter((c) => !order.includes(c))
        .sort();
    catChipsEl.replaceChildren();
    catChipsEl.appendChild(createChip("todas", "all", state.cat === "all"));
    for (const c of cats.concat(extras)) {
        catChipsEl.appendChild(createChip(c.toLowerCase(), c, state.cat === c));
    }
}

langChipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.lang = chip.dataset.value;
    state.page = 1;
    renderChips();
    render();
});

catChipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.cat = chip.dataset.value;
    state.page = 1;
    renderChips();
    render();
});

let debounce;
searchEl.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        state.q = searchEl.value;
        state.page = 1;
        render();
    }, 250);
});

clearEl.addEventListener("click", () => {
    state.q = "";
    state.lang = "all";
    state.cat = "all";
    state.page = 1;
    searchEl.value = "";
    renderChips();
    render();
});

function onPageClick(e) {
    const btn = e.target.closest(".page-btn");
    if (!btn || btn.disabled) return;
    state.page += btn.dataset.page === "next" ? 1 : -1;
    render();
    resultsEl.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
}

paginationEls.forEach((el) => el.addEventListener("click", onPageClick));

async function onCopyClick(copyBtn) {
    const idx = Number(copyBtn.dataset.idx);
    await copyText(EXERCISES[idx].code);
    copyBtn.classList.add("is-copied");
    const original = copyBtn.textContent;
    copyBtn.textContent = "copiado ✓";
    setTimeout(() => {
        copyBtn.classList.remove("is-copied");
        copyBtn.textContent = original;
    }, 1200);
}

resultsEl.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".card__view");
    if (!viewBtn) return;
    openSolution(Number(viewBtn.dataset.idx));
});

modalBody.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".copy");
    if (copyBtn) onCopyClick(copyBtn);
});

let modalOpen = false;
let modalTrigger = null;

function openSolution(idx) {
    const ex = EXERCISES[idx];
    if (!ex) return;
    modalTrigger = document.activeElement;
    modalBadge.textContent = "[" + ex.lang + "]";
    modalTitle.textContent = ex.name + "()";
    modalMeta.textContent =
        ex.file + " · " + ex.category.toLowerCase() + " · " + ex.level.toLowerCase();
    modalBody.replaceChildren(...solutionNodes(ex, idx));
    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalOpen = true;
    setTimeout(() => modalClose.focus(), 0);
}

function closeSolution() {
    modalOpen = false;
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (modalTrigger && modalTrigger.focus) modalTrigger.focus();
}

modalClose.addEventListener("click", closeSolution);
modalEl.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeSolution();
});

function trapFocus(e) {
    const focusables = modalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

document.querySelectorAll(".nav__link[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
        state.lang = btn.dataset.lang;
        state.q = "";
        state.page = 1;
        searchEl.value = "";
        renderChips();
        render();
        document
            .getElementById("grid")
            .scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
    });
});

let cmdkOpen = false;
let cmdkItems = [];
let cmdkActive = -1;
let lastFocused = null;

function openCmdk() {
    lastFocused = document.activeElement;
    cmdkOpen = true;
    cmdkEl.classList.add("is-open");
    cmdkEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    cmdkInput.value = "";
    renderCmdk("");
    setTimeout(() => cmdkInput.focus(), 0);
}

function closeCmdk() {
    cmdkOpen = false;
    cmdkEl.classList.remove("is-open");
    cmdkEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
}

function renderCmdk(query) {
    const q = query.trim().toLowerCase();
    const matches = EXERCISES.map((ex, i) => ({ ex, i }))
        .filter(({ ex }) => !q || ex.name.toLowerCase().includes(q))
        .slice(0, 8);
    cmdkItems = matches;
    cmdkActive = matches.length ? 0 : -1;
    cmdkResults.replaceChildren(
        ...(matches.length
            ? matches.map(({ ex, i }, k) =>
                  createNode(
                      "button",
                      {
                          class: "cmdk__item" + (k === cmdkActive ? " is-active" : ""),
                          type: "button",
                          "data-idx": i,
                      },
                      [
                          createNode("span", { class: "cmdk__name", text: ex.name + "()" }),
                          createNode("span", { class: "cmdk__lang", text: "[" + ex.lang + "]" }),
                      ]
                  )
              )
            : [createNode("p", { class: "cmdk__none", text: "Sin coincidencias." })])
    );
}

function moveCmdk(delta) {
    if (!cmdkItems.length) return;
    cmdkActive = (cmdkActive + delta + cmdkItems.length) % cmdkItems.length;
    const items = cmdkResults.querySelectorAll(".cmdk__item");
    items.forEach((el, k) => el.classList.toggle("is-active", k === cmdkActive));
}

function openExercise(idx) {
    const target = EXERCISES[idx];
    if (!target) return;
    state.q = "";
    state.lang = "all";
    state.cat = "all";
    state.page = Math.floor(idx / PAGE_SIZE) + 1;
    searchEl.value = "";
    renderChips();
    render();
    const card = document.getElementById("ex-" + idx);
    if (card)
        card.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
    openSolution(idx);
}

searchpillEl.addEventListener("click", () => (cmdkOpen ? closeCmdk() : openCmdk()));

cmdkEl.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) {
        closeCmdk();
        return;
    }
    const item = e.target.closest(".cmdk__item");
    if (item) {
        closeCmdk();
        openExercise(Number(item.dataset.idx));
    }
});

cmdkInput.addEventListener("input", () => renderCmdk(cmdkInput.value));

document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        cmdkOpen ? closeCmdk() : openCmdk();
        return;
    }
    if (modalOpen) {
        if (e.key === "Escape") {
            e.preventDefault();
            closeSolution();
            return;
        }
        if (e.key === "Tab") {
            trapFocus(e);
            return;
        }
        return;
    }
    if (!cmdkOpen) return;
    if (e.key === "Escape") {
        closeCmdk();
        return;
    }
    if (e.key === "ArrowDown") {
        e.preventDefault();
        moveCmdk(1);
        return;
    }
    if (e.key === "ArrowUp") {
        e.preventDefault();
        moveCmdk(-1);
        return;
    }
    if (e.key === "Enter" && cmdkActive >= 0) {
        e.preventDefault();
        closeCmdk();
        openExercise(cmdkItems[cmdkActive].i);
    }
});

const HERO_CODE = [
    "public int diferencia21(int n) {",
    "    if (n < 21) {",
    "        return 21 - n;",
    "    } else {",
    "        return (n - 21)*2;",
    "    }",
    "}",
].join("\n");

function initHero() {
    const out = document.getElementById("hero-code-out");
    if (!out) return;
    if (prefersReduced()) {
        out.replaceChildren(...highlight(HERO_CODE, "java"));
        return;
    }
    const firstLine = HERO_CODE.split("\n")[0];
    const typed = document.createElement("span");
    const caret = document.createElement("span");
    caret.textContent = "▌";
    caret.setAttribute("aria-hidden", "true");
    typed.appendChild(caret);
    out.appendChild(typed);
    let i = 0;
    const step = () => {
        if (i < firstLine.length) {
            caret.before(document.createTextNode(firstLine[i]));
            i++;
            setTimeout(step, 26);
        } else {
            caret.remove();
            out.replaceChildren(...highlight(HERO_CODE, "java"));
        }
    };
    step();
}

let revealObserver = null;
if ("IntersectionObserver" in window && !prefersReduced()) {
    revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
}

function observeReveals() {
    const items = document.querySelectorAll(".reveal");
    if (revealObserver) {
        items.forEach((el) => revealObserver.observe(el));
    } else {
        items.forEach((el) => el.classList.add("is-in"));
    }
}

renderStats();
renderChips();
render();
initHero();
observeReveals();
