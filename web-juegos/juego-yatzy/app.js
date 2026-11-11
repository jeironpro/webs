// Yatzy — cinco dados, tres lanzamientos, scorecard completo y bot sin React.
const PLAYER_1 = 'player1';
const PLAYER_2 = 'player2';
const DICE_COUNT = 5;
const DIE_FACES = [1, 2, 3, 4, 5, 6];
const MAX_ROLLS = 3;
const BONUS_THRESHOLD = 63;
const BONUS_SCORE = 35;
const FULL_HOUSE_SCORE = 25;
const SMALL_STRAIGHT_SCORE = 30;
const LARGE_STRAIGHT_SCORE = 40;
const YATZY_SCORE = 50;
const CATEGORY_ONES = 'ones';
const CATEGORY_TWOS = 'twos';
const CATEGORY_THREES = 'threes';
const CATEGORY_FOURS = 'fours';
const CATEGORY_FIVES = 'fives';
const CATEGORY_SIXES = 'sixes';
const CATEGORY_THREE_OF_A_KIND = 'threeOfAKind';
const CATEGORY_FOUR_OF_A_KIND = 'fourOfAKind';
const CATEGORY_FULL_HOUSE = 'fullHouse';
const CATEGORY_SMALL_STRAIGHT = 'smallStraight';
const CATEGORY_LARGE_STRAIGHT = 'largeStraight';
const CATEGORY_YATZY = 'yatzy';
const CATEGORY_CHANCE = 'chance';
const UPPER_CATEGORIES = [CATEGORY_ONES, CATEGORY_TWOS, CATEGORY_THREES, CATEGORY_FOURS, CATEGORY_FIVES, CATEGORY_SIXES];
const LOWER_CATEGORIES = [CATEGORY_THREE_OF_A_KIND, CATEGORY_FOUR_OF_A_KIND, CATEGORY_FULL_HOUSE, CATEGORY_SMALL_STRAIGHT, CATEGORY_LARGE_STRAIGHT, CATEGORY_YATZY, CATEGORY_CHANCE];
const ALL_CATEGORIES = [...UPPER_CATEGORIES, ...LOWER_CATEGORIES];
const SMALL_STRAIGHT_SEQUENCES = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
const LARGE_STRAIGHT_SEQUENCES = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFFICULTY_LABELS = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' };
const DEFAULT_DIFFICULTY = 'hard';
const BOT_STEP_DELAY_MS = 1100;
const FACE_FOR_CATEGORY = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 };
const FACE_PIPS = { 1: [4], 2: [2, 6], 3: [2, 4, 6], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
const ZERO_PRIORITY = [CATEGORY_YATZY, CATEGORY_LARGE_STRAIGHT, CATEGORY_FULL_HOUSE, CATEGORY_SMALL_STRAIGHT, CATEGORY_FOUR_OF_A_KIND, CATEGORY_THREE_OF_A_KIND, CATEGORY_CHANCE, ...UPPER_CATEGORIES];

const app = document.querySelector('#app');
let screen = 'home';
let selectedMode = null;
let mode = 'local';
let difficulty = DEFAULT_DIFFICULTY;
let game = createGame();
let botTimer = null;

function crear(etiqueta, propiedades = {}, hijos = []) {
    const nodo = document.createElement(etiqueta);

    Object.entries(propiedades).forEach(([clave, valor]) => {
        if (valor === undefined || valor === null || valor === false) return;
        if (clave === 'clase') nodo.className = valor;
        else if (clave === 'texto') nodo.textContent = valor;
        else if (clave === 'estilo') nodo.setAttribute('style', valor);
        else nodo.setAttribute(clave, valor === true ? '' : String(valor));
    });

    [].concat(hijos).forEach((hijo) => {
        if (hijo === null || hijo === undefined || hijo === false) return;
        nodo.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
    });

    return nodo;
}

const icon = (name, extra = '') =>
    crear('span', { clase: `material-symbols-rounded ${extra}`.trim(), 'aria-hidden': 'true', texto: name });

const button = (text, iconName, variant = 'primary', action = '') =>
    crear(
        'button',
        { type: 'button', clase: `button button--${variant}`, 'data-action': action || undefined },
        [iconName ? icon(iconName) : null, text]
    );

function rollDie() {
    return DIE_FACES[Math.floor(Math.random() * DIE_FACES.length)];
}
function rollDice(count = DICE_COUNT) {
    return Array.from({ length: count }, rollDie);
}
function rerollUnheld(dice, held) {
    return dice.map((value, index) => (held[index] ? value : rollDie()));
}
function countByFace(dice) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    dice.forEach((value) => { counts[value] += 1; });
    return counts;
}
function uniqueSortedFaces(dice) {
    return [...new Set(dice)].sort((a, b) => a - b);
}
function sumDice(dice) {
    return dice.reduce((total, value) => total + value, 0);
}
function sumByFace(dice, face) {
    return dice.filter((value) => value === face).reduce((total, value) => total + value, 0);
}
function hasCountAtLeast(dice, required) {
    return Object.values(countByFace(dice)).some((count) => count >= required);
}
function isFullHouse(dice) {
    const counts = Object.values(countByFace(dice)).filter((count) => count > 0).sort();
    return counts.length === 2 && counts[0] === 2 && counts[1] === 3;
}
function containsSequence(dice, sequences) {
    const unique = uniqueSortedFaces(dice);
    return sequences.some((sequence) => sequence.every((face) => unique.includes(face)));
}
function scoreCategory(dice, category) {
    switch (category) {
        case CATEGORY_ONES: return sumByFace(dice, 1);
        case CATEGORY_TWOS: return sumByFace(dice, 2);
        case CATEGORY_THREES: return sumByFace(dice, 3);
        case CATEGORY_FOURS: return sumByFace(dice, 4);
        case CATEGORY_FIVES: return sumByFace(dice, 5);
        case CATEGORY_SIXES: return sumByFace(dice, 6);
        case CATEGORY_THREE_OF_A_KIND: return hasCountAtLeast(dice, 3) ? sumDice(dice) : 0;
        case CATEGORY_FOUR_OF_A_KIND: return hasCountAtLeast(dice, 4) ? sumDice(dice) : 0;
        case CATEGORY_FULL_HOUSE: return isFullHouse(dice) ? FULL_HOUSE_SCORE : 0;
        case CATEGORY_SMALL_STRAIGHT: return containsSequence(dice, SMALL_STRAIGHT_SEQUENCES) ? SMALL_STRAIGHT_SCORE : 0;
        case CATEGORY_LARGE_STRAIGHT: return containsSequence(dice, LARGE_STRAIGHT_SEQUENCES) ? LARGE_STRAIGHT_SCORE : 0;
        case CATEGORY_YATZY: return hasCountAtLeast(dice, 5) ? YATZY_SCORE : 0;
        case CATEGORY_CHANCE: return sumDice(dice);
        default: return 0;
    }
}
function computeCategoryScores(dice) {
    return Object.fromEntries(ALL_CATEGORIES.map((category) => [category, scoreCategory(dice, category)]));
}
function computeUpperSum(scores) {
    return UPPER_CATEGORIES.reduce((total, category) => total + (scores[category] || 0), 0);
}
function computeBonus(upperSum) {
    return upperSum >= BONUS_THRESHOLD ? BONUS_SCORE : 0;
}
function computeLowerSum(scores) {
    return LOWER_CATEGORIES.reduce((total, category) => total + (scores[category] || 0), 0);
}
function computeTotalScore(scores) {
    const upperSum = computeUpperSum(scores);
    return upperSum + computeBonus(upperSum) + computeLowerSum(scores);
}

