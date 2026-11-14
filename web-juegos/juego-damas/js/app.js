const BOARD_SIZE = 8;
const PLAYER_1 = 1;
const PLAYER_2 = 2;
const PIECES_PER_PLAYER = 12;
const FORWARD_DIRECTION = { [PLAYER_1]: -1, [PLAYER_2]: 1 };
const PROMOTION_ROW = { [PLAYER_1]: 0, [PLAYER_2]: BOARD_SIZE - 1 };
const DIAGONALS = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
];
const DIFFICULTIES = ["facil", "medio", "dificil"];
const DIFFICULTY_LABELS = { facil: "Fácil", medio: "Medio", dificil: "Difícil" };
const DIFFICULTY_DEPTHS = { facil: 1, medio: 2, dificil: 4 };
const DEFAULT_DIFFICULTY = "dificil";
const BOT_DELAY_MS = 1500;
const MAN_VALUE = 100;
const KING_VALUE = 160;
const ADVANCE_BONUS = 2;
const LOSS_SCORE = 1_000_000;

const app = document.querySelector("#app");
let screen = "home";
let selectedMode = null;
let difficulty = DEFAULT_DIFFICULTY;
let mode = "local";
let game = createGame();
let selection = null;
let botTimer = null;

function createEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function isPlayableSquare(row, col) {
    return (row + col) % 2 === 1;
}

function isInsideBoard(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function createInitialBoard() {
    const board = createEmptyBoard();
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            if (!isPlayableSquare(row, col)) continue;
            if (row < 3) board[row][col] = { player: PLAYER_2, king: false };
            else if (row > 4) board[row][col] = { player: PLAYER_1, king: false };
        }
    }
    return board;
}

function countPieces(board, player) {
    let count = 0;
    for (let row = 0; row < BOARD_SIZE; row += 1)
        for (let col = 0; col < BOARD_SIZE; col += 1)
            if (board[row][col] !== null && board[row][col].player === player) count += 1;
    return count;
}

function switchPlayer(player) {
    return player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
}

function getDirections(piece) {
    return piece.king
        ? DIAGONALS
        : [
              [FORWARD_DIRECTION[piece.player], -1],
              [FORWARD_DIRECTION[piece.player], 1],
          ];
}

function isPromotionRow(row, player) {
    return row === PROMOTION_ROW[player];
}

function createMove(from, landings, captured) {
    return { from, landings, captured };
}

function getSimpleMoves(board, row, col, piece) {
    const moves = [];
    for (const [dr, dc] of getDirections(piece)) {
        const toRow = row + dr;
        const toCol = col + dc;
        if (
            !isInsideBoard(toRow, toCol) ||
            !isPlayableSquare(toRow, toCol) ||
            board[toRow][toCol] !== null
        )
            continue;
        moves.push(createMove({ row, col }, [{ row: toRow, col: toCol }], []));
    }
    return moves;
}

function getCaptureChains(board, row, col, piece) {
    const chains = [];
    for (const [dr, dc] of DIAGONALS) {
        const enemyRow = row + dr;
        const enemyCol = col + dc;
        const landingRow = row + 2 * dr;
        const landingCol = col + 2 * dc;
        if (
            !isInsideBoard(enemyRow, enemyCol) ||
            !isInsideBoard(landingRow, landingCol) ||
            !isPlayableSquare(landingRow, landingCol)
        )
            continue;
        const enemy = board[enemyRow][enemyCol];
        if (
            enemy === null ||
            enemy.player === piece.player ||
            board[landingRow][landingCol] !== null
        )
            continue;
        const virtualBoard = board.map((cells) => [...cells]);
        virtualBoard[enemyRow][enemyCol] = null;
        virtualBoard[row][col] = null;
        virtualBoard[landingRow][landingCol] = piece;
        const continuations = getCaptureChains(virtualBoard, landingRow, landingCol, piece);
        if (continuations.length === 0) {
            chains.push({
                landings: [{ row: landingRow, col: landingCol }],
                captured: [{ row: enemyRow, col: enemyCol }],
            });
        } else {
            for (const continuation of continuations) {
                chains.push({
                    landings: [{ row: landingRow, col: landingCol }, ...continuation.landings],
                    captured: [{ row: enemyRow, col: enemyCol }, ...continuation.captured],
                });
            }
        }
    }
    return chains;
}

