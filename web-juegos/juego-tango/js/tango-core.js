/**
 * Tango · núcleo sin DOM.
 *
 * Un tablero 6×6 se llena con soles (1) y lunas (2). Reglas:
 *   - cada fila y cada columna tiene exactamente 3 soles y 3 lunas;
 *   - nunca hay tres símbolos iguales seguidos en fila ni en columna;
 *   - las parejas con "=" comparten símbolo y las parejas con "×" son distintas.
 */

export const SOL = 1;
export const LUNA = 2;

const mitadDe = (n) => n / 2;

export function crearRng(semilla) {
    let s = semilla >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function mezclar(lista, rng) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

/** Filas posibles: n/2 soles y ninguna racha de tres. */
export function patronesFila(n) {
    const mitad = mitadDe(n);
    const salida = [];
    const fila = [];
    const rec = (soles, racha, ultimo) => {
        if (fila.length === n) {
            if (soles === mitad) salida.push(fila.slice());
            return;
        }
        for (const valor of [SOL, LUNA]) {
            if (valor === SOL && soles === mitad) continue;
            if (valor === ultimo && racha === 2) continue;
            fila.push(valor);
            rec(soles + (valor === SOL ? 1 : 0), valor === ultimo ? racha + 1 : 1, valor);
            fila.pop();
        }
    };
    rec(0, 0, 0);
    return salida;
}

/** Una cuadrícula completa y válida, elegida al azar. */
export function generarSolucion(n, rng) {
    const patrones = patronesFila(n);
    const mitad = mitadDe(n);
    const filas = [];
    const conteo = new Array(n).fill(0);

    const rec = (r) => {
        if (r === n) return conteo.every((c) => c === mitad);

        for (const fila of mezclar(patrones, rng)) {
            let vale = true;
            for (let c = 0; c < n && vale; c++) {
                if (fila[c] === SOL && conteo[c] >= mitad) vale = false;
                if (r >= 2 && filas[r - 1][c] === fila[c] && filas[r - 2][c] === fila[c]) {
                    vale = false;
                }
            }
            for (let c = 0; c < n && vale; c++) {
                const restantes = n - r - 1;
                const faltan = mitad - conteo[c] - (fila[c] === SOL ? 1 : 0);
                if (faltan < 0 || faltan > restantes) vale = false;
            }
            if (!vale) continue;

            filas.push(fila);
            for (let c = 0; c < n; c++) if (fila[c] === SOL) conteo[c]++;

            if (rec(r + 1)) return true;

            for (let c = 0; c < n; c++) if (fila[c] === SOL) conteo[c]--;
            filas.pop();
        }
        return false;
    };

    return rec(0) ? filas : null;
}

export function esSolucionValida(n, valores) {
    const mitad = mitadDe(n);

    for (let k = 0; k < n; k++) {
        const fila = [];
        const columna = [];
        for (let p = 0; p < n; p++) {
            fila.push(valores[k * n + p]);
            columna.push(valores[p * n + k]);
        }
        for (const linea of [fila, columna]) {
            let soles = 0;
            for (let p = 0; p < n; p++) {
                if (linea[p] === SOL) soles++;
                else if (linea[p] !== LUNA) return false;
                if (p >= 2 && linea[p] === linea[p - 1] && linea[p] === linea[p - 2]) return false;
            }
            if (soles !== mitad) return false;
        }
    }
    return true;
}

function normalizarDados(dados) {
    if (dados instanceof Map) return [...dados.entries()];
    return dados.map(({ i, v }) => [i, v]);
}

function crearMotor(n, dados, relaciones) {
    const total = n * n;
    const grid = new Uint8Array(total);
    for (const [i, valor] of normalizarDados(dados)) grid[i] = valor;

    const adyacentes = Array.from({ length: total }, () => []);
    for (const { a, b, tipo } of relaciones) {
        const igual = tipo === "=";
        adyacentes[a].push({ j: b, igual });
        adyacentes[b].push({ j: a, igual });
    }

    const mitad = mitadDe(n);

    /** Aplica deducciones forzadas hasta el punto fijo. false si hay contradicción. */
    const propagar = () => {
        let cambia = true;
        while (cambia) {
            cambia = false;

            for (let i = 0; i < total; i++) {
                const valor = grid[i];
                if (!valor) continue;
                for (const { j, igual } of adyacentes[i]) {
                    if (grid[j]) {
                        if ((grid[j] === valor) !== igual) return false;
                    } else {
                        grid[j] = igual ? valor : 3 - valor;
                        cambia = true;
                    }
                }
            }

            for (let k = 0; k < n; k++) {
                const fila = [];
                const columna = [];
                for (let p = 0; p < n; p++) {
                    fila.push(k * n + p);
                    columna.push(p * n + k);
                }
                for (const linea of [fila, columna]) {
                    let soles = 0;
                    let lunas = 0;
                    for (const i of linea) {
                        if (grid[i] === SOL) soles++;
                        else if (grid[i] === LUNA) lunas++;
                    }
                    if (soles > mitad || lunas > mitad) return false;
                    if (soles === mitad) {
                        for (const i of linea) {
                            if (!grid[i]) {
                                grid[i] = LUNA;
                                cambia = true;
                            }
                        }
                    } else if (lunas === mitad) {
                        for (const i of linea) {
                            if (!grid[i]) {
                                grid[i] = SOL;
                                cambia = true;
                            }
                        }
                    }

                    for (let p = 0; p + 2 < n; p++) {
                        const a = linea[p];
                        const b = linea[p + 1];
                        const c = linea[p + 2];
                        if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) return false;
                        if (grid[a] && grid[a] === grid[c] && !grid[b]) {
                            grid[b] = 3 - grid[a];
                            cambia = true;
                        } else if (grid[a] && grid[a] === grid[b] && !grid[c]) {
                            grid[c] = 3 - grid[a];
                            cambia = true;
                        } else if (grid[b] && grid[b] === grid[c] && !grid[a]) {
                            grid[a] = 3 - grid[b];
                            cambia = true;
                        }
                    }
                }
            }
        }
        return true;
    };

    return { grid, propagar };
}