function createEmptyScores() {
    return Object.fromEntries(ALL_CATEGORIES.map((category) => [category, null]));
}
function createGame() {
    return {
        turn: PLAYER_1,
        rollNumber: 0,
        dice: [],
        held: Array(DICE_COUNT).fill(false),
        scores: { [PLAYER_1]: createEmptyScores(), [PLAYER_2]: createEmptyScores() },
    };
}
function hasFilledAllCategories(current, player) {
    return ALL_CATEGORIES.every((category) => current.scores[player][category] !== null);
}
function isGameOver(current) {
    return hasFilledAllCategories(current, PLAYER_1) && hasFilledAllCategories(current, PLAYER_2);
}
function getWinner(current) {
    const total1 = computeTotalScore(current.scores[PLAYER_1]);
    const total2 = computeTotalScore(current.scores[PLAYER_2]);
    if (total1 === total2) return null;
    return total1 > total2 ? PLAYER_1 : PLAYER_2;
}
function getPlayerTotal(current, player) {
    return computeTotalScore(current.scores[player]);
}
function getAvailableCategories(current, player) {
    return ALL_CATEGORIES.filter((category) => current.scores[player][category] === null);
}
function canRoll(current) {
    return !isGameOver(current) && current.rollNumber < MAX_ROLLS;
}
function rollDiceInGame(current) {
    if (current.rollNumber >= MAX_ROLLS) return current;
    const hasHeld = current.held.some(Boolean);
    const dice = hasHeld ? rerollUnheld(current.dice, current.held) : rollDice();
    return { ...current, dice, held: [...current.held], rollNumber: current.rollNumber + 1 };
}
function toggleHold(current, index) {
    if (current.dice.length === 0 || current.rollNumber >= MAX_ROLLS || index < 0 || index >= DICE_COUNT) return current;
    const held = [...current.held];
    held[index] = !held[index];
    return { ...current, held };
}
function holdIndices(current, indices) {
    if (current.dice.length === 0 || current.rollNumber >= MAX_ROLLS) return current;
    const held = Array(DICE_COUNT).fill(false);
    indices.forEach((index) => { if (index >= 0 && index < DICE_COUNT) held[index] = true; });
    return { ...current, held };
}
function selectCategory(current, category, player = current.turn) {
    if (current.dice.length === 0 || current.scores[player][category] !== null) return current;
    const scores = { ...current.scores, [player]: { ...current.scores[player], [category]: scoreCategory(current.dice, category) } };
    return { ...current, scores, turn: player === PLAYER_1 ? PLAYER_2 : PLAYER_1, rollNumber: 0, dice: [], held: Array(DICE_COUNT).fill(false) };
}