function getLegalMoves(board, player) {
    const pieces = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = board[row][col];
            if (piece !== null && piece.player === player) pieces.push({ row, col, piece });
        }
    }
    const captureMoves = [];
    const simpleMoves = [];
    for (const { row, col, piece } of pieces) {
        const chains = getCaptureChains(board, row, col, piece);
        for (const chain of chains)
            captureMoves.push(createMove({ row, col }, chain.landings, chain.captured));
        if (chains.length === 0) simpleMoves.push(...getSimpleMoves(board, row, col, piece));
    }
    return captureMoves.length > 0 ? captureMoves : simpleMoves;
}

function moveKey(move) {
    return `${move.from.row}:${move.from.col}>${move.landings.map((square) => `${square.row}:${square.col}`).join("-")}`;
}

function isLegalMove(board, player, move) {
    const key = moveKey(move);
    return getLegalMoves(board, player).some((legal) => moveKey(legal) === key);
}

function applyMoveToBoard(board, move) {
    const next = board.map((cells) => [...cells]);
    const piece = next[move.from.row][move.from.col];
    if (piece === null) throw new Error("No hay ficha en el origen");
    next[move.from.row][move.from.col] = null;
    for (const captured of move.captured) next[captured.row][captured.col] = null;
    const finalSquare = move.landings[move.landings.length - 1];
    next[finalSquare.row][finalSquare.col] = piece;
    const crowned = move.landings.some((square) => isPromotionRow(square.row, piece.player));
    if (crowned && !piece.king) next[finalSquare.row][finalSquare.col] = { ...piece, king: true };
    return next;
}

function countPiecesByPlayer(board) {
    return { [PLAYER_1]: countPieces(board, PLAYER_1), [PLAYER_2]: countPieces(board, PLAYER_2) };
}

function createGame() {
    return {
        board: createInitialBoard(),
        turn: PLAYER_1,
        pieces: { [PLAYER_1]: PIECES_PER_PLAYER, [PLAYER_2]: PIECES_PER_PLAYER },
        history: [],
        undoUsed: false,
        over: false,
        winner: null,
    };
}

function applyMove(current, move) {
    if (current.over || !isLegalMove(current.board, current.turn, move)) return current;
    const nextBoard = applyMoveToBoard(current.board, move);
    const nextTurn = switchPlayer(current.turn);
    const next = {
        ...current,
        board: nextBoard,
        turn: nextTurn,
        pieces: countPiecesByPlayer(nextBoard),
        history: [...current.history, { board: current.board, turn: current.turn }],
        over: false,
        winner: null,
    };
    if (next.pieces[nextTurn] === 0 || getLegalMoves(nextBoard, nextTurn).length === 0) {
        next.over = true;
        next.winner = current.turn;
    }
    return next;
}

function undoMove(current) {
    if (current.undoUsed || current.history.length === 0) return current;
    const previous = current.history[current.history.length - 1];
    return {
        ...current,
        board: previous.board,
        turn: previous.turn,
        pieces: countPiecesByPlayer(previous.board),
        history: current.history.slice(0, -1),
        undoUsed: true,
        over: false,
        winner: null,
    };
}

function evaluateSide(board, player) {
    let score = 0;
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = board[row][col];
            if (piece === null || piece.player !== player) continue;
            score += piece.king ? KING_VALUE : MAN_VALUE;
            if (!piece.king)
                score += (player === PLAYER_1 ? row : BOARD_SIZE - 1 - row) * ADVANCE_BONUS;
        }
    }
    return score;
}

