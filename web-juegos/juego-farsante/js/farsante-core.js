export const MIN_JUGADORES = 3;
export const MAX_JUGADORES = 12;
export const MIN_JUGADORES_DOS_FARSANTES = 6;
export const RONDAS = [1, 2, 3];

export const TEMATICAS = [
    {
        id: "cotidiano",
        nombre: "Lo cotidiano",
        descripcion: "Objetos que tienes a mano",
        palabras: [
            "paraguas",
            "tijeras",
            "linterna",
            "espejo",
            "reloj",
            "maleta",
            "llave",
            "botón",
            "cámara",
            "mapa",
            "brújula",
            "silbato",
            "candado",
            "termómetro",
            "cuaderno",
            "calcetín",
            "cuchara",
            "almohada",
            "cepillo",
            "ventana",
            "cargador",
            "cartera",
            "silla",
            "mantel",
        ],
    },
    {
        id: "lugares",
        nombre: "Lugares",
        descripcion: "Sitios donde pasa algo",
        palabras: [
            "faro",
            "invernadero",
            "observatorio",
            "archivo",
            "teatro",
            "mercado",
            "biblioteca",
            "estación",
            "museo",
            "azotea",
            "sótano",
            "pasaje",
            "isla",
            "desierto",
            "volcán",
            "puente",
            "túnel",
            "acantilado",
            "plaza",
            "jardín",
            "castillo",
            "fábrica",
            "hospital",
            "aeropuerto",
        ],
    },
    {
        id: "oficios",
        nombre: "Oficios",
        descripcion: "Gente con un trabajo raro",
        palabras: [
            "cartógrafo",
            "farero",
            "relojero",
            "titiritero",
            "perfumista",
            "vidriero",
            "encuadernador",
            "herbolario",
            "luthier",
            "jardinero",
            "panadero",
            "sastre",
            "ceramista",
            "ilustrador",
            "guardabosques",
            "buceador",
            "astrónomo",
            "restaurador",
            "locutor",
            "traductor",
            "fotógrafo",
            "arquitecta",
            "mecánico",
            "veterinaria",
        ],
    },
    {
        id: "criaturas",
        nombre: "Criaturas",
        descripcion: "Seres que no deberían existir",
        palabras: [
            "dragón",
            "vampiro",
            "sirena",
            "duende",
            "golem",
            "quimera",
            "fénix",
            "espectro",
            "trol",
            "hada",
            "minotauro",
            "basilisco",
            "yeti",
            "kraken",
            "autómata",
            "licántropo",
            "oráculo",
            "titán",
            "gnomo",
            "arpía",
            "momia",
            "cíclope",
            "salamandra",
            "sombra",
        ],
    },
    {
        id: "sabores",
        nombre: "Sabores",
        descripcion: "Cosas que se prueban",
        palabras: [
            "canela",
            "miel",
            "limón",
            "romero",
            "chocolate",
            "vainilla",
            "pimienta",
            "jengibre",
            "menta",
            "café",
            "tomate",
            "albahaca",
            "trufa",
            "sal",
            "humo",
            "caramelo",
            "lavanda",
            "coco",
            "mostaza",
            "aceituna",
            "frambuesa",
            "comino",
            "naranja",
            "azafrán",
        ],
    },
    {
        id: "cultura",
        nombre: "Cultura",
        descripcion: "Formatos y escenas",
        palabras: [
            "western",
            "documental",
            "novela",
            "cómic",
            "concierto",
            "museo",
            "videojuego",
            "podcast",
            "circo",
            "ópera",
            "festival",
            "tráiler",
            "secuela",
            "biografía",
            "poema",
            "orquesta",
            "escenario",
            "claqueta",
            "carátula",
            "fanfic",
            "remake",
            "meme",
            "bitácora",
            "camerino",
        ],
    },
];

export const AVATARES = 8;

export function normalizarNombre(nombre) {
    return String(nombre ?? "")
        .trim()
        .replace(/\s+/g, " ");
}

export function validarNombre(nombre, jugadores = [], idExcluir = null) {
    const limpio = normalizarNombre(nombre);
    if (limpio.length < 2) return "Escribe al menos 2 letras.";
    if (limpio.length > 16) return "Máximo 16 caracteres.";
    const repetido = jugadores.some(
        (jugador) =>
            jugador.id !== idExcluir &&
            jugador.nombre.toLocaleLowerCase("es") === limpio.toLocaleLowerCase("es")
    );
    return repetido ? "Ese nombre ya está en el expediente." : "";
}

export function crearJugador(nombre, indice, id = `p-${indice + 1}`) {
    return {
        id,
        nombre: normalizarNombre(nombre),
        avatar: indice % AVATARES,
    };
}

