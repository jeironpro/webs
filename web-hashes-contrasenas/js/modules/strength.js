/**
 * Estimación local de fuerza de contraseñas: entropía por juego de caracteres,
 * penalizaciones por patrones previsibles y tiempos de ataque orientativos.
 */

const COMMON_PASSWORDS = new Set([
    "123456",
    "password",
    "123456789",
    "12345678",
    "12345",
    "qwerty",
    "1234567",
    "111111",
    "123123",
    "abc123",
    "1234",
    "password1",
    "iloveyou",
    "000000",
    "admin",
    "welcome",
    "monkey",
    "login",
    "dragon",
    "passw0rd",
    "master",
    "hello",
    "letmein",
    "football",
    "whatever",
    "qwerty123",
    "1q2w3e4r",
    "666666",
    "654321",
    "contraseña",
    "contrasena",
    "españa",
    "espana",
    "barcelona",
    "madrid",
    "futbol",
    "usuario",
    "clave",
    "admin123",
    "root",
    "toor",
    "changeme",
    "secret",
    "default",
    "guest",
    "test",
    "prueba",
    "hola",
    "amor",
    "teamo",
    "0000",
    "121212",
    "123321",
    "112233",
    "159753",
    "qwertyuiop",
    "asdfgh",
    "zxcvbn",
    "password123",
    "contraseña123",
    "1234567890",
    "qwertyui",
    "asdfghjkl",
    "1qaz2wsx",
    "starwars",
    "batman",
    "superman",
    "trustno1",
    "sunshine",
    "princess",
    "shadow",
    "michael",
    "jennifer",
    "computer",
    "samsung",
    "google",
    "facebook",
    "linkedin",
    "android",
]);

const COMMON_WORDS = [
    "password",
    "contrasena",
    "contraseña",
    "qwerty",
    "admin",
    "welcome",
    "iloveyou",
    "letmein",
    "dragon",
    "monkey",
    "usuario",
    "clave",
    "123456",
    "abcdef",
    "asdf",
    "000000",
    "111111",
    "futbol",
    "barcelona",
    "madrid",
    "españa",
    "hola",
    "amor",
];

const SYMBOLS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365.25 * DAY;

const CHARACTER_CLASSES = [
    { id: "lower", label: "minúsculas", size: 26, test: (text) => /[a-z]/.test(text) },
    { id: "upper", label: "mayúsculas", size: 26, test: (text) => /[A-Z]/.test(text) },
    { id: "digit", label: "dígitos", size: 10, test: (text) => /[0-9]/.test(text) },
    {
        id: "symbol",
        label: "símbolos",
        size: 32,
        test: (text) => [...text].some((character) => SYMBOLS.includes(character)),
    },
    { id: "space", label: "espacios", size: 1, test: (text) => /\s/.test(text) },
    {
        id: "extended",
        label: "no ASCII",
        size: 100,
        test: (text) => [...text].some((character) => character.codePointAt(0) > 0x7f),
    },
];

const CRACK_SCENARIOS = [
    { id: "online", label: "Ataque en línea", rateLabel: "10 intentos/s", rate: 10 },
    {
        id: "server",
        label: "Servidor con KDF",
        rateLabel: "10⁴ intentos/s",
        rate: 10_000,
    },
    {
        id: "gpu",
        label: "GPU contra hash rápido",
        rateLabel: "10¹¹ intentos/s",
        rate: 100_000_000_000,
    },
];

const LABELS = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"];
const TONES = ["critical", "weak", "fair", "good", "strong"];
const SUMMARIES = [
    "Se rompería casi al instante con un ataque automático.",
    "Un ataque automatizado la superaría en poco tiempo.",
    "Resiste lo básico, pero no un ataque dedicado.",
    "Buena base: la longitud y la variedad marcan la diferencia.",
    "Mucho margen frente a ataques automatizados.",
];

const numberFormatter = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0,
    useGrouping: true,
});

function formatAmount(value) {
    if (value >= 10) return numberFormatter.format(Math.round(value));
    return new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 1,
        useGrouping: true,
    }).format(value);
}

function withUnit(value, singular, plural) {
    const amount = formatAmount(value);
    return `${amount} ${amount === "1" ? singular : plural}`;
}

/**
 * Convierte segundos en una duración legible.
 * @param {number} seconds
 * @returns {string}
 */
export function formatSeconds(seconds) {
    if (!Number.isFinite(seconds)) return "prácticamente imposible";
    if (seconds < 1) return "menos de un segundo";
    if (seconds < MINUTE) return withUnit(seconds, "s", "s");
    if (seconds < HOUR) return withUnit(seconds / MINUTE, "min", "min");
    if (seconds < DAY) return withUnit(seconds / HOUR, "h", "h");
    if (seconds < YEAR) return withUnit(seconds / DAY, "día", "días");

    const years = seconds / YEAR;
    if (years < 1_000_000) return withUnit(years, "año", "años");
    if (years < 1_000_000_000) {
        return withUnit(years / 1_000_000, "millón de años", "millones de años");
    }

    return "más de 1.000 millones de años";
}

/**
 * Estima el tiempo medio de ruptura para varios escenarios.
 * @param {number} entropy Bits de entropía.
 * @returns {{id: string, label: string, rateLabel: string, seconds: number, time: string}[]}
 */
