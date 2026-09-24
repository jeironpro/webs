/* ============================================================
   Continguts DAW — internacionalización (i18n)
   ------------------------------------------------------------
   Convenciones de este archivo:
   - Los identificadores van en inglés y los comentarios, en
     español.
   - Los diccionarios de textos viven en archivos JSON separados
     por idioma (lang/ca.json, lang/es.json y lang/en.json) y se
     cargan con fetch, de modo que traducir no exige tocar código.
   - El idioma activo se guarda en localStorage y, si no hay
     preferencia guardada, se detecta el idioma del navegador.
   ============================================================ */

// Idiomas admitidos por la interfaz.
export const LANGS = ["ca", "es", "en"];

// Idioma por defecto cuando no hay preferencia guardada ni el
// navegador coincide con uno de los admitidos. También actúa
// como respaldo si falta una clave en el idioma activo.
export const DEFAULT_LANG = "ca";

// Regiones usadas para formatear números y fechas por idioma.
const REGIONS = {
    ca: "ca-ES",
    es: "es-ES",
    en: "en-GB",
};

// Carpeta donde viven los diccionarios JSON por idioma.
const LANG_DIR = "lang/";

// Clave de localStorage donde se guarda la preferencia de idioma.
const STORAGE_KEY = "continguts-daw-lang";

// Caché de diccionarios ya cargados: idioma -> objeto de textos.
const dictionaryCache = new Map();

// Promesas de descargas en curso para no duplicar peticiones.
const pendingLoads = new Map();

// Lee la preferencia guardada o detecta el idioma del navegador.
const detectLanguage = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && LANGS.includes(saved)) return saved;
    } catch (_) {
        // Sin acceso a localStorage (modo privado): se sigue con
        // la detección del navegador.
    }
    if (typeof navigator !== "undefined") {
        const firstPart = (navigator.language || "").split("-")[0].toLowerCase();
        if (LANGS.includes(firstPart)) return firstPart;
    }
    return DEFAULT_LANG;
};

// Idioma activo de la interfaz (cambia al pulsar el selector).
let currentLang = detectLanguage();

// Devuelve el idioma activo ("ca", "es" o "en").
export const current = () => currentLang;

// Devuelve la región usada para formatear números del idioma.
export const locale = () => REGIONS[currentLang] || REGIONS[DEFAULT_LANG];

// Cambia el idioma activo y guarda la preferencia; devuelve true
// si el idioma solicitado es válido.
export const setLanguage = (lang) => {
    if (!LANGS.includes(lang)) return false;
    currentLang = lang;
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
        // Sin acceso a localStorage: el cambio aplica en memoria.
    }
    return true;
};

// Descarga y cachea el diccionario JSON de un idioma. La promesa
// compartida evita lanzar dos peticiones para el mismo idioma.
export const loadDictionary = async (lang) => {
    if (dictionaryCache.has(lang)) return dictionaryCache.get(lang);
    if (!pendingLoads.has(lang)) {
        const request = fetch(`${LANG_DIR}${lang}.json`)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((data) => {
                dictionaryCache.set(lang, data);
                return data;
            })
            .finally(() => pendingLoads.delete(lang));
        pendingLoads.set(lang, request);
    }
    return pendingLoads.get(lang);
};

// Garantiza que el diccionario del idioma pedido esté cargado y
// también el de catalán (respaldo de claves ausentes). Lanza un
// error si no se puede cargar el idioma solicitado.
export const ensureDictionaries = async (lang) => {
    const targets = lang === DEFAULT_LANG ? [DEFAULT_LANG] : [lang, DEFAULT_LANG];
    const results = await Promise.allSettled(targets.map((item) => loadDictionary(item)));
    const requested = results[0];
    if (requested.status === "rejected") throw requested.reason;
};

// Traduce una clave al idioma activo y sustituye las variables
// {name} por su valor (si se pasan). Sin traducción: la clave o
// el texto del idioma de respaldo (catalán).
export const translate = (key, vars) => {
    const activeTable = dictionaryCache.get(currentLang) || {};
    const fallbackTable = dictionaryCache.get(DEFAULT_LANG) || {};
    let text = activeTable[key];
    if (text == null) text = fallbackTable[key];
    if (text == null) text = key;
    if (vars) {
        text = text.replace(/\{(\w+)\}/g, (match, name) =>
            vars[name] != null ? vars[name] : match
        );
    }
    return text;
};
