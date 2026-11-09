/**
 * Núcleo de Patches: generación de tableros, pistas, solver y validación.
 *
 * Un tablero es { n, pistas, solucion }:
 * - `pistas` es una lista de { i, area, forma } con una pista por retal.
 * - `solucion` es una lista de rectángulos { r, c, w, h } que cubren el tablero.
 *
 * Reglas: cada retal es un rectángulo con exactamente una pista, su área es el
 * número de la pista y su proporción respeta la forma indicada.
 */

export const CUADRADA = "cuadrada";
export const ANCHA = "ancha";
export const ALTA = "alta";
export const LIBRE = "libre";

export const FORMAS = [CUADRADA, ANCHA, ALTA, LIBRE];

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

function barajar(lista, rng) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

/** Forma que corresponde a un rectángulo real. */
export function formaDe(w, h) {
    if (w === h) return CUADRADA;
    return w > h ? ANCHA : ALTA;
}

/** Proporciones posibles para un área y una forma dadas. */
export function proporciones(area, forma, n) {
    const salida = [];
    for (let h = 1; h <= n; h++) {
        if (area % h !== 0) continue;
        const w = area / h;
        if (w > n) continue;
        if (forma === CUADRADA && w !== h) continue;
        if (forma === ANCHA && w <= h) continue;
        if (forma === ALTA && h <= w) continue;
        salida.push({ w, h });
    }
    return salida;
}

/** ¿El rectángulo contiene exactamente una pista? */
function contieneSoloSuPista(rect, n, indices) {
    let cuenta = 0;
    for (let r = rect.r; r < rect.r + rect.h; r++) {
        for (let c = rect.c; c < rect.c + rect.w; c++) {
            if (indices.has(r * n + c)) cuenta++;
            if (cuenta > 1) return false;
        }
    }
    return cuenta === 1;
}

/** Candidatos de cada pista: rectángulos válidos que solo la contienen a ella. */
export function construirCandidatos(tablero) {
    const { n, pistas } = tablero;
    const indices = new Set(pistas.map((pista) => pista.i));

    return pistas.map((pista, k) => {
        const fila = Math.floor(pista.i / n);
        const columna = pista.i % n;
        const salida = [];

        for (const { w, h } of proporciones(pista.area, pista.forma, n)) {
            for (let r = Math.max(0, fila - h + 1); r <= Math.min(fila, n - h); r++) {
                for (let c = Math.max(0, columna - w + 1); c <= Math.min(columna, n - w); c++) {
                    const rect = { r, c, w, h };
                    if (!contieneSoloSuPista(rect, n, indices)) continue;
                    salida.push({ ...rect, k });
                }
            }
        }
        return salida;
    });
}

/** Celdas de un rectángulo. */
export function celdasDe({ r, c, w, h }, n) {
    const salida = [];
    for (let f = r; f < r + h; f++) {
        for (let col = c; col < c + w; col++) salida.push(f * n + col);
    }
    return salida;
}

/** ¿Las piezas cubren el tablero sin solapes y respetan sus pistas? */
export function esSolucion(tablero, piezas) {
    const { n, pistas } = tablero;
    if (!Array.isArray(piezas) || piezas.length !== pistas.length) return false;

    const cubierta = new Uint8Array(n * n);
    const usadas = new Set();

    for (const pieza of piezas) {
        if (!pieza || !Number.isInteger(pieza.k)) return false;
        if (usadas.has(pieza.k)) return false;
        usadas.add(pieza.k);

        const pista = pistas[pieza.k];
        if (!pista) return false;
        if (pieza.w * pieza.h !== pista.area) return false;
        if (formaDe(pieza.w, pieza.h) !== pista.forma && pista.forma !== LIBRE) return false;

        const celdas = celdasDe(pieza, n);
        if (celdas.some((i) => cubierta[i])) return false;
        if (!celdas.includes(pista.i)) return false;
        for (const i of celdas) cubierta[i] = 1;
    }

    return cubierta.every((valor) => valor === 1);
}

/**
 * Cuenta soluciones (hasta `limite`) con cobertura exacta: se toma la primera
 * casilla libre y se prueban los rectángulos candidatos que la cubren.
 */
