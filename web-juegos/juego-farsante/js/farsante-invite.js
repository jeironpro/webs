const VERSION = 1;

function bytesABinario(bytes) {
    let binario = "";
    bytes.forEach((byte) => {
        binario += String.fromCharCode(byte);
    });
    return binario;
}

function binarioABytes(binario) {
    return Uint8Array.from(binario, (caracter) => caracter.charCodeAt(0));
}

function codificarBase64(binario) {
    if (typeof btoa === "function") {
        return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    }
    return Buffer.from(binario, "binary")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function decodificarBase64(codigo) {
    const normalizado = String(codigo)
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(codigo.length / 4) * 4, "=");
    if (typeof atob === "function") return atob(normalizado);
    return Buffer.from(normalizado, "base64").toString("binary");
}

export function codificarInvitacion(payload) {
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    return codificarBase64(bytesABinario(bytes));
}

function validarPayload(payload) {
    if (!payload || payload.v !== VERSION) {
        throw new Error("La invitación no tiene un formato reconocido.");
    }
    if (!Array.isArray(payload.jugadores) || payload.jugadores.length < 3) {
        throw new Error("La invitación no incluye una mesa válida.");
    }
    const ids = new Set();
    payload.jugadores.forEach((jugador) => {
        if (!jugador || typeof jugador.id !== "string" || typeof jugador.nombre !== "string") {
            throw new Error("La invitación incluye un jugador inválido.");
        }
        if (ids.has(jugador.id)) throw new Error("La invitación repite un jugador.");
        ids.add(jugador.id);
    });
    const { config, partida } = payload;
    if (!config || ![1, 2, 3].includes(config.rondas)) {
        throw new Error("La invitación no incluye una configuración válida.");
    }
    if (!Array.isArray(config.tematicaIds) || config.tematicaIds.length === 0) {
        throw new Error("La invitación no incluye temáticas.");
    }
    if (
        !partida ||
        !Array.isArray(partida.farsanteIds) ||
        ![1, 2].includes(partida.farsanteIds.length)
    ) {
        throw new Error("La invitación no incluye el reparto.");
    }
    partida.farsanteIds.forEach((id) => {
        if (!ids.has(id)) throw new Error("La invitación apunta a un farsante inexistente.");
    });
    if (typeof partida.palabra !== "string" || typeof partida.categoria !== "string") {
        throw new Error("La invitación no incluye la palabra del caso.");
    }
    return payload;
}

export function leerInvitacion(codigo) {
    if (!codigo) throw new Error("Falta el código de invitación.");
    let payload;
    try {
        payload = JSON.parse(new TextDecoder().decode(binarioABytes(decodificarBase64(codigo))));
    } catch {
        throw new Error("La invitación no se puede leer.");
    }
    return validarPayload(payload);
}

export function crearPayloadInvitacion({ jugadores, config, partida }) {
    return {
        v: VERSION,
        jugadores: jugadores.map(({ id, nombre, avatar }) => ({ id, nombre, avatar })),
        config: {
            rondas: config.rondas,
            tematicaIds: [...config.tematicaIds],
            pista: Boolean(config.pista),
            farsantes: partida.farsanteIds.length,
        },
        partida: {
            farsanteIds: [...partida.farsanteIds],
            palabra: partida.palabra,
            categoria: partida.categoria,
            tematicaId: partida.tematicaId,
            letra: partida.letra,
        },
    };
}

export function crearEnlaceInvitacion(baseUrl, payload) {
    const limpia = String(baseUrl).split("#")[0];
    return `${limpia}#invitacion=${codificarInvitacion(payload)}`;
}

export function leerInvitacionDeHash(hash) {
    const parametros = new URLSearchParams(String(hash || "").replace(/^#/, ""));
    const codigo = parametros.get("invitacion");
    if (!codigo) return null;
    try {
        return leerInvitacion(codigo);
    } catch {
        return null;
    }
}
