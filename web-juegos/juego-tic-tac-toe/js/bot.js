(function (raiz) {
    "use strict";

    const LINEAS_GANADORAS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function evaluarTablero(tablero) {
        for (const linea of LINEAS_GANADORAS) {
            const [a, b, c] = linea;

            if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
                return { ganador: tablero[a], linea };
            }
        }

        if (tablero.every(Boolean)) {
            return { ganador: null, linea: null };
        }

        return null;
    }

    function vaciasDe(tablero) {
        return tablero
            .map((valor, indice) => (valor === "" ? indice : null))
            .filter((indice) => indice !== null);
    }

    function jugadaGanadora(tablero, ficha) {
        for (const indice of vaciasDe(tablero)) {
            const copia = tablero.slice();
            copia[indice] = ficha;

            if (evaluarTablero(copia)?.ganador === ficha) {
                return indice;
            }
        }

        return null;
    }

    function minimax(tablero, jugador, profundidad) {
        const resultado = evaluarTablero(tablero);

        if (resultado?.ganador === "O") {
            return 10 - profundidad;
        }

        if (resultado?.ganador === "X") {
            return profundidad - 10;
        }

        if (resultado) {
            return 0;
        }

        const vacias = vaciasDe(tablero);

        if (jugador === "O") {
            let mejor = Number.NEGATIVE_INFINITY;

            for (const indice of vacias) {
                tablero[indice] = "O";
                mejor = Math.max(mejor, minimax(tablero, "X", profundidad + 1));
                tablero[indice] = "";
            }

            return mejor;
        }

        let mejor = Number.POSITIVE_INFINITY;

        for (const indice of vacias) {
            tablero[indice] = "X";
            mejor = Math.min(mejor, minimax(tablero, "O", profundidad + 1));
            tablero[indice] = "";
        }

        return mejor;
    }

    function mejorJugada(tablero, vacias, aleatorio) {
        let mejorPuntaje = Number.NEGATIVE_INFINITY;
        let mejores = [];

        for (const indice of vacias) {
            const copia = tablero.slice();
            copia[indice] = "O";
            const puntaje = minimax(copia, "X", 0);

            if (puntaje > mejorPuntaje) {
                mejorPuntaje = puntaje;
                mejores = [indice];
            } else if (puntaje === mejorPuntaje) {
                mejores.push(indice);
            }
        }

        return mejores[Math.floor(aleatorio() * mejores.length)];
    }

    function elegirJugadaDelBot(tablero, dificultad, aleatorio = Math.random) {
        if (evaluarTablero(tablero)) {
            return null;
        }

        const vacias = vaciasDe(tablero);

        if (vacias.length === 0) {
            return null;
        }

        const victoria = jugadaGanadora(tablero, "O");

        if (victoria !== null) {
            return victoria;
        }

        const bloqueo = jugadaGanadora(tablero, "X");

        if (bloqueo !== null) {
            return bloqueo;
        }

        if (dificultad === "facil") {
            return vacias[Math.floor(aleatorio() * vacias.length)];
        }

        if (dificultad === "medio" && aleatorio() < 0.68) {
            return mejorJugada(tablero, vacias, aleatorio);
        }

        if (dificultad === "dificil") {
            return mejorJugada(tablero, vacias, aleatorio);
        }

        return vacias[Math.floor(aleatorio() * vacias.length)];
    }

    raiz.TresEnRayaBot = Object.freeze({ evaluarTablero, elegirJugadaDelBot });
})(typeof globalThis !== "undefined" ? globalThis : this);
