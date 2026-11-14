export const LANGS = ["ca", "es", "en"];

export const DEFAULT_LANG = "ca";

const REGIONS = {
    ca: "ca-ES",
    es: "es-ES",
    en: "en-GB",
};

const LANG_DIR = "data/lang/";

const STORAGE_KEY = "continguts-daw-lang";

const dictionaryCache = new Map();

const pendingLoads = new Map();

const savedLanguage = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const persistLanguage = (lang) => {
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch {
        return;
    }
};

const detectLanguage = () => {
    const saved = savedLanguage();
    if (saved && LANGS.includes(saved)) return saved;
    if (typeof navigator !== "undefined") {
        const firstPart = (navigator.language || "").split("-")[0].toLowerCase();
        if (LANGS.includes(firstPart)) return firstPart;
    }
    return DEFAULT_LANG;
};

let currentLang = detectLanguage();

export const current = () => currentLang;

export const locale = () => REGIONS[currentLang] || REGIONS[DEFAULT_LANG];

export const setLanguage = (lang) => {
    if (!LANGS.includes(lang)) return false;
    currentLang = lang;
    persistLanguage(lang);
    return true;
};

export const loadDictionary = async (lang) => {
    if (dictionaryCache.has(lang)) return dictionaryCache.get(lang);
    if (!pendingLoads.has(lang)) {
        const request = (async () => {
            try {
                const response = await fetch(`${LANG_DIR}${lang}.json`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                dictionaryCache.set(lang, data);
                return data;
            } finally {
                pendingLoads.delete(lang);
            }
        })();
        pendingLoads.set(lang, request);
    }
    return pendingLoads.get(lang);
};

export const ensureDictionaries = async (lang) => {
    const targets = lang === DEFAULT_LANG ? [DEFAULT_LANG] : [lang, DEFAULT_LANG];
    const results = await Promise.allSettled(targets.map((item) => loadDictionary(item)));
    const requested = results[0];
    if (requested.status === "rejected") throw requested.reason;
};

export const translate = (key, vars) => {
    const activeTable = dictionaryCache.get(currentLang) || {};
    const fallbackTable = dictionaryCache.get(DEFAULT_LANG) || {};
    let text = activeTable[key];
    if (text === null || text === undefined) text = fallbackTable[key];
    if (text === null || text === undefined) text = key;
    if (vars) {
        text = text.replace(/\{(\w+)\}/g, (match, name) =>
            vars[name] !== null && vars[name] !== undefined ? vars[name] : match
        );
    }
    return text;
};