// Bot.
const UPPER_BONUS_RATE = BONUS_SCORE / BONUS_THRESHOLD;
function adjustedScore(score, category, upperSum) {
    if (score <= 0 || !UPPER_CATEGORIES.includes(category) || upperSum >= BONUS_THRESHOLD) return score;
    return score * (1 + UPPER_BONUS_RATE);
}
function chooseCategory(dice, available, upperSum, level) {
    if (!available.length) return null;
    if (level === 'easy' && Math.random() < 0.25) return available[Math.floor(Math.random() * available.length)];
    const scored = available.map((category) => ({ category, score: adjustedScore(scoreCategory(dice, category), category, upperSum) }));
    const bestScore = Math.max(...scored.map((entry) => entry.score));
    const best = scored.filter((entry) => entry.score === bestScore);
    if (bestScore === 0 && best.length > 1) return best.sort((a, b) => ZERO_PRIORITY.indexOf(a.category) - ZERO_PRIORITY.indexOf(b.category))[0].category;
    return best[Math.floor(Math.random() * best.length)].category;
}
function majorityFaces(dice, count) {
    return Object.entries(countByFace(dice)).sort((a, b) => b[1] - a[1]).slice(0, count).map(([face]) => Number(face));
}
function bestMatchingSequence(dice, sequences) {
    const unique = uniqueSortedFaces(dice);
    let best = sequences[0];
    let bestMatches = -1;
    for (const sequence of sequences) {
        const matches = sequence.filter((face) => unique.includes(face)).length;
        if (matches > bestMatches) { bestMatches = matches; best = sequence; }
    }
    return best;
}
function supportBonus(dice, category) {
    const counts = countByFace(dice);
    const presentFaces = Object.values(counts).filter((count) => count > 0);
    const maxCount = Math.max(...Object.values(counts));
    switch (category) {
        case CATEGORY_YATZY:
        case CATEGORY_FOUR_OF_A_KIND:
        case CATEGORY_THREE_OF_A_KIND: return maxCount >= 3 ? maxCount * 10 : 0;
        case CATEGORY_FULL_HOUSE: return presentFaces.length <= 2 ? 15 : 0;
        case CATEGORY_SMALL_STRAIGHT: return bestMatchingSequence(dice, SMALL_STRAIGHT_SEQUENCES).length * 10;
        case CATEGORY_LARGE_STRAIGHT: return bestMatchingSequence(dice, LARGE_STRAIGHT_SEQUENCES).length * 10;
        default: return 0;
    }
}
function greedyTarget(dice, available, upperSum) {
    let best = available[0];
    let bestValue = -Infinity;
    for (const category of available) {
        const score = scoreCategory(dice, category);
        const value = adjustedScore(score, category, upperSum) + (score > 0 ? 0 : supportBonus(dice, category));
        if (value > bestValue) { bestValue = value; best = category; }
    }
    return best;
}
function greedyKeepIndices(dice, available, upperSum) {
    const target = greedyTarget(dice, available, upperSum);
    let keepFaces = [];
    if (UPPER_CATEGORIES.includes(target)) keepFaces = [FACE_FOR_CATEGORY[target]];
    else if ([CATEGORY_THREE_OF_A_KIND, CATEGORY_FOUR_OF_A_KIND, CATEGORY_YATZY].includes(target)) keepFaces = majorityFaces(dice, 1);
    else if (target === CATEGORY_FULL_HOUSE) keepFaces = majorityFaces(dice, 2);
    else if (target === CATEGORY_SMALL_STRAIGHT) keepFaces = bestMatchingSequence(dice, SMALL_STRAIGHT_SEQUENCES);
    else if (target === CATEGORY_LARGE_STRAIGHT) keepFaces = bestMatchingSequence(dice, LARGE_STRAIGHT_SEQUENCES);
    else keepFaces = [5, 6];
    return dice.map((value, index) => (keepFaces.includes(value) ? index : null)).filter((index) => index !== null);
}
function* outcomeCombinations(count) {
    function* combine(start, remaining, prefix) {
        if (remaining === 0) { yield [...prefix]; return; }
        for (let face = start; face < DIE_FACES.length; face += 1) {
            prefix.push(DIE_FACES[face]);
            yield* combine(face, remaining - 1, prefix);
            prefix.pop();
        }
    }
    yield* combine(0, count, []);
}
function bestImmediateScore(dice, available, upperSum) {
    return Math.max(...available.map((category) => adjustedScore(scoreCategory(dice, category), category, upperSum)));
}
function expectedKeepValue(kept, rerolls, available, upperSum) {
    let total = 0;
    let outcomes = 0;
    for (const combination of outcomeCombinations(rerolls)) {
        total += bestImmediateScore([...kept, ...combination], available, upperSum);
        outcomes += 1;
    }
    return total / outcomes;
}
function chooseDiceToKeep(dice, available, upperSum, level) {
    if (level === 'easy' && Math.random() < 0.3) return [Math.floor(Math.random() * dice.length)];
    const greedy = greedyKeepIndices(dice, available, upperSum);
    if (level !== 'hard') return greedy;
    let best = greedy;
    let bestValue = -Infinity;
    for (let mask = 0; mask < 2 ** dice.length; mask += 1) {
        const keepIndices = [];
        for (let index = 0; index < dice.length; index += 1) if (mask & (1 << index)) keepIndices.push(index);
        const kept = keepIndices.map((index) => dice[index]);
        const value = expectedKeepValue(kept, dice.length - kept.length, available, upperSum);
        if (value > bestValue || (value === bestValue && keepIndices.length > best.length)) {
            bestValue = value;
            best = keepIndices;
        }
    }
    return best;
}
function botStep(current, level) {
    const available = getAvailableCategories(current, PLAYER_2);
    const upperSum = computeUpperSum(current.scores[PLAYER_2]);
    if (!available.length) return current;
    if (current.dice.length === 0) return rollDiceInGame(current);
    if (current.rollNumber < MAX_ROLLS) {
        const keep = chooseDiceToKeep(current.dice, available, upperSum, level);
        if (keep.length === current.dice.length) return selectCategory(current, chooseCategory(current.dice, available, upperSum, level), PLAYER_2);
        return rollDiceInGame(holdIndices(current, keep));
    }
    return selectCategory(current, chooseCategory(current.dice, available, upperSum, level), PLAYER_2);
}

