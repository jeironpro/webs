/* Guía GTA VI · Progreso: índice de las doce categorías */

import { ARMAS, EQUIPO } from "./progress-arsenal.js";
import {
    ANIMALES,
    ACTIVIDADES,
    BANDAS,
    COLECCIONES,
    CONTACTOS,
    ROBOS,
} from "./progress-leonida.js";
import { DESAFIOS, HISTORIA, TRUCOS } from "./progress-meta.js";
import { VEHICULOS } from "./progress-vehicles.js";

export const PROGRESS = [
    VEHICULOS,
    ARMAS,
    ANIMALES,
    EQUIPO,
    COLECCIONES,
    ACTIVIDADES,
    CONTACTOS,
    BANDAS,
    ROBOS,
    DESAFIOS,
    HISTORIA,
    TRUCOS,
];

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
