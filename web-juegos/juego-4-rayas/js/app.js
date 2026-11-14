const COLUMNS = 7;
const ROWS = 6;
const WIN_LENGTH = 4;
const EMPTY = null;
const PLAYER_1 = "player1";
const PLAYER_2 = "player2";
const DIRECTIONS = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: -1 },
];
const GAME_STATUS = { PLAYING: "playing", WON: "won", DRAW: "draw" };
const DIFFICULTIES = ["facil", "medio", "dificil"];
const DIFFICULTY_LABELS = { facil: "Fácil", medio: "Medio", dificil: "Difícil" };
const DIFFICULTY_DEPTHS = { facil: 1, medio: 5, dificil: 8 };
const DEFAULT_DIFFICULTY = "dificil";
const BOT_DELAY_MS = 700;

const app = document.querySelector("#app");
let screen = "home";
let selectedMode = null;
let difficulty = DEFAULT_DIFFICULTY;
let mode = "local";
let game = createGame();
let scores = { [PLAYER_1]: 0, [PLAYER_2]: 0 };
let botTimer = null;

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(EMPTY));
}

function cloneBoard(board) {
    return board.map((row) => [...row]);
}

function createGame() {
    return {
        board: createBoard(),
        turn: PLAYER_1,
        status: GAME_STATUS.PLAYING,
        winner: null,
        winningLine: null,
    };
}

function getLowestEmptyRow(board, column) {
    for (let row = ROWS - 1; row >= 0; row -= 1) if (board[row][column] === EMPTY) return row;
    return -1;
}

function isColumnFull(board, column) {
    return getLowestEmptyRow(board, column) === -1;
}

function isBoardFull(board) {
    return board.every((row) => row.every((cell) => cell !== EMPTY));
}

function getWinningLine(board, player) {
    for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLUMNS; col += 1) {
            if (board[row][col] !== player) continue;
            for (const { row: dr, col: dc } of DIRECTIONS) {
                const line = [];
                for (let step = 0; step < WIN_LENGTH; step += 1) {
                    const nextRow = row + dr * step;
                    const nextCol = col + dc * step;
                    if (
                        nextRow < 0 ||
                        nextRow >= ROWS ||
                        nextCol < 0 ||
                        nextCol >= COLUMNS ||
                        board[nextRow][nextCol] !== player
                    )
                        break;
                    line.push({ row: nextRow, col: nextCol });
                }
                if (line.length === WIN_LENGTH) return line;
            }
        }
    }
    return null;
}

function applyMove(current, column) {
    if (current.status !== GAME_STATUS.PLAYING) return current;
    const row = getLowestEmptyRow(current.board, column);
    if (row === -1) return current;
    const board = cloneBoard(current.board);
    board[row][column] = current.turn;
    const winningLine = getWinningLine(board, current.turn);
    if (winningLine !== null) {
        return { ...current, board, status: GAME_STATUS.WON, winner: current.turn, winningLine };
    }
    return {
        ...current,
        board,
        turn: current.turn === PLAYER_1 ? PLAYER_2 : PLAYER_1,
        status: isBoardFull(board) ? GAME_STATUS.DRAW : GAME_STATUS.PLAYING,
    };
}

const WIN_SCORE = 1_000_000;
const WINDOW_SCORES = [0, 1, 10, 100, 1_000];
const CENTER_BONUS = [0, 1, 2, 3, 2, 1, 0];
const getOpponent = (player) => (player === PLAYER_1 ? PLAYER_2 : PLAYER_1);
const getLegalMoves = (board) =>
    Array.from({ length: COLUMNS }, (_, column) => column).filter(
        (column) => getLowestEmptyRow(board, column) !== -1
    );