// Interfaz.
function dieFace(value) {
    const pips = FACE_PIPS[value] ?? [];
    return crear(
        'span',
        { clase: 'die-face', 'aria-hidden': 'true' },
        Array.from({ length: 9 }, (_, index) =>
            crear('span', { clase: `die-face__cell${pips.includes(index) ? ' die-face__cell--pip' : ''}` })
        )
    );
}

function renderHome() {
    const modes = [
        { id: 'bot', label: 'Jugar vs Bot', description: 'Enfréntate al bot en este tablero', icon: 'smart_toy' },
        { id: 'local', label: '2 Jugadores', description: 'Comparte el tablero con otra persona', icon: 'group' },
    ];
    const dificultades = crear('div', { clase: 'home__difficulty', role: 'group', 'aria-label': 'Dificultad del bot' }, DIFFICULTIES.map((level) =>
        crear(
            'button',
            {
                type: 'button',
                clase: `home__difficulty-option${difficulty === level ? ' home__difficulty-option--active' : ''}`,
                'data-difficulty': level,
                'aria-pressed': String(difficulty === level),
            },
            [DIFFICULTY_LABELS[level]]
        )
    ));

    app.replaceChildren(
        crear('div', { clase: 'app' }, [
            crear('div', { clase: 'home' }, [
                crear('header', { clase: 'home__header' }, [
                    icon('casino'),
                    crear('h1', { clase: 'home__title', texto: 'Yatzy' }),
                    crear('p', { clase: 'home__subtitle', texto: 'Elige cómo quieres jugar' }),
                ]),
                crear('div', { clase: 'home__modes' }, modes.map((item) =>
                    crear(
                        'button',
                        {
                            type: 'button',
                            clase: `home__mode${selectedMode === item.id ? ' home__mode--selected' : ''}`,
                            'data-mode': item.id,
                            'aria-pressed': String(selectedMode === item.id),
                        },
                        [
                            icon(item.icon),
                            crear('span', { clase: 'home__mode-label', texto: item.label }),
                            crear('span', { clase: 'home__mode-description', texto: item.description }),
                        ]
                    )
                )),
                selectedMode === 'bot' ? dificultades : null,
                crear(
                    'button',
                    { type: 'button', clase: 'button button--primary', 'data-action': 'start', disabled: selectedMode === null ? true : undefined },
                    [icon('play_arrow'), 'Jugar']
                ),
            ]),
        ])
    );

    app.querySelectorAll('[data-mode]').forEach((element) => element.addEventListener('click', () => { selectedMode = element.dataset.mode; renderHome(); }));
    app.querySelectorAll('[data-difficulty]').forEach((element) => element.addEventListener('click', () => { difficulty = element.dataset.difficulty; renderHome(); }));
    app.querySelector('[data-action="start"]').addEventListener('click', startGame);
}

