const FIGURAS = [
    { simbolo: "🦊", nombre: "zorro" },
    { simbolo: "🦁", nombre: "león" },
    { simbolo: "🐯", nombre: "tigre" },
    { simbolo: "🐘", nombre: "elefante" },
    { simbolo: "🐨", nombre: "koala" },
    { simbolo: "🐼", nombre: "panda" },
    { simbolo: "🦒", nombre: "jirafa" },
    { simbolo: "🦓", nombre: "cebra" },
    { simbolo: "🐵", nombre: "mono" },
    { simbolo: "🐸", nombre: "rana" },
    { simbolo: "🐙", nombre: "pulpo" },
    { simbolo: "🐋", nombre: "ballena" },
    { simbolo: "🦋", nombre: "mariposa" },
    { simbolo: "🐝", nombre: "abeja" },
    { simbolo: "🐢", nombre: "tortuga" },
    { simbolo: "🐧", nombre: "pingüino" },
    { simbolo: "🐴", nombre: "caballo" },
    { simbolo: "🐰", nombre: "conejo" },
    { simbolo: "🐱", nombre: "gato" },
    { simbolo: "🐶", nombre: "perro" },
    { simbolo: "🍎", nombre: "manzana" },
    { simbolo: "🍌", nombre: "plátano" },
    { simbolo: "🍓", nombre: "fresa" },
    { simbolo: "🍉", nombre: "sandía" },
    { simbolo: "🍍", nombre: "piña" },
    { simbolo: "🥑", nombre: "aguacate" },
    { simbolo: "🍒", nombre: "cereza" },
    { simbolo: "🥥", nombre: "coco" },
    { simbolo: "🚀", nombre: "cohete" },
    { simbolo: "✈️", nombre: "avión" },
    { simbolo: "🚲", nombre: "bicicleta" },
    { simbolo: "🚗", nombre: "coche" },
    { simbolo: "🎸", nombre: "guitarra" },
    { simbolo: "🎹", nombre: "piano" },
    { simbolo: "🌞", nombre: "sol" },
    { simbolo: "🌙", nombre: "luna" },
    { simbolo: "⭐", nombre: "estrella" },
    { simbolo: "❤️", nombre: "corazón" },
    { simbolo: "🍕", nombre: "pizza" },
    { simbolo: "🍦", nombre: "helado" },
];

const NIVELES = {
    facil: { parejas: 8, columnas: 4, etiqueta: "Fácil" },
    medio: { parejas: 12, columnas: 6, etiqueta: "Medio" },
    dificil: { parejas: 18, columnas: 6, etiqueta: "Difícil" },
};

const elementos = {
    tablero: document.querySelector("#tablero-juego"),
    niveles: [...document.querySelectorAll("[data-nivel]")],
    parejas: document.querySelector("#parejas"),
    intentos: document.querySelector("#intentos"),
    tiempo: document.querySelector("#tiempo"),
    estado: document.querySelector("#estado"),
    btnReiniciar: document.querySelector("#boton-reiniciar"),
    modal: document.querySelector("#modal-victoria"),
    modalIntentos: document.querySelector("#modal-intentos"),
    modalTiempo: document.querySelector("#modal-tiempo"),
    modalJugar: document.querySelector("#modal-jugar"),
};

let nivelActual = "facil";
let cartasAbiertas = [];
let parejasEncontradas = 0;
let intentos = 0;
let segundos = 0;
let intervalo = null;
let bloqueado = false;
let juegoIniciado = false;

