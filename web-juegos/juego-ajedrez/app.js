// Ajedrez — reglas completas, bot negamax y pantallas sin React.

const BOARD_SIZE = 8;
const WHITE = "white";
const BLACK = "black";
const PIECE_TYPES = {
    PAWN: "pawn",
    KNIGHT: "knight",
    BISHOP: "bishop",
    ROOK: "rook",
    QUEEN: "queen",
    KING: "king",
};
const PIECE_VALUES = {
    [PIECE_TYPES.PAWN]: 100,
    [PIECE_TYPES.KNIGHT]: 320,
    [PIECE_TYPES.BISHOP]: 330,
    [PIECE_TYPES.ROOK]: 500,
    [PIECE_TYPES.QUEEN]: 900,
    [PIECE_TYPES.KING]: 20000,
};
const PROMOTION_ROW = {
    [WHITE]: 0,
    [BLACK]: BOARD_SIZE - 1,
};
const GAME_END_REASONS = {
    CHECKMATE: "checkmate",
    STALEMATE: "stalemate",
    INSUFFICIENT_MATERIAL: "insufficient_material",
    FIFTY_MOVE_RULE: "fifty_move_rule",
    THREEFOLD_REPETITION: "threefold_repetition",
};
const DIFFICULTIES = ["facil", "medio", "dificil"];
const DIFFICULTY_LABELS = {
    facil: "Fácil",
    medio: "Medio",
    dificil: "Difícil",
};
const DIFFICULTY_DEPTHS = {
    facil: 1,
    medio: 2,
    dificil: 3,
};
const DEFAULT_DIFFICULTY = "dificil";
const BOT_DELAY_MS = 1500;
const WIN_SCORE = 1000000;
const FIFTY_MOVE_LIMIT = 100;
const REPETITION_LIMIT = 3;

// Glifos Unicode de las piezas: ambos bandos comparten la misma silueta rellena;
// la diferencia la aporta el color (CSS).
const PIECE_GLYPHS = {
    [WHITE]: {
        [PIECE_TYPES.KING]: "♚",
        [PIECE_TYPES.QUEEN]: "♛",
        [PIECE_TYPES.ROOK]: "♜",
        [PIECE_TYPES.BISHOP]: "♝",
        [PIECE_TYPES.KNIGHT]: "♞",
        [PIECE_TYPES.PAWN]: "♟",
    },
    [BLACK]: {
        [PIECE_TYPES.KING]: "♚",
        [PIECE_TYPES.QUEEN]: "♛",
        [PIECE_TYPES.ROOK]: "♜",
        [PIECE_TYPES.BISHOP]: "♝",
        [PIECE_TYPES.KNIGHT]: "♞",
        [PIECE_TYPES.PAWN]: "♟",
    },
};
const PIECE_NAMES = {
    [PIECE_TYPES.KING]: "rey",
    [PIECE_TYPES.QUEEN]: "dama",
    [PIECE_TYPES.ROOK]: "torre",
    [PIECE_TYPES.BISHOP]: "alfil",
    [PIECE_TYPES.KNIGHT]: "caballo",
    [PIECE_TYPES.PAWN]: "peón",
};

// ===== Tablero =====

const FILES = "abcdefgh";

function createEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function isInsideBoard(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function toAlgebraic(row, col) {
    return `${FILES[col]}${BOARD_SIZE - row}`;
}

function createPiece(type, color) {
    return { type, color };
}

function createInitialBoard() {
    const board = createEmptyBoard();
    const backRank = [
        PIECE_TYPES.ROOK,
        PIECE_TYPES.KNIGHT,
        PIECE_TYPES.BISHOP,
        PIECE_TYPES.QUEEN,
        PIECE_TYPES.KING,
        PIECE_TYPES.BISHOP,
        PIECE_TYPES.KNIGHT,
        PIECE_TYPES.ROOK,
    ];
    for (let col = 0; col < BOARD_SIZE; col += 1) {
        board[0][col] = createPiece(backRank[col], BLACK);
        board[1][col] = createPiece(PIECE_TYPES.PAWN, BLACK);
        board[BOARD_SIZE - 2][col] = createPiece(PIECE_TYPES.PAWN, WHITE);
        board[BOARD_SIZE - 1][col] = createPiece(backRank[col], WHITE);
    }
    return board;
}

function countPieces(board, color) {
    let count = 0;
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = board[row][col];
            if (piece !== null && piece.color === color) count += 1;
        }
    }
    return count;
}

function switchPlayer(color) {
    return color === WHITE ? BLACK : WHITE;
}

function getPiecesOfColor(board, color) {
    const pieces = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = board[row][col];
            if (piece !== null && piece.color === color) pieces.push({ piece, row, col });
        }
    }
    return pieces;
}

// ===== Movimientos de las piezas =====

const ORTHOGONAL_DIRECTIONS = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
];
const DIAGONAL_DIRECTIONS = [
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 1 },
];
const KNIGHT_OFFSETS = [
    { row: -2, col: -1 },
    { row: -2, col: 1 },
    { row: -1, col: -2 },
    { row: -1, col: 2 },
    { row: 1, col: -2 },
    { row: 1, col: 2 },
    { row: 2, col: -1 },
    { row: 2, col: 1 },
];

const PAWN_START_ROWS = {
    white: 6,
    black: 1,
};
const KING_START_ROWS = {
    white: 7,
    black: 0,
};
const KING_START_COLUMN = 4;

const CASTLING_PATHS = {
    kingSide: {
        rookFromCol: 7,
        rookToCol: 5,
        empty: [5, 6],
        safe: [4, 5, 6],
        kingToCol: 6,
    },
    queenSide: {
        rookFromCol: 0,
        rookToCol: 3,
        empty: [1, 2, 3],
        safe: [2, 3, 4],
        kingToCol: 2,
    },
};

