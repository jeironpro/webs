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

export function vecinos4(i, n) {
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

export function generarReinas(n, rng, presupuesto = 200000) {
    const columnas = new Int16Array(n).fill(-1);
    const usada = new Uint8Array(n);
    let nodos = 0;

    function buscar(fila) {
        if (fila === n) return true;
        if (++nodos > presupuesto) return false;
        for (const col of barajar([...Array(n).keys()], rng)) {
            if (usada[col]) continue;
            if (fila > 0 && Math.abs(col - columnas[fila - 1]) <= 1) continue;
            usada[col] = 1;
            columnas[fila] = col;
            if (buscar(fila + 1)) return true;
            usada[col] = 0;
        }
        return false;
    }

    if (!buscar(0)) return null;
    return Array.from(columnas, (col, fila) => fila * n + col);
}

export function repartirRegiones(n, reinas, rng) {
    const total = n * n;
    const regiones = new Int16Array(total).fill(-1);
    const tamanos = new Int16Array(n);
    const frentes = Array.from({ length: n }, () => []);

    const empujarVecinos = (i, region) => {
        for (const v of vecinos4(i, n)) {
            if (regiones[v] === -1) frentes[region].push(v);
        }
    };

    reinas.forEach((i, region) => {
        regiones[i] = region;
        tamanos[region] = 1;
    });
    reinas.forEach((i, region) => empujarVecinos(i, region));

    let pendientes = total - n;
    let guardia = 0;

    while (pendientes > 0) {
        if (++guardia > total * 60) return null;

        const activas = [];
        for (let r = 0; r < n; r++) {
            if (frentes[r].length > 0) activas.push(r);
        }
        if (activas.length === 0) return null;

        const a = activas[Math.floor(rng() * activas.length)];
        const b = activas[Math.floor(rng() * activas.length)];
        const region = tamanos[a] <= tamanos[b] ? a : b;

        const frente = frentes[region];
        const posicion = Math.floor(rng() * frente.length);
        const i = frente[posicion];
        frente[posicion] = frente[frente.length - 1];
        frente.pop();
        if (regiones[i] !== -1) continue;

        regiones[i] = region;
        tamanos[region] += 1;
        pendientes -= 1;
        empujarVecinos(i, region);
    }

    return Array.from(regiones);
}

function regionConexa(regiones, n, region) {
    const celdas = [];
    for (let i = 0; i < regiones.length; i++) {
        if (regiones[i] === region) celdas.push(i);
    }
    if (celdas.length === 0) return false;

    const vistas = new Set([celdas[0]]);
    const pila = [celdas[0]];
    while (pila.length > 0) {
        const i = pila.pop();
        for (const v of vecinos4(i, n)) {
            if (regiones[v] === region && !vistas.has(v)) {
                vistas.add(v);
                pila.push(v);
            }
        }
    }
    return vistas.size === celdas.length;
}

export function repararRegiones(n, regiones, reinas, rng, presupuesto = 400000) {
    const total = n * n;
    const plantada = new Set(reinas);
    const columnasPlantada = reinas.map((i) => i % n);

    for (let vuelta = 0; vuelta < total * 6; vuelta++) {
        const { soluciones, agotado } = contarSoluciones(
            { n, regiones },
            { limite: 2, presupuesto }
        );
        if (agotado) return null;
        if (soluciones.length === 1) return regiones;
        if (soluciones.length === 0) return null;

        const rival = soluciones.find((solucion) =>
            solucion.some((col, fila) => col !== columnasPlantada[fila])
        );
        if (!rival) return null;

        const candidatas = barajar(
            rival.map((col, fila) => fila * n + col).filter((i) => !plantada.has(i)),
            rng
        );

        let movida = false;
        for (const celda of candidatas) {
            const origen = regiones[celda];
            if (regiones.filter((valor) => valor === origen).length < 2) continue;

            const vecinas = new Set();
            for (const v of vecinos4(celda, n)) vecinas.add(regiones[v]);
            const destinos = barajar(
                [...vecinas].filter((region) => region !== origen),
                rng
            );

            for (const destino of destinos) {
                regiones[celda] = destino;
                if (regionConexa(regiones, n, origen)) {
                    movida = true;
                    break;
                }
                regiones[celda] = origen;
            }
            if (movida) break;
        }

        if (!movida) return null;
    }

    return null;
}

export function contarSoluciones(tablero, opciones = {}) {
    const limite = opciones.limite ?? 2;
    const presupuesto = opciones.presupuesto ?? 400000;
    const { n, regiones } = tablero;

    const columnaUsada = new Uint8Array(n);
    const regionUsada = new Uint8Array(n);
    const elegidas = new Int16Array(n);
    const soluciones = [];
    let nodos = 0;
    let agotado = false;

    function paso(fila) {
        if (++nodos > presupuesto) {
            agotado = true;
            return true;
        }
        if (fila === n) {
            soluciones.push(Array.from(elegidas));
            return soluciones.length >= limite;
        }

        for (let col = 0; col < n; col++) {
            if (columnaUsada[col]) continue;
            if (fila > 0 && Math.abs(col - elegidas[fila - 1]) <= 1) continue;
            const region = regiones[fila * n + col];
            if (region >= 0 && regionUsada[region]) continue;

            columnaUsada[col] = 1;
            if (region >= 0) regionUsada[region] = 1;
            elegidas[fila] = col;

            const parar = paso(fila + 1);

            columnaUsada[col] = 0;
            if (region >= 0) regionUsada[region] = 0;
            if (parar) return true;
        }
        return false;
    }

    paso(0);
    return { soluciones, agotado, nodos };
}

export function regionesValidas(tablero) {
    const { n, regiones } = tablero;
    if (!Array.isArray(regiones) || regiones.length !== n * n) return false;

    const porRegion = Array.from({ length: n }, () => []);
    for (let i = 0; i < regiones.length; i++) {
        const region = regiones[i];
        if (!Number.isInteger(region) || region < 0 || region >= n) return false;
        porRegion[region].push(i);
    }

    for (const celdas of porRegion) {
        if (celdas.length === 0) return false;
        const vistas = new Set([celdas[0]]);
        const pila = [celdas[0]];
        while (pila.length > 0) {
            const i = pila.pop();
            for (const v of vecinos4(i, n)) {
                if (regiones[v] === regiones[i] && !vistas.has(v)) {
                    vistas.add(v);
                    pila.push(v);
                }
            }
        }
        if (vistas.size !== celdas.length) return false;
    }
    return true;
}

export function esSolucion(tablero, solucion) {
    const { n, regiones } = tablero;
    const total = n * n;
    if (!Array.isArray(solucion) || solucion.length !== n) return false;

    const filas = new Set();
    const columnas = new Set();
    const regs = new Set();
    const vistas = new Set();

    for (const i of solucion) {
        if (!Number.isInteger(i) || i < 0 || i >= total || vistas.has(i)) return false;
        vistas.add(i);
        const fila = Math.floor(i / n);
        const col = i % n;
        const region = regiones[i];
        if (filas.has(fila) || columnas.has(col) || regs.has(region)) return false;
        filas.add(fila);
        columnas.add(col);
        regs.add(region);
    }

    if (filas.size !== n || columnas.size !== n || regs.size !== n) return false;

    const orden = [...solucion].sort((a, b) => a - b);
    for (let k = 1; k < orden.length; k++) {
        const anterior = orden[k - 1];
        const actual = orden[k];
        const df = Math.abs(Math.floor(anterior / n) - Math.floor(actual / n));
        const dc = Math.abs((anterior % n) - (actual % n));
        if (df <= 1 && dc <= 1) return false;
    }
    return true;
}

export function generarPuzzle(n, opciones = {}) {
    const rng = opciones.rng ?? crearRng(Math.floor(Math.random() * 1e9) + 1);
    const intentos = opciones.intentos ?? 120;
    const presupuesto = opciones.presupuesto ?? 400000;

    for (let intento = 0; intento < intentos; intento++) {
        const reinas = generarReinas(n, rng);
        if (!reinas) continue;

        const reparto = repartirRegiones(n, reinas, rng);
        if (!reparto) continue;

        const regiones = repararRegiones(n, reparto, reinas, rng, presupuesto);
        if (!regiones) continue;

        const tablero = { n, regiones };
        const { soluciones, agotado } = contarSoluciones(tablero, { limite: 2, presupuesto });
        if (agotado || soluciones.length !== 1) continue;

        const solucion = soluciones[0].map((col, fila) => fila * n + col);
        if (!esSolucion(tablero, solucion)) continue;
        if (!regionesValidas(tablero)) continue;

        return { ...tablero, solucion };
    }

    return null;
}
