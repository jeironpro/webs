const tamano = 13; // Tamaño del crucigrama
const casillasNegras = 25; // Casillas negras permitidas

// Función para obtener la posición de la casilla central
function casillaCentral() {
    return Math.floor(tamano / 2);
}

// Función para encontrar las posiciones de la mitad superior izquierda del tablero
function encontrarMitadPosiciones() {
    const mitad = [];
    const centro = casillaCentral();

    for (let fila = 0; fila < tamano; fila++) {
        for (let columna = 0; columna < tamano; columna++) {
            if (fila < centro || (fila === centro && columna < centro)) {
                mitad.push([fila, columna]);
            }
        }
    }
    return mitad.filter(([fila, columna]) => !(fila === centro && columna === centro));
}

// Función para calcular la posición simetrica de una casilla (en espejo, diagonal doble)
function posicionSimetrica(fila, columna) {
    return [tamano - fila - 1, tamano - columna - 1];
}

// Función para marcar dos posiciones en el tablero: la original y la simetrica
function casillasSimetricas(table, fila, columna) {
    table[fila][columna] = '#';
    const [filaSim, colSim] = posicionSimetrica(fila, columna);
    table[filaSim][colSim] = '#';
}

// Función para contar las casillas negras que hay en el patrón
function contarCasillasNegras(table) {
    return table.flat().filter(c => c === '#').length;
}

// Función para verificar si hay exactamente 1 casilla vacía (blanca)
function secuenciaUnaCasilla(table) {
    const revisar = (arr) => {
        for (const fila of arr) {
            let contador = 0;
            for (const c of fila) {
                if (c === '#') {
                    if (contador === 1) return true;
                    contador = 0;
                } else contador++;
            }
            if (contador === 1) return true;
        }
        return false;
    };

    const columnas = Array.from({ length: tamano }, (_, c) =>
        table.map(fila => fila[c])
    );

    return revisar(table) || revisar(columnas);
}

// Funcion para verificar si hay más de 10 casillas vacías (blancas)
function tieneSecuenciaMuyLarga(table) {
    const longitudMax = 10;

    const revisar = (arr) => {
        for (const fila of arr) {
            let contador = 0;
            for (const c of fila) {
                if (c === '#') {
                    if (contador > longitudMax) return true;
                    contador = 0;
                } else contador++;
            }
            if (contador > longitudMax) return true;
        }
        return false;
    };

    const columnas = Array.from({ length: tamano }, (_, c) =>
        table.map(fila => fila[c])
    );

    return revisar(table) || revisar(columnas);
}

// Función para verificar cuantas casillas blancas hay respecto a las casillas negras
function verificarCasillasBlancas(table) {
    const totalBlancas = tamano * tamano - contarCasillasNegras(table);
    if (totalBlancas === 0) return true;

    const vistas = Array.from({ length: tamano }, () => Array(tamano).fill(false));
    const coordenadas = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    let busquedaBFS = [];
    for (let f = 0; f < tamano; f++) {
        for (let c = 0; c < tamano; c++) {
            if (table[f][c] !== '#') {
                busquedaBFS.push([f, c]);
                vistas[f][c] = true;
                break;
            }
        }
        if (busquedaBFS.length > 0) break;
    }

    let contador = 0;
    while (busquedaBFS.length) {
        const [f, c] = busquedaBFS.shift();
        contador++;
        for (const [df, dc] of coordenadas) {
            const nf = f + df, nc = c + dc;
            if (
                nf >= 0 && nf < tamano && nc >= 0 && nc < tamano &&
                !vistas[nf][nc] && table[nf][nc] !== '#'
            ) {
                vistas[nf][nc] = true;
                busquedaBFS.push([nf, nc]);
            }
        }
    }

    return contador === totalBlancas;
}

// Función para generar los patrones
function generarPatron() {
    const mitad = encontrarMitadPosiciones();
    const centro = casillaCentral();
    const paresNecesarios = (casillasNegras - 1) / 2;
    let intentos = 0;

    while (intentos++ < 400000) {
        let tablero = Array.from({ length: tamano }, () => Array(tamano).fill(''));
        tablero[centro][centro] = '#';

        const mezcla = mitad.slice().sort(() => Math.random() - 0.5);
        const opcion = mezcla.slice(0, paresNecesarios);
        opcion.forEach(([f, c]) => casillasSimetricas(tablero, f, c));

        if (contarCasillasNegras(tablero) !== casillasNegras) continue;
        if (secuenciaUnaCasilla(tablero)) continue;
        if (tieneSecuenciaMuyLarga(tablero)) continue;
        if (!verificarCasillasBlancas(tablero)) continue;

        return tablero;
    }
    return null;
}

// Función para formatear los tableros y que cada fila quede en una línea
function jsonFormateado(tableros) {
    let resultado = '[\n';
    tableros.forEach((obj, i) => {
        resultado += `    {\n        "id": ${obj.id},\n        "tablero": [\n`;
        obj.tablero.forEach((fila, j) => {
            resultado +=
                '            [' +
                fila.map(c => `"${c}"`).join(', ') +
                ']' + (j < obj.tablero.length - 1 ? ',' : '') +
                '\n';
        });
        resultado += '        ]\n    }' + (i < tableros.length - 1 ? ',' : '') + '\n';
    });
    resultado += ']';
    return resultado;
}

// Función para generar y descargar los patrones
async function generarYDescargar() {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = "Generando patrones, espera por favor...";

    const patrones = [];
    for (let i = 0; i < 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 10));
        const patron = generarPatron();
        if (patron) patrones.push({ id: patrones.length + 1, tablero: patron });
    }

    const textoJson = jsonFormateado(patrones);
    const blob = new Blob([textoJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "crucigramas.json";
    a.click();
    URL.revokeObjectURL(url);

    mensaje.textContent = `Descarga completada. Generados ${patrones.length} patrones.`;
}

document.getElementById("btnGenerar").addEventListener("click", generarYDescargar);