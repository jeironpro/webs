/**
 * Núcleo de Wend: generación, solver y validación de tableros.
 *
 * Un tablero es { n, letras, muros, solucion }:
 * - `letras[i]` es la letra de la casilla `i = fila * n + columna`. Todas las
 *   casillas tienen letra: el tablero está lleno.
 * - `muros` son aristas bloqueadas `[a, b]` entre dos casillas contiguas. No
 *   ocupan casillas: se dibujan sobre el borde que separa dos letras.
 * - `solucion` contiene una entrada por palabra: { palabra, celdas }, donde
 *   `celdas` es el camino ordenado que hay que trazar.
 *
 * Reglas: cada palabra es un camino ortogonal sin repetir casilla; todas las
 * casillas pertenecen a una palabra; los muros no se cruzan.
 */

export const LARGO_MINIMO = 3;
export const LARGO_MAXIMO = 8;

/** Generador pseudoaleatorio determinista (mulberry32). */
export function crearRng(semilla = 1) {
    let estado = semilla >>> 0;
    return () => {
        estado = (estado + 0x6d2b79f5) >>> 0;
        let t = estado;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function vecinos(i, n) {
    const fila = Math.floor(i / n);
    const columna = i % n;
    const salida = [];
    if (fila > 0) salida.push(i - n);
    if (fila < n - 1) salida.push(i + n);
    if (columna > 0) salida.push(i - 1);
    if (columna < n - 1) salida.push(i + 1);
    return salida;
}

export function normalizarPalabra(palabra) {
    return String(palabra)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

export function claveMuro(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function conjuntoMuros(tablero) {
    return new Set((tablero.muros ?? []).map(([a, b]) => claveMuro(a, b)));
}

function barajar(lista, rng) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

function claveCamino(celdas) {
    return celdas.join(",");
}

function claveCanonica(celdas) {
    const directa = claveCamino(celdas);
    const inversa = claveCamino([...celdas].reverse());
    return directa < inversa ? directa : inversa;
}

/** Camino hamiltoniano aleatorio para partir el tablero en palabras. */
function caminoHamiltoniano(n, rng, presupuesto = 400000) {
    const total = n * n;
    const usado = new Uint8Array(total);
    const camino = [];
    let nodos = 0;

    const libres = (i) => vecinos(i, n).filter((v) => !usado[v]);

    function dfs(i) {
        if (++nodos > presupuesto) return false;
        usado[i] = 1;
        camino.push(i);
        if (camino.length === total) return true;

        const opciones = barajar(libres(i), rng);
        opciones.sort((a, b) => libres(a).length - libres(b).length);
        for (const v of opciones) {
            if (dfs(v)) return true;
            if (nodos > presupuesto) break;
        }
        camino.pop();
        usado[i] = 0;
        return false;
    }

    return dfs(Math.floor(rng() * total)) ? camino : null;
}

function construirTablero(n, colocadas, muros = []) {
    const letras = Array(n * n).fill(null);
    for (const { palabra, celdas } of colocadas) {
        celdas.forEach((i, k) => {
            letras[i] = palabra[k];
        });
    }

    const solucion = [...colocadas]
        .sort(
            (a, b) =>
                a.palabra.length - b.palabra.length ||
                a.palabra.localeCompare(b.palabra)
        )
        .map(({ palabra, celdas }) => ({ palabra, celdas: [...celdas] }));

    return { n, letras, muros, solucion };
}

/**
 * Cuenta particiones válidas del tablero (hasta `limite`) usando el diccionario.
 */
export function contarSoluciones(tablero, palabras, opciones = {}) {
    const limite = opciones.limite ?? 2;
    const presupuesto = opciones.presupuesto ?? 300000;
    const { n, letras, solucion } = tablero;
    const total = n * n;
    const bloqueados = conjuntoMuros(tablero);
    const diccionario = new Set(palabras.map(normalizarPalabra));
    const prefijos = new Set();
    for (const palabra of diccionario) {
        for (let k = 1; k <= palabra.length; k++) prefijos.add(palabra.slice(0, k));
    }

    const requeridos = new Map();
    for (const { palabra } of solucion) {
        const largo = palabra.length;
        requeridos.set(largo, (requeridos.get(largo) || 0) + 1);
    }

    const abiertas = [];
    for (let i = 0; i < total; i++) if (letras[i] !== null) abiertas.push(i);
    if (abiertas.length !== solucion.reduce((suma, p) => suma + p.palabra.length, 0)) {
        return { soluciones: [], agotado: false, nodos: 0 };
    }

    const candidatos = [];
    const porCelda = Array.from({ length: total }, () => []);
    const vistos = new Set();

    for (const inicio of abiertas) {
        const camino = [inicio];
        const usado = new Set([inicio]);
        let texto = letras[inicio];

        const explorar = () => {
            if (!prefijos.has(texto)) return;
            const largo = texto.length;
            if (requeridos.has(largo) && diccionario.has(texto)) {
                const clave = claveCanonica(camino);
                if (!vistos.has(clave)) {
                    vistos.add(clave);
                    const indice = candidatos.length;
                    candidatos.push({ palabra: texto, celdas: [...camino] });
                    for (const i of camino) porCelda[i].push(indice);
                }
            }
            if (largo >= LARGO_MAXIMO) return;

            const ultimo = camino[camino.length - 1];
            for (const v of vecinos(ultimo, n)) {
                if (letras[v] === null || usado.has(v)) continue;
                if (bloqueados.has(claveMuro(ultimo, v))) continue;
                usado.add(v);
                camino.push(v);
                texto += letras[v];
                explorar();
                texto = texto.slice(0, -1);
                camino.pop();
                usado.delete(v);
            }
        };

        explorar();
    }

    const cubiertas = new Uint8Array(total);
    const elegidas = [];
    const soluciones = [];
    let nodos = 0;
    let agotado = false;

    const paso = () => {
        if (++nodos > presupuesto) {
            agotado = true;
            return true;
        }

        let primera = -1;
        for (const i of abiertas) {
            if (!cubiertas[i]) {
                primera = i;
                break;
            }
        }

        if (primera === -1) {
            const completo = [...requeridos.values()].every((cantidad) => cantidad === 0);
            if (completo) soluciones.push(elegidas.slice());
            return soluciones.length >= limite;
        }

        for (const indice of porCelda[primera]) {
            const candidato = candidatos[indice];
            const largo = candidato.celdas.length;
            if ((requeridos.get(largo) || 0) === 0) continue;
            if (candidato.celdas.some((i) => cubiertas[i])) continue;

            for (const i of candidato.celdas) cubiertas[i] = 1;
            requeridos.set(largo, requeridos.get(largo) - 1);
            elegidas.push(candidato);

            const parar = paso();

            elegidas.pop();
            requeridos.set(largo, requeridos.get(largo) + 1);
            for (const i of candidato.celdas) cubiertas[i] = 0;
            if (parar) return true;
        }
        return false;
    };

    paso();
    return { soluciones, agotado, nodos };
}

/** Comprueba que una palabra ocupa un camino ortogonal válido. */
export function esCaminoDePalabra(tablero, palabra, celdas) {
    const { n, letras } = tablero;
    const bloqueados = conjuntoMuros(tablero);
    if (!Array.isArray(celdas) || celdas.length !== palabra.length) return false;
    if (celdas.some((i) => !Number.isInteger(i) || i < 0 || i >= n * n)) return false;
    if (new Set(celdas).size !== celdas.length) return false;

    for (let k = 0; k < celdas.length; k++) {
        const i = celdas[k];
        if (letras[i] !== palabra[k]) return false;
        if (k > 0) {
            const anterior = celdas[k - 1];
            if (!vecinos(anterior, n).includes(i)) return false;
            if (bloqueados.has(claveMuro(anterior, i))) return false;
        }
    }
    return true;
}

/** Devuelve el índice de la palabra si la ruta coincide con una solución. */
export function buscarPalabra(tablero, ruta) {
    if (!Array.isArray(ruta) || ruta.length < LARGO_MINIMO) return -1;
    for (let k = 0; k < tablero.solucion.length; k++) {
        const celdas = tablero.solucion[k].celdas;
        if (celdas.length !== ruta.length) continue;
        const directa = celdas.every((i, posicion) => ruta[posicion] === i);
        const inversa = celdas.every(
            (i, posicion) => ruta[ruta.length - 1 - posicion] === i
        );
        if (directa || inversa) return k;
    }
    return -1;
}

/** Comprueba que todas las casillas están cubiertas por la solución. */
export function solucionCubreTablero(tablero) {
    const { n, letras, solucion } = tablero;
    const cubiertas = new Uint8Array(n * n);
    for (const { palabra, celdas } of solucion) {
        if (!esCaminoDePalabra(tablero, palabra, celdas)) return false;
        for (const i of celdas) {
            if (cubiertas[i]) return false;
            cubiertas[i] = 1;
        }
    }

    for (let i = 0; i < n * n; i++) {
        if (letras[i] === null || !cubiertas[i]) return false;
    }
    return true;
}

/** Valida estructura, diccionario, muros y unicidad de un tablero. */
export function validarTablero(tablero, palabras, opciones = {}) {
    const { n, letras, muros, solucion } = tablero;
    if (!Number.isInteger(n) || n < 3 || !Array.isArray(letras) || letras.length !== n * n) {
        return false;
    }
    if (!letras.every((letra) => typeof letra === "string" && letra.length === 1)) {
        return false;
    }
    if (!Array.isArray(muros) || !Array.isArray(solucion) || solucion.length === 0) {
        return false;
    }

    const vistosMuros = new Set();
    const conjunto = new Set();
    for (const muro of muros) {
        if (!Array.isArray(muro) || muro.length !== 2) return false;
        const [a, b] = muro;
        if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) return false;
        if (a >= n * n || b >= n * n || !vecinos(a, n).includes(b)) return false;
        const clave = claveMuro(a, b);
        if (vistosMuros.has(clave)) return false;
        vistosMuros.add(clave);
        conjunto.add(clave);
    }

    const diccionario = new Set(palabras.map(normalizarPalabra));
    for (const { palabra, celdas } of solucion) {
        const normalizada = normalizarPalabra(palabra);
        if (!diccionario.has(normalizada)) return false;
        if (normalizada.length < LARGO_MINIMO || normalizada.length > LARGO_MAXIMO) {
            return false;
        }
        if (!esCaminoDePalabra(tablero, normalizada, celdas)) return false;
        for (let k = 1; k < celdas.length; k++) {
            if (conjunto.has(claveMuro(celdas[k - 1], celdas[k]))) return false;
        }
    }
    if (!solucionCubreTablero(tablero)) return false;

    const { soluciones, agotado } = contarSoluciones(tablero, palabras, {
        limite: 2,
        presupuesto: opciones.presupuesto ?? 400000,
    });
    if (agotado || soluciones.length !== 1) return false;

    const esperadas = new Set(solucion.map(({ celdas }) => claveCanonica(celdas)));
    const obtenidas = new Set(soluciones[0].map(({ celdas }) => claveCanonica(celdas)));
    if (esperadas.size !== obtenidas.size) return false;
    for (const clave of esperadas) if (!obtenidas.has(clave)) return false;

    return true;
}

/**
 * Genera un tablero 6×6 completamente lleno de letras y cinco palabras.
 *
 * Se parte de un camino hamiltoniano, se corta en cinco tramos y se llena cada
 * tramo con una palabra. Después se colocan muros en las aristas que no usa la
 * solución y se retiran mientras el tablero siga teniendo una solución única.
 */
export function generarPuzzle(n, palabras, opciones = {}) {
    const rng = opciones.rng ?? crearRng(Math.floor(Math.random() * 1e9) + 1);
    const intentos = opciones.intentos ?? 80;
    const largos = opciones.largos ?? [6, 7, 7, 8, 8];
    const presupuesto = opciones.presupuesto ?? 400000;
    const normalizadas = [...new Set(palabras.map(normalizarPalabra))].filter(
        (palabra) => palabra.length >= LARGO_MINIMO && palabra.length <= LARGO_MAXIMO
    );

    for (let intento = 0; intento < intentos; intento++) {
        const camino = caminoHamiltoniano(n, rng);
        if (!camino) continue;

        const orden = barajar([...largos], rng);
        const colocadas = [];
        let posicion = 0;
        let completo = true;

        for (const largo of orden) {
            const opcionesPalabra = normalizadas.filter(
                (palabra) =>
                    palabra.length === largo &&
                    !colocadas.some((colocada) => colocada.palabra === palabra)
            );
            if (opcionesPalabra.length === 0) {
                completo = false;
                break;
            }
            const palabra = opcionesPalabra[Math.floor(rng() * opcionesPalabra.length)];
            const celdas = camino.slice(posicion, posicion + largo);
            posicion += largo;
            colocadas.push({ palabra, celdas });
        }
        if (!completo || posicion !== n * n) continue;

        const usadas = new Set();
        for (const { celdas } of colocadas) {
            for (let k = 1; k < celdas.length; k++) {
                usadas.add(claveMuro(celdas[k - 1], celdas[k]));
            }
        }

        const candidatos = [];
        const vistos = new Set();
        for (let i = 0; i < n * n; i++) {
            for (const v of vecinos(i, n)) {
                if (v <= i) continue;
                const clave = claveMuro(i, v);
                if (!usadas.has(clave) && !vistos.has(clave)) {
                    vistos.add(clave);
                    candidatos.push([i, v]);
                }
            }
        }
        barajar(candidatos, rng);

        const letras = Array(n * n).fill(null);
        for (const { palabra, celdas } of colocadas) {
            celdas.forEach((i, k) => {
                letras[i] = palabra[k];
            });
        }
        const solucion = [...colocadas]
            .sort(
                (a, b) =>
                    a.palabra.length - b.palabra.length ||
                    a.palabra.localeCompare(b.palabra)
            )
            .map(({ palabra, celdas }) => ({ palabra, celdas: [...celdas] }));

        let muros = candidatos.map(([a, b]) => [a, b]);
        const inicial = { n, letras, muros, solucion };
        const arranque = contarSoluciones(inicial, normalizadas, {
            limite: 2,
            presupuesto,
        });
        if (arranque.agotado || arranque.soluciones.length !== 1) continue;

        for (let k = muros.length - 1; k >= 0; k--) {
            const pruebaMuros = muros.filter((_, j) => j !== k);
            const prueba = { n, letras, muros: pruebaMuros, solucion };
            const resultado = contarSoluciones(prueba, normalizadas, {
                limite: 2,
                presupuesto,
            });
            if (!resultado.agotado && resultado.soluciones.length === 1) {
                muros = pruebaMuros;
            }
        }

        const tablero = { n, letras, muros, solucion };
        if (validarTablero(tablero, normalizadas, { presupuesto })) return tablero;
    }

    return null;
}