function getSlidingTargets(board, row, col, piece, directions) {
    const targets = [];
    for (const direction of directions) {
        let nextRow = row + direction.row;
        let nextCol = col + direction.col;
        while (isInsideBoard(nextRow, nextCol)) {
            const occupant = board[nextRow][nextCol];
            if (occupant === null) {
                targets.push({ row: nextRow, col: nextCol });
            } else {
                if (occupant.color !== piece.color) {
                    targets.push({ row: nextRow, col: nextCol });
                }
                break;
            }
            nextRow += direction.row;
            nextCol += direction.col;
        }
    }
    return targets;
}

function getPseudoLegalTargets(board, row, col) {
    const piece = board[row][col];
    const enemyColor = piece.color === WHITE ? BLACK : WHITE;

    switch (piece.type) {
        case PIECE_TYPES.PAWN: {
            const targets = [];
            const forward = piece.color === WHITE ? -1 : 1;
            const startRow = PAWN_START_ROWS[piece.color];

            for (const step of [1, 2]) {
                if (step === 2 && row !== startRow) break;
                const nextRow = row + forward * step;
                if (!isInsideBoard(nextRow, col) || board[nextRow][col] !== null) break;
                targets.push({ row: nextRow, col });
            }

            for (const side of [-1, 1]) {
                const nextRow = row + forward;
                const nextCol = col + side;
                if (!isInsideBoard(nextRow, nextCol)) continue;
                const occupant = board[nextRow][nextCol];
                if (occupant !== null && occupant.color === enemyColor) {
                    targets.push({ row: nextRow, col: nextCol });
                }
            }
            return targets;
        }

        case PIECE_TYPES.KNIGHT:
            return KNIGHT_OFFSETS.map((offset) => ({
                row: row + offset.row,
                col: col + offset.col,
            }));

        case PIECE_TYPES.BISHOP:
            return getSlidingTargets(board, row, col, piece, DIAGONAL_DIRECTIONS);

        case PIECE_TYPES.ROOK:
            return getSlidingTargets(board, row, col, piece, ORTHOGONAL_DIRECTIONS);

        case PIECE_TYPES.QUEEN:
            return getSlidingTargets(
                board,
                row,
                col,
                piece,
                DIAGONAL_DIRECTIONS.concat(ORTHOGONAL_DIRECTIONS),
            );

        case PIECE_TYPES.KING: {
            const targets = [];
            for (const diagonal of DIAGONAL_DIRECTIONS) {
                targets.push({ row: row + diagonal.row, col: col + diagonal.col });
            }
            for (const orthogonal of ORTHOGONAL_DIRECTIONS) {
                targets.push({ row: row + orthogonal.row, col: col + orthogonal.col });
            }
            return targets;
        }

        default:
            return [];
    }
}

function isRookOnStartSquare(board, row, col, color) {
    const rook = board[row][col];
    return rook !== null && rook.type === PIECE_TYPES.ROOK && rook.color === color;
}

function isCastlingPathClear(board, color, side) {
    const row = KING_START_ROWS[color];
    const path = CASTLING_PATHS[side];
    if (!isRookOnStartSquare(board, row, path.rookFromCol, color)) return false;
    const king = board[row][KING_START_COLUMN];
    if (king === null || king.type !== PIECE_TYPES.KING || king.color !== color) return false;
    return path.empty.every((col) => board[row][col] === null);
}

function getCastlingSafeColumns(side) {
    return CASTLING_PATHS[side].safe;
}

function getCastlingKingTargetColumn(side) {
    return CASTLING_PATHS[side].kingToCol;
}

function getCastlingRookSquares(side) {
    return { fromCol: CASTLING_PATHS[side].rookFromCol, toCol: CASTLING_PATHS[side].rookToCol };
}

// ===== Detección de jaques y movimientos legales =====

function findKing(board, color) {
    for (const { piece, row, col } of getPiecesOfColor(board, color)) {
        if (piece.type === PIECE_TYPES.KING) return { row, col };
    }
    return null;
}

function isSquareAttacked(board, row, col, byColor) {
    for (const offset of KNIGHT_OFFSETS) {
        const targetRow = row + offset.row;
        const targetCol = col + offset.col;
        if (!isInsideBoard(targetRow, targetCol)) continue;
        const piece = board[targetRow][targetCol];
        if (piece !== null && piece.color === byColor && piece.type === PIECE_TYPES.KNIGHT) {
            return true;
        }
    }

    for (const direction of [...ORTHOGONAL_DIRECTIONS, ...DIAGONAL_DIRECTIONS]) {
        const targetRow = row + direction.row;
        const targetCol = col + direction.col;
        if (!isInsideBoard(targetRow, targetCol)) continue;
        const piece = board[targetRow][targetCol];
        if (piece !== null && piece.color === byColor && piece.type === PIECE_TYPES.KING) {
            return true;
        }
    }

    const pawnRow = byColor === WHITE ? row + 1 : row - 1;
    for (const side of [-1, 1]) {
        const pawnCol = col + side;
        if (!isInsideBoard(pawnRow, pawnCol)) continue;
        const piece = board[pawnRow][pawnCol];
        if (piece !== null && piece.color === byColor && piece.type === PIECE_TYPES.PAWN) {
            return true;
        }
    }

    for (const direction of ORTHOGONAL_DIRECTIONS) {
        let nextRow = row + direction.row;
        let nextCol = col + direction.col;
        while (isInsideBoard(nextRow, nextCol)) {
            const piece = board[nextRow][nextCol];
            if (piece !== null) {
                const isSlider =
                    piece.color === byColor &&
                    (piece.type === PIECE_TYPES.ROOK || piece.type === PIECE_TYPES.QUEEN);
                if (isSlider) return true;
                break;
            }
            nextRow += direction.row;
            nextCol += direction.col;
        }
    }
    for (const direction of DIAGONAL_DIRECTIONS) {
        let nextRow = row + direction.row;
        let nextCol = col + direction.col;
        while (isInsideBoard(nextRow, nextCol)) {
            const piece = board[nextRow][nextCol];
            if (piece !== null) {
                const isSlider =
                    piece.color === byColor &&
                    (piece.type === PIECE_TYPES.BISHOP || piece.type === PIECE_TYPES.QUEEN);
                if (isSlider) return true;
                break;
            }
            nextRow += direction.row;
            nextCol += direction.col;
        }
    }
    return false;
}

