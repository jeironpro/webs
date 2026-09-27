const Animales = [
    { src: "img/aguila.png", nombre: "águila" },
    { src: "img/aguila.png", nombre: "águila" },
    { src: "img/caballo.png", nombre: "caballo" },
    { src: "img/caballo.png", nombre: "caballo" },
    { src: "img/ciervo.png", nombre: "ciervo" },
    { src: "img/ciervo.png", nombre: "ciervo" },
    { src: "img/coala.png", nombre: "coala" },
    { src: "img/coala.png", nombre: "coala" },
    { src: "img/elefante.png", nombre: "elefante" },
    { src: "img/elefante.png", nombre: "elefante" },
    { src: "img/leon.png", nombre: "león" },
    { src: "img/leon.png", nombre: "león" },
    { src: "img/tigre.png", nombre: "tigre" },
    { src: "img/tigre.png", nombre: "tigre" },
    { src: "img/tortuga.png", nombre: "tortuga" },
    { src: "img/tortuga.png", nombre: "tortuga" },
];

let cartasAbiertas = [];
let bloqueoTablero = false;

const tablero = document.getElementById('tablero-juego');
const botonReiniciar = document.getElementById('boton-reiniciar');
const modalVictoria = document.getElementById('modal-victoria');
const botonCerrarModal = document.getElementById('boton-cerrar-modal');

const crearTablero = () => {
    // Limpiar tablero
    tablero.textContent = '';

    // Ocultar modal si está visible
    modalVictoria.classList.remove('mostrar');

    // Mezclar animales
    const animalesMezclados = [...Animales].sort(() => Math.random() - 0.5);

    animalesMezclados.forEach((animal) => {
        const elementoCarta = crearElementoCarta(animal);
        tablero.appendChild(elementoCarta);
    });
};

const crearElementoCarta = (animal) => {
    // ... (rest of the code remains similar until desactivarCartas)
    const contenedorCarta = document.createElement('div');
    contenedorCarta.classList.add('carta');

    const contenidoCarta = document.createElement('div');
    contenidoCarta.classList.add('carta-contenido');

    const caraDorso = document.createElement('div');
    caraDorso.classList.add('carta-dorso');

    const caraFrente = document.createElement('div');
    caraFrente.classList.add('carta-frente');

    const imagen = document.createElement('img');
    imagen.src = animal.src;
    imagen.alt = animal.nombre;
    imagen.classList.add('imagen-animal');

    caraFrente.appendChild(imagen);
    contenidoCarta.appendChild(caraDorso);
    contenidoCarta.appendChild(caraFrente);
    contenedorCarta.appendChild(contenidoCarta);

    contenedorCarta.addEventListener('click', () => manejarClickCarta(contenedorCarta));

    return contenedorCarta;
};

const manejarClickCarta = (carta) => {
    if (bloqueoTablero || carta.classList.contains('mostrar') || carta.classList.contains('iguales')) {
        return;
    }

    carta.classList.add('mostrar');
    cartasAbiertas.push(carta);

    if (cartasAbiertas.length === 2) {
        verificarPareja();
    }
};

const verificarPareja = () => {
    bloqueoTablero = true;

    const [primeraCarta, segundaCarta] = cartasAbiertas;
    const imagen1 = primeraCarta.querySelector('.imagen-animal').src;
    const imagen2 = segundaCarta.querySelector('.imagen-animal').src;

    if (imagen1 === imagen2) {
        desactivarCartas();
    } else {
        voltearCartas();
    }
};

const desactivarCartas = () => {
    cartasAbiertas.forEach(carta => carta.classList.add('iguales'));
    resetearEstado();

    const todasLasCartas = document.querySelectorAll('.carta');
    const todasEmparejadas = Array.from(todasLasCartas).every(carta => carta.classList.contains('iguales'));

    if (todasEmparejadas) {
        setTimeout(() => {
            modalVictoria.classList.add('mostrar');
        }, 500);
    }
};

const voltearCartas = () => {
    setTimeout(() => {
        cartasAbiertas.forEach(carta => carta.classList.remove('mostrar'));
        resetearEstado();
    }, 1000);
};

const resetearEstado = () => {
    cartasAbiertas = [];
    bloqueoTablero = false;
};

botonReiniciar.addEventListener('click', crearTablero);
botonCerrarModal.addEventListener('click', crearTablero);

// Iniciar juego
document.addEventListener('DOMContentLoaded', crearTablero);