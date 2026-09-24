const canciones = [
    { titulo: "Gabito Ballesteros - A Puro Dolor", src: "canciones/APuroDolor.mp3" },
    { titulo: "Gabito Ballesteros - Chiquitita", src: "canciones/Chiquitita.mp3" },
    { titulo: "Fuerza Regida - Disculpe Usted", src: "canciones/DisculpeUsted.mp3" },
    { titulo: "Fuerza Regida - Los Sufrimientos", src: "canciones/LosSufrimientos.mp3" },
    { titulo: "Natanael Cano - Mi Bello Angel", src: "canciones/MiBelloAngel.mp3" },
    { titulo: "Fuerza Regida - Navidad Sin Ti", src: "canciones/NavidadSinTi.mp3" },
    { titulo: "Fuerza Regida - No Me Dejes Nunca", src: "canciones/NoMeDejesNunca.mp3" },
    { titulo: "Fuerza Regida - No Volvere", src: "canciones/NoVolvere.mp3" },
    { titulo: "Natanael Cano - O Me Voy O Te Vas", src: "canciones/OMeVoyOTeVas.mp3" },
    { titulo: "Gabito Ballesteros - Que Lloro", src: "canciones/QueLloro.mp3" },
    { titulo: "Fuerza Regida - Que Tal Se Siente", src: "canciones/QueTalSeSiente.mp3" },
    { titulo: "Fuerza Regida - Quien Es Usted", src: "canciones/QuienEsUsted.mp3" },
    { titulo: "Gabito Ballesteros - Te He Prometido", src: "canciones/TeHePrometido.mp3" },
    { titulo: "Fuerza Regida - Te Hubieras Ido Antes", src: "canciones/TeHubierasIdoAntes.mp3" },
    { titulo: "Fuerza Regida - Te Voy A Olvidar", src: "canciones/TeVoyAOlvidar.mp3" },
    { titulo: "Fuerza Regida - Tu Ventana", src: "canciones/TuVentana.mp3" },
    { titulo: "Fuerza Regida - Un Idiota", src: "canciones/UnIdiota.mp3" },
    { titulo: "Fuerza Regida - Vete Ya", src: "canciones/VeteYa.mp3" },
];

const reproductorAudio = new Audio();
let cancionActual = 0;

const cargarCancion = () => {
    reproductorAudio.src = canciones[cancionActual].src;
    const info = canciones[cancionActual].titulo.split("-");
    document.getElementById("nombre-artista").textContent = info[0] ? info[0].trim() : "";
    document.getElementById("titulo-cancion").textContent = info[1] ? info[1].trim() : info[0].trim();
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
    botonReproducir.style.display = 'none';
    botonPausar.style.display = 'block';
};

const pausarCancion = () => {
    reproductorAudio.pause();
    imagenCancion.classList.remove("reproduciendo");
    botonPausar.style.display = 'none';
    botonReproducir.style.display = 'block';
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
    contenedorListado.style.display = 'none';
    reproductor.style.display = 'block';
    iconoVolver.style.setProperty('display', 'none', 'important');
    contenedorReproductor.style.overflowY = 'hidden';
};

iconoVolver.addEventListener('click', () => {
    reproductor.style.display = 'block';
    iconoVolver.style.setProperty('display', 'none', 'important');
    contenedorReproductor.style.overflowY = 'hidden';
    contenedorListado.style.display = 'none';
});

iconoListado.addEventListener('click', () => {
    reproductor.style.display = 'none';
    iconoVolver.style.setProperty('display', 'block', 'important');
    contenedorReproductor.style.overflowY = 'auto';
    contenedorListado.style.display = 'block';

    contenedorListado.innerHTML = "";
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