export function contarSoluciones(tablero, opciones = {}) {
    const limite = opciones.limite ?? 2;
    const presupuesto = opciones.presupuesto ?? 200000;
    const { n } = tablero;
    const candidatos = construirCandidatos(tablero);

    const cubierta = new Uint8Array(n * n);
    const usada = new Uint8Array(tablero.pistas.length);
    const elegidas = [];
    const soluciones = [];
    let nodos = 0;
    let agotado = false;

    function paso() {
        if (++nodos > presupuesto) {
            agotado = true;
            return true;
        }
        if (elegidas.length === tablero.pistas.length) {
            if (cubierta.every((valor) => valor === 1)) {
                soluciones.push([...elegidas]);
            }
            return soluciones.length >= limite;
        }

        let celda = -1;
        for (let i = 0; i < cubierta.length; i++) {
            if (!cubierta[i]) {
                celda = i;
                break;
            }
        }
        if (celda === -1) {
            soluciones.push([...elegidas]);
            return soluciones.length >= limite;
        }

        for (let k = 0; k < candidatos.length; k++) {
            if (usada[k]) continue;
            for (const rect of candidatos[k]) {
                if (!celdasDe(rect, n).includes(celda)) continue;
                const celdas = celdasDe(rect, n);
                if (celdas.some((i) => cubierta[i])) continue;

                for (const i of celdas) cubierta[i] = 1;
                usada[k] = 1;
                elegidas.push({ ...rect, k });

                if (paso()) return true;

                elegidas.pop();
                usada[k] = 0;
                for (const i of celdas) cubierta[i] = 0;
            }
        }
        return false;
    }

    paso();
    return { soluciones, agotado, nodos };
}

/** Reparte el tablero en `k` rectángulos cortando uno existente cada vez. */
export function partirTablero(n, rng, k) {
    let rects = [{ r: 0, c: 0, w: n, h: n }];
    let guardia = 0;

    while (rects.length < k && guardia++ < 200) {
        const indices = rects
            .map((rect, i) => ({ rect, i }))
            .filter(({ rect }) => rect.w > 1 || rect.h > 1)
            .map(({ i }) => i);
        if (indices.length === 0) return null;

        const i = indices[Math.floor(rng() * indices.length)];
        const rect = rects[i];

        if (rect.w > 1 && (rect.h === 1 || rng() < 0.5)) {
            const corte = 1 + Math.floor(rng() * (rect.w - 1));
            rects.splice(
                i,
                1,
                { ...rect, w: corte },
                { ...rect, c: rect.c + corte, w: rect.w - corte }
            );
        } else {
            const corte = 1 + Math.floor(rng() * (rect.h - 1));
            rects.splice(
                i,
                1,
                { ...rect, h: corte },
                { ...rect, r: rect.r + corte, h: rect.h - corte }
            );
        }
    }

    if (rects.length !== k) return null;
    if (rects.some((rect) => rect.w * rect.h < 2 || rect.w * rect.h > 12)) return null;
    return rects;
}

/**
 * Genera un tablero de solución única. Empieza con las formas exactas y, si el
 * tablero sigue teniendo una sola solución, relaja alguna pista a forma libre.
 */
export function generarPuzzle(n, rng, opciones = {}) {
    const intentos = opciones.intentos ?? 120;
    const minimo = opciones.minimoRetales ?? 5;
    const maximo = opciones.maximoRetales ?? 7;

    for (let intento = 0; intento < intentos; intento++) {
        const k = minimo + Math.floor(rng() * (maximo - minimo + 1));
        const rects = partirTablero(n, rng, k);
        if (!rects) continue;

        const pistas = rects
            .map((rect) => {
                const area = rect.w * rect.h;
                const fila = rect.r + Math.floor(rng() * rect.h);
                const columna = rect.c + Math.floor(rng() * rect.w);
                return {
                    i: fila * n + columna,
                    area,
                    forma: formaDe(rect.w, rect.h),
                };
            })
            .sort((a, b) => a.i - b.i);

        const tablero = { n, pistas };
        const { soluciones } = contarSoluciones(tablero);
        if (soluciones.length !== 1) continue;

        // Relaja alguna forma exacta a libre sin perder la solución única.
        for (let k2 = 0; k2 < pistas.length; k2++) {
            if (pistas[k2].forma === LIBRE) continue;
            if (rng() > 0.35) continue;
            const antes = pistas[k2].forma;
            pistas[k2] = { ...pistas[k2], forma: LIBRE };
            const prueba = contarSoluciones({ n, pistas });
            if (prueba.soluciones.length !== 1) pistas[k2] = { ...pistas[k2], forma: antes };
        }

        return {
            n,
            pistas,
            solucion: [...soluciones[0]].sort((a, b) => a.r - b.r || a.c - b.c),
        };
    }

    return null;
}

/** Pistas ordenadas por su índice de casilla. */
export function ordenarPistas(pistas) {
    return [...pistas].sort((a, b) => a.i - b.i);
}
