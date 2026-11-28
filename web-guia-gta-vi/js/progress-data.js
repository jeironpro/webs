/* Guía GTA VI · Progreso: doce categorías y contador de fichas */

import { loadJSON } from "./data.js";

const catalog = await loadJSON("progreso.json", []);

export const PROGRESS = Array.isArray(catalog) ? catalog : [];

export function countEntries(node) {
    if (Array.isArray(node.items)) return node.items.length;
    if (Array.isArray(node.list)) return node.list.length;
    if (Array.isArray(node.groups)) {
        return node.groups.reduce((total, group) => total + countEntries(group), 0);
    }
    return 0;
}

export const PROGRESS_TOTAL = PROGRESS.reduce(
    (total, category) => total + countEntries(category),
    0
);
