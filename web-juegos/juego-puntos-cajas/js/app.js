const GRID_SIZE = 6;
const BOXES_PER_SIDE = GRID_SIZE - 1;
const TOTAL_EDGES = BOXES_PER_SIDE * GRID_SIZE * 2;
const PLAYER_1 = 1;
const PLAYER_2 = 2;
const EDGE_HORIZONTAL = "H";
const EDGE_VERTICAL = "V";
const DIFFICULTY_LABELS = { easy: "Fácil", medium: "Medio", hard: "Difícil" };
const DIFFICULTY_DEPTHS = { easy: 1, medium: 3, hard: 5 };
const DEFAULT_DIFFICULTY = "medium";
const BOT_MOVE_DELAY_MS = 450;
const WIN_SCORE = 1_000_000;
const BOX_VALUE = 100;
const GREEDY_RATIO = 0.7;
const MAX_MOVES_PER_NODE = 12;

const app = document.querySelector("#app");
let screen = "home";
let mode = "bot";
let difficulty = DEFAULT_DIFFICULTY;
let game = createInitialGame();
let botTimer = null;

const edgeKey = (type, row, col) => `${type}-${row}-${col}`;
const boxKey = (row, col) => `${row}-${col}`;
const switchPlayer = (player) => (player === PLAYER_1 ? PLAYER_2 : PLAYER_1);

function createInitialGame() {
    return {
        edges: new Map(),
        boxes: new Map(),
        turn: PLAYER_1,
        scores: { [PLAYER_1]: 0, [PLAYER_2]: 0 },
    };
}

function getBoxesAroundEdge(type, row, col) {
    const boxes = [];
    if (type === EDGE_HORIZONTAL) {
        if (row > 0) boxes.push({ row: row - 1, col });
        if (row < BOXES_PER_SIDE) boxes.push({ row, col });
    } else {
        if (col > 0) boxes.push({ row, col: col - 1 });
        if (col < BOXES_PER_SIDE) boxes.push({ row, col });
    }
    return boxes;
}

function isBoxComplete(edges, row, col) {
    return (
        edges.has(edgeKey(EDGE_HORIZONTAL, row, col)) &&
        edges.has(edgeKey(EDGE_HORIZONTAL, row + 1, col)) &&
        edges.has(edgeKey(EDGE_VERTICAL, row, col)) &&
        edges.has(edgeKey(EDGE_VERTICAL, row, col + 1))
    );
}

function getAllEdges() {
    const edges = [];
    for (let row = 0; row < GRID_SIZE; row += 1)
        for (let col = 0; col < BOXES_PER_SIDE; col += 1)
            edges.push({ type: EDGE_HORIZONTAL, row, col });
    for (let row = 0; row < BOXES_PER_SIDE; row += 1)
        for (let col = 0; col < GRID_SIZE; col += 1) edges.push({ type: EDGE_VERTICAL, row, col });
    return edges;
}

function applyMove(current, type, row, col, player) {
    const key = edgeKey(type, row, col);
    if (current.edges.has(key) || player !== current.turn) return null;
    const nextEdges = new Map(current.edges);
    nextEdges.set(key, player);
    const nextBoxes = new Map(current.boxes);
    const nextScores = { ...current.scores };
    let completed = 0;
    for (const box of getBoxesAroundEdge(type, row, col)) {
        const keyBox = boxKey(box.row, box.col);
        if (nextBoxes.has(keyBox)) continue;
        if (isBoxComplete(nextEdges, box.row, box.col)) {
            nextBoxes.set(keyBox, player);
            completed += 1;
        }
    }
    if (completed > 0) nextScores[player] += completed;
    return {
        edges: nextEdges,
        boxes: nextBoxes,
        turn: completed > 0 ? player : switchPlayer(player),
        scores: nextScores,
    };
}

function getLegalEdges(current) {
    return getAllEdges().filter(
        (edge) => !current.edges.has(edgeKey(edge.type, edge.row, edge.col))
    );
}

function isGameOver(current) {
    return current.edges.size === TOTAL_EDGES;
}

function getWinner(current) {
    if (current.scores[PLAYER_1] === current.scores[PLAYER_2]) return null;
    return current.scores[PLAYER_1] > current.scores[PLAYER_2] ? PLAYER_1 : PLAYER_2;
}

function evaluate(current, botPlayer) {
    return (current.scores[botPlayer] - current.scores[switchPlayer(botPlayer)]) * BOX_VALUE;
}