function evaluate(board, player) {
    return evaluateSide(board, player) - evaluateSide(board, switchPlayer(player));
}

function orderMoves(moves) {
    return [...moves].sort((a, b) => b.captured.length - a.captured.length);
}

function search(board, botPlayer, depth, alpha, beta) {
    const playerToMove = depth % 2 === 0 ? botPlayer : switchPlayer(botPlayer);
    const moves = getLegalMoves(board, playerToMove);
    if (moves.length === 0) return depth % 2 === 0 ? -LOSS_SCORE : LOSS_SCORE;
    if (depth === 0) return evaluate(board, botPlayer);
    if (depth % 2 === 0) {
        let best = -Infinity;
        for (const move of orderMoves(moves)) {
            best = Math.max(
                best,
                search(applyMoveToBoard(board, move), botPlayer, depth - 1, alpha, beta)
            );
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
        }
        return best;
    }
    let best = Infinity;
    for (const move of orderMoves(moves)) {
        best = Math.min(
            best,
            search(applyMoveToBoard(board, move), botPlayer, depth - 1, alpha, beta)
        );
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
    }
    return best;
}

function chooseMove(current, level) {
    const moves = getLegalMoves(current.board, current.turn);
    if (moves.length === 0) return null;
    const depth = DIFFICULTY_DEPTHS[level];
    if (depth <= 1) {
        const scored = moves.map((move) => ({
            move,
            score: evaluate(applyMoveToBoard(current.board, move), current.turn),
        }));
        const bestScore = Math.max(...scored.map((entry) => entry.score));
        const bestMoves = scored
            .filter((entry) => entry.score === bestScore)
            .map((entry) => entry.move);
        return Math.random() < 0.7
            ? bestMoves[Math.floor(Math.random() * bestMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];
    }
    let bestScore = -Infinity;
    let bestMoves = [];
    for (const move of orderMoves(moves)) {
        const score = search(
            applyMoveToBoard(current.board, move),
            current.turn,
            depth - 1,
            -Infinity,
            Infinity
        );
        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        } else if (score === bestScore) bestMoves.push(move);
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

const icon = (name, extra = "") =>
    crear("span", {
        clase: `material-symbols-rounded ${extra}`.trim(),
        "aria-hidden": "true",
        texto: name,
    });

const botonAccion = (texto, icono, accion, deshabilitado) =>
    crear(
        "button",
        {
            type: "button",
            clase: "button button--secondary",
            "data-action": accion,
            disabled: deshabilitado ? true : undefined,
        },
        [icono ? icon(icono) : null, texto]
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
        [
            ...DIFFICULTIES.map((level) =>
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
            ),
        ]
    );

    app.replaceChildren(
        crear("div", { clase: "home" }, [
            crear("header", { clase: "home__header" }, [
                icon("sports_esports"),
                crear("h2", { clase: "home__title", texto: "Damas" }),
                crear("p", { clase: "home__subtitle", texto: "Elige cómo quieres jugar" }),
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
    const p1Name = mode === "bot" ? "TÚ" : "Jugador 1";
    const p2Name = mode === "bot" ? "BOT" : "Jugador 2";
    const badge = mode === "bot" ? DIFFICULTY_LABELS[difficulty] : "2 JUGADORES";
    const active1 = game.turn === PLAYER_1;
    const active2 = game.turn === PLAYER_2;

    return crear("section", { clase: "scoreboard", "aria-label": "Marcador de la partida" }, [
        crear("div", { clase: "scoreboard__badge-row" }, [
            crear("span", { clase: "scoreboard__badge", texto: badge }),
        ]),
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
                texto: String(game.pieces[PLAYER_1]),
            }),
            crear("span", { clase: "scoreboard__vs", texto: "VS" }),
            crear("span", {
                clase: `scoreboard__count${active2 ? " scoreboard__count--active" : ""}`,
                texto: String(game.pieces[PLAYER_2]),
            }),
        ]),
    ]);
}

function boardMarkup() {
    const disabled = game.over || (mode === "bot" && game.turn === PLAYER_2);
    const allMoves = disabled ? [] : getLegalMoves(game.board, game.turn);
    const activeSelection =
        selection !== null && game.board[selection.row]?.[selection.col]?.player === game.turn
            ? selection
            : null;
    const legalMoves =
        activeSelection === null
            ? []
            : allMoves.filter(
                  (move) =>
                      move.from.row === activeSelection.row && move.from.col === activeSelection.col
              );
    const targetKeys = new Set(
        legalMoves.map((move) => {
            const last = move.landings[move.landings.length - 1];
            return `${last.row},${last.col}`;
        })
    );
    const captureOrigins = new Set(
        allMoves
            .filter((move) => move.captured.length > 0)
            .map((move) => `${move.from.row},${move.from.col}`)
    );
    const selectedHasCaptures = legalMoves.some((move) => move.captured.length > 0);
    const notice =
        !disabled && captureOrigins.size > 0
            ? activeSelection === null
                ? "Captura obligatoria: elige una ficha resaltada para comer"
                : !selectedHasCaptures
                  ? "Esta ficha no puede capturar: elige una ficha resaltada"
                  : null
            : null;

    const squares = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = game.board[row][col];
            const classes = [
                "board__square",
                isPlayableSquare(row, col) ? "board__square--dark" : "board__square--light",
            ];
            if (
                activeSelection !== null &&
                activeSelection.row === row &&
                activeSelection.col === col
            )
                classes.push("board__square--selected");
            if (targetKeys.has(`${row},${col}`)) classes.push("board__square--target");
            if (captureOrigins.has(`${row},${col}`)) classes.push("board__square--can-capture");

            if (!isPlayableSquare(row, col)) {
                squares.push(crear("div", { clase: classes.join(" "), "aria-hidden": "true" }));
                continue;
            }

            const ficha =
                piece === null
                    ? null
                    : crear(
                          "span",
                          {
                              clase: `piece piece--player-${piece.player}${piece.king ? " piece--king" : ""}`,
                              "aria-hidden": "true",
                          },
                          [piece.king ? icon("crown", "piece__crown") : null]
                      );
            const pista = targetKeys.has(`${row},${col}`)
                ? crear("span", { clase: "board__hint", "aria-hidden": "true" })
                : null;

            squares.push(
                crear(
                    "button",
                    {
                        type: "button",
                        clase: classes.join(" "),
                        "data-row": String(row),
                        "data-col": String(col),
                        "aria-label": `Fila ${row + 1} columna ${col + 1}`,
                        "aria-pressed": String(
                            activeSelection !== null &&
                                activeSelection.row === row &&
                                activeSelection.col === col
                        ),
                        disabled: disabled ? true : undefined,
                    },
                    [ficha, pista]
                )
            );
        }
    }

    return crear("div", { clase: "board" }, [
        crear(
            "div",
            { clase: "board__grid", role: "grid", "aria-label": "Tablero de damas" },
            squares
        ),
        notice ? crear("p", { clase: "board__notice", role: "status", texto: notice }) : null,
    ]);
}