function isInCheck(board, color) {
    const king = findKing(board, color);
    if (king === null) return false;
    return isSquareAttacked(board, king.row, king.col, switchPlayer(color));
}

function createBaseMove(from, to, piece) {
    return {
        from,
        to,
        piece: piece.type,
        color: piece.color,
        capturedType: null,
        capturedSquare: null,
        promotion: null,
        isEnPassant: false,
        isCastling: null,
        isDoublePawnPush: false,
    };
}

function getPseudoLegalMoves(board, color) {
    const moves = [];
    for (const { piece, row, col } of getPiecesOfColor(board, color)) {
        const targets = getPseudoLegalTargets(board, row, col);
        for (const target of targets) {
            if (!isInsideBoard(target.row, target.col)) continue;
            const occupant = board[target.row][target.col];
            if (occupant !== null && occupant.color === color) continue;
            const move = createBaseMove({ row, col }, target, piece);
            if (occupant !== null) {
                move.capturedType = occupant.type;
                move.capturedSquare = { row: target.row, col: target.col };
            }
            moves.push(move);
        }
    }
    return moves;
}

function annotateEnPassant(moves, board, color, enPassantTarget) {
    if (enPassantTarget === null) return moves;
    const result = [...moves];
    const capturingRow = enPassantTarget.row + (color === WHITE ? 1 : -1);
    for (const col of [enPassantTarget.col - 1, enPassantTarget.col + 1]) {
        if (!isInsideBoard(capturingRow, col)) continue;
        const piece = board[capturingRow][col];
        if (piece === null || piece.color !== color || piece.type !== PIECE_TYPES.PAWN) continue;
        result.push({
            from: { row: capturingRow, col },
            to: { row: enPassantTarget.row, col: enPassantTarget.col },
            piece: PIECE_TYPES.PAWN,
            color,
            capturedType: PIECE_TYPES.PAWN,
            capturedSquare: { row: capturingRow, col: enPassantTarget.col },
            promotion: null,
            isEnPassant: true,
            isCastling: null,
            isDoublePawnPush: false,
        });
    }
    return result;
}

function annotateCastling(moves, board, color, castlingRights) {
    const result = [...moves];
    const kingRow = KING_START_ROWS[color];
    for (const side of ["kingSide", "queenSide"]) {
        if (!castlingRights[color][side]) continue;
        if (!isCastlingPathClear(board, color, side)) continue;

        const safeColumns = getCastlingSafeColumns(side);
        const allSafe = safeColumns.every(
            (col) => !isSquareAttacked(board, kingRow, col, switchPlayer(color)),
        );
        if (!allSafe) continue;

        result.push({
            from: { row: kingRow, col: KING_START_COLUMN },
            to: { row: kingRow, col: getCastlingKingTargetColumn(side) },
            piece: PIECE_TYPES.KING,
            color,
            capturedType: null,
            capturedSquare: null,
            promotion: null,
            isEnPassant: false,
            isCastling: side,
            isDoublePawnPush: false,
        });
    }
    return result;
}

function moveToNotation(move) {
    const promotionSuffix =
        move.promotion !== null ? `=${move.promotion[0].toUpperCase()}` : "";
    return `${toAlgebraic(move.from.row, move.from.col)}${toAlgebraic(
        move.to.row,
        move.to.col,
    )}${promotionSuffix}`;
}

function moveKey(move) {
    return moveToNotation(move);
}

function filterMovesLeavingKingInCheck(board, color, moves) {
    return moves.filter((move) => !isInCheck(applyMoveToBoard(board, move), color));
}

function expandPromotions(moves, color) {
    const expanded = [];
    for (const move of moves) {
        if (move.piece === PIECE_TYPES.PAWN && move.to.row === PROMOTION_ROW[color]) {
            for (const promotionType of [
                PIECE_TYPES.QUEEN,
                PIECE_TYPES.ROOK,
                PIECE_TYPES.BISHOP,
                PIECE_TYPES.KNIGHT,
            ]) {
                expanded.push({ ...move, promotion: promotionType });
            }
        } else {
            expanded.push(move);
        }
    }
    return expanded;
}

function getLegalMoves(board, color, { castlingRights = null, enPassantTarget = null } = {}) {
    let moves = getPseudoLegalMoves(board, color);
    moves = annotateEnPassant(moves, board, color, enPassantTarget);
    if (castlingRights !== null) {
        moves = annotateCastling(moves, board, color, castlingRights);
    }
    const safeMoves = filterMovesLeavingKingInCheck(board, color, moves);
    return expandPromotions(safeMoves, color);
}

function isLegalMove(state, move) {
    const legal = getLegalMoves(state.board, state.turn, {
        castlingRights: state.castlingRights,
        enPassantTarget: state.enPassantTarget,
    });
    return legal.some((candidate) => moveKey(candidate) === moveKey(move));
}

// ===== Aplicación de movimientos =====