function scoreboard() {
    const p1Name = mode === 'bot' ? 'TÚ' : 'Jugador 1';
    const p2Name = mode === 'bot' ? 'BOT' : 'Jugador 2';
    const badge = mode === 'bot' ? DIFFICULTY_LABELS[difficulty] : '2 JUGADORES';
    const active1 = game.turn === PLAYER_1;
    const active2 = game.turn === PLAYER_2;

    return crear('section', { clase: 'scoreboard', 'aria-label': 'Marcador de la partida' }, [
        crear('div', { clase: 'scoreboard__badge-row' }, [crear('span', { clase: 'scoreboard__badge', texto: badge })]),
        crear('div', { clase: 'scoreboard__names' }, [
            crear('span', { clase: `scoreboard__name${active1 ? ' scoreboard__name--active' : ''}`, texto: p1Name }),
            crear('span', { clase: `scoreboard__name${active2 ? ' scoreboard__name--active' : ''}`, texto: p2Name }),
        ]),
        crear('div', { clase: 'scoreboard__counts' }, [
            crear('span', { clase: `scoreboard__count${active1 ? ' scoreboard__count--active' : ''}`, texto: String(getPlayerTotal(game, PLAYER_1)) }),
            crear('span', { clase: 'scoreboard__vs', texto: 'VS' }),
            crear('span', { clase: `scoreboard__count${active2 ? ' scoreboard__count--active' : ''}`, texto: String(getPlayerTotal(game, PLAYER_2)) }),
        ]),
    ]);
}

