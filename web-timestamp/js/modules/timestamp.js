/**
 * Conversión entre marcas de tiempo Unix, fechas locales y lecturas formateadas.
 * El módulo no toca el DOM: todo lo que devuelve se puede probar con fechas fijas.
 */

const NUMERIC = /^-?\d+(?:\.\d+)?$/;
const MS_THRESHOLD = 1e11;

const UTC_FORMAT = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
});

const LOCAL_FORMAT = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
});

const RELATIVE = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

const UNITS = [
    ["year", 31536000000],
    ["month", 2592000000],
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
    ["second", 1000],
];

/**
 * Interpreta una marca de tiempo numérica y decide si está en segundos o milisegundos.
 * Los valores enteros con magnitud de 1e11 o más se consideran milisegundos.
 * @param {string|number} value
 * @returns {{ok: true, unit: "s"|"ms", milliseconds: number, seconds: number, date: Date} | {ok: false, error: string}}
 */
export function parseTimestamp(value) {
    const raw = String(value ?? "").trim();
    if (raw === "") return { ok: false, error: "empty" };
    if (!NUMERIC.test(raw)) return { ok: false, error: "invalid" };

    const number = Number(raw);
    if (!Number.isFinite(number)) return { ok: false, error: "invalid" };

    const unit = Math.abs(number) >= MS_THRESHOLD && Number.isInteger(number) ? "ms" : "s";
    const milliseconds = unit === "ms" ? number : Math.round(number * 1000);
    const date = new Date(milliseconds);

    if (Number.isNaN(date.getTime())) return { ok: false, error: "range" };

    return {
        ok: true,
        unit,
        milliseconds,
        seconds: Math.floor(milliseconds / 1000),
        date,
    };
}

/**
 * Interpreta el valor de un input `datetime-local` como fecha local.
 * @param {string} value
 * @returns {{ok: true, date: Date, milliseconds: number, seconds: number} | {ok: false, error: string}}
 */
export function parseDateInput(value) {
    const raw = String(value ?? "").trim();
    if (raw === "") return { ok: false, error: "empty" };

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return { ok: false, error: "invalid" };

    return {
        ok: true,
        date,
        milliseconds: date.getTime(),
        seconds: Math.floor(date.getTime() / 1000),
    };
}

/**
 * Da formato local `YYYY-MM-DDTHH:mm:ss` para rellenar un input datetime-local.
 * @param {Date} date
 * @returns {string}
 */
export function toDatetimeLocal(date) {
    const pad = (value) => String(value).padStart(2, "0");

    return [
        date.getFullYear(),
        "-",
        pad(date.getMonth() + 1),
        "-",
        pad(date.getDate()),
        "T",
        pad(date.getHours()),
        ":",
        pad(date.getMinutes()),
        ":",
        pad(date.getSeconds()),
    ].join("");
}

/**
 * Describe la diferencia entre dos fechas en español.
 * @param {Date} date
 * @param {Date} [now]
 * @returns {string}
 */
export function relativeTime(date, now = new Date()) {
    const diff = date.getTime() - now.getTime();
    const absolute = Math.abs(diff);

    if (absolute < 1000) return "ahora mismo";

    for (const [unit, size] of UNITS) {
        if (absolute >= size || unit === "second") {
            return RELATIVE.format(Math.round(diff / size), unit);
        }
    }

    return "ahora mismo";
}

/**
 * Etiqueta del desfase de la zona local, por ejemplo `UTC+01:00`.
 * @param {Date} date
 * @returns {string}
 */
export function offsetLabel(date) {
    const minutes = -date.getTimezoneOffset();
    const sign = minutes >= 0 ? "+" : "-";
    const absolute = Math.abs(minutes);

    return `UTC${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(
        absolute % 60
    ).padStart(2, "0")}`;
}

/**
 * Construye todas las lecturas que muestra la interfaz.
 * @param {Date} date
 * @returns {{iso: string, utc: string, local: string, seconds: string, milliseconds: string, zone: string, offset: string}}
 */
export function buildOutputs(date) {
    return {
        iso: date.toISOString(),
        utc: UTC_FORMAT.format(date),
        local: LOCAL_FORMAT.format(date),
        seconds: String(Math.floor(date.getTime() / 1000)),
        milliseconds: String(date.getTime()),
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offset: offsetLabel(date),
    };
}