function immediateBoxes(current, type, row, col) {
    let count = 0;
    for (const box of getBoxesAroundEdge(type, row, col)) {
        if (current.boxes.has(boxKey(box.row, box.col))) continue;
        const { row: r, col: c } = box;
        const placed =
            (current.edges.has(edgeKey(EDGE_HORIZONTAL, r, c)) ? 1 : 0) +
            (current.edges.has(edgeKey(EDGE_HORIZONTAL, r + 1, c)) ? 1 : 0) +
            (current.edges.has(edgeKey(EDGE_VERTICAL, r, c)) ? 1 : 0) +
            (current.edges.has(edgeKey(EDGE_VERTICAL, r, c + 1)) ? 1 : 0);
        if (placed === 3) count += 1;
    }
    return count;
}

function orderMoves(current) {
    return getLegalEdges(current).sort(
        (a, b) =>
            immediateBoxes(current, b.type, b.row, b.col) -
            immediateBoxes(current, a.type, a.row, a.col)
    );
}

function search(current, botPlayer, depth, alpha, beta) {
    if (isGameOver(current)) {
        const winner = getWinner(current);
        if (winner === botPlayer) return WIN_SCORE;
        if (winner === null) return 0;
        return -WIN_SCORE;
    }
    if (depth === 0) return evaluate(current, botPlayer);
    const maximizing = current.turn === botPlayer;
    let best = maximizing ? -Infinity : Infinity;
    for (const edge of orderMoves(current).slice(0, MAX_MOVES_PER_NODE)) {
        const next = applyMove(current, edge.type, edge.row, edge.col, current.turn);
        const score = search(next, botPlayer, depth - 1, alpha, beta);
        if (maximizing) {
            best = Math.max(best, score);
            alpha = Math.max(alpha, best);
        } else {
            best = Math.min(best, score);
            beta = Math.min(beta, best);
        }
        if (beta <= alpha) break;
    }
    return best;
}

function pickGreedyMove(current, edges) {
    const scored = edges.map((edge) => ({
        edge,
        score: evaluate(
            applyMove(current, edge.type, edge.row, edge.col, current.turn),
            current.turn
        ),
    }));
    const bestScore = Math.max(...scored.map((entry) => entry.score));
    const bestEdges = scored
        .filter((entry) => entry.score === bestScore)
        .map((entry) => entry.edge);
    return Math.random() < GREEDY_RATIO
        ? bestEdges[Math.floor(Math.random() * bestEdges.length)]
        : edges[Math.floor(Math.random() * edges.length)];
}

function chooseMove(current, level) {
    const edges = getLegalEdges(current);
    if (edges.length === 0) return null;
    const depth = DIFFICULTY_DEPTHS[level];
    if (depth <= 1) return pickGreedyMove(current, edges);
    let bestScore = -Infinity;
    let bestEdges = [];
    for (const edge of orderMoves(current).slice(0, MAX_MOVES_PER_NODE)) {
        const next = applyMove(current, edge.type, edge.row, edge.col, current.turn);
        const score = search(next, current.turn, depth - 1, -Infinity, Infinity);
        if (score > bestScore) {
            bestScore = score;
            bestEdges = [edge];
        } else if (score === bestScore) bestEdges.push(edge);
    }
    return bestEdges[Math.floor(Math.random() * bestEdges.length)];
}

function crear(etiqueta, propiedades = {}, hijos = []) {
    const nodo = document.createElement(etiqueta);

    Object.entries(propiedades).forEach(([clave, valor]) => {
        if (valor === undefined || valor === null || valor === false) return;
        if (clave === "clase") nodo.className = valor;
        else if (clave === "texto") nodo.textContent = valor;
        else if (clave === "estilo") nodo.setAttribute("style", valor);
        else nodo.setAttribute(clave, valor === true ? "" : String(valor));
    });

    [].concat(hijos).forEach((hijo) => {
        if (hijo === null || hijo === undefined || hijo === false) return;
        nodo.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
    });

    return nodo;
}

const icon = (name, extra = "") =>
    crear("span", {
        clase: `material-symbols-rounded ${extra}`.trim(),
        "aria-hidden": "true",
        texto: name,
    });

const button = (text, iconName, variant = "primary", action = "") =>
    crear(
        "button",
        { type: "button", clase: `button button--${variant}`, "data-action": action || undefined },
        [iconName ? icon(iconName) : null, text]
    );