function rowBadge({ die = null, label = null, iconName = null, caption = null, yatzy = false }) {
    return crear('div', { clase: `scorecard__badge${yatzy ? ' scorecard__badge--yatzy' : ''}` }, [
        die !== null ? dieFace(die) : null,
        label !== null ? crear('span', { clase: 'scorecard__badge-text', texto: label }) : null,
        iconName !== null ? icon(iconName) : null,
        caption !== null ? crear('span', { clase: 'scorecard__badge-caption', texto: caption }) : null,
    ]);
}

function cellProps(category, player, interactable) {
    const score = game.scores[player][category];
    if (score !== null) return { value: score, selectable: false };
    if (player === game.turn && game.dice.length > 0) return { value: scoreCategory(game.dice, category), selectable: interactable };
    return { value: null, selectable: false };
}

function playerCell(category, player, interactable) {
    const props = cellProps(category, player, interactable);
    const variant = player === PLAYER_1 ? 'p1' : 'p2';
    const classes = `scorecard-cell scorecard-cell--${variant}${props.selectable ? ' scorecard-cell--selectable' : ''}`;
    if (!props.selectable) {
        return crear('div', { clase: classes }, [props.value === null ? null : props.value]);
    }
    return crear('button', { type: 'button', clase: classes, 'data-score-category': category, 'aria-label': `Anotar ${props.value}` }, [props.value]);
}

