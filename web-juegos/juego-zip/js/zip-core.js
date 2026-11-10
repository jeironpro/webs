/**
 * Núcleo de Zip: generación de tableros, resolución y validación.
 *
 * Un tablero es { n, numeros: [{ i, orden }], muros: [[a, b], ...] }:
 * - `i` es el índice de la casilla (fila * n + columna).
 * - `orden` empieza en 0 y se muestra al jugador como 1.
 * - cada muro es una arista entre dos casillas contiguas.
 *
 * Reglas: un solo camino ortogonal que empieza en el número 1, pasa por los
 * números en orden, visita todas las casillas exactamente una vez y termina
 * en el último número sin cruzar ningún muro.
 */

export function claveMuro(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

/** Generador pseudoaleatorio determinista (mulberry32) para reproducir tableros. */
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
    const col = i % n;
    const salida = [];
    if (fila > 0) salida.push(i - n);
    if (fila < n - 1) salida.push(i + n);
    if (col > 0) salida.push(i - 1);
    if (col < n - 1) salida.push(i + 1);
    return salida;
}

function barajar(lista, rng) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

/** Camino hamiltoniano aleatorio; la heurística de Warnsdorff evita callejones. */
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

/**
 * Reparte los números a lo largo del camino: primero y último siempre, y el
 * resto con separación irregular para que ningún tablero se parezca a otro.
 */
function colocarNumeros(camino, cantidad, rng) {
    const largo = camino.length;
    const paso = (largo - 1) / (cantidad - 1);
    const margen = Math.max(1, Math.floor(paso / 3));
    const posiciones = new Set([0, largo - 1]);

    for (let k = 1; k < cantidad - 1; k++) {
        const centro = k * paso;
        const desvio = Math.round((rng() * 2 - 1) * margen);
        const posicion = Math.min(largo - 2, Math.max(1, Math.round(centro + desvio)));
        posiciones.add(posicion);
    }

    for (let relleno = 1; posiciones.size < cantidad && relleno < largo - 1; relleno++) {
        posiciones.add(relleno);
    }

    return [...posiciones]
        .sort((a, b) => a - b)
        .map((posicion, orden) => ({ i: camino[posicion], orden }));
}

/** Aristas que el camino no usa: los únicos muros que no lo bloquean. */
function aristasLibres(n, camino) {
    const usadas = new Set();
    for (let k = 1; k < camino.length; k++) {
        usadas.add(claveMuro(camino[k - 1], camino[k]));
    }
    const salida = [];
    for (let i = 0; i < n * n; i++) {
        for (const v of vecinos(i, n)) {
            if (v > i && !usadas.has(claveMuro(i, v))) salida.push([i, v]);
        }
    }
    return salida;
}

/**
 * Cuenta soluciones del tablero (hasta `limite`) con poda de conectividad.
 * Devuelve también si se agotó el presupuesto de nodos.
 */