function applyMoveToBoard(board, move) {
    const next = board.map((rowCells) => [...rowCells]);
    const piece = next[move.from.row][move.from.col];
    if (piece === null) {
        throw new Error("There is no piece on the origin square");
    }

    next[move.from.row][move.from.col] = null;
    if (move.capturedSquare !== null) {
        next[move.capturedSquare.row][move.capturedSquare.col] = null;
    }

    next[move.to.row][move.to.col] =
        move.promotion !== null ? { type: move.promotion, color: piece.color } : piece;

    if (move.isCastling !== null) {
        const row = KING_START_ROWS[move.color];
        const { fromCol, toCol } = getCastlingRookSquares(move.isCastling);
        next[row][toCol] = next[row][fromCol];
        next[row][fromCol] = null;
    }
    return next;
}

// ===== Fin de partida =====

function hasInsufficientMaterial(board) {
    let minors = 0;
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = board[row][col];
            if (piece === null || piece.type === PIECE_TYPES.KING) continue;
            if (
                piece.type === PIECE_TYPES.PAWN ||
                piece.type === PIECE_TYPES.ROOK ||
                piece.type === PIECE_TYPES.QUEEN
            ) {
                return false;
            }
            minors += 1;
        }
    }
    return minors <= 1;
}

// ===== Estado de la partida =====

const PIECE_LETTERS = {
    [PIECE_TYPES.PAWN]: "p",
    [PIECE_TYPES.KNIGHT]: "n",
    [PIECE_TYPES.BISHOP]: "b",
    [PIECE_TYPES.ROOK]: "r",
    [PIECE_TYPES.QUEEN]: "q",
    [PIECE_TYPES.KING]: "k",
};

function positionKey(board, turn) {
    const rows = board
        .map((row) =>
            row
                .map((piece) => {
                    if (piece === null) return ".";
                    const letter = PIECE_LETTERS[piece.type];
                    return piece.color === WHITE ? letter.toUpperCase() : letter;
                })
                .join(""),
        )
        .join("/");
    return `${rows}|${turn}`;
}

function createInitialCastlingRights() {
    return {
        [WHITE]: { kingSide: true, queenSide: true },
        [BLACK]: { kingSide: true, queenSide: true },
    };
}

function createInitialPositionCounts(board, turn) {
    return { [positionKey(board, turn)]: 1 };
}

function createGame() {
    const board = createInitialBoard();
    return {
        board,
        turn: WHITE,
        castlingRights: createInitialCastlingRights(),
        enPassantTarget: null,
        halfmoveClock: 0,
        fullmoveNumber: 1,
        positionCounts: createInitialPositionCounts(board, WHITE),
        history: [],
        capturedPieces: [],
        undoUsed: false,
        lastMove: null,
        over: false,
        winner: null,
        endReason: null,
    };
}

function isRookLeavingHomeSquare(move, row) {
    return move.piece === PIECE_TYPES.ROOK && move.from.row === row;
}

function updateCastlingRights(castlingRights, move) {
    const next = {
        [WHITE]: { ...castlingRights[WHITE] },
        [BLACK]: { ...castlingRights[BLACK] },
    };

    if (move.piece === PIECE_TYPES.KING) {
        next[move.color] = { kingSide: false, queenSide: false };
    }

    const ownKingRow = KING_START_ROWS[move.color];
    if (isRookLeavingHomeSquare(move, ownKingRow)) {
        if (move.from.col === 0) next[move.color].queenSide = false;
        if (move.from.col === 7) next[move.color].kingSide = false;
    }

    if (move.capturedType === PIECE_TYPES.ROOK && move.capturedSquare !== null) {
        const rivalColor = switchPlayer(move.color);
        const rivalKingRow = KING_START_ROWS[rivalColor];
        if (move.capturedSquare.row === rivalKingRow) {
            if (move.capturedSquare.col === 0) next[rivalColor].queenSide = false;
            if (move.capturedSquare.col === 7) next[rivalColor].kingSide = false;
        }
    }
    return next;
}

function detectGameEnd(game) {
    const moves = getLegalMoves(game.board, game.turn, {
        castlingRights: game.castlingRights,
        enPassantTarget: game.enPassantTarget,
    });

    if (moves.length === 0) {
        if (isInCheck(game.board, game.turn)) {
            return { winner: switchPlayer(game.turn), reason: GAME_END_REASONS.CHECKMATE };
        }
        return { winner: null, reason: GAME_END_REASONS.STALEMATE };
    }

    if (hasInsufficientMaterial(game.board)) {
        return { winner: null, reason: GAME_END_REASONS.INSUFFICIENT_MATERIAL };
    }
    if (game.halfmoveClock >= FIFTY_MOVE_LIMIT) {
        return { winner: null, reason: GAME_END_REASONS.FIFTY_MOVE_RULE };
    }
    if (game.positionCounts[positionKey(game.board, game.turn)] >= REPETITION_LIMIT) {
        return { winner: null, reason: GAME_END_REASONS.THREEFOLD_REPETITION };
    }
    return null;
}