function scorecard(interactable) {
    const leftRows = UPPER_CATEGORIES.map((category, index) => ({ id: category, die: index + 1 }));
    const rightRows = [
        { id: CATEGORY_THREE_OF_A_KIND, label: '3X' },
        { id: CATEGORY_FOUR_OF_A_KIND, label: '4X' },
        { id: CATEGORY_FULL_HOUSE, iconName: 'cottage' },
        { id: CATEGORY_SMALL_STRAIGHT, iconName: 'style', caption: 'SMALL' },
        { id: CATEGORY_LARGE_STRAIGHT, iconName: 'view_carousel', caption: 'LARGE' },
        { id: CATEGORY_YATZY, label: 'YATZY', yatzy: true },
        { id: CATEGORY_CHANCE, iconName: 'help' },
    ];
    const filas = leftRows.map((left) => {
        const right = rightRows[leftRows.indexOf(left)];
        return crear('div', { clase: 'scorecard__row' }, [
            crear('div', { clase: 'scorecard__half' }, [
                rowBadge({ die: left.die }),
                playerCell(left.id, PLAYER_1, interactable),
                playerCell(left.id, PLAYER_2, interactable),
            ]),
            crear('span', { clase: 'scorecard__row-divider' }),
            crear('div', { clase: 'scorecard__half' }, [
                rowBadge(right),
                playerCell(right.id, PLAYER_1, interactable),
                playerCell(right.id, PLAYER_2, interactable),
            ]),
        ]);
    });
    const bonusRow = crear('div', { clase: 'scorecard__row' }, [
        crear('div', { clase: 'scorecard__half' }, [
            crear('div', { clase: 'scorecard__badge scorecard__badge--bonus' }, [
                crear('span', { clase: 'scorecard__badge-text', texto: 'BONUS' }),
                crear('span', { clase: 'scorecard__bonus-value', texto: `+${BONUS_SCORE}` }),
            ]),
            crear('span', {
                clase: `bonus-circle bonus-circle--p1${computeUpperSum(game.scores[PLAYER_1]) >= BONUS_THRESHOLD ? ' bonus-circle--achieved' : ''}`,
                texto: `${computeUpperSum(game.scores[PLAYER_1])}/${BONUS_THRESHOLD}`,
            }),
            crear('span', {
                clase: `bonus-circle bonus-circle--p2${computeUpperSum(game.scores[PLAYER_2]) >= BONUS_THRESHOLD ? ' bonus-circle--achieved' : ''}`,
                texto: `${computeUpperSum(game.scores[PLAYER_2])}/${BONUS_THRESHOLD}`,
            }),
        ]),
        crear('span', { clase: 'scorecard__row-divider' }),
        crear('div', { clase: 'scorecard__half' }, [
            rowBadge({ iconName: 'help' }),
            playerCell(CATEGORY_CHANCE, PLAYER_1, interactable),
            playerCell(CATEGORY_CHANCE, PLAYER_2, interactable),
        ]),
    ]);

    return crear('section', { clase: 'scorecard', 'aria-label': 'Tablero de puntuaciones' }, [
        crear('div', { clase: 'scorecard__rows' }, [...filas, bonusRow]),
    ]);
}

function holdRow(humanPlaying) {
    const bloqueado = !humanPlaying || game.dice.length === 0 || game.rollNumber >= MAX_ROLLS;
    return crear('div', { clase: 'hold-row' }, game.dice.map((value, index) =>
        crear(
            'button',
            {
                type: 'button',
                clase: `star-die${game.held[index] ? ' star-die--held' : ''}`,
                'data-hold': String(index),
                'aria-label': `Dado ${value}${game.held[index] ? ', marcado para conservar' : ''}`,
                'aria-pressed': String(game.held[index]),
                disabled: bloqueado ? true : undefined,
            },
            [icon('star'), crear('span', { clase: 'star-die__value', texto: String(value) })]
        )
    ));
}

function rollBar(disabled) {
    return crear('button', { type: 'button', clase: 'roll-bar', 'data-action': 'roll', 'aria-label': 'GIRA', disabled: disabled ? true : undefined }, [
        crear('span', { clase: 'roll-bar__label', texto: 'GIRA' }),
        crear('span', { clase: 'roll-bar__circles', 'aria-hidden': 'true' }, Array.from({ length: MAX_ROLLS }, (_, index) =>
            crear('span', { clase: `roll-bar__circle${game.rollNumber === index + 1 ? ' roll-bar__circle--active' : ''}`, texto: String(index + 1) })
        )),
    ]);
}

