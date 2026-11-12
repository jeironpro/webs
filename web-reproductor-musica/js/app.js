const canciones = [
    { titulo: "Gabito Ballesteros - A Puro Dolor", src: "assets/media/APuroDolor.mp3" },
    { titulo: "Gabito Ballesteros - Chiquitita", src: "assets/media/Chiquitita.mp3" },
    { titulo: "Fuerza Regida - Disculpe Usted", src: "assets/media/DisculpeUsted.mp3" },
    { titulo: "Fuerza Regida - Los Sufrimientos", src: "assets/media/LosSufrimientos.mp3" },
    { titulo: "Natanael Cano - Mi Bello Angel", src: "assets/media/MiBelloAngel.mp3" },
    { titulo: "Fuerza Regida - Navidad Sin Ti", src: "assets/media/NavidadSinTi.mp3" },
    { titulo: "Fuerza Regida - No Me Dejes Nunca", src: "assets/media/NoMeDejesNunca.mp3" },
    { titulo: "Fuerza Regida - No Volvere", src: "assets/media/NoVolvere.mp3" },
    { titulo: "Natanael Cano - O Me Voy O Te Vas", src: "assets/media/OMeVoyOTeVas.mp3" },
    { titulo: "Gabito Ballesteros - Que Lloro", src: "assets/media/QueLloro.mp3" },
    { titulo: "Fuerza Regida - Que Tal Se Siente", src: "assets/media/QueTalSeSiente.mp3" },
    { titulo: "Fuerza Regida - Quien Es Usted", src: "assets/media/QuienEsUsted.mp3" },
    { titulo: "Gabito Ballesteros - Te He Prometido", src: "assets/media/TeHePrometido.mp3" },
    { titulo: "Fuerza Regida - Te Hubieras Ido Antes", src: "assets/media/TeHubierasIdoAntes.mp3" },
    { titulo: "Fuerza Regida - Te Voy A Olvidar", src: "assets/media/TeVoyAOlvidar.mp3" },
    { titulo: "Fuerza Regida - Tu Ventana", src: "assets/media/TuVentana.mp3" },
    { titulo: "Fuerza Regida - Un Idiota", src: "assets/media/UnIdiota.mp3" },
    { titulo: "Fuerza Regida - Vete Ya", src: "assets/media/VeteYa.mp3" },
];

const reproductorAudio = new Audio();
let cancionActual = 0;

const cargarCancion = () => {
    reproductorAudio.src = canciones[cancionActual].src;
    const info = canciones[cancionActual].titulo.split("-");
    document.getElementById("nombre-artista").textContent = info[0] ? info[0].trim() : "";
    document.getElementById("titulo-cancion").textContent = info[1]
        ? info[1].trim()
        : info[0].trim();
};

const contenedorReproductor = document.getElementById("contenedor-reproductor");
const contenedorListado = document.getElementById("listado-canciones");
const reproductor = document.getElementById("reproductor");
const iconoVolver = document.querySelector(".volver");
const iconoListado = document.querySelector(".icono-listado");
const progreso = document.getElementById("progreso");
const imagenCancion = document.getElementById("imagen-cancion");
const botonReproducir = document.getElementById("reproducir");
const botonPausar = document.getElementById("pausar");
const botonSiguiente = document.getElementById("siguiente");
const botonAnterior = document.getElementById("anterior");

const reproducirCancion = () => {
    reproductorAudio.play();
    imagenCancion.classList.add("reproduciendo");
    botonReproducir.style.display = "none";
    botonPausar.style.display = "block";
};

const pausarCancion = () => {
    reproductorAudio.pause();
    imagenCancion.classList.remove("reproduciendo");
    botonPausar.style.display = "none";
    botonReproducir.style.display = "block";
};

const siguienteCancion = () => {
    cancionActual = (cancionActual + 1) % canciones.length;
    cargarCancion();
    reproducirCancion();
};

const anteriorCancion = () => {
    cancionActual = (cancionActual - 1 + canciones.length) % canciones.length;
    cargarCancion();
    reproducirCancion();
};

const seleccionarCancion = (index) => {
    cancionActual = index;
    cargarCancion();
    reproducirCancion();
    contenedorListado.style.display = "none";
    reproductor.style.display = "block";
    iconoVolver.style.display = "none";
    contenedorReproductor.style.overflowY = "hidden";
};

iconoVolver.addEventListener("click", () => {
    reproductor.style.display = "block";
    iconoVolver.style.display = "none";
    contenedorReproductor.style.overflowY = "hidden";
    contenedorListado.style.display = "none";
});

iconoListado.addEventListener("click", () => {
    reproductor.style.display = "none";
    iconoVolver.style.display = "block";
    contenedorReproductor.style.overflowY = "auto";
    contenedorListado.style.display = "block";

    contenedorListado.replaceChildren();
    const ul = document.createElement("ul");
    ul.className = "listado-estilo";

    canciones.forEach((cancion, index) => {
        const li = document.createElement("li");
        li.textContent = cancion.titulo;
        li.addEventListener("click", () => seleccionarCancion(index));
        ul.appendChild(li);
    });

    contenedorListado.appendChild(ul);
});

botonReproducir.addEventListener("click", reproducirCancion);
botonPausar.addEventListener("click", pausarCancion);
botonSiguiente.addEventListener("click", siguienteCancion);
botonAnterior.addEventListener("click", anteriorCancion);

progreso.addEventListener("input", function () {
    reproductorAudio.currentTime = (this.value * reproductorAudio.duration) / 100;
});

reproductorAudio.addEventListener("timeupdate", () => {
    const porcentaje = (reproductorAudio.currentTime / reproductorAudio.duration) * 100;

    progreso.style.background = `linear-gradient(to right, #fe8d94 ${porcentaje}%, #ffffff ${porcentaje}%, #ffffff ${porcentaje}%)`;
    progreso.value = porcentaje;

    if (reproductorAudio.currentTime === reproductorAudio.duration) {
        siguienteCancion();
    }
});

cargarCancion();