function applyMove(game, move) {
    if (game.over) throw new Error("The game has already ended");
    if (!isLegalMove(game, move)) throw new Error("Invalid move");

    const isDoublePawnPush =
        move.piece === PIECE_TYPES.PAWN && Math.abs(move.to.row - move.from.row) === 2;
    const enrichedMove = { ...move, isDoublePawnPush };

    const nextBoard = applyMoveToBoard(game.board, enrichedMove);
    const nextTurn = switchPlayer(game.turn);

    const enPassantTarget = isDoublePawnPush
        ? { row: (move.from.row + move.to.row) / 2, col: move.to.col }
        : null;

    const resetsClock = move.capturedType !== null || move.piece === PIECE_TYPES.PAWN;
    const halfmoveClock = resetsClock ? 0 : game.halfmoveClock + 1;

    const fullmoveNumber =
        game.turn === BLACK ? game.fullmoveNumber + 1 : game.fullmoveNumber;

    const lastMove = {
        from: move.from,
        to: move.to,
        piece: move.piece,
        color: move.color,
        notation: moveToNotation(move),
        isCapture: move.capturedType !== null,
        isEnPassant: move.isEnPassant,
        isCastling: move.isCastling,
    };

    const capturedPiece =
        move.capturedType === null
            ? null
            : { type: move.capturedType, color: switchPlayer(move.color) };
    const capturedPieces =
        capturedPiece === null ? game.capturedPieces : [...game.capturedPieces, capturedPiece];

    const history = [
        ...game.history,
        {
            board: game.board,
            turn: game.turn,
            castlingRights: game.castlingRights,
            enPassantTarget: game.enPassantTarget,
            halfmoveClock: game.halfmoveClock,
            fullmoveNumber: game.fullmoveNumber,
            positionCounts: game.positionCounts,
            capturedPieces: game.capturedPieces,
            lastMove: game.lastMove,
        },
    ];

    const positionCounts = { ...game.positionCounts };
    const nextKey = positionKey(nextBoard, nextTurn);
    positionCounts[nextKey] = (positionCounts[nextKey] ?? 0) + 1;

    const next = {
        board: nextBoard,
        turn: nextTurn,
        castlingRights: updateCastlingRights(game.castlingRights, move),
        enPassantTarget,
        halfmoveClock,
        fullmoveNumber,
        positionCounts,
        history,
        capturedPieces,
        undoUsed: game.undoUsed,
        lastMove,
        over: false,
        winner: null,
        endReason: null,
    };

    const end = detectGameEnd(next);
    if (end !== null) {
        next.over = true;
        next.winner = end.winner;
        next.endReason = end.reason;
    }
    return next;
}

function undoMove(game, plies = 1) {
    if (game.undoUsed || game.history.length === 0) return game;
    const count = Math.min(plies, game.history.length);
    const previous = game.history[game.history.length - count];
    return {
        board: previous.board,
        turn: previous.turn,
        castlingRights: previous.castlingRights,
        enPassantTarget: previous.enPassantTarget,
        halfmoveClock: previous.halfmoveClock,
        fullmoveNumber: previous.fullmoveNumber,
        positionCounts: previous.positionCounts,
        capturedPieces: previous.capturedPieces,
        lastMove: previous.lastMove,
        history: game.history.slice(0, -count),
        undoUsed: true,
        over: false,
        winner: null,
        endReason: null,
    };
}

// ===== Evaluación del bot =====

const PAWN_ADVANCE_BONUS = 8;