export function obtenerTematicas(tematicaIds = []) {
    const ids = new Set(tematicaIds);
    return TEMATICAS.filter((tematica) => ids.has(tematica.id));
}

export function elegirPalabra(tematicaIds, rng = Math.random) {
    const tematicas = obtenerTematicas(tematicaIds);
    const pool = tematicas.flatMap((tematica) =>
        tematica.palabras.map((palabra) => ({
            palabra,
            categoria: tematica.nombre,
            tematicaId: tematica.id,
        }))
    );
    if (pool.length === 0) throw new Error("Selecciona al menos una temática.");
    const indice = Math.min(pool.length - 1, Math.floor(rng() * pool.length));
    return pool[indice];
}

export function crearPartida(jugadores, config, rng = Math.random) {
    if (jugadores.length < MIN_JUGADORES || jugadores.length > MAX_JUGADORES) {
        throw new Error(`La partida necesita entre ${MIN_JUGADORES} y ${MAX_JUGADORES} jugadores.`);
    }
    const cantidadFarsantes = config.farsantes === 2 ? 2 : 1;
    if (cantidadFarsantes === 2 && jugadores.length < MIN_JUGADORES_DOS_FARSANTES) {
        throw new Error(
            `Dos farsantes necesitan al menos ${MIN_JUGADORES_DOS_FARSANTES} jugadores.`
        );
    }
    const palabra = elegirPalabra(config.tematicaIds, rng);
    const disponibles = [...jugadores];
    const farsanteIds = [];
    for (let indice = 0; indice < cantidadFarsantes; indice += 1) {
        const posicion = Math.min(
            disponibles.length - 1,
            Math.floor(rng() * disponibles.length)
        );
        farsanteIds.push(disponibles[posicion].id);
        disponibles.splice(posicion, 1);
    }
    return {
        farsanteIds,
        impostorId: farsanteIds[0],
        palabra: palabra.palabra,
        categoria: palabra.categoria,
        tematicaId: palabra.tematicaId,
        letra: palabra.palabra.charAt(0).toLocaleUpperCase("es"),
        rondaActual: 1,
        eliminados: [],
        votos: {},
        indiceVotante: 0,
        resultado: null,
    };
}

export function jugadoresVivos(jugadores, eliminados = []) {
    const fuera = new Set(eliminados);
    return jugadores.filter((jugador) => !fuera.has(jugador.id));
}

export function ordenPistas(jugadores, eliminados, rondaActual) {
    const vivos = jugadoresVivos(jugadores, eliminados);
    if (vivos.length === 0) return [];
    const salto = (Math.max(1, rondaActual) - 1) % vivos.length;
    return [...vivos.slice(salto), ...vivos.slice(0, salto)];
}

export function resolverVotacion({
    jugadores,
    eliminados = [],
    votos = {},
    rondaActual = 1,
    rondasMax = 2,
    farsanteIds = [],
    impostorId,
}) {
    const idsFarsantes = farsanteIds.length > 0 ? farsanteIds : [impostorId].filter(Boolean);
    const conjuntoFarsantes = new Set(idsFarsantes);
    const vivos = jugadoresVivos(jugadores, eliminados);
    const conteo = new Map();
    Object.values(votos).forEach((objetivoId) => {
        conteo.set(objetivoId, (conteo.get(objetivoId) || 0) + 1);
    });
    const tally = vivos.map((jugador) => ({
        id: jugador.id,
        nombre: jugador.nombre,
        votos: conteo.get(jugador.id) || 0,
    }));
    const maximo = Math.max(0, ...tally.map((fila) => fila.votos));
    const masVotados = tally.filter((fila) => fila.votos === maximo);
    const empate = maximo === 0 || masVotados.length !== 1;
    const eliminadoId = empate ? null : masVotados[0].id;
    const restantes = vivos.filter((jugador) => jugador.id !== eliminadoId);
    const farsantesVivos = restantes.filter((jugador) => conjuntoFarsantes.has(jugador.id));
    const inocentesVivos = restantes.length - farsantesVivos.length;
    let ganador = null;

    if (farsantesVivos.length === 0) ganador = "inocentes";
    else if (inocentesVivos <= farsantesVivos.length) ganador = "farsante";
    else if (rondaActual >= rondasMax) ganador = "farsante";

    return {
        tally,
        maximo,
        empate,
        eliminadoId,
        eraFarsante: Boolean(eliminadoId && conjuntoFarsantes.has(eliminadoId)),
        farsantesVivos,
        restantes,
        ganador,
        fin: Boolean(ganador),
    };
}

export function avanzarRonda(partida) {
    return {
        ...partida,
        rondaActual: partida.rondaActual + 1,
        votos: {},
        indiceVotante: 0,
        resultado: null,
    };
}
