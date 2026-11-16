/**
 * Conversiones puras de texto: Base64, URL y entidades HTML.
 * Las funciones lanzan errores con mensajes en español cuando la entrada no
 * se puede interpretar; la interfaz decide cómo mostrarlos.
 */

const HTML_ENTITIES = Object.freeze({
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: "\u00a0",
    iexcl: "¡",
    cent: "¢",
    pound: "£",
    curren: "¤",
    yen: "¥",
    brvbar: "¦",
    sect: "§",
    uml: "¨",
    copy: "©",
    ordf: "ª",
    aacute: "á",
    eacute: "é",
    iacute: "í",
    oacute: "ó",
    uacute: "ú",
    ntilde: "ñ",
    uuml: "ü",
    Aacute: "Á",
    Eacute: "É",
    Iacute: "Í",
    Oacute: "Ó",
    Uacute: "Ú",
    Ntilde: "Ñ",
    Uuml: "Ü",
    laquo: "«",
    not: "¬",
    shy: "\u00ad",
    reg: "®",
    macr: "¯",
    deg: "°",
    plusmn: "±",
    sup2: "²",
    sup3: "³",
    acute: "´",
    micro: "µ",
    para: "¶",
    middot: "·",
    cedil: "¸",
    sup1: "¹",
    ordm: "º",
    raquo: "»",
    frac14: "¼",
    frac12: "½",
    frac34: "¾",
    iquest: "¿",
    times: "×",
    divide: "÷",
    euro: "€",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    ndash: "–",
    mdash: "—",
    lsquo: "‘",
    rsquo: "’",
    sbquo: "‚",
    ldquo: "“",
    rdquo: "”",
    bdquo: "„",
    dagger: "†",
    Dagger: "‡",
    bull: "•",
    hellip: "…",
    permil: "‰",
    prime: "′",
    Prime: "″",
    larr: "←",
    uarr: "↑",
    rarr: "→",
    darr: "↓",
    harr: "↔",
    lArr: "⇐",
    uArr: "⇑",
    rArr: "⇒",
    dArr: "⇓",
    hArr: "⇔",
    forall: "∀",
    part: "∂",
    exist: "∃",
    empty: "∅",
    nabla: "∇",
    isin: "∈",
    notin: "∉",
    ni: "∋",
    prod: "∏",
    sum: "∑",
    minus: "−",
    lowast: "∗",
    radic: "√",
    prop: "∝",
    infin: "∞",
    ang: "∠",
    and: "∧",
    or: "∨",
    cap: "∩",
    cup: "∪",
    int: "∫",
    there4: "∴",
    sim: "∼",
    cong: "≅",
    asymp: "≈",
    ne: "≠",
    equiv: "≡",
    le: "≤",
    ge: "≥",
    sub: "⊂",
    sup: "⊃",
    nsub: "⊄",
    sube: "⊆",
    supe: "⊇",
    oplus: "⊕",
    otimes: "⊗",
    perp: "⊥",
    sdot: "⋅",
    lceil: "⌈",
    rceil: "⌉",
    lfloor: "⌊",
    rfloor: "⌋",
    loz: "◊",
    spades: "♠",
    clubs: "♣",
    hearts: "♥",
    diams: "♦",
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    epsilon: "ε",
    zeta: "ζ",
    eta: "η",
    theta: "θ",
    lambda: "λ",
    mu: "μ",
    pi: "π",
    rho: "ρ",
    sigma: "σ",
    tau: "τ",
    phi: "φ",
    omega: "ω",
    Alpha: "Α",
    Beta: "Β",
    Gamma: "Γ",
    Delta: "Δ",
    Theta: "Θ",
    Lambda: "Λ",
    Pi: "Π",
    Sigma: "Σ",
    Phi: "Φ",
    Omega: "Ω",
});

const ESSENTIAL_REPLACEMENTS = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&#39;"],
];