function renderGame() {
    const gameOver = isGameOver(game);
    const winner = getWinner(game);
    const humanPlaying = mode === 'bot' ? game.turn === PLAYER_1 : true;
    const botThinking = mode === 'bot' && game.turn === PLAYER_2 && !gameOver;
    const hasHeld = game.held.some(Boolean);
    const rollDisabled = gameOver || !humanPlaying || !canRoll(game);
    const interactable = humanPlaying && game.dice.length > 0 && !gameOver;
    const status = botThinking ? 'El bot está pensando…' : game.dice.length === 0 ? 'Pulsa GIRA para lanzar los dados' : game.rollNumber >= MAX_ROLLS ? 'Elige una categoría para anotar' : hasHeld ? 'Pulsa GIRA para relanzar los dados sin estrella' : 'Pulsa GIRA para relanzar todos los dados';
    const overTitle = winner === null ? '¡Empate!' : mode === 'bot' ? (winner === PLAYER_1 ? '¡Ganaste!' : '¡El bot ganó!') : `¡${winner === PLAYER_1 ? 'Jugador 1' : 'Jugador 2'} gana!`;
    const fin = crear('div', { clase: 'game-over', role: 'dialog', 'aria-label': 'Fin de la partida' }, [
        icon('emoji_events'),
        crear('h2', { clase: 'game-over__title', texto: overTitle }),
        crear('div', { clase: 'game-over__actions' }, [
            button('Jugar de nuevo', 'restart_alt', 'primary', 'restart'),
            button('Menú', 'arrow_back', 'secondary', 'menu'),
        ]),
    ]);

    app.replaceChildren(
        crear('div', { clase: 'app' }, [
            crear('div', { clase: 'game-screen' }, [
                scoreboard(),
                scorecard(interactable),
                crear('div', { clase: 'game-screen__play-area' }, [
                    crear('p', { clase: 'game-screen__status', role: 'status', texto: status }),
                    holdRow(humanPlaying),
                    rollBar(rollDisabled),
                    crear('div', { clase: 'game-screen__actions' }, [
                        button('Reiniciar', 'restart_alt', 'secondary', 'restart'),
                        button('Menú', 'arrow_back', 'secondary', 'menu'),
                    ]),
                ]),
                gameOver ? fin : null,
            ]),
        ])
    );

    app.querySelectorAll('[data-hold]').forEach((element) => element.addEventListener('click', () => toggleHoldDie(Number(element.dataset.hold))));
    app.querySelectorAll('[data-score-category]').forEach((element) => element.addEventListener('click', () => scoreTurn(element.dataset.scoreCategory)));
    app.querySelectorAll('[data-action="roll"]').forEach((element) => element.addEventListener('click', rollTurn));
    app.querySelectorAll('[data-action="restart"]').forEach((element) => element.addEventListener('click', restartGame));
    app.querySelectorAll('[data-action="menu"]').forEach((element) => element.addEventListener('click', goHome));
}

function startGame() {
    if (selectedMode === null) return;
    mode = selectedMode;
    game = createGame();
    screen = 'game';
    render();
    scheduleBot();
}
function restartGame() {
    clearBotTimer();
    game = createGame();
    render();
    scheduleBot();
}
function goHome() {
    clearBotTimer();
    game = createGame();
    screen = 'home';
    selectedMode = null;
    difficulty = DEFAULT_DIFFICULTY;
    render();
}
function clearBotTimer() {
    if (botTimer !== null) { clearTimeout(botTimer); botTimer = null; }
}
function scheduleBot() {
    clearBotTimer();
    if (screen !== 'game' || mode !== 'bot' || game.turn !== PLAYER_2 || isGameOver(game)) return;
    botTimer = setTimeout(() => {
        botTimer = null;
        game = botStep(game, difficulty);
        renderGame();
        scheduleBot();
    }, BOT_STEP_DELAY_MS);
}
function rollTurn() {
    if (isGameOver(game) || (mode === 'bot' && game.turn === PLAYER_2) || !canRoll(game)) return;
    game = rollDiceInGame(game);
    renderGame();
    scheduleBot();
}
function toggleHoldDie(index) {
    if (isGameOver(game) || (mode === 'bot' && game.turn === PLAYER_2)) return;
    game = toggleHold(game, index);
    renderGame();
}
function scoreTurn(category) {
    if (isGameOver(game) || (mode === 'bot' && game.turn === PLAYER_2)) return;
    game = selectCategory(game, category);
    renderGame();
    scheduleBot();
}
function render() {
    if (screen === 'home') renderHome();
    else renderGame();
}
render();
