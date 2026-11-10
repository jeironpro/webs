const VOCALES = new Set(["a", "e", "i", "o", "u"]);
const TIPOS_PISTA = ["letras", "vocales", "ultima"];

function normalizarLetra(letra) {
    return String(letra)
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function letrasDe(palabra) {
    return Array.from(String(palabra));
}

function contarVocales(palabra) {
    return letrasDe(palabra).filter((letra) => VOCALES.has(normalizarLetra(letra))).length;
}

function ultimaLetra(palabra) {
    const letras = letrasDe(palabra);
    return letras[letras.length - 1];
}

function semillaDe(bot, partida, sal = "") {
    const texto = `${bot.id}|${partida.palabra}|${partida.rondaActual}|${sal}`;
    let semilla = 0;
    for (const caracter of texto) {
        semilla = (semilla * 31 + caracter.codePointAt(0)) >>> 0;
    }
    return semilla;
}

function elegir(lista, semilla) {
    return lista[semilla % lista.length];
}

function pistaVerdadera(tipo, partida) {
    if (tipo === "letras") return `Tiene ${letrasDe(partida.palabra).length} letras.`;
    if (tipo === "vocales") return `Lleva ${contarVocales(partida.palabra)} vocales.`;
    return `Termina en ${ultimaLetra(partida.palabra)}.`;
}

function pistaFalsa(tipo, partida, semilla) {
    if (tipo === "letras") {
        const total = letrasDe(partida.palabra).length;
        return `Yo diría que tiene ${Math.max(1, total + (semilla % 2 === 0 ? 1 : -1))} letras.`;
    }
    if (tipo === "vocales") {
        const total = contarVocales(partida.palabra);
        return `Lleva ${Math.max(0, total + (semilla % 2 === 0 ? 1 : -1))} vocales.`;
    }
    const actual = normalizarLetra(ultimaLetra(partida.palabra));
    const candidatas = "abcdefghijklmnopqrstuvwxyz".split("").filter((letra) => letra !== actual);
    return `Termina en ${elegir(candidatas, semilla)}.`;
}

export function generarPistasBots({ jugadores = [], partida }) {
    if (!partida) return {};
    const eliminados = new Set(partida.eliminados || []);
    const farsantes = new Set(partida.farsanteIds || []);
    return jugadores
        .filter((jugador) => jugador.bot && !eliminados.has(jugador.id))
        .reduce((pistas, bot, indice) => {
            const semilla = semillaDe(bot, partida);
            const tipo = TIPOS_PISTA[(semilla + indice) % TIPOS_PISTA.length];
            const esFarsante = farsantes.has(bot.id);
            pistas[bot.id] = {
                texto: esFarsante
                    ? pistaFalsa(tipo, partida, semilla)
                    : pistaVerdadera(tipo, partida),
                correcta: !esFarsante,
            };
            return pistas;
        }, {});
}

export function votarBots({ jugadores = [], partida }) {
    if (!partida) return {};
    const eliminados = new Set(partida.eliminados || []);
    const farsantes = new Set(partida.farsanteIds || []);
    const vivos = jugadores.filter((jugador) => !eliminados.has(jugador.id));
    const pistas = generarPistasBots({ jugadores, partida });

    return vivos
        .filter((jugador) => jugador.bot)
        .reduce((votos, bot) => {
            const candidatos = vivos.filter((jugador) => jugador.id !== bot.id);
            if (candidatos.length === 0) return votos;
            const semilla = semillaDe(bot, partida, "voto");
            let objetivo;

            if (farsantes.has(bot.id)) {
                const inocentes = candidatos.filter((jugador) => !farsantes.has(jugador.id));
                objetivo = elegir(inocentes.length > 0 ? inocentes : candidatos, semilla);
            } else {
                const sospechosos = candidatos.filter(
                    (jugador) => pistas[jugador.id]?.correcta === false
                );
                objetivo = elegir(sospechosos.length > 0 ? sospechosos : candidatos, semilla);
            }

            votos[bot.id] = objetivo.id;
            return votos;
        }, {});
}