export function contarSoluciones(tablero, opciones = {}) {
    const limite = opciones.limite ?? 2;
    const presupuesto = opciones.presupuesto ?? 300000;
    const { n, numeros, muros } = tablero;
    const total = n * n;
    const lista = [...numeros].sort((a, b) => a.orden - b.orden);
    const orden = new Int16Array(total).fill(-1);
    lista.forEach(({ i, orden: o }) => {
        orden[i] = o;
    });

    const inicio = lista[0].i;
    const ultimo = lista[lista.length - 1].i;
    const bloqueado = new Set(muros.map(([a, b]) => claveMuro(a, b)));
    const visitado = new Uint8Array(total);
    const camino = [inicio];
    const soluciones = [];
    let nodos = 0;
    let agotado = false;
    visitado[inicio] = 1;

    function libres(i) {
        const salida = [];
        for (const v of vecinos(i, n)) {
            if (!visitado[v] && !bloqueado.has(claveMuro(i, v))) salida.push(v);
        }
        return salida;
    }

    /** Si alguna casilla pendiente queda aislada, la rama es imposible. */
    function todasAlcanzables(desde) {
        const alcanzado = new Uint8Array(total);
        const pila = libres(desde);
        for (const v of pila) alcanzado[v] = 1;
        for (let k = 0; k < pila.length; k++) {
            for (const v of libres(pila[k])) {
                if (alcanzado[v]) continue;
                alcanzado[v] = 1;
                pila.push(v);
            }
        }
        for (let i = 0; i < total; i++) {
            if (!visitado[i] && !alcanzado[i]) return false;
        }
        return true;
    }

    function paso(actual, siguiente) {
        if (++nodos > presupuesto) {
            agotado = true;
            return true;
        }
        if (camino.length === total) {
            if (actual === ultimo && siguiente === lista.length) soluciones.push([...camino]);
            return soluciones.length >= limite;
        }
        if (actual === ultimo) return false;
        if (!todasAlcanzables(actual)) return false;

        const opciones = libres(actual).filter((v) => orden[v] === -1 || orden[v] === siguiente);
        opciones.sort((a, b) => libres(a).length - libres(b).length);
        for (const v of opciones) {
            const o = orden[v];
            const nuevoSiguiente = o === -1 ? siguiente : siguiente + 1;
            visitado[v] = 1;
            camino.push(v);
            const parar = paso(v, nuevoSiguiente);
            visitado[v] = 0;
            camino.pop();
            if (parar) return true;
        }
        return false;
    }

    paso(inicio, 1);
    return { soluciones, agotado, nodos };
}

/**
 * Genera un tablero con solución única: parte de un camino hamiltoniano y
 * añade muros en aristas que el camino no usa hasta descartar las alternativas.
 * Devuelve null si no lo consigue dentro del presupuesto.
 */
export function generarPuzzle(n, opciones = {}) {
    const rng = opciones.rng ?? crearRng(Math.floor(Math.random() * 1e9) + 1);
    const intentos = opciones.intentos ?? 40;
    const cantidad = opciones.cantidad ?? (n <= 6 ? 5 : 6);
    const presupuesto = opciones.presupuesto ?? 250000;

    for (let intento = 0; intento < intentos; intento++) {
        const camino = caminoHamiltoniano(n, rng);
        if (!camino) continue;

        const numeros = colocarNumeros(camino, cantidad, rng);
        if (numeros.length !== cantidad) continue;
        const candidatas = barajar(aristasLibres(n, camino), rng);

        for (let ronda = 0; ronda < 9; ronda++) {
            const fraccion = 0.16 + ronda * 0.04;
            const muros = candidatas.slice(0, Math.round(candidatas.length * fraccion));
            const { soluciones } = contarSoluciones(
                { n, numeros, muros },
                { limite: 2, presupuesto }
            );
            if (soluciones.length === 1) {
                return { n, numeros, muros, solucion: soluciones[0] };
            }
        }
    }
    return null;
}

/** Comprueba que un camino cumple todas las reglas del tablero. */
export function esSolucion(tablero, camino) {
    const { n, numeros, muros } = tablero;
    const total = n * n;
    if (!Array.isArray(camino) || camino.length !== total) return false;

    const orden = new Map(numeros.map(({ i, orden: o }) => [i, o]));
    const inicio = numeros.find(({ orden: o }) => o === 0);
    const ultimo = numeros.reduce((a, b) => (a.orden > b.orden ? a : b));
    if (!inicio || camino[0] !== inicio.i) return false;
    if (camino[camino.length - 1] !== ultimo.i) return false;

    const bloqueado = new Set(muros.map(([a, b]) => claveMuro(a, b)));
    const visto = new Uint8Array(total);
    let esperado = 0;

    for (let k = 0; k < camino.length; k++) {
        const i = camino[k];
        if (!Number.isInteger(i) || i < 0 || i >= total || visto[i]) return false;
        visto[i] = 1;
        if (k > 0) {
            const previo = camino[k - 1];
            if (!vecinos(previo, n).includes(i)) return false;
            if (bloqueado.has(claveMuro(previo, i))) return false;
        }
        if (orden.has(i)) {
            if (orden.get(i) !== esperado) return false;
            esperado += 1;
        }
    }

    return esperado === numeros.length;
}
