import { crearRenderizador, redimensionar } from "./juego/renderizador.js";
import { crearEscena } from "./juego/escena.js";
import { crearCircuito } from "./juego/pista.js";
import { cargarNucleo } from "./juego/nucleo.js";
import { crearCarrera } from "./juego/carrera.js";
import { crearCoche } from "./juego/coche.js";
import { crearRivales } from "./juego/rivales.js";
import { crearCamara, crearSeguimiento } from "./juego/camara.js";
import { crearEntrada } from "./juego/entrada.js";
import { crearHud } from "./interfaz/hud.js";
import { limitar } from "./juego/utilidades.js";

const VUELTAS = 3;
const DIFICULTAD = 1;

const lienzo = document.getElementById("lienzo");
const velo = document.getElementById("velo-carga");
const mensajeCarga = document.getElementById("carga-mensaje");
const menu = document.getElementById("menu");
const botonIniciar = document.getElementById("boton-iniciar");
const aviso = document.getElementById("aviso");
const avisoTexto = document.getElementById("aviso-texto");

const hud = crearHud();
const entrada = crearEntrada();

const estado = {
    modo: "menu",
    reloj: 0,
};

let renderizador;
let escena;
let camara;
let seguimiento;
let circuito;
let coche;
let rivales;
let carrera;
let ultimoTiempo = 0;
let hudAcumulado = 0;

async function arrancar() {
    try {
        mensajeCarga.textContent = "Inicializando el motor gráfico…";
        const creado = await crearRenderizador(lienzo);
        renderizador = creado.renderizador;
        hud.backend(creado.backend);

        mensajeCarga.textContent = "Cargando el núcleo WebAssembly…";
        const nucleo = await cargarNucleo({ semilla: 2026, muestras: 640 });

        mensajeCarga.textContent = "Generando circuito…";
        const mundo = crearEscena();
        escena = mundo.escena;

        circuito = crearCircuito({ nucleo });
        escena.add(circuito.grupo);

        carrera = crearCarrera({ nucleo, dificultad: DIFICULTAD, vueltas: VUELTAS });

        coche = crearCoche();
        escena.add(coche.grupo);

        rivales = crearRivales(carrera.rivales);
        rivales.anadirA(escena);

        camara = crearCamara(lienzo.clientWidth / lienzo.clientHeight || 16 / 9);
        seguimiento = crearSeguimiento(camara);

        colocarEnParrilla();

        mensajeCarga.textContent = "Compilando materiales…";
        await renderizador.compileAsync?.(escena, camara);

        renderizador.render(escena, camara);
        velo.classList.add("velo--oculto");

        globalThis.addEventListener("resize", alRedimensionar);
        document.addEventListener("visibilitychange", alCambiarVisibilidad);

        botonIniciar.addEventListener("click", iniciarCarrera);
        entrada.alAccion("pausa", alternarPausa);
        entrada.alAccion("reiniciar", reiniciarCarrera);

        ultimoTiempo = performance.now();
        renderizador.setAnimationLoop(bucle);
    } catch (error) {
        console.error("No se pudo iniciar el juego:", error);
        mostrarAviso(error);
    }
}

function mostrarAviso(error) {
    velo.classList.add("velo--oculto");
    menu.classList.add("menu--oculto");
    aviso.hidden = false;
    if (error?.message) {
        avisoTexto.textContent = `El navegador no ha podido dibujar la carrera (${error.message}). Activa la aceleración por hardware o prueba en un navegador actualizado.`;
    }
}

function colocarEnParrilla() {
    const { coche: cocheEstado, rivales: rivalesEstado } = carrera.iniciar();
    colocarCoche(cocheEstado);
    rivales.actualizar(rivalesEstado, 0);
    seguimiento.colocar(coche.grupo.position, cocheEstado.rumbo);
}

function colocarCoche(cocheEstado) {
    coche.grupo.position.set(cocheEstado.x, cocheEstado.y, cocheEstado.z);
    coche.grupo.rotation.y = cocheEstado.rumbo;

    const muestra = circuito.muestras[Math.round(cocheEstado.indice) % circuito.muestras.length];
    if (muestra) {
        coche.grupo.rotation.x = -Math.asin(limitar(muestra.tangente.y, -1, 1));
    }
}

function iniciarCarrera() {
    estado.modo = "carrera";
    colocarEnParrilla();
    menu.classList.add("menu--oculto");
    hud.mostrar(true);
}

function reiniciarCarrera() {
    if (estado.modo === "menu") return;
    estado.modo = "carrera";
    colocarEnParrilla();
    hud.mostrar(true);
}

function alternarPausa() {
    if (estado.modo === "carrera") {
        estado.modo = "pausa";
    } else if (estado.modo === "pausa") {
        estado.modo = "carrera";
        ultimoTiempo = performance.now();
    }
}

function alRedimensionar() {
    redimensionar(renderizador, camara, lienzo);
}

function alCambiarVisibilidad() {
    if (document.hidden && estado.modo === "carrera") {
        estado.modo = "pausa";
    }
}

function bucle(tiempoMs) {
    const dt = Math.min((tiempoMs - ultimoTiempo) / 1000 || 0, 0.05);
    ultimoTiempo = tiempoMs;
    estado.reloj += dt;

    if (estado.modo === "carrera" || estado.modo === "resultado") {
        actualizarCarrera(dt);
    } else if (estado.modo === "pausa") {
        // Congelado: se sigue dibujando el último estado.
    } else {
        seguimiento.orbitar(estado.reloj, coche.grupo.position);
        coche.actualizar({ dt, velocidad: 0, giro: 0 });
    }

    renderizador.render(escena, camara);
}

function actualizarCarrera(dt) {
    const input = estado.modo === "resultado" ? { acelerar: 0, frenar: 1, giro: 0, derrape: false } : entrada.leer();
    const { coche: cocheEstado, rivales: rivalesEstado } = carrera.paso(dt, input);

    colocarCoche(cocheEstado);
    coche.actualizar({
        dt,
        velocidad: cocheEstado.velocidad,
        giro: input.giro,
    });
    rivales.actualizar(rivalesEstado, dt);

    seguimiento.seguir(coche.grupo.position, cocheEstado.rumbo, dt, cocheEstado.velocidad);

    hudAcumulado += dt;
    if (hudAcumulado > 0.1) {
        hudAcumulado = 0;
        hud.actualizar({
            velocidadKmh: cocheEstado.velocidad * 3.6,
            vueltaActual: Math.min(Math.round(cocheEstado.vuelta), VUELTAS),
            vueltasTotales: VUELTAS,
        });
    }

    if (cocheEstado.terminado && estado.modo === "carrera") {
        estado.modo = "resultado";
    }
}

arrancar();