function buildWindowCoords() {
    const coords = [];
    for (let row = 0; row < ROWS; row += 1)
        for (let col = 0; col <= COLUMNS - WIN_LENGTH; col += 1)
            coords.push([0, 1, 2, 3].map((step) => [row, col + step]));
    for (let col = 0; col < COLUMNS; col += 1)
        for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1)
            coords.push([0, 1, 2, 3].map((step) => [row + step, col]));
    for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1)
        for (let col = 0; col <= COLUMNS - WIN_LENGTH; col += 1)
            coords.push([0, 1, 2, 3].map((step) => [row + step, col + step]));
    for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1)
        for (let col = WIN_LENGTH - 1; col < COLUMNS; col += 1)
            coords.push([0, 1, 2, 3].map((step) => [row + step, col - step]));
    return coords;
}
const WINDOW_COORDS = buildWindowCoords();

function evaluateBoard(board, player) {
    const opponent = getOpponent(player);
    let score = 0;
    for (const window of WINDOW_COORDS) {
        let own = 0;
        let rival = 0;
        for (const [row, col] of window) {
            if (board[row][col] === player) own += 1;
            else if (board[row][col] === opponent) rival += 1;
        }
        if (own > 0 && rival > 0) continue;
        if (own > 0) score += WINDOW_SCORES[own];
        if (rival > 0) score -= WINDOW_SCORES[rival];
    }
    for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLUMNS; col += 1) {
            if (board[row][col] === player) score += CENTER_BONUS[col];
            else if (board[row][col] === opponent) score -= CENTER_BONUS[col];
        }
    }
    return score;
}

function placeDisk(board, column, player) {
    const row = getLowestEmptyRow(board, column);
    if (row === -1) return -1;
    board[row][column] = player;
    return row;
}

function removeDisk(board, row, column) {
    board[row][column] = EMPTY;
}

function isWinningMove(board, row, column, player) {
    for (const { row: rowStep, col: colStep } of DIRECTIONS) {
        let count = 1;
        for (const sign of [1, -1]) {
            let nextRow = row + rowStep * sign;
            let nextCol = column + colStep * sign;
            while (
                nextRow >= 0 &&
                nextRow < ROWS &&
                nextCol >= 0 &&
                nextCol < COLUMNS &&
                board[nextRow][nextCol] === player
            ) {
                count += 1;
                nextRow += rowStep * sign;
                nextCol += colStep * sign;
            }
        }
        if (count >= WIN_LENGTH) return true;
    }
    return false;
}

function findImmediateWinColumn(board, player) {
    for (const column of getLegalMoves(board)) {
        const row = placeDisk(board, column, player);
        const wins = isWinningMove(board, row, column, player);
        removeDisk(board, row, column);
        if (wins) return column;
    }
    return null;
}

function getThreatColumns(board, player) {
    const threats = [];
    for (const column of getLegalMoves(board)) {
        const row = placeDisk(board, column, player);
        if (isWinningMove(board, row, column, player)) threats.push(column);
        removeDisk(board, row, column);
    }
    return threats;
}

function orderMoves(moves, threats) {
    const threatSet = new Set(threats);
    return [...moves].sort(
        (a, b) =>
            Number(threatSet.has(b)) - Number(threatSet.has(a)) ||
            CENTER_BONUS[b] - CENTER_BONUS[a] ||
            a - b
    );
}

function negamax(board, player, depth, alpha, beta) {
    if (findImmediateWinColumn(board, player) !== null) return WIN_SCORE - 1;
    const moves = getLegalMoves(board);
    if (moves.length === 0) return 0;
    if (depth === 0) return evaluateBoard(board, player);
    const orderedMoves = orderMoves(moves, getThreatColumns(board, getOpponent(player)));
    let best = -Infinity;
    for (const column of orderedMoves) {
        const row = placeDisk(board, column, player);
        const value = -negamax(board, getOpponent(player), depth - 1, -beta, -alpha);
        removeDisk(board, row, column);
        best = Math.max(best, value);
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
    }
    return best;
}