/** Cuenta soluciones (hasta `limite`) con propagación; un tope de nodos evita bloqueos. */
export function contarSoluciones(n, dados, relaciones, limite = 2) {
    const total = n * n;
    const { grid, propagar } = crearMotor(n, dados, relaciones);
    let soluciones = 0;
    let nodos = 0;
    const TOPE = 200000;

    const buscar = () => {
        nodos++;
        if (nodos > TOPE) {
            soluciones = Math.max(soluciones, limite);
            return;
        }
        if (!propagar()) return;

        let hueco = -1;
        for (let i = 0; i < total; i++) {
            if (!grid[i]) {
                hueco = i;
                break;
            }
        }
        if (hueco === -1) {
            soluciones++;
            return;
        }

        const copia = grid.slice();
        for (const valor of [SOL, LUNA]) {
            grid.set(copia);
            grid[hueco] = valor;
            buscar();
            if (soluciones >= limite) {
                grid.set(copia);
                return;
            }
        }
        grid.set(copia);
    };

    buscar();
    return soluciones;
}

/** La cuadrícula completa si todas las deducciones la cierran sin adivinar; null si no. */
export function resolverPorLogica(n, dados, relaciones) {
    const { grid, propagar } = crearMotor(n, dados, relaciones);
    if (!propagar()) return null;
    return grid.every((valor) => valor !== 0) ? Array.from(grid) : null;
}

const paresAdyacentes = (n) => {
    const pares = [];
    for (let f = 0; f < n; f++) {
        for (let c = 0; c < n; c++) {
            const a = f * n + c;
            if (c + 1 < n) pares.push({ a, b: a + 1 });
            if (f + 1 < n) pares.push({ a, b: a + n });
        }
    }
    return pares;
};

const esUnicaYLogica = (n, dados, relaciones) =>
    contarSoluciones(n, dados, relaciones) === 1 && resolverPorLogica(n, dados, relaciones) !== null;

/**
 * Genera un tablero con pistas y relaciones recortadas hasta que la solución sea
 * única y se pueda alcanzar solo con deducciones. Se conservan al menos 4 casillas
 * dadas y 3 relaciones, para que el puzle no empiece vacío.
 */
export function generarPuzzle(rng, n = 6) {
    const solucion = generarSolucion(n, rng);
    if (!solucion) throw new Error("no se pudo generar una solución");

    const plano = solucion.flat();
    const dadas = new Set(Array.from({ length: n * n }, (_, i) => i));
    const relaciones = paresAdyacentes(n).map(({ a, b }) => ({
        a,
        b,
        tipo: plano[a] === plano[b] ? "=" : "x",
    }));
    const activas = relaciones.map(() => true);

    const dados = () => [...dadas].sort((a, b) => a - b).map((i) => ({ i, v: plano[i] }));
    const visibles = () => relaciones.filter((_, k) => activas[k]);

    const orden = mezclar(
        [
            ...Array.from({ length: n * n }, (_, i) => ({ clase: "dado", i })),
            ...relaciones.map((_, i) => ({ clase: "relacion", i })),
        ],
        rng
    );

    for (const pista of orden) {
        if (pista.clase === "dado") {
            if (dadas.size <= 4) continue;
            dadas.delete(pista.i);
            if (!esUnicaYLogica(n, dados(), visibles())) dadas.add(pista.i);
        } else {
            if (activas.filter(Boolean).length <= 3) continue;
            activas[pista.i] = false;
            if (!esUnicaYLogica(n, dados(), visibles())) activas[pista.i] = true;
        }
    }

    return {
        n,
        solucion: plano,
        dados: dados(),
        relaciones: visibles(),
    };
}
