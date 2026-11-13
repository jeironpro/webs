import { MAX_RADIUS } from "./mandala.js";

const HALF_TURN = Math.PI;
const QUARTER_TURN = Math.PI / 2;

const BASE_TEMPLATES = [
    {
        id: "clasico",
        name: "Clásico",
        symmetry: 12,
        bands: [
            {
                innerRadius: 0,
                outerRadius: 74,
                petals: [{ type: "cuna", innerRadius: 0, outerRadius: 74 }],
            },
            {
                innerRadius: 74,
                outerRadius: 148,
                petals: [
                    {
                        type: "gota",
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
                petals: [{ type: "petalo", innerRadius: 148, outerRadius: 222, ancho: 0.7 }],
            },
            {
                innerRadius: 222,
                outerRadius: 290,
                petals: [
                    {
                        type: "cuna",
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
                petals: [{ type: "petalo", innerRadius: 16, outerRadius: 96, ancho: 0.85 }],
            },
            {
                innerRadius: 96,
                outerRadius: 168,
                petals: [
                    {
                        type: "gota",
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
                        type: "petalo",
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
                petals: [{ type: "cuna", innerRadius: 236, outerRadius: 290, ancho: 0.6 }],
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
                petals: [{ type: "cuna", innerRadius: 0, outerRadius: 62 }],
            },
            {
                innerRadius: 62,
                outerRadius: 132,
                petals: [{ type: "petalo", innerRadius: 62, outerRadius: 132, ancho: 1 }],
            },
            {
                innerRadius: 132,
                outerRadius: 205,
                petals: [
                    {
                        type: "gota",
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
                        type: "cuna",
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
                petals: [{ type: "gota", innerRadius: 22, outerRadius: 92, ancho: 0.45 }],
            },
            {
                innerRadius: 92,
                outerRadius: 162,
                petals: [
                    {
                        type: "petalo",
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
                petals: [{ type: "cuna", innerRadius: 162, outerRadius: 235, ancho: 0.7 }],
            },
            {
                innerRadius: 235,
                outerRadius: 290,
                petals: [
                    {
                        type: "gota",
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
                petals: [{ type: "cuna", innerRadius: 0, outerRadius: 60 }],
            },
            {
                innerRadius: 60,
                outerRadius: 130,
                petals: [{ type: "cuna", innerRadius: 60, outerRadius: 130, ancho: 0.45 }],
            },
            {
                innerRadius: 130,
                outerRadius: 200,
                petals: [
                    {
                        type: "gota",
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
                        type: "diamante",
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
                petals: [{ type: "petalo", innerRadius: 14, outerRadius: 92, ancho: 0.8 }],
            },
            {
                innerRadius: 92,
                outerRadius: 150,
                petals: [
                    {
                        type: "petalo",
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
                petals: [{ type: "gota", innerRadius: 150, outerRadius: 225, ancho: 0.5 }],
            },
            {
                innerRadius: 225,
                outerRadius: 290,
                petals: [
                    {
                        type: "petalo",
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
                petals: [{ type: "gota", innerRadius: 18, outerRadius: 105, ancho: 1.5 }],
            },
            {
                innerRadius: 105,
                outerRadius: 180,
                petals: [
                    {
                        type: "gota",
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
                petals: [{ type: "gota", innerRadius: 180, outerRadius: 240, ancho: 0.9 }],
            },
            {
                innerRadius: 240,
                outerRadius: 290,
                petals: [
                    {
                        type: "gota",
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
                petals: [{ type: "diamante", innerRadius: 0, outerRadius: 70, ancho: 0.9 }],
            },
            {
                innerRadius: 70,
                outerRadius: 140,
                petals: [
                    {
                        type: "cuna",
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
                petals: [{ type: "diamante", innerRadius: 140, outerRadius: 220, ancho: 0.85 }],
            },
            {
                innerRadius: 220,
                outerRadius: 290,
                petals: [
                    {
                        type: "cuna",
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
                petals: [{ type: "cuna", innerRadius: 0, outerRadius: 80 }],
            },
            {
                innerRadius: 80,
                outerRadius: 165,
                petals: [
                    {
                        type: "gota",
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
                petals: [{ type: "diamante", innerRadius: 165, outerRadius: 240, ancho: 0.8 }],
            },
            {
                innerRadius: 240,
                outerRadius: 290,
                petals: [
                    {
                        type: "cuna",
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
                petals: [{ type: "cuna", innerRadius: 0, outerRadius: 55 }],
            },
            {
                innerRadius: 55,
                outerRadius: 130,
                petals: [
                    {
                        type: "diamante",
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
                petals: [{ type: "gota", innerRadius: 130, outerRadius: 205, ancho: 0.45 }],
            },
            {
                innerRadius: 205,
                outerRadius: 290,
                petals: [
                    {
                        type: "cuna",
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

const GENERATED_COUNT = 90;

const SYMMETRIES = [4, 5, 6, 8, 10, 12, 16];
const PETAL_TYPES = ["cuna", "petalo", "gota", "diamante"];
const MIN_WIDTH = { cuna: 0.25, petal: 0.5, drop: 0.4, diamante: 0.4 };
const MAX_WIDTH = { cuna: 1, petal: 1, drop: 1.5, diamante: 1 };

const MIN_BANDS = 3;
const MAX_BANDS = 4;

const MIN_BAND_THICKNESS = 10;

const MIN_CENTER_RADIUS = 8;
const MAX_CENTER_RADIUS = 16;

const NOUNS = ["Flor", "Sol", "Rosas", "Estrella", "Abanico", "Loto", "Corona", "Ondas", "Campana"];
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

function createRandom(seed) {
    let state = seed >>> 0;
    return function random() {
        state = (state + 0x6d2b79f5) | 0;
        let mix = Math.imul(state ^ (state >>> 15), 1 | state);
        mix = (mix + Math.imul(mix ^ (mix >>> 7), 61 | mix)) ^ mix;
        return ((mix ^ (mix >>> 14)) >>> 0) / 4294967296;
    };
}

function integerBetween(random, min, max) {
    return min + Math.floor(random() * (max - min + 1));
}

function realBetween(random, min, max) {
    return min + random() * (max - min);
}

function roundTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}

function generatedId(index) {
    return `generada-${String(index + 1).padStart(2, "0")}`;
}

function generatedName(index) {
    const noun = NOUNS[Math.floor(index / ADJECTIVES.length)];
    const adjective = ADJECTIVES[index % ADJECTIVES.length];
    return `${noun} ${adjective}`;
}

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

const GENERATED_TEMPLATES = [];
for (let i = 0; i < GENERATED_COUNT; i += 1) {
    GENERATED_TEMPLATES.push(generateTemplate(i));
}
const TEMPLATES = BASE_TEMPLATES.concat(GENERATED_TEMPLATES);

function getById(id) {
    return TEMPLATES.find((template) => template.id === id) || TEMPLATES[0];
}

export { TEMPLATES, getById };