function pickGreedyMove(current) {
    const moves = getLegalMoves(current.board);
    const scored = moves.map((column) => {
        const row = placeDisk(current.board, column, current.turn);
        const score = isWinningMove(current.board, row, column, current.turn)
            ? WIN_SCORE
            : evaluateBoard(current.board, current.turn);
        removeDisk(current.board, row, column);
        return { column, score };
    });
    const bestScore = Math.max(...scored.map((entry) => entry.score));
    const bestMoves = scored
        .filter((entry) => entry.score === bestScore)
        .map((entry) => entry.column);
    if (Math.random() < 0.7) return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    return moves[Math.floor(Math.random() * moves.length)];
}

function chooseMove(current, level) {
    if (current.status !== GAME_STATUS.PLAYING) return null;
    const moves = getLegalMoves(current.board);
    if (moves.length === 0) return null;
    const depth = DIFFICULTY_DEPTHS[level];
    if (depth <= 1) return pickGreedyMove(current);
    const bot = current.turn;
    const winningColumn = findImmediateWinColumn(current.board, bot);
    if (winningColumn !== null) return winningColumn;
    const orderedMoves = orderMoves(moves, getThreatColumns(current.board, getOpponent(bot)));
    let bestScore = -Infinity;
    let bestMoves = [];
    for (const column of orderedMoves) {
        const row = placeDisk(current.board, column, bot);
        const value = -negamax(current.board, getOpponent(bot), depth - 1, -Infinity, Infinity);
        removeDisk(current.board, row, column);
        if (value > bestScore) {
            bestScore = value;
            bestMoves = [column];
        } else if (value === bestScore) bestMoves.push(column);
        if (value >= WIN_SCORE - 1) break;
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
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

const icon = (name) =>
    crear("span", { clase: "material-symbols-rounded", "aria-hidden": "true", texto: name });

const accionDe = (text) =>
    text === "Jugar"
        ? "start"
        : text === "Reiniciar" || text === "Jugar de nuevo"
          ? "restart"
          : text === "Menú"
            ? "menu"
            : "";

const button = (text, iconName, variant = "primary") =>
    crear(
        "button",
        { type: "button", clase: `button button--${variant}`, "data-action": accionDe(text) },
        [iconName ? icon(iconName) : null, text]
    );

function renderHome() {
    const modes = [
        {
            id: "bot",
            label: "Jugar vs Bot",
            description: "Enfréntate al bot en este tablero",
            icon: "smart_toy",
        },
        {
            id: "local",
            label: "2 Jugadores",
            description: "Comparte el tablero con otra persona",
            icon: "group",
        },
    ];
    const dificultades = crear(
        "div",
        { clase: "home__difficulty", role: "group", "aria-label": "Dificultad del bot" },
        DIFFICULTIES.map((level) =>
            crear(
                "button",
                {
                    type: "button",
                    clase: `home__difficulty-option${difficulty === level ? " home__difficulty-option--active" : ""}`,
                    "data-difficulty": level,
                    "aria-pressed": String(difficulty === level),
                },
                [DIFFICULTY_LABELS[level]]
            )
        )
    );

    app.replaceChildren(
        crear("div", { clase: "home" }, [
            crear("header", { clase: "home__header" }, [
                icon("sports_esports"),
                crear("h2", { clase: "home__title", texto: "4 en Raya" }),
                crear("p", { clase: "home__subtitle", texto: "Conecta cuatro bolitas para ganar" }),
            ]),
            crear(
                "div",
                { clase: "home__modes" },
                modes.map((item) =>
                    crear(
                        "button",
                        {
                            type: "button",
                            clase: `home__mode${selectedMode === item.id ? " home__mode--selected" : ""}`,
                            "data-mode": item.id,
                            "aria-pressed": String(selectedMode === item.id),
                        },
                        [
                            icon(item.icon),
                            crear("span", { clase: "home__mode-label", texto: item.label }),
                            crear("span", {
                                clase: "home__mode-description",
                                texto: item.description,
                            }),
                        ]
                    )
                )
            ),
            selectedMode === "bot" ? dificultades : null,
            crear(
                "button",
                {
                    type: "button",
                    clase: "button button--primary",
                    "data-action": "start",
                    disabled: selectedMode === null ? true : undefined,
                },
                [icon("play_arrow"), "Jugar"]
            ),
        ])
    );

    app.querySelectorAll("[data-mode]").forEach((element) =>
        element.addEventListener("click", () => {
            selectedMode = element.dataset.mode;
            renderHome();
        })
    );
    app.querySelectorAll("[data-difficulty]").forEach((element) =>
        element.addEventListener("click", () => {
            difficulty = element.dataset.difficulty;
            renderHome();
        })
    );
    app.querySelector('[data-action="start"]').addEventListener("click", startGame);
}

function scoreboard() {
    const isBotMode = mode === "bot";
    const p1Name = isBotMode ? "TÚ" : "JUGADOR 1";
    const p2Name = isBotMode ? "BOT" : "JUGADOR 2";
    const active1 = game.turn === PLAYER_1;
    const active2 = game.turn === PLAYER_2;

    return crear("section", { clase: "scoreboard", "aria-label": "Marcador de la partida" }, [
        isBotMode
            ? crear("div", { clase: "scoreboard__badge-row" }, [
                  crear("span", {
                      clase: "scoreboard__badge",
                      texto: DIFFICULTY_LABELS[difficulty],
                  }),
              ])
            : null,
        crear("div", { clase: "scoreboard__names" }, [
            crear("span", {
                clase: `scoreboard__name${active1 ? " scoreboard__name--active" : ""}`,
                texto: p1Name,
            }),
            crear("span", {
                clase: `scoreboard__name${active2 ? " scoreboard__name--active" : ""}`,
                texto: p2Name,
            }),
        ]),
        crear("div", { clase: "scoreboard__counts" }, [
            crear("span", {
                clase: `scoreboard__count${active1 ? " scoreboard__count--active" : ""}`,
                texto: String(scores[PLAYER_1]),
            }),
            crear("span", { clase: "scoreboard__vs", texto: "vs" }),
            crear("span", {
                clase: `scoreboard__count${active2 ? " scoreboard__count--active" : ""}`,
                texto: String(scores[PLAYER_2]),
            }),
        ]),
    ]);
}

function listBalls(board) {
    const balls = [];
    for (let row = 0; row < ROWS; row += 1)
        for (let col = 0; col < COLUMNS; col += 1)
            if (board[row][col] !== null) balls.push({ row, col, player: board[row][col] });
    return balls;
}

function getStrikeEnds(line) {
    const first = line[0];
    const last = line[line.length - 1];
    const steps = line.length - 1;
    const stepRow = (last.row - first.row) / steps;
    const stepCol = (last.col - first.col) / steps;
    return {
        x1: first.col + 0.5 - stepCol * 0.5,
        y1: first.row + 0.5 - stepRow * 0.5,
        x2: last.col + 0.5 + stepCol * 0.5,
        y2: last.row + 0.5 + stepRow * 0.5,
    };
}

const SVG = "http://www.w3.org/2000/svg";

function marcaGanadora(strike) {
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", "board__strike");
    svg.setAttribute("viewBox", `0 0 ${COLUMNS} ${ROWS}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const linea = document.createElementNS(SVG, "line");
    linea.setAttribute("x1", String(strike.x1));
    linea.setAttribute("y1", String(strike.y1));
    linea.setAttribute("x2", String(strike.x2));
    linea.setAttribute("y2", String(strike.y2));
    svg.append(linea);

    return svg;
}

function boardMarkup() {
    const line = game.winningLine ?? [];
    const isWinningCell = (row, col) => line.some((cell) => cell.row === row && cell.col === col);
    const strike = line.length >= 2 ? getStrikeEnds(line) : null;
    const disabled =
        game.status !== GAME_STATUS.PLAYING || (mode === "bot" && game.turn === PLAYER_2);

    return crear("div", { clase: "board" }, [
        crear("div", { clase: "board__back" }),
        crear(
            "div",
            { clase: "board__balls" },
            listBalls(game.board).map(({ row, col, player }) =>
                crear("span", {
                    clase: `board__ball board__ball--${player}${isWinningCell(row, col) ? " board__ball--winner" : ""}`,
                    estilo: `grid-column:${col + 1};grid-row:${row + 1};--ball-row:${row}`,
                    "aria-hidden": "true",
                })
            )
        ),
        crear("div", { clase: "board__front", "aria-hidden": "true" }),
        strike ? marcaGanadora(strike) : null,
        crear(
            "div",
            { clase: "board__columns" },
            Array.from({ length: COLUMNS }, (_, col) =>
                crear("button", {
                    type: "button",
                    clase: "board__column",
                    "data-column": String(col),
                    "aria-label": `Columna ${col + 1}`,
                    disabled: disabled || isColumnFull(game.board, col) ? true : undefined,
                })
            )
        ),
    ]);
}

function renderGame() {
    const isBotMode = mode === "bot";
    const gameOver = game.status !== GAME_STATUS.PLAYING;
    const botTurn = isBotMode && game.turn === PLAYER_2 && !gameOver;
    const title =
        game.status === GAME_STATUS.DRAW
            ? "Empate"
            : isBotMode
              ? game.winner === PLAYER_1
                  ? "¡Ganaste!"
                  : "¡El bot ganó!"
              : `¡${game.winner === PLAYER_1 ? "JUGADOR 1" : "JUGADOR 2"} gana!`;
    const fin = crear(
        "div",
        {
            clase: "game-over",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Fin de la partida",
        },
        [
            crear("div", { clase: "game-over__card" }, [
                crear("h2", { clase: "game-over__title", texto: title }),
                crear("div", { clase: "game-over__actions" }, [
                    button("Jugar de nuevo", "replay", "primary"),
                    button("Menú", "arrow_back", "secondary"),
                ]),
            ]),
        ]
    );

    app.replaceChildren(
        crear("div", { clase: "game-screen" }, [
            scoreboard(),
            boardMarkup(),
            crear("div", {
                clase: "game-screen__status",
                role: "status",
                texto: botTurn ? "El bot está pensando…" : "",
            }),
            crear("div", { clase: "game-screen__actions" }, [
                button("Reiniciar", "restart_alt", "secondary"),
                button("Menú", "arrow_back", "secondary"),
            ]),
            gameOver ? fin : null,
        ])
    );

    app.querySelectorAll("[data-column]").forEach((element) =>
        element.addEventListener("click", () => playColumn(Number(element.dataset.column)))
    );
    app.querySelectorAll('[data-action="restart"]').forEach((element) =>
        element.addEventListener("click", restartGame)
    );
    app.querySelectorAll('[data-action="menu"]').forEach((element) =>
        element.addEventListener("click", goMenu)
    );
}

function startGame() {
    if (selectedMode === null) return;
    mode = selectedMode;
    game = createGame();
    scores = { [PLAYER_1]: 0, [PLAYER_2]: 0 };
    screen = "game";
    render();
    scheduleBot();
}

function restartGame() {
    clearBotTimer();
    game = createGame();
    render();
    scheduleBot();
}

function goMenu() {
    clearBotTimer();
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
    if (
        screen !== "game" ||
        mode !== "bot" ||
        game.status !== GAME_STATUS.PLAYING ||
        game.turn !== PLAYER_2
    )
        return;
    botTimer = setTimeout(() => {
        botTimer = null;
        const column = chooseMove(game, difficulty);
        if (column !== null) playColumn(column);
        else scheduleBot();
    }, BOT_DELAY_MS);
}

function playColumn(column) {
    if (game.status !== GAME_STATUS.PLAYING) return;
    if (mode === "bot" && game.turn === PLAYER_2) return;
    const next = applyMove(game, column);
    if (next === game) return;
    game = next;
    if (game.status === GAME_STATUS.WON) scores[game.winner] += 1;
    render();
    if (game.status === GAME_STATUS.PLAYING) scheduleBot();
    else clearBotTimer();
}

function render() {
    if (screen === "home") renderHome();
    else renderGame();
}

render();