function renderHome() {
    const dificultades = crear("div", { clase: "home__difficulty" }, [
        crear("span", { clase: "home__label", texto: "Dificultad" }),
        crear(
            "div",
            { clase: "home__difficulty-options" },
            Object.entries(DIFFICULTY_LABELS).map(([id, label]) =>
                crear(
                    "button",
                    {
                        type: "button",
                        clase: `home__difficulty-option${difficulty === id ? " home__difficulty-option--active" : ""}`,
                        "data-difficulty": id,
                        "aria-pressed": String(difficulty === id),
                    },
                    [label]
                )
            )
        ),
    ]);

    app.replaceChildren(
        crear("main", { clase: "app" }, [
            crear("section", { clase: "home", "aria-label": "Pantalla de inicio" }, [
                crear("h2", { clase: "home__title", texto: "Puntos y Cajas" }),
                crear("p", { clase: "home__subtitle", texto: "Completa más cajas que tu rival" }),
                crear("div", { clase: "home__card" }, [
                    crear("div", { clase: "home__modes" }, [
                        button(
                            "vs Bot",
                            "smart_toy",
                            mode === "bot" ? "primary" : "secondary",
                            "mode-bot"
                        ),
                        button(
                            "2 Jugadores",
                            "group",
                            mode === "local" ? "primary" : "secondary",
                            "mode-local"
                        ),
                    ]),
                    mode === "bot" ? dificultades : null,
                    button("Jugar", null, "primary", "start"),
                ]),
            ]),
        ])
    );

    app.querySelector('[data-action="mode-bot"]').addEventListener("click", () => {
        mode = "bot";
        renderHome();
    });
    app.querySelector('[data-action="mode-local"]').addEventListener("click", () => {
        mode = "local";
        renderHome();
    });
    app.querySelectorAll("[data-difficulty]").forEach((element) =>
        element.addEventListener("click", () => {
            difficulty = element.dataset.difficulty;
            renderHome();
        })
    );
    app.querySelector('[data-action="start"]').addEventListener("click", startGame);
}

function scoreboard() {
    const p1Name = mode === "bot" ? "TÚ" : "Jugador 1";
    const p2Name = mode === "bot" ? "BOT" : "Jugador 2";
    const badge = mode === "bot" ? DIFFICULTY_LABELS[difficulty] : "2 jugadores";
    const active1 = game.turn === PLAYER_1;
    const active2 = game.turn === PLAYER_2;

    return crear("section", { clase: "scoreboard", "aria-label": "Marcador de la partida" }, [
        crear("div", { clase: "scoreboard__badge-row" }, [
            crear("span", { clase: "scoreboard__badge", texto: badge }),
        ]),
        crear("div", { clase: "scoreboard__names" }, [
            crear("span", {
                clase: `scoreboard__name${active1 ? " scoreboard__name--player-1" : ""}`,
                texto: p1Name,
            }),
            crear("span", {
                clase: `scoreboard__name${active2 ? " scoreboard__name--player-2" : ""}`,
                texto: p2Name,
            }),
        ]),
        crear("div", { clase: "scoreboard__counts" }, [
            crear("span", {
                clase: `scoreboard__count${active1 ? " scoreboard__count--player-1" : ""}`,
                texto: String(game.scores[PLAYER_1]),
            }),
            crear("span", { clase: "scoreboard__vs", "aria-hidden": "true", texto: "VS" }),
            crear("span", {
                clase: `scoreboard__count${active2 ? " scoreboard__count--player-2" : ""}`,
                texto: String(game.scores[PLAYER_2]),
            }),
        ]),
    ]);
}

function boardMarkup() {
    const cells = [];
    const totalCells = GRID_SIZE * 2 - 1;

    for (let row = 0; row < totalCells; row += 1) {
        for (let col = 0; col < totalCells; col += 1) {
            const isDot = row % 2 === 0 && col % 2 === 0;
            const horizontal = row % 2 === 0 && col % 2 === 1;
            const vertical = row % 2 === 1 && col % 2 === 0;

            if (isDot) {
                cells.push(crear("span", { clase: "board__dot", "aria-hidden": "true" }));
                continue;
            }

            if (horizontal || vertical) {
                const type = horizontal ? EDGE_HORIZONTAL : EDGE_VERTICAL;
                const edgeRow = Math.floor(row / 2);
                const edgeCol = Math.floor(col / 2);
                const placedBy = game.edges.get(edgeKey(type, edgeRow, edgeCol));
                const completed = getBoxesAroundEdge(type, edgeRow, edgeCol).some((box) =>
                    game.boxes.has(boxKey(box.row, box.col))
                );
                const classes = [
                    "edge-button",
                    horizontal ? "edge-button--horizontal" : "edge-button--vertical",
                ];

                if (placedBy === PLAYER_1) classes.push("edge-button--player-1");
                if (placedBy === PLAYER_2) classes.push("edge-button--player-2");
                if (completed) classes.push("edge-button--completed");

                cells.push(
                    crear("button", {
                        type: "button",
                        clase: classes.join(" "),
                        "data-edge-type": type,
                        "data-edge-row": String(edgeRow),
                        "data-edge-col": String(edgeCol),
                        "aria-label": `Arista ${horizontal ? "horizontal" : "vertical"} fila ${edgeRow} columna ${edgeCol}`,
                        disabled: placedBy !== undefined ? true : undefined,
                    })
                );
                continue;
            }

            const boxRow = Math.floor(row / 2);
            const boxCol = Math.floor(col / 2);
            const owner = game.boxes.get(boxKey(boxRow, boxCol));

            cells.push(
                crear("div", {
                    clase: `box-cell${owner === PLAYER_1 ? " box-cell--player-1" : owner === PLAYER_2 ? " box-cell--player-2" : ""}`,
                    "aria-hidden": "true",
                })
            );
        }
    }

    return crear("div", { clase: "board" }, [
        crear(
            "div",
            {
                clase: "board__grid",
                role: "group",
                "aria-label": "Tablero de puntos y cajas",
                estilo: `--board-cells:${totalCells}`,
            },
            cells
        ),
    ]);
}

