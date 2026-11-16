export const DEFAULT_PRESET_ID = "biblia-biblias";

export const PRESETS = [
    {
        id: "biblia-biblias",
        group: "Biblia",
        label: "Biblias",
        method: "GET",
        url: "http://127.0.0.1:8000/biblias",
        headers: [],
        body: "",
        note: "Listado público de biblias.",
    },
    {
        id: "biblia-capitulo",
        group: "Biblia",
        label: "Capítulo 1",
        method: "GET",
        url: "http://127.0.0.1:8000/capitulos/1/versiculos",
        headers: [],
        body: "",
        note: "Versículos del capítulo 1.",
    },
    {
        id: "pokemon-lista",
        group: "Pokémon",
        label: "Lista",
        method: "GET",
        url: "http://127.0.0.1:8000/pokemones",
        headers: [{ key: "X-API-Key", value: "" }],
        body: "",
        note: "Añade tu X-API-Key en Cabeceras.",
    },
    {
        id: "pokemon-id",
        group: "Pokémon",
        label: "Por ID",
        method: "GET",
        url: "http://127.0.0.1:8000/pokemones/1",
        headers: [{ key: "X-API-Key", value: "" }],
        body: "",
        note: "Consulta el Pokémon 1 con tu API Key.",
    },
    {
        id: "demo-publica",
        group: "Demo",
        label: "JSONPlaceholder",
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/posts/1",
        headers: [],
        body: "",
        note: "Una API pública para probar el cliente sin arrancar nada.",
    },
];

/** Return a deep copy so the UI can edit headers and body without touching the catalog. */
export function getPreset(id) {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return null;

    return {
        ...preset,
        headers: preset.headers.map((header) => ({ ...header })),
    };
}
