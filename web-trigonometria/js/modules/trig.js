/**
 * Funciones puras del círculo unitario: normalización de ángulos, razones
 * trigonométricas, cuadrante y formato de las lecturas.
 */

/**
 * Lleva un ángulo a [0, 360).
 * @param {number} degrees
 * @returns {number}
 */
export function normalizeAngle(degrees) {
    if (!Number.isFinite(degrees)) return 0;

    const value = degrees % 360;
    return value < 0 ? value + 360 : value;
}

/**
 * Convierte grados a radianes.
 * @param {number} degrees
 * @returns {number}
 */
export function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

/**
 * Calcula seno, coseno y tangente, limpiando el ruido de coma flotante.
 * La tangente es `null` en 90° y 270°.
 * @param {number} degrees
 * @returns {{sin: number, cos: number, tan: number|null, radians: number}}
 */
export function trigValues(degrees) {
    const radians = toRadians(normalizeAngle(degrees));
    const clean = (value) => (Math.abs(value) < 1e-12 ? 0 : value);

    const sin = clean(Math.sin(radians));
    const cos = clean(Math.cos(radians));
    const tan = Math.abs(cos) < 1e-12 ? null : clean(Math.tan(radians));

    return { sin, cos, tan, radians };
}

/**
 * Describe la posición del ángulo en el plano.
 * @param {number} degrees
 * @returns {"Eje X"|"Eje Y"|"Cuadrante I"|"Cuadrante II"|"Cuadrante III"|"Cuadrante IV"}
 */
export function quadrantOf(degrees) {
    const angle = normalizeAngle(degrees);

    if (angle === 0 || angle === 180) return "Eje X";
    if (angle === 90 || angle === 270) return "Eje Y";
    if (angle < 90) return "Cuadrante I";
    if (angle < 180) return "Cuadrante II";
    if (angle < 270) return "Cuadrante III";
    return "Cuadrante IV";
}

/**
 * Punto del círculo unitario en coordenadas matemáticas (y hacia arriba).
 * @param {number} degrees
 * @returns {{x: number, y: number}}
 */
export function pointOnCircle(degrees) {
    const { sin, cos } = trigValues(degrees);
    return { x: cos, y: sin };
}

const EXACT_ANGLES = new Map([
    [0, { sin: "0", cos: "1", tan: "0", coords: "(1, 0)", radians: "0" }],
    [30, { sin: "1/2", cos: "√3/2", tan: "√3/3", coords: "(√3/2, 1/2)", radians: "π/6" }],
    [45, { sin: "√2/2", cos: "√2/2", tan: "1", coords: "(√2/2, √2/2)", radians: "π/4" }],
    [60, { sin: "√3/2", cos: "1/2", tan: "√3", coords: "(1/2, √3/2)", radians: "π/3" }],
    [90, { sin: "1", cos: "0", tan: null, coords: "(0, 1)", radians: "π/2" }],
    [120, { sin: "√3/2", cos: "−1/2", tan: "−√3", coords: "(−1/2, √3/2)", radians: "2π/3" }],
    [135, { sin: "√2/2", cos: "−√2/2", tan: "−1", coords: "(−√2/2, √2/2)", radians: "3π/4" }],
    [150, { sin: "1/2", cos: "−√3/2", tan: "−√3/3", coords: "(−√3/2, 1/2)", radians: "5π/6" }],
    [180, { sin: "0", cos: "−1", tan: "0", coords: "(−1, 0)", radians: "π" }],
    [210, { sin: "−1/2", cos: "−√3/2", tan: "√3/3", coords: "(−√3/2, −1/2)", radians: "7π/6" }],
    [225, { sin: "−√2/2", cos: "−√2/2", tan: "1", coords: "(−√2/2, −√2/2)", radians: "5π/4" }],
    [240, { sin: "−√3/2", cos: "−1/2", tan: "√3", coords: "(−1/2, −√3/2)", radians: "4π/3" }],
    [270, { sin: "−1", cos: "0", tan: null, coords: "(0, −1)", radians: "3π/2" }],
    [300, { sin: "−√3/2", cos: "1/2", tan: "−√3", coords: "(1/2, −√3/2)", radians: "5π/3" }],
    [315, { sin: "−√2/2", cos: "√2/2", tan: "−1", coords: "(√2/2, −√2/2)", radians: "7π/4" }],
    [330, { sin: "−1/2", cos: "√3/2", tan: "−√3/3", coords: "(√3/2, −1/2)", radians: "11π/6" }],
]);

/**
 * Devuelve los valores exactos de un ángulo frecuente, o `null` si no lo es.
 * Se admite una décima de tolerancia para absorber el redondeo del arrastre.
 * @param {number} degrees
 * @returns {{sin: string, cos: string, tan: string|null, coords: string, radians: string} | null}
 */
export function exactValues(degrees) {
    const key = Number(normalizeAngle(degrees).toFixed(1));
    const entry = EXACT_ANGLES.get(key);

    return entry ? { ...entry } : null;
}

/**
 * Formatea un número con decimales fijos, sin `-0`.
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function formatNumber(value, digits = 3) {
    return value.toFixed(digits).replace(/^-(0(?:\.0+)?)$/, "$1");
}

/**
 * Muestra el ángulo normalizado con un máximo de un decimal.
 * @param {number} degrees
 * @returns {string}
 */
export function formatAngle(degrees) {
    const rounded = Number(normalizeAngle(degrees).toFixed(1));
    return `${rounded}°`;
}

/**
 * Muestra el ángulo en radianes con tres decimales.
 * @param {number} degrees
 * @returns {string}
 */
export function formatRadians(degrees) {
    return `${normalizeAngle(degrees) === 0 ? 0 : toRadians(normalizeAngle(degrees)).toFixed(3)} rad`;
}