const CENTER_BONUS = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 4, 4, 2, 1, 0],
    [0, 1, 2, 4, 4, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

const PAWN_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [60, 60, 60, 60, 60, 60, 60, 60],
    [20, 22, 25, 30, 30, 25, 22, 20],
    [8, 10, 14, 24, 24, 14, 10, 8],
    [4, 6, 10, 20, 20, 10, 6, 4],
    [2, 2, 4, 8, 8, 4, 2, 2],
    [0, 0, 0, -4, -4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
    [-40, -30, -20, -20, -20, -20, -30, -40],
    [-30, -10, 0, 4, 4, 0, -10, -30],
    [-20, 0, 12, 16, 16, 12, 0, -20],
    [-20, 4, 16, 20, 20, 16, 4, -20],
    [-20, 0, 16, 20, 20, 16, 0, -20],
    [-20, 4, 12, 16, 16, 12, 4, -20],
    [-30, -10, 0, 4, 4, 0, -10, -30],
    [-40, -30, -20, -20, -20, -20, -30, -40],
];

const BISHOP_TABLE = [
    [-14, -8, -8, -8, -8, -8, -8, -14],
    [-8, 0, 0, 0, 0, 0, 0, -8],
    [-8, 0, 6, 10, 10, 6, 0, -8],
    [-8, 6, 6, 10, 10, 6, 6, -8],
    [-8, 0, 10, 10, 10, 10, 0, -8],
    [-8, 10, 10, 10, 10, 10, 10, -8],
    [-8, 6, 0, 0, 0, 0, 6, -8],
    [-14, -8, -8, -8, -8, -8, -8, -14],
];

const KING_TABLE = [
    [-40, -40, -40, -40, -40, -40, -40, -40],
    [-40, -40, -40, -40, -40, -40, -40, -40],
    [-40, -40, -40, -40, -40, -40, -40, -40],
    [-40, -40, -40, -40, -40, -40, -40, -40],
    [-30, -30, -30, -30, -30, -30, -30, -30],
    [-20, -20, -20, -20, -20, -20, -20, -20],
    [10, 10, 0, 0, 0, 0, 10, 10],
    [20, 30, 10, 0, 0, 10, 30, 20],
];

const PIECE_TABLES = {
    [PIECE_TYPES.PAWN]: PAWN_TABLE,
    [PIECE_TYPES.KNIGHT]: KNIGHT_TABLE,
    [PIECE_TYPES.BISHOP]: BISHOP_TABLE,
    [PIECE_TYPES.QUEEN]: CENTER_BONUS,
    [PIECE_TYPES.ROOK]: CENTER_BONUS,
    [PIECE_TYPES.KING]: KING_TABLE,
};

function getPositionalBonus(piece, row, col) {
    const table = PIECE_TABLES[piece.type];
    if (table === undefined) return 0;
    const pieceRow = piece.color === WHITE ? row : 7 - row;
    return table[pieceRow][col];
}

function evaluateSide(board, color) {
    let score = 0;
    for (const { piece, row, col } of getPiecesOfColor(board, color)) {
        score += PIECE_VALUES[piece.type];
        score += getPositionalBonus(piece, row, col);
        if (piece.type === PIECE_TYPES.PAWN) {
            const advance = piece.color === WHITE ? 6 - row : row - 1;
            score += advance * PAWN_ADVANCE_BONUS;
        }
    }
    return score;
}

function evaluateBoard(board, color) {
    const rival = color === WHITE ? BLACK : WHITE;
    return evaluateSide(board, color) - evaluateSide(board, rival);
}

// ===== Bot negamax con poda alfa-beta =====

function createSearchState(game) {
    return {
        board: game.board,
        turn: game.turn,
        castlingRights: game.castlingRights,
        enPassantTarget: game.enPassantTarget,
    };
}

function applyToSearchState(state, move) {
    const isDoublePawnPush =
        move.piece === PIECE_TYPES.PAWN && Math.abs(move.to.row - move.from.row) === 2;
    return {
        board: applyMoveToBoard(state.board, move),
        turn: switchPlayer(state.turn),
        castlingRights: updateCastlingRights(state.castlingRights, move),
        enPassantTarget: isDoublePawnPush
            ? { row: (move.from.row + move.to.row) / 2, col: move.to.col }
            : null,
    };
}

function getMovesForState(state) {
    return getLegalMoves(state.board, state.turn, {
        castlingRights: state.castlingRights,
        enPassantTarget: state.enPassantTarget,
    });
}

function orderMoves(moves) {
    return [...moves].sort((a, b) => {
        const captureScore = (move) =>
            move.capturedType === null ? 0 : PIECE_VALUES[move.capturedType];
        return captureScore(b) - captureScore(a);
    });
}

function search(state, depth, alpha, beta) {
    const moves = getMovesForState(state);

    if (moves.length === 0) {
        return isInCheck(state.board, state.turn) ? -WIN_SCORE : 0;
    }

    if (depth === 0) {
        return evaluateBoard(state.board, state.turn);
    }

    let best = -Infinity;
    for (const move of orderMoves(moves)) {
        const score = -search(applyToSearchState(state, move), depth - 1, -beta, -alpha);
        best = Math.max(best, score);
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
    }
    return best;
}

function pickGreedyMove(moves, board, color, random) {
    const scored = moves.map((move) => ({
        move,
        score: evaluateBoard(applyMoveToBoard(board, move), color),
    }));
    const bestScore = Math.max(...scored.map((entry) => entry.score));
    const bestMoves = scored.filter((entry) => entry.score === bestScore).map((e) => e.move);
    if (random() < 0.7) {
        return bestMoves[Math.floor(random() * bestMoves.length)];
    }
    return moves[Math.floor(random() * moves.length)];
}

function chooseMove(game, difficulty, random = Math.random) {
    const moves = getMovesForState(createSearchState(game));
    if (moves.length === 0) return null;

    const depth = DIFFICULTY_DEPTHS[difficulty];
    if (depth <= 1) {
        return pickGreedyMove(moves, game.board, game.turn, random);
    }

    let bestScore = -Infinity;
    let bestMoves = [];
    for (const move of orderMoves(moves)) {
        const score = -search(
            applyToSearchState(createSearchState(game), move),
            depth - 1,
            -Infinity,
            Infinity,
        );
        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        } else if (score === bestScore) {
            bestMoves.push(move);
        }
    }
    return bestMoves[Math.floor(random() * bestMoves.length)];
}

// ===== Interfaz =====

const app = document.querySelector("#app");
const icon = (name, extra = "") =>
    `<span class="material-symbols-rounded ${extra}" aria-hidden="true">${name}</span>`;
const button = (text, iconName, variant = "primary", action = "") =>
    `<button type="button" class="button button--${variant}"${
        action ? ` data-action="${action}"` : ""
    }>${iconName ? icon(iconName) : ""}${text}</button>`;

const MODES = [
    {
        id: "bot",
        label: "Jugar vs Bot",
        description: "Enfréntate al bot en el tablero",
        icon: "smart_toy",
    },
    {
        id: "local",
        label: "2 Jugadores",
        description: "Comparte el tablero con otra persona",
        icon: "group",
    },
];

let screen = "home";
let selectedMode = null;
let difficulty = DEFAULT_DIFFICULTY;
let mode = "bot";
let game = createGame();
let selection = null;
let botTimer = null;
let currentMoves = [];
let currentDisabled = false;

function isLightSquare(row, col) {
    return (row + col) % 2 === 1;
}

function pieceMarkup(type, color, extra = "") {
    const classes = ["piece", `piece--${color}`, extra].filter(Boolean).join(" ");
    return `<span class="${classes}" aria-hidden="true">${PIECE_GLYPHS[color][type]}</span>`;
}

function sortCapturedPieces(pieces) {
    return [...pieces].sort((a, b) => PIECE_VALUES[b.type] - PIECE_VALUES[a.type]);
}

function squareLabel(row, col, piece) {
    const coordinates = toAlgebraic(row, col);
    if (piece === null) return coordinates;
    const colorName = piece.color === WHITE ? "blanco" : "negro";
    return `${coordinates}, ${PIECE_NAMES[piece.type]} ${colorName}`;
}

function endReasonText(reason) {
    switch (reason) {
        case GAME_END_REASONS.CHECKMATE:
            return "Jaque mate";
        case GAME_END_REASONS.STALEMATE:
            return "Ahogado: no hay movimientos legales";
        case GAME_END_REASONS.INSUFFICIENT_MATERIAL:
            return "Material insuficiente para dar mate";
        case GAME_END_REASONS.FIFTY_MOVE_RULE:
            return "Regla de los 50 movimientos";
        case GAME_END_REASONS.THREEFOLD_REPETITION:
            return "Repetición de posición";
        default:
            return "";
    }
}