function mezclar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function formatearTiempo(total) {
    const minutos = Math.floor(total / 60);
    const resto = total % 60;
    return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function iniciarReloj() {
    window.clearInterval(intervalo);
    segundos = 0;
    juegoIniciado = false;
    elementos.tiempo.textContent = "00:00";
    intervalo = window.setInterval(() => {
        if (!juegoIniciado) return;
        segundos += 1;
        elementos.tiempo.textContent = formatearTiempo(segundos);
    }, 1000);
}

function crearCarta(figura) {
    const carta = document.createElement("button");
    carta.type = "button";
    carta.className = "carta";
    carta.dataset.figura = figura.nombre;
    carta.setAttribute("role", "gridcell");
    carta.setAttribute("aria-label", "Carta boca abajo");

    const contenido = document.createElement("div");
    contenido.className = "carta__contenido";

    const dorso = document.createElement("div");
    dorso.className = "carta__cara carta__dorso";

    const frente = document.createElement("div");
    frente.className = "carta__cara carta__frente";
    frente.textContent = figura.simbolo;

    contenido.appendChild(dorso);
    contenido.appendChild(frente);
    carta.appendChild(contenido);
    carta.addEventListener("click", () => voltearCarta(carta));
    return carta;
}

function nuevaPartida() {
    const nivel = NIVELES[nivelActual];
    window.clearInterval(intervalo);
    iniciarReloj();
    cartasAbiertas = [];
    parejasEncontradas = 0;
    intentos = 0;
    bloqueado = false;
    elementos.modal.hidden = true;
    elementos.parejas.textContent = `0 / ${nivel.parejas}`;
    elementos.intentos.textContent = "0";
    elementos.estado.textContent = "Elige una carta para empezar.";

    const figuras = mezclar(FIGURAS).slice(0, nivel.parejas);
    const mazo = mezclar(figuras.flatMap((figura) => [figura, figura]));
    const columnas = window.innerWidth < 560 ? 4 : nivel.columnas;

    elementos.tablero.textContent = "";
    elementos.tablero.style.setProperty("--columnas", String(columnas));
    elementos.tablero.setAttribute(
        "aria-label",
        `Tablero de parejas, nivel ${nivel.etiqueta.toLowerCase()}`
    );

    mazo.forEach((figura) => {
        elementos.tablero.appendChild(crearCarta(figura));
    });
}

function voltearCarta(carta) {
    if (
        bloqueado ||
        carta.classList.contains("volteada") ||
        carta.classList.contains("encontrada")
    ) {
        return;
    }

    if (!juegoIniciado) {
        juegoIniciado = true;
        elementos.estado.textContent = "Encuentra las parejas iguales.";
    }

    carta.classList.add("volteada");
    carta.setAttribute("aria-label", `Carta ${carta.dataset.figura}`);
    cartasAbiertas.push(carta);

    if (cartasAbiertas.length === 2) {
        comprobarPareja();
    }
}

function comprobarPareja() {
    bloqueado = true;
    intentos += 1;
    elementos.intentos.textContent = String(intentos);

    const [primera, segunda] = cartasAbiertas;

    if (primera.dataset.figura === segunda.dataset.figura) {
        primera.classList.add("encontrada");
        segunda.classList.add("encontrada");
        primera.setAttribute("aria-label", `Pareja encontrada: ${primera.dataset.figura}`);
        segunda.setAttribute("aria-label", `Pareja encontrada: ${segunda.dataset.figura}`);
        parejasEncontradas += 1;
        elementos.parejas.textContent = `${parejasEncontradas} / ${NIVELES[nivelActual].parejas}`;
        cartasAbiertas = [];
        bloqueado = false;

        if (parejasEncontradas === NIVELES[nivelActual].parejas) {
            window.clearInterval(intervalo);
            window.setTimeout(mostrarVictoria, 450);
        }
        return;
    }

    window.setTimeout(() => {
        primera.classList.remove("volteada");
        segunda.classList.remove("volteada");
        primera.setAttribute("aria-label", "Carta boca abajo");
        segunda.setAttribute("aria-label", "Carta boca abajo");
        cartasAbiertas = [];
        bloqueado = false;
    }, 850);
}

function mostrarVictoria() {
    elementos.modalIntentos.textContent = String(intentos);
    elementos.modalTiempo.textContent = formatearTiempo(segundos);
    elementos.modal.hidden = false;
    elementos.estado.textContent = "¡Has encontrado todas las parejas!";
    elementos.modalJugar.focus({ preventScroll: true });
}

function cambiarNivel(nivel) {
    nivelActual = nivel;
    elementos.niveles.forEach((boton) => {
        const activo = boton.dataset.nivel === nivel;
        boton.classList.toggle("nivel--activo", activo);
        boton.setAttribute("aria-pressed", String(activo));
    });
    nuevaPartida();
}

elementos.niveles.forEach((boton) => {
    boton.addEventListener("click", () => cambiarNivel(boton.dataset.nivel));
});

elementos.btnReiniciar.addEventListener("click", nuevaPartida);
elementos.modalJugar.addEventListener("click", nuevaPartida);
elementos.modal.addEventListener("click", (evento) => {
    if (evento.target === elementos.modal) elementos.modal.hidden = true;
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !elementos.modal.hidden) {
        elementos.modal.hidden = true;
    }
});

nuevaPartida();
