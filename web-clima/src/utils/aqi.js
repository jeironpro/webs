/**
 * Categorías del índice de calidad del aire europeo (EAQI) y del índice
 * AQI estadounidense (US AQI), con la clave de color asociada.
 */
const EUROPEAN_LEVELS = [
    { key: 'good', label: 'Muy buena' }, // 0–20
    { key: 'good', label: 'Buena' }, // 20–40
    { key: 'fair', label: 'Aceptable' }, // 40–60
    { key: 'poor', label: 'Deficiente' }, // 60–80
    { key: 'very-poor', label: 'Muy deficiente' }, // 80–100
    { key: 'extremely-poor', label: 'Extremadamente deficiente' }, // >100
]

const US_LEVELS = [
    { key: 'good', label: 'Buena' }, // 0–50
    { key: 'moderate', label: 'Moderada' }, // 51–100
    { key: 'sensitive', label: 'Insalubre para grupos' }, // 101–150
    { key: 'unhealthy', label: 'Insalubre' }, // 151–200
    { key: 'very-unhealthy', label: 'Muy insalubre' }, // 201–300
    { key: 'hazardous', label: 'Peligrosa' }, // 301+
]

/**
 * Devuelve { key, label } de la categoría del índice europeo.
 */
export function aqiCategoryEU(value) {
    return pickCategory(value, EUROPEAN_LEVELS, [20, 40, 60, 80, 100])
}

/**
 * Devuelve { key, label } de la categoría del índice estadounidense.
 */
export function aqiCategoryUS(value) {
    return pickCategory(value, US_LEVELS, [50, 100, 150, 200, 300])
}

function pickCategory(value, levels, steps) {
    if (value === null || value === undefined) return null
    for (let i = 0; i < steps.length; i += 1) {
        if (value <= steps[i]) return levels[i]
    }
    return levels[levels.length - 1]
}