function renderGame() {
    const botTurn = mode === "bot" && game.turn === PLAYER_2 && !game.over;
    const undoDisabled = botTurn || game.undoUsed || game.history.length === 0 || game.over;
    const winnerName =
        game.winner === PLAYER_1
            ? mode === "bot"
                ? "TÚ"
                : "Jugador 1"
            : game.winner === PLAYER_2
              ? mode === "bot"
                  ? "BOT"
                  : "Jugador 2"
              : null;
    const title =
        mode === "bot"
            ? game.winner === PLAYER_1
                ? "¡Ganaste!"
                : "¡El bot ganó!"
            : winnerName
              ? `¡${winnerName} gana!`
              : "";
    const fin = crear(
        "div",
        {
            clase: "game-over",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Fin de partida",
        },
        [
            crear("div", { clase: "game-over__card" }, [
                icon("emoji_events"),
                crear("h2", { clase: "game-over__title", texto: title }),
                crear("div", { clase: "game-over__actions" }, [
                    botonAccion("Jugar de nuevo", "restart_alt", "restart", false),
                    botonAccion("Volver al menú", null, "menu", false),
                ]),
            ]),
        ]
    );

    app.replaceChildren(
        crear("div", { clase: "game-screen" }, [
            scoreboard(),
            boardMarkup(),
            crear("div", { clase: "game-screen__controls" }, [
                botTurn
                    ? crear("p", {
                          clase: "game-screen__thinking",
                          role: "status",
                          texto: "El bot está pensando…",
                      })
                    : null,
                crear("div", { clase: "game-screen__actions" }, [
                    botonAccion("Deshacer", "undo", "undo", undoDisabled),
                    botonAccion("Reiniciar", "restart_alt", "restart", false),
                    botonAccion("Menú", "arrow_back", "menu", false),
                ]),
            ]),
            game.over && winnerName !== null ? fin : null,
        ])
    );

    app.querySelectorAll("[data-row][data-col]").forEach((element) =>
        element.addEventListener("click", () =>
            handleSquare(Number(element.dataset.row), Number(element.dataset.col))
        )
    );
    app.querySelectorAll('[data-action="undo"]').forEach((element) =>
        element.addEventListener("click", doUndo)
    );
    app.querySelectorAll('[data-action="restart"]').forEach((element) =>
        element.addEventListener("click", restartGame)
    );
    app.querySelectorAll('[data-action="menu"]').forEach((element) =>
        element.addEventListener("click", goMenu)
    );
}