export function estimateCrackTimes(entropy) {
    const averageGuesses = 2 ** Math.max(0, entropy - 1);

    return CRACK_SCENARIOS.map((scenario) => {
        const seconds = averageGuesses / scenario.rate;
        return { ...scenario, seconds, time: formatSeconds(seconds) };
    });
}

function hasSequence(text) {
    const characters = [...text.toLowerCase()];
    let ascending = 1;
    let descending = 1;

    for (let index = 1; index < characters.length; index += 1) {
        const difference = characters[index].codePointAt(0) - characters[index - 1].codePointAt(0);
        ascending = difference === 1 ? ascending + 1 : 1;
        descending = difference === -1 ? descending + 1 : 1;

        if (ascending >= 4 || descending >= 4) return true;
    }

    return ["qwerty", "asdf", "zxcv", "qaz", "wsx", "edc", "1234", "abcd"].some((pattern) =>
        text.includes(pattern)
    );
}

function hasRepeatedBlock(text) {
    return /(.)\1{2,}/u.test(text) || /(.{2,6})\1/u.test(text);
}

/**
 * Analiza una contraseña sin enviarla a ningún sitio.
 * @param {string} password
 * @returns {{
 *   empty: boolean,
 *   length: number,
 *   poolSize: number,
 *   entropy: number,
 *   score: number,
 *   label: string,
 *   tone: string,
 *   summary: string,
 *   common: boolean,
 *   classes: {id: string, label: string, active: boolean}[],
 *   warnings: string[],
 *   tips: string[],
 *   crackTimes: ReturnType<typeof estimateCrackTimes>
 * }}
 */
export function checkPassword(password) {
    const characters = Array.from(password);
    const length = characters.length;
    const classes = CHARACTER_CLASSES.map((definition) => ({
        id: definition.id,
        label: definition.label,
        active: definition.test(password),
    }));

    if (length === 0) {
        return {
            empty: true,
            length: 0,
            poolSize: 0,
            entropy: 0,
            score: 0,
            label: "Sin contraseña",
            tone: "empty",
            summary: "Escribe una contraseña para ver su huella de fuerza.",
            common: false,
            classes,
            warnings: [],
            tips: [],
            crackTimes: CRACK_SCENARIOS.map((scenario) => ({
                ...scenario,
                seconds: Number.POSITIVE_INFINITY,
                time: "—",
            })),
        };
    }

    const activeClasses = CHARACTER_CLASSES.filter((definition) => definition.test(password));
    const poolSize = activeClasses.reduce((total, definition) => total + definition.size, 0);
    const lower = password.toLowerCase();
    const trimmed = lower.trim();
    const isCommon = COMMON_PASSWORDS.has(trimmed);
    const hasCommonWord = COMMON_WORDS.some((word) => lower.includes(word));
    const sequential = hasSequence(lower);
    const repeated = hasRepeatedBlock(password);
    const hasDate = /\b(19|20)\d{2}\b/.test(password);
    const uniqueRatio = new Set(characters).size / length;
    const lowVariety = length >= 8 && uniqueRatio < 0.5;
    const warnings = [];

    let entropy = length * Math.log2(poolSize || 1);

    if (isCommon) {
        warnings.push("Aparece en la lista local de contraseñas comunes.");
        entropy = Math.min(entropy, 12);
    } else if (hasCommonWord) {
        warnings.push("Contiene una palabra habitual de listas de filtraciones.");
        entropy *= 0.6;
    }

    if (sequential) {
        warnings.push("Incluye una secuencia predecible de letras, números o teclado.");
        entropy *= 0.7;
    }

    if (repeated) {
        warnings.push("Repite caracteres o bloques completos.");
        entropy *= 0.65;
    }

    if (hasDate) {
        warnings.push("Contiene un año fácil de adivinar.");
        entropy *= 0.8;
    }

    if (lowVariety) {
        warnings.push("Usa muy pocos caracteres distintos.");
        entropy *= 0.7;
    }

    entropy = Math.max(0, entropy);

    let score = entropy < 28 ? 0 : entropy < 40 ? 1 : entropy < 60 ? 2 : entropy < 80 ? 3 : 4;

    if (isCommon) {
        score = 0;
    } else {
        if (length < 8) score = Math.min(score, 1);
        else if (length < 12) score = Math.min(score, 3);
        if (activeClasses.length === 1) score = Math.min(score, 2);
        if (sequential || repeated) score = Math.min(score, 2);
        if (hasDate) score = Math.min(score, 3);
    }

    const tips = [];
    if (length < 12) {
        tips.push("Alarga la contraseña a 12 caracteres o usa una frase de varias palabras.");
    }
    if (isCommon || hasCommonWord) {
        tips.push("Evita palabras y contraseñas que aparecen en diccionarios y filtraciones.");
    }
    if (sequential || repeated || hasDate) {
        tips.push("Rompe secuencias, repeticiones y fechas previsibles.");
    }
    if (activeClasses.length < 4 && score < 3) {
        tips.push("Mezcla mayúsculas, minúsculas, números y símbolos.");
    }
    if (score >= 3) {
        tips.push("Guárdala en un gestor y no la reutilices en otros servicios.");
    }

    return {
        empty: false,
        length,
        poolSize,
        entropy,
        score,
        label: LABELS[score],
        tone: TONES[score],
        summary: SUMMARIES[score],
        common: isCommon,
        classes,
        warnings,
        tips: tips.slice(0, 3),
        crackTimes: estimateCrackTimes(entropy),
    };
}