function playerNames() {
    return mode === "bot"
        ? { player1Name: "TÚ", player2Name: "BOT" }
        : { player1Name: "Jugador 1", player2Name: "Jugador 2" };
}

function resultTitle() {
    const { player1Name, player2Name } = playerNames();
    const winnerName =
        game.winner === WHITE ? player1Name : game.winner === BLACK ? player2Name : null;
    if (mode === "bot") {
        return game.winner === WHITE ? "¡Ganaste!" : "¡El bot ganó!";
    }
    return winnerName !== null ? `¡${winnerName} gana!` : "¡Tablas!";
}

function scoreboardMarkup() {
    const { player1Name, player2Name } = playerNames();
    const player1Active = game.turn === WHITE;
    const player2Active = game.turn === BLACK;
    const badge = mode === "bot" ? DIFFICULTY_LABELS[difficulty] : "2 JUGADORES";
    const player1Pieces = countPieces(game.board, WHITE);
    const player2Pieces = countPieces(game.board, BLACK);
    return `<section class="scoreboard" aria-label="Marcador de la partida">
        <div class="scoreboard__top-row"><span class="scoreboard__badge">${badge}</span></div>
        <div class="scoreboard__names">
            <span class="scoreboard__name${player1Active ? " scoreboard__name--active" : ""}">${player1Name}</span>
            <span class="scoreboard__name${player2Active ? " scoreboard__name--active" : ""}">${player2Name}</span>
        </div>
        <div class="scoreboard__counts">
            <span class="scoreboard__count${player1Active ? " scoreboard__count--active" : ""}">${player1Pieces}</span>
            <span class="scoreboard__vs">vs</span>
            <span class="scoreboard__count${player2Active ? " scoreboard__count--active" : ""}">${player2Pieces}</span>
        </div>
    </section>`;
}

function capturedPiecesMarkup(pieces, ownerName) {
    if (pieces.length === 0) return "";
    const ordered = sortCapturedPieces(pieces);
    const summary = ordered.map((piece) => PIECE_NAMES[piece.type]).join(", ");
    return `<div class="captured-pieces" role="region" aria-label="Piezas capturadas por ${ownerName}: ${summary}">
        ${ordered
            .map((piece) => pieceMarkup(piece.type, piece.color, "captured-pieces__item"))
            .join("")}
    </div>`;
}

function boardMarkup() {
    const activeSelection =
        selection !== null &&
        game.board[selection.row]?.[selection.col] !== null &&
        game.board[selection.row][selection.col].color === game.turn
            ? selection
            : null;

    const targetKeys = new Set();
    const captureKeys = new Set();
    if (activeSelection !== null) {
        for (const move of currentMoves) {
            if (move.from.row !== activeSelection.row || move.from.col !== activeSelection.col) {
                continue;
            }
            const key = `${move.to.row},${move.to.col}`;
            targetKeys.add(key);
            if (move.capturedType !== null) captureKeys.add(key);
        }
    }

    const checkSquare = currentDisabled
        ? null
        : isInCheck(game.board, game.turn)
          ? findKing(game.board, game.turn)
          : null;
    const checkKey = checkSquare !== null ? `${checkSquare.row},${checkSquare.col}` : null;

    const squares = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = game.board[row][col];
            const key = `${row},${col}`;
            const selected =
                activeSelection !== null &&
                activeSelection.row === row &&
                activeSelection.col === col;
            const isTarget = targetKeys.has(key);
            const isCapture = captureKeys.has(key);
            const isLastMove =
                game.lastMove !== null &&
                ((game.lastMove.from.row === row && game.lastMove.from.col === col) ||
                    (game.lastMove.to.row === row && game.lastMove.to.col === col));
            const isCheck = checkKey === key;

            const markers = [];
            if (isLastMove) {
                markers.push('<span class="board__marker board__marker--last-move"></span>');
            }
            if (isCheck) {
                markers.push('<span class="board__marker board__marker--check"></span>');
            }
            if (selected) {
                markers.push('<span class="board__marker board__marker--selection"></span>');
            }

            const className = `board__square ${
                isLightSquare(row, col) ? "board__square--light" : "board__square--dark"
            }`;

            squares.push(`<button type="button" class="${className}" data-row="${row}" data-col="${col}"${
                currentDisabled ? " disabled" : ""
            } aria-label="${squareLabel(row, col, piece)}" aria-pressed="${selected}">
                ${markers.join("")}
                ${piece !== null ? pieceMarkup(piece.type, piece.color) : ""}
                ${
                    isTarget
                        ? `<span class="board__marker board__marker--target ${
                              isCapture ? "board__marker--capture" : "board__marker--dot"
                          }" aria-hidden="true"></span>`
                        : ""
                }
            </button>`);
        }
    }

    return `<div class="chessboard" role="grid" aria-label="Tablero de ajedrez">${squares.join("")}</div>`;
}

function renderHome() {
    app.innerHTML = `<div class="app"><div class="home">
        <header class="home__header">
            ${icon("sports_esports")}
            <h1 class="home__title">Ajedrez</h1>
            <p class="home__subtitle">Elige cómo quieres jugar</p>
        </header>
        <div class="home__modes">
            ${MODES.map(
                (item) =>
                    `<button type="button" class="home__mode${
                        selectedMode === item.id ? " home__mode--selected" : ""
                    }" data-mode="${item.id}" aria-pressed="${selectedMode === item.id}">
                        ${icon(item.icon)}
                        <span class="home__mode-label">${item.label}</span>
                        <span class="home__mode-description">${item.description}</span>
                    </button>`,
            ).join("")}
        </div>
        ${
            selectedMode === "bot"
                ? `<div class="home__difficulty" role="group" aria-label="Dificultad del bot">
                    ${DIFFICULTIES.map(
                        (level) =>
                            `<button type="button" class="home__difficulty-option${
                                difficulty === level ? " home__difficulty-option--active" : ""
                            }" data-difficulty="${level}" aria-pressed="${difficulty === level}">${
                                DIFFICULTY_LABELS[level]
                            }</button>`,
                    ).join("")}
                </div>`
                : ""
        }
        <button type="button" class="button button--primary" data-action="start" ${
            selectedMode === null ? "disabled" : ""
        }>${icon("play_arrow")}Jugar</button>
    </div></div>`;

    app.querySelectorAll("[data-mode]").forEach((element) =>
        element.addEventListener("click", () => {
            selectedMode = element.dataset.mode;
            renderHome();
        }),
    );
    app.querySelectorAll("[data-difficulty]").forEach((element) =>
        element.addEventListener("click", () => {
            difficulty = element.dataset.difficulty;
            renderHome();
        }),
    );
    app.querySelector('[data-action="start"]').addEventListener("click", startGame);
}

function renderGame() {
    const { player1Name, player2Name } = playerNames();
    const botTurn = mode === "bot" && game.turn === BLACK && !game.over;
    const disabled = game.over || botTurn;
    currentMoves = disabled
        ? []
        : getLegalMoves(game.board, game.turn, {
              castlingRights: game.castlingRights,
              enPassantTarget: game.enPassantTarget,
          });
    currentDisabled = disabled;

    const player1Captures = game.capturedPieces.filter((piece) => piece.color === BLACK);
    const player2Captures = game.capturedPieces.filter((piece) => piece.color === WHITE);
    const undoDisabled =
        botTurn || game.undoUsed || game.history.length === 0 || game.over;
    const status = botTurn ? "El bot está pensando…" : null;

    app.innerHTML = `<div class="app"><div class="game-screen">
        <div class="game-screen__score">${scoreboardMarkup()}</div>
        <div class="game-screen__side game-screen__side--left">${capturedPiecesMarkup(
            player1Captures,
            player1Name,
        )}</div>
        <div class="game-screen__board">${boardMarkup()}</div>
        <div class="game-screen__side game-screen__side--right">${capturedPiecesMarkup(
            player2Captures,
            player2Name,
        )}</div>
        <div class="game-screen__controls">
            ${status !== null ? `<p class="game-screen__status" role="status">${status}</p>` : ""}
            <div class="game-screen__actions">
                ${button("Deshacer", "undo", "secondary", "undo")}
                ${button("Reiniciar", "restart_alt", "secondary", "restart")}
                ${button("Menú", "arrow_back", "secondary", "menu")}
            </div>
        </div>
        ${
            game.over
                ? `<div class="game-over" role="dialog" aria-modal="true" aria-label="Fin de partida">
                    <div class="game-over__card">
                        ${icon("emoji_events")}
                        <h2 class="game-over__title">${resultTitle()}</h2>
                        ${
                            endReasonText(game.endReason) !== ""
                                ? `<p class="game-over__subtitle">${endReasonText(game.endReason)}</p>`
                                : ""
                        }
                        <div class="game-over__actions">
                            ${button("Jugar de nuevo", "restart_alt", "primary", "restart")}
                            ${button("Volver al menú", "", "secondary", "menu")}
                        </div>
                    </div>
                </div>`
                : ""
        }
    </div></div>`;

    app.querySelectorAll("[data-row]").forEach((element) =>
        element.addEventListener("click", () =>
            handleSquareClick(Number(element.dataset.row), Number(element.dataset.col)),
        ),
    );
    const undoButton = app.querySelector('[data-action="undo"]');
    undoButton.disabled = undoDisabled;
    undoButton.addEventListener("click", undo);
    app.querySelectorAll('[data-action="restart"]').forEach((element) =>
        element.addEventListener("click", restartGame),
    );
    app.querySelectorAll('[data-action="menu"]').forEach((element) =>
        element.addEventListener("click", goHome),
    );
}

function render() {
    if (screen === "home") renderHome();
    else renderGame();
}

function handleSquareClick(row, col) {
    if (currentDisabled) return;
    const piece = game.board[row][col];

    if (selection !== null) {
        const move = currentMoves.find(
            (candidate) =>
                candidate.from.row === selection.row &&
                candidate.from.col === selection.col &&
                candidate.to.row === row &&
                candidate.to.col === col,
        );
        if (move !== undefined) {
            game = applyMove(game, move);
            selection = null;
            renderGame();
            scheduleBot();
            return;
        }
    }

    selection = piece !== null && piece.color === game.turn ? { row, col } : null;
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

function clearBotTimer() {
    if (botTimer !== null) {
        clearTimeout(botTimer);
        botTimer = null;
    }
}

function scheduleBot() {
    clearBotTimer();
    if (screen !== "game" || mode !== "bot" || game.turn !== BLACK || game.over) return;
    botTimer = setTimeout(() => {
        botTimer = null;
        const move = chooseMove(game, difficulty);
        if (move === null) return;
        game = applyMove(game, move);
        selection = null;
        renderGame();
        scheduleBot();
    }, BOT_DELAY_MS);
}

function undo() {
    if (mode === "bot" && game.turn === BLACK && !game.over) return;
    if (game.undoUsed || game.history.length === 0) return;
    const plies = mode === "bot" ? Math.min(2, game.history.length) : 1;
    game = undoMove(game, plies);
    selection = null;
    clearBotTimer();
    renderGame();
    scheduleBot();
}

function restartGame() {
    clearBotTimer();
    game = createGame();
    selection = null;
    renderGame();
    scheduleBot();
}

function goHome() {
    clearBotTimer();
    game = createGame();
    selection = null;
    screen = "home";
    selectedMode = null;
    difficulty = DEFAULT_DIFFICULTY;
    render();
}

render();
