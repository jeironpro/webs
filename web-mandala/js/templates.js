/**
 * Plantillas de mandalas.
 *
 * Cada plantilla define su simetría rotacional y una lista de bandas
 * anulares. Cada banda tiene un radio interior/exterior y un conjunto de
 * descriptores de pétalos que se replican alrededor del centro.
 *
 * Tipos de pétalo disponibles:
 *  - "cuna":     sector circular (triángulo con borde curvo).
 *  - "petalo":   borde exterior curvo tipo lente.
 *  - "gota":     círculo (su "ancho" controla el radio del círculo).
 *  - "diamante": lente con cierre en línea recta.
 *
 * El catálogo combina 10 diseños curados (PLANTILLAS_BASE) con 90 variaciones
 * generadas de forma determinista (misma semilla por índice), de modo que cada
 * plantilla se dibuja siempre igual. Se expone el namespace MandalaTemplates.
 */
(function (global) {
    "use strict";

    /* ------------------------------------------------------------------------
     * Constantes compartidas
     * ---------------------------------------------------------------------- */

    // Desplazamientos angulares usados para intercalar pétalos entre bandas:
    // la mitad del giro (PI) y un cuarto de giro.
    const HALF_TURN = Math.PI;
    const QUARTER_TURN = Math.PI / 2;

    // Radio exterior máximo del lienzo (debe coincidir con Mandala.RADIO_MAX).
    const MAX_RADIUS = 290;

    /* ------------------------------------------------------------------------
     * Catálogo curado (10 diseños definidos a mano)
     * ---------------------------------------------------------------------- */

    const BASE_TEMPLATES = [
        {
            id: "clasico",
            name: "Clásico",
            symmetry: 12,
            bands: [
                {
                    innerRadius: 0,
                    outerRadius: 74,
                    petals: [{ type: "wedge", innerRadius: 0, outerRadius: 74 }],
                },
                {
                    innerRadius: 74,
                    outerRadius: 148,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 74,
                            outerRadius: 148,
                            ancho: 0.5,
                            start: HALF_TURN / 12,
                        },
                    ],
                },
                {
                    innerRadius: 148,
                    outerRadius: 222,
                    petals: [{ type: "petal", innerRadius: 148, outerRadius: 222, ancho: 0.7 }],
                },
                {
                    innerRadius: 222,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "wedge",
                            innerRadius: 222,
                            outerRadius: 290,
                            ancho: 0.55,
                            start: HALF_TURN / 12,
                        },
                    ],
                },
            ],
        },
        {
            id: "flor",
            name: "Flor",
            symmetry: 8,
            bands: [
                {
                    innerRadius: 16,
                    outerRadius: 96,
                    petals: [{ type: "petal", innerRadius: 16, outerRadius: 96, ancho: 0.85 }],
                },
                {
                    innerRadius: 96,
                    outerRadius: 168,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 96,
                            outerRadius: 168,
                            ancho: 0.5,
                            start: HALF_TURN / 8,
                        },
                    ],
                },
                {
                    innerRadius: 168,
                    outerRadius: 236,
                    petals: [
                        {
                            type: "petal",
                            innerRadius: 168,
                            outerRadius: 236,
                            ancho: 0.6,
                            start: HALF_TURN / 8,
                        },
                    ],
                },
                {
                    innerRadius: 236,
                    outerRadius: 290,
                    petals: [{ type: "wedge", innerRadius: 236, outerRadius: 290, ancho: 0.6 }],
                },
            ],
            center: { radius: 12 },
        },
        {
            id: "sol",
            name: "Sol radiante",
            symmetry: 12,
            bands: [
                {
                    innerRadius: 0,
                    outerRadius: 62,
                    petals: [{ type: "wedge", innerRadius: 0, outerRadius: 62 }],
                },
                {
                    innerRadius: 62,
                    outerRadius: 132,
                    petals: [{ type: "petal", innerRadius: 62, outerRadius: 132, ancho: 1 }],
                },
                {
                    innerRadius: 132,
                    outerRadius: 205,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 132,
                            outerRadius: 205,
                            ancho: 0.5,
                            start: HALF_TURN / 12,
                        },
                    ],
                },
                {
                    innerRadius: 205,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "wedge",
                            innerRadius: 205,
                            outerRadius: 290,
                            ancho: 0.35,
                            start: QUARTER_TURN / 3,
                        },
                    ],
                },
            ],
            center: { radius: 14 },
        },
        {
            id: "abstracto",
            name: "Abstracto",
            symmetry: 6,
            bands: [
                {
                    innerRadius: 22,
                    outerRadius: 92,
                    petals: [{ type: "drop", innerRadius: 22, outerRadius: 92, ancho: 0.45 }],
                },
                {
                    innerRadius: 92,
                    outerRadius: 162,
                    petals: [
                        {
                            type: "petal",
                            innerRadius: 92,
                            outerRadius: 162,
                            ancho: 0.9,
                            start: HALF_TURN / 6,
                        },
                    ],
                },
                {
                    innerRadius: 162,
                    outerRadius: 235,
                    petals: [{ type: "wedge", innerRadius: 162, outerRadius: 235, ancho: 0.7 }],
                },
                {
                    innerRadius: 235,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 235,
                            outerRadius: 290,
                            ancho: 0.4,
                            start: QUARTER_TURN / 3,
                        },
                    ],
                },
            ],
            center: { radius: 12 },
        },
        {
            id: "estrella",
            name: "Estrella",
            symmetry: 5,
            bands: [
                {
                    innerRadius: 0,
                    outerRadius: 60,
                    petals: [{ type: "wedge", innerRadius: 0, outerRadius: 60 }],
                },
                {
                    innerRadius: 60,
                    outerRadius: 130,
                    petals: [{ type: "wedge", innerRadius: 60, outerRadius: 130, ancho: 0.45 }],
                },
                {
                    innerRadius: 130,
                    outerRadius: 200,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 130,
                            outerRadius: 200,
                            ancho: 0.5,
                            start: HALF_TURN / 5,
                        },
                    ],
                },
                {
                    innerRadius: 200,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "diamond",
                            innerRadius: 200,
                            outerRadius: 290,
                            ancho: 0.5,
                            start: HALF_TURN / 10,
                        },
                    ],
                },
            ],
        },
        {
            id: "petalos-dobles",
            name: "Pétalos dobles",
            symmetry: 8,
            bands: [
                {
                    innerRadius: 14,
                    outerRadius: 92,
                    petals: [{ type: "petal", innerRadius: 14, outerRadius: 92, ancho: 0.8 }],
                },
                {
                    innerRadius: 92,
                    outerRadius: 150,
                    petals: [
                        {
                            type: "petal",
                            innerRadius: 92,
                            outerRadius: 150,
                            ancho: 0.55,
                            start: HALF_TURN / 8,
                        },
                    ],
                },
                {
                    innerRadius: 150,
                    outerRadius: 225,
                    petals: [{ type: "drop", innerRadius: 150, outerRadius: 225, ancho: 0.5 }],
                },
                {
                    innerRadius: 225,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "petal",
                            innerRadius: 225,
                            outerRadius: 290,
                            ancho: 0.6,
                            start: HALF_TURN / 8,
                        },
                    ],
                },
            ],
            center: { radius: 10 },
        },
        {
            id: "nacar",
            name: "Nácar",
            symmetry: 12,
            bands: [
                {
                    innerRadius: 18,
                    outerRadius: 105,
                    petals: [{ type: "drop", innerRadius: 18, outerRadius: 105, ancho: 1.5 }],
                },
                {
                    innerRadius: 105,
                    outerRadius: 180,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 105,
                            outerRadius: 180,
                            ancho: 1.2,
                            start: HALF_TURN / 12,
                        },
                    ],
                },
                {
                    innerRadius: 180,
                    outerRadius: 240,
                    petals: [{ type: "drop", innerRadius: 180, outerRadius: 240, ancho: 0.9 }],
                },
                {
                    innerRadius: 240,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 240,
                            outerRadius: 290,
                            ancho: 0.7,
                            start: HALF_TURN / 12,
                        },
                    ],
                },
            ],
            center: { radius: 12 },
        },
        {
            id: "vainas",
            name: "Vainas",
            symmetry: 6,
            bands: [
                {
                    innerRadius: 0,
                    outerRadius: 70,
                    petals: [{ type: "diamond", innerRadius: 0, outerRadius: 70, ancho: 0.9 }],
                },
                {
                    innerRadius: 70,
                    outerRadius: 140,
                    petals: [
                        {
                            type: "wedge",
                            innerRadius: 70,
                            outerRadius: 140,
                            ancho: 0.5,
                            start: HALF_TURN / 6,
                        },
                    ],
                },
                {
                    innerRadius: 140,
                    outerRadius: 220,
                    petals: [{ type: "diamond", innerRadius: 140, outerRadius: 220, ancho: 0.85 }],
                },
                {
                    innerRadius: 220,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "wedge",
                            innerRadius: 220,
                            outerRadius: 290,
                            ancho: 0.45,
                            start: HALF_TURN / 6,
                        },
                    ],
                },
            ],
            center: { radius: 12 },
        },
        {
            id: "geometrico",
            name: "Geométrico",
            symmetry: 4,
            bands: [
                {
                    innerRadius: 0,
                    outerRadius: 80,
                    petals: [{ type: "wedge", innerRadius: 0, outerRadius: 80 }],
                },
                {
                    innerRadius: 80,
                    outerRadius: 165,
                    petals: [
                        {
                            type: "drop",
                            innerRadius: 80,
                            outerRadius: 165,
                            ancho: 0.6,
                            start: HALF_TURN / 4,
                        },
                    ],
                },
                {
                    innerRadius: 165,
                    outerRadius: 240,
                    petals: [{ type: "diamond", innerRadius: 165, outerRadius: 240, ancho: 0.8 }],
                },
                {
                    innerRadius: 240,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "wedge",
                            innerRadius: 240,
                            outerRadius: 290,
                            ancho: 0.9,
                            start: HALF_TURN / 4,
                        },
                    ],
                },
            ],
        },
        {
            id: "puntas",
            name: "Puntas",
            symmetry: 16,
            bands: [
                {
                    innerRadius: 0,
                    outerRadius: 55,
                    petals: [{ type: "wedge", innerRadius: 0, outerRadius: 55 }],
                },
                {
                    innerRadius: 55,
                    outerRadius: 130,
                    petals: [
                        {
                            type: "diamond",
                            innerRadius: 55,
                            outerRadius: 130,
                            ancho: 0.5,
                            start: HALF_TURN / 16,
                        },
                    ],
                },
                {
                    innerRadius: 130,
                    outerRadius: 205,
                    petals: [{ type: "drop", innerRadius: 130, outerRadius: 205, ancho: 0.45 }],
                },
                {
                    innerRadius: 205,
                    outerRadius: 290,
                    petals: [
                        {
                            type: "wedge",
                            innerRadius: 205,
                            outerRadius: 290,
                            ancho: 0.28,
                            start: HALF_TURN / 16,
                        },
                    ],
                },
            ],
            center: { radius: 12 },
        },
    ];

    /* ------------------------------------------------------------------------
     * Catálogo ampliado: variaciones generadas de forma determinista
     * ---------------------------------------------------------------------- */

    // Cantidad de variaciones generadas que completan el catálogo hasta 100.
    const GENERATED_COUNT = 90;

    // Espacio paramétrico: simetrías válidas, tipos de pétalo y rangos de ancho
    // admitidos por el motor (ver mandala.js) para cada tipo.
    const SYMMETRIES = [4, 5, 6, 8, 10, 12, 16];
    const PETAL_TYPES = ["wedge", "petal", "drop", "diamond"];
    const MIN_WIDTH = { cuna: 0.25, petal: 0.5, drop: 0.4, diamante: 0.4 };
    const MAX_WIDTH = { cuna: 1, petal: 1, drop: 1.5, diamante: 1 };

    // Número de bandas por plantilla generada.
    const MIN_BANDS = 3;
    const MAX_BANDS = 4;

    // Grosor radial mínimo entre bandas consecutivas (evita aros degenerados).
    const MIN_BAND_THICKNESS = 10;

    // Rango del radio del círculo de cierre (centro) cuando está presente.
    const MIN_CENTER_RADIUS = 8;
    const MAX_CENTER_RADIUS = 16;

    // Léxicos para componer nombres propios únicos: 9 sustantivos × 10 adjetivos
    // = 90 combinaciones distintas que cubren las 90 variaciones.
    const NOUNS = [
        "Flor",
        "Sol",
        "Rosas",
        "Estrella",
        "Abanico",
        "Loto",
        "Corona",
        "Ondas",
        "Campana",
    ];
    const ADJECTIVES = [
        "serena",
        "fogosa",
        "luminosa",
        "silvestre",
        "dorada",
        "celeste",
        "nocturna",
        "tropical",
        "esmeralda",
        "sutil",
    ];

    /**
     * Generador pseudoaleatorio determinista (mulberry32) sembrado por índice:
     * la misma semilla produce siempre la misma secuencia de números.
     */
    function createRandom(seed) {
        let state = seed >>> 0;
        return function random() {
            state = (state + 0x6d2b79f5) | 0;
            let mix = Math.imul(state ^ (state >>> 15), 1 | state);
            mix = (mix + Math.imul(mix ^ (mix >>> 7), 61 | mix)) ^ mix;
            return ((mix ^ (mix >>> 14)) >>> 0) / 4294967296;
        };
    }

    /** Devuelve un entero aleatorio dentro del intervalo [minimo, maximo]. */
    function integerBetween(random, min, max) {
        return min + Math.floor(random() * (max - min + 1));
    }

    /** Devuelve un real aleatorio dentro del intervalo [minimo, maximo). */
    function realBetween(random, min, max) {
        return min + random() * (max - min);
    }

    /** Redondea un número a dos decimales para mantener los datos compactos. */
    function roundTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }

    /** Compone el id único de una variación (p. ej. "generada-05"). */
    function generatedId(index) {
        return `generada-${String(index + 1).padStart(2, "0")}`;
    }

    /** Compone el nombre propio único de una variación (sustantivo + adjetivo). */
    function generatedName(index) {
        const noun = NOUNS[Math.floor(index / ADJECTIVES.length)];
        const adjective = ADJECTIVES[index % ADJECTIVES.length];
        return `${noun} ${adjective}`;
    }

    /**
     * Reparte el radio máximo en las bandas mediante cortes aleatorios
     * ordenados, garantizando un grosor mínimo entre bandas consecutivas.
     */
    function partitionRadii(random, bandCount) {
        const cuts = [];
        for (let i = 0; i < bandCount - 1; i += 1) {
            cuts.push(random());
        }
        cuts.sort((a, b) => a - b);

        const limits = [];
        let last = 0;
        for (const fraction of cuts) {
            let value = Math.round(fraction * MAX_RADIUS);
            if (value < last + MIN_BAND_THICKNESS) {
                value = last + MIN_BAND_THICKNESS;
            }
            if (value > MAX_RADIUS - MIN_BAND_THICKNESS) {
                value = MAX_RADIUS - MIN_BAND_THICKNESS;
            }
            limits.push(value);
            last = value;
        }
        limits.push(MAX_RADIUS);
        return limits;
    }

    /** Genera una plantilla determinista a partir de su índice (misma semilla → mismo diseño). */
    function generateTemplate(index) {
        const random = createRandom(index + 1);
        const symmetry = SYMMETRIES[integerBetween(random, 0, SYMMETRIES.length - 1)];
        const bandCount = integerBetween(random, MIN_BANDS, MAX_BANDS);
        const limits = partitionRadii(random, bandCount);
        const withCenter = random() < 0.5;

        const bands = [];
        let innerRadius = 0;
        for (let b = 0; b < bandCount; b += 1) {
            const outerRadius = limits[b];
            const type = PETAL_TYPES[integerBetween(random, 0, PETAL_TYPES.length - 1)];
            const ancho = roundTwoDecimals(realBetween(random, MIN_WIDTH[type], MAX_WIDTH[type]));
            const start = random() < 0.5 ? 0 : HALF_TURN / symmetry;
            bands.push({
                innerRadius,
                outerRadius,
                petals: [
                    {
                        type,
                        innerRadius,
                        outerRadius,
                        ancho,
                        start,
                    },
                ],
            });
            innerRadius = outerRadius;
        }

        const template = {
            id: generatedId(index),
            name: generatedName(index),
            symmetry,
            bands,
        };
        if (withCenter) {
            template.center = {
                radius: integerBetween(random, MIN_CENTER_RADIUS, MAX_CENTER_RADIUS),
            };
        }
        return template;
    }

    // Construye el catálogo final: las 10 curadas seguidas de las 90 variaciones.
    const GENERATED_TEMPLATES = [];
    for (let i = 0; i < GENERATED_COUNT; i += 1) {
        GENERATED_TEMPLATES.push(generateTemplate(i));
    }
    const TEMPLATES = BASE_TEMPLATES.concat(GENERATED_TEMPLATES);

    /** Devuelve la plantilla con el id indicado (por defecto, la primera). */
    function getById(id) {
        return TEMPLATES.find((template) => template.id === id) || TEMPLATES[0];
    }

    global.MandalaTemplates = {
        list: TEMPLATES,
        get: getById,
    };
})(window);
