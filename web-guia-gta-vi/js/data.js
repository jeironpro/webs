/* Guía GTA VI · carga de catálogos JSON */

const DATA_BASE = "./data/gta-vi/";

export async function loadJSON(name, fallback) {
    try {
        const response = await fetch(`${DATA_BASE}${name}`);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(`No se pudo cargar ${name}`, error);
        return fallback;
    }
}