function renderGame() {
    const over = isGameOver(game);
    const botTurn = mode === "bot" && game.turn === PLAYER_2;
    const winner = over ? getWinner(game) : null;
    const winnerName =
        winner === null
            ? null
            : winner === PLAYER_1
              ? mode === "bot"
                  ? "TÚ"
                  : "Jugador 1"
              : mode === "bot"
                ? "BOT"
                : "Jugador 2";
    const fin = crear("section", { clase: "game-over", "aria-label": "Fin de la partida" }, [
        crear("div", { clase: "game-over__card" }, [
            icon("emoji_events", "game-over__icon"),
            crear("h2", {
                clase: "game-over__title",
                texto: winnerName === null ? "Empate" : `Gana ${winnerName}`,
            }),
            crear("div", { clase: "game-over__actions" }, [
                button("Jugar de nuevo", null, "primary", "play-again"),
                button("Menú", null, "secondary", "menu"),
            ]),
        ]),
    ]);

    app.replaceChildren(
        crear("main", { clase: "app" }, [
            crear("header", { clase: "app__header" }, [
                crear("h2", { clase: "app__title", texto: "Puntos y Cajas" }),
            ]),
            crear("section", { clase: "game-screen", "aria-label": "Pantalla de partida" }, [
                scoreboard(),
                boardMarkup(),
                crear("div", { clase: "game-screen__controls" }, [
                    button("Reiniciar", "restart_alt", "ghost", "restart"),
                    button("Menú", "arrow_back", "ghost", "menu"),
                ]),
                crear("p", {
                    clase: "sr-only",
                    role: "status",
                    texto: `Turno del jugador ${game.turn}`,
                }),
            ]),
            over ? fin : null,
        ])
    );

    app.querySelectorAll("[data-edge-type]").forEach((element) =>
        element.addEventListener("click", () => {
            if (botTurn) return;
            playEdge(
                element.dataset.edgeType,
                Number(element.dataset.edgeRow),
                Number(element.dataset.edgeCol)
            );
        })
    );
    app.querySelectorAll('[data-action="restart"]').forEach((element) =>
        element.addEventListener("click", restartGame)
    );
    app.querySelectorAll('[data-action="menu"]').forEach((element) =>
        element.addEventListener("click", goHome)
    );
    app.querySelectorAll('[data-action="play-again"]').forEach((element) =>
        element.addEventListener("click", restartGame)
    );
}

function startGame() {
    game = createInitialGame();
    screen = "game";
    render();
    scheduleBot();
}

function restartGame() {
    clearBotTimer();
    game = createInitialGame();
    render();
    scheduleBot();
}

function goHome() {
    clearBotTimer();
    game = createInitialGame();
    screen = "home";
    render();
}

function clearBotTimer() {
    if (botTimer !== null) {
        clearTimeout(botTimer);
        botTimer = null;
    }
}

function scheduleBot() {
    clearBotTimer();
    if (screen !== "game" || mode !== "bot" || game.turn !== PLAYER_2 || isGameOver(game)) return;
    botTimer = setTimeout(() => {
        botTimer = null;
        const edge = chooseMove(game, difficulty);
        if (edge !== null) {
            const next = applyMove(game, edge.type, edge.row, edge.col, game.turn);
            if (next !== null) {
                game = next;
                renderGame();
            }
        }
        scheduleBot();
    }, BOT_MOVE_DELAY_MS);
}

function playEdge(type, row, col) {
    if (isGameOver(game) || (mode === "bot" && game.turn === PLAYER_2)) return;
    const next = applyMove(game, type, row, col, game.turn);
    if (next === null) return;
    game = next;
    renderGame();
    scheduleBot();
}

function render() {
    if (screen === "home") renderHome();
    else renderGame();
}

render();
