"use strict";

const BOARD_SIZE = 13;
const BLACK_CELL_COUNT = 25;
const MAX_WHITE_SEQUENCE = 10;
const MAX_GENERATION_ATTEMPTS = 20000;
const PATTERN_COUNT = 100;
const BLACK_CELL = "#";
const WHITE_CELL = "";
const CENTER_INDEX = Math.floor(BOARD_SIZE / 2);
const MIRRORED_PAIRS = (BLACK_CELL_COUNT - 1) / 2;

const generateButton = document.getElementById("generate-button");
const statusMessage = document.getElementById("status-message");

function buildHalfPositions() {
    const positions = [];

    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let column = 0; column < BOARD_SIZE; column += 1) {
            if (row < CENTER_INDEX || (row === CENTER_INDEX && column < CENTER_INDEX)) {
                positions.push({ row, column });
            }
        }
    }

    return positions;
}

const HALF_POSITIONS = buildHalfPositions();

function getMirrorPosition(row, column) {
    return {
        row: BOARD_SIZE - row - 1,
        column: BOARD_SIZE - column - 1,
    };
}

function markMirroredCells(board, row, column) {
    const mirror = getMirrorPosition(row, column);

    board[row][column] = BLACK_CELL;
    board[mirror.row][mirror.column] = BLACK_CELL;
}

function clearMirroredCells(board, row, column) {
    const mirror = getMirrorPosition(row, column);

    board[row][column] = WHITE_CELL;
    board[mirror.row][mirror.column] = WHITE_CELL;
}

function countBlackCells(board) {
    return board.reduce(
        (total, row) => total + row.filter((cell) => cell === BLACK_CELL).length,
        0
    );
}

function shuffle(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
}

function hasInvalidRun(board, isInvalidLength) {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
        let runLength = 0;

        for (let column = 0; column < BOARD_SIZE; column += 1) {
            if (board[row][column] === BLACK_CELL) {
                if (isInvalidLength(runLength)) return true;
                runLength = 0;
            } else {
                runLength += 1;
            }
        }

        if (isInvalidLength(runLength)) return true;
    }

    for (let column = 0; column < BOARD_SIZE; column += 1) {
        let runLength = 0;

        for (let row = 0; row < BOARD_SIZE; row += 1) {
            if (board[row][column] === BLACK_CELL) {
                if (isInvalidLength(runLength)) return true;
                runLength = 0;
            } else {
                runLength += 1;
            }
        }

        if (isInvalidLength(runLength)) return true;
    }

    return false;
}

function hasSingleCellSequence(board) {
    return hasInvalidRun(board, (length) => length === 1);
}

function hasLongSequence(board) {
    return hasInvalidRun(board, (length) => length > MAX_WHITE_SEQUENCE);
}

function hasConnectedWhiteCells(board) {
    const totalWhiteCells = BOARD_SIZE * BOARD_SIZE - countBlackCells(board);

    if (totalWhiteCells === 0) return true;

    const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    let start = null;
    for (let row = 0; row < BOARD_SIZE && !start; row += 1) {
        for (let column = 0; column < BOARD_SIZE; column += 1) {
            if (board[row][column] !== BLACK_CELL) {
                start = { row, column };
                break;
            }
        }
    }

    const queue = [start];
    visited[start.row][start.column] = true;
    let head = 0;
    let visitedWhiteCells = 0;

    while (head < queue.length) {
        const { row, column } = queue[head];
        head += 1;
        visitedWhiteCells += 1;

        for (const [rowOffset, columnOffset] of directions) {
            const nextRow = row + rowOffset;
            const nextColumn = column + columnOffset;

            if (
                nextRow >= 0 &&
                nextRow < BOARD_SIZE &&
                nextColumn >= 0 &&
                nextColumn < BOARD_SIZE &&
                !visited[nextRow][nextColumn] &&
                board[nextRow][nextColumn] !== BLACK_CELL
            ) {
                visited[nextRow][nextColumn] = true;
                queue.push({ row: nextRow, column: nextColumn });
            }
        }
    }

    return visitedWhiteCells === totalWhiteCells;
}

function createEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(WHITE_CELL));
}

function generatePattern() {
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
        const board = createEmptyBoard();
        board[CENTER_INDEX][CENTER_INDEX] = BLACK_CELL;
        let placedPairs = 0;

        for (const { row, column } of shuffle(HALF_POSITIONS)) {
            markMirroredCells(board, row, column);

            if (hasSingleCellSequence(board)) {
                clearMirroredCells(board, row, column);
                continue;
            }

            placedPairs += 1;
            if (placedPairs === MIRRORED_PAIRS) break;
        }

        if (placedPairs !== MIRRORED_PAIRS) continue;
        if (countBlackCells(board) !== BLACK_CELL_COUNT) continue;
        if (hasLongSequence(board)) continue;
        if (!hasConnectedWhiteCells(board)) continue;

        return board;
    }

    return null;
}

function getBoardSignature(board) {
    return board.map((row) => row.join("")).join("|");
}

async function generateAndDownload() {
    statusMessage.textContent = "Generando patrones, espera por favor...";
    generateButton.disabled = true;

    try {
        const patterns = [];
        const signatures = new Set();

        while (patterns.length < PATTERN_COUNT) {
            await new Promise((resolve) => setTimeout(resolve, 0));

            const board = generatePattern();
            if (!board) {
                throw new Error("No se pudo generar un patrón válido.");
            }

            const signature = getBoardSignature(board);
            if (signatures.has(signature)) continue;

            signatures.add(signature);
            patterns.push({ id: patterns.length + 1, board });
        }

        const jsonText = JSON.stringify(patterns, null, 4);
        const blob = new Blob([jsonText], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = "crosswords.json";
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        statusMessage.textContent = `Descarga completada. Generados ${patterns.length} patrones.`;
    } catch (error) {
        console.error(error);
        statusMessage.textContent = "No se pudieron generar los patrones. Inténtalo de nuevo.";
    } finally {
        generateButton.disabled = false;
    }
}

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

generateButton.addEventListener("click", generateAndDownload);
