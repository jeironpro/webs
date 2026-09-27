const celdas = document.querySelectorAll('.celda-juego');
let jugadorActual = "X";
let tablero = ['', '', '', '', '', '', '', '', ''];
let juego = true;

const formasGanar = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function ganar() {
    for (let forma of formasGanar) {
        const [a, b, c] = forma;
        
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            juego = false;
            return tablero[a];
        }
    }

    if (!tablero.includes('')) {
        juego = false;
        return 'Empate';
    }
    return null;
}

function resultados(resultado) {
    const contenedorEstado = document.getElementById("notificacion-estado");
    const estado = document.getElementById("mensaje-estado");
    const progreso = document.getElementById("barra-progreso");

    if (resultado === 'Empate') {
        estado.textContent = '¡Es un empate!';
        progreso.style.background = 'linear-gradient(to right, var(--rojo-suave) 50%, var(--azul-claro) 100%)';
    } else if (resultado === 'X') {
        estado.textContent = '¡X Gana!';
        progreso.style.background = 'var(--rojo-suave)';
    } else if (resultado === 'O') {
        estado.textContent = '¡O Gana!';
        progreso.style.background = 'var(--azul-claro)';
    }

    contenedorEstado.classList.add('visible');
    setTimeout(() => {
        contenedorEstado.classList.remove('visible');
    }, 3000);
}

function marcarJugador(index) {
    if (juego && tablero[index] === '') {
        tablero[index] = jugadorActual;
        celdas[index].textContent = jugadorActual;
        celdas[index].classList.add(jugadorActual === 'X' ? 'equis' : 'circulo');
        
        const ganador = ganar();
        
        if (ganador) {
            resultados(ganador);
        } else {
            jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
        }
    }
}

function reiniciar() {
    tablero = ['', '', '', '', '', '', '', '', ''];
    jugadorActual = 'X';
    juego = true;

    celdas.forEach(celda => {
        celda.textContent = '';
        celda.classList.remove('equis', 'circulo');
    });

    const mensajeEstado = document.getElementById('mensaje-estado');
    if (mensajeEstado) mensajeEstado.textContent = '';
}