function handleSquare(row, col) {
    if (game.over || (mode === "bot" && game.turn === PLAYER_2)) return;
    const allMoves = getLegalMoves(game.board, game.turn);
    const activeSelection =
        selection !== null && game.board[selection.row]?.[selection.col]?.player === game.turn
            ? selection
            : null;
    if (activeSelection !== null) {
        const legalMoves = allMoves.filter(
            (move) => move.from.row === activeSelection.row && move.from.col === activeSelection.col
        );
        const move = legalMoves.find((candidate) => {
            const last = candidate.landings[candidate.landings.length - 1];
            return last.row === row && last.col === col;
        });
        if (move !== undefined) {
            const next = applyMove(game, move);
            if (next !== game) {
                game = next;
                selection = null;
                renderGame();
                scheduleBot();
            }
            return;
        }
    }
    const piece = game.board[row][col];
    selection = piece !== null && piece.player === game.turn ? { row, col } : null;
    renderGame();
}

function startGame() {
    if (selectedMode === null) return;
    mode = selectedMode;
    game = createGame();
    selection = null;
    screen = "game";
    render();
    scheduleBot();
}

function restartGame() {
    clearBotTimer();
    game = createGame();
    selection = null;
    render();
    scheduleBot();
}

function doUndo() {
    if (mode === "bot" && game.turn === PLAYER_2 && !game.over) return;
    if (game.undoUsed || game.history.length === 0 || game.over) return;
    clearBotTimer();
    game = undoMove(game);
    selection = null;
    render();
}

function goMenu() {
    clearBotTimer();
    game = createGame();
    selection = null;
    screen = "home";
    selectedMode = null;
    difficulty = DEFAULT_DIFFICULTY;
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
    if (screen !== "game" || mode !== "bot" || game.over || game.turn !== PLAYER_2) return;
    botTimer = setTimeout(() => {
        botTimer = null;
        const move = chooseMove(game, difficulty);
        if (move !== null) {
            const next = applyMove(game, move);
            if (next !== game) {
                game = next;
                selection = null;
                renderGame();
            }
        }
        scheduleBot();
    }, BOT_DELAY_MS);
}

function render() {
    if (screen === "home") renderHome();
    else renderGame();
}

render();