/** Decodifica una referencia numérica válida; si no lo es, la deja intacta. */
function numericEntity(value, radix, original) {
    const codePoint = Number.parseInt(value, radix);
    const isSurrogate = codePoint >= 0xd800 && codePoint <= 0xdfff;
    if (!Number.isInteger(codePoint) || codePoint === 0 || codePoint > 0x10ffff || isSurrogate) {
        return original;
    }

    return String.fromCodePoint(codePoint);
}

/**
 * Codifica texto como Base64 estándar (RFC 4648) usando UTF-8.
 * @param {string} text
 * @returns {string}
 */
export function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary);
}

/**
 * Decodifica Base64 estándar como texto UTF-8. Ignora espacios y saltos de línea.
 * @param {string} value
 * @returns {string}
 */
export function decodeBase64(value) {
    const compact = value.replace(/\s+/g, "");
    if (compact === "") return "";

    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact) || compact.length % 4 === 1) {
        throw new Error("El texto no es Base64 válido.");
    }

    let binary;
    try {
        const padded = compact.padEnd(Math.ceil(compact.length / 4) * 4, "=");
        binary = atob(padded);
    } catch {
        throw new Error("El texto no es Base64 válido.");
    }

    try {
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
        throw new Error("El Base64 no contiene texto UTF-8 válido.");
    }
}

/**
 * Codifica texto para una URL.
 * @param {string} text
 * @param {{scope?: "component"|"full"}} [options]
 * @returns {string}
 */
export function encodeUrl(text, { scope = "component" } = {}) {
    return scope === "full" ? encodeURI(text) : encodeURIComponent(text);
}

/**
 * Decodifica una URL o uno de sus componentes.
 * @param {string} text
 * @param {{scope?: "component"|"full"}} [options]
 * @returns {string}
 */
export function decodeUrl(text, { scope = "component" } = {}) {
    try {
        return scope === "full" ? decodeURI(text) : decodeURIComponent(text);
    } catch {
        throw new Error("La secuencia de escape de la URL no es válida.");
    }
}

/**
 * Escapa los caracteres que tienen significado en HTML.
 * Con `scope: "all"` también convierte a entidad numérica todo lo que no sea ASCII.
 * @param {string} text
 * @param {{scope?: "essential"|"all"}} [options]
 * @returns {string}
 */
export function encodeHtmlEntities(text, { scope = "essential" } = {}) {
    const escaped = ESSENTIAL_REPLACEMENTS.reduce(
        (result, [character, entity]) => result.replaceAll(character, entity),
        text
    );

    if (scope !== "all") return escaped;

    return [...escaped]
        .map((character) => {
            const codePoint = character.codePointAt(0);
            if (codePoint <= 0x7f) return character;
            return `&#x${codePoint.toString(16).toUpperCase()};`;
        })
        .join("");
}

/**
 * Convierte entidades HTML nombradas y numéricas de vuelta a texto.
 * Las entidades desconocidas o inválidas se conservan tal cual.
 * @param {string} text
 * @returns {string}
 */
export function decodeHtmlEntities(text) {
    return text.replace(
        /&(?:#([0-9]+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z][a-zA-Z0-9]+));/g,
        (original, decimal, hexadecimal, name) => {
            if (decimal !== undefined) return numericEntity(decimal, 10, original);
            if (hexadecimal !== undefined) return numericEntity(hexadecimal, 16, original);
            return HTML_ENTITIES[name] ?? original;
        }
    );
}

/**
 * Aplica el códec y el sentido indicados.
 * @param {string} text
 * @param {"base64"|"url"|"html"} codec
 * @param {"encode"|"decode"} direction
 * @param {{scope?: string}} [options]
 * @returns {string}
 */
export function transformText(text, codec, direction, options = {}) {
    if (direction !== "encode" && direction !== "decode") {
        throw new Error("El sentido de la conversión no es válido.");
    }

    const encode = direction === "encode";

    if (codec === "base64") return encode ? encodeBase64(text) : decodeBase64(text);
    if (codec === "url") return encode ? encodeUrl(text, options) : decodeUrl(text, options);
    if (codec === "html") {
        return encode ? encodeHtmlEntities(text, options) : decodeHtmlEntities(text);
    }

    throw new Error("El canal seleccionado no existe.");
}
