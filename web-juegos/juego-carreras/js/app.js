import { crearRenderizador, redimensionar } from "./juego/renderizador.js";
import { crearEscena } from "./juego/escena.js";
import { crearCircuito } from "./juego/pista.js";
import { crearCoche } from "./juego/coche.js";
import { crearCamara, crearSeguimiento } from "./juego/camara.js";
import { crearEntrada } from "./juego/entrada.js";
import { crearHud } from "./interfaz/hud.js";
import { limitar, modulo, suavizar } from "./juego/utilidades.js";

const VUELTAS = 3;
const VELOCIDAD_MAXIMA = 64;

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
    progreso: 0.002,
    desvio: 0,
    velocidad: 0,
    giro: 0,
    tiempo: 0,
};

let renderizador;
let escena;
let camara;
let seguimiento;
let circuito;
let coche;
let ultimoTiempo = 0;
let hudAcumulado = 0;

async function arrancar() {
    try {
        mensajeCarga.textContent = "Inicializando el motor gráfico…";
        const creado = await crearRenderizador(lienzo);
        renderizador = creado.renderizador;
        hud.backend(creado.backend);

        mensajeCarga.textContent = "Generando circuito…";
        const mundo = crearEscena();
        escena = mundo.escena;

        circuito = crearCircuito();
        escena.add(circuito.grupo);

        coche = crearCoche();
        escena.add(coche.grupo);

        camara = crearCamara(lienzo.clientWidth / lienzo.clientHeight || 16 / 9);
        seguimiento = crearSeguimiento(camara);

        posicionarCoche();

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
        avisoTexto.textContent = `El navegador no ha podido crear un contexto WebGPU ni WebGL 2 (${error.message}). Activa la aceleración por hardware o prueba en un navegador actualizado.`;
    }
}

function iniciarCarrera() {
    estado.modo = "carrera";
    estado.progreso = 0.002;
    estado.desvio = 0;
    estado.velocidad = 0;
    estado.tiempo = 0;
    menu.classList.add("menu--oculto");
    hud.mostrar(true);
    posicionarCoche();
}

function reiniciarCarrera() {
    if (estado.modo === "menu") return;
    estado.modo = "carrera";
    estado.progreso = 0.002;
    estado.desvio = 0;
    estado.velocidad = 0;
    estado.tiempo = 0;
    posicionarCoche();
}

function alternarPausa() {
    if (estado.modo === "carrera") {
        estado.modo = "pausa";
    } else if (estado.modo === "pausa") {
        estado.modo = "carrera";
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

function posicionarCoche() {
    const muestra = circuito.muestraEn(estado.progreso);
    coche.grupo.position.copy(circuito.posicionEn(estado.progreso, estado.desvio));
    const rumbo = Math.atan2(muestra.tangente.x, muestra.tangente.z);
    coche.grupo.rotation.y = rumbo;
    coche.grupo.rotation.x = -Math.asin(limitar(muestra.tangente.y, -1, 1));
    seguimiento.colocar(coche.grupo.position, rumbo);
}

function actualizarCarrera(dt) {
    const input = entrada.leer();

    estado.giro = suavizar(estado.giro, input.giro, 9, dt);

    const aceleracion = input.acelerar * 26 - input.frenar * 34;
    const resistencia = estado.velocidad * (input.derrape ? 0.42 : 0.26);
    estado.velocidad = limitar(estado.velocidad + (aceleracion - resistencia) * dt, 0, VELOCIDAD_MAXIMA);

    const agarre = input.derrape ? 1.7 : 1;
    const respuesta = 6.5 * agarre * (0.35 + Math.min(estado.velocidad, 55) / 55);
    const limiteDesvio = circuito.ancho / 2 - 1.2;

    if (estado.velocidad > 0.5) {
        estado.desvio = limitar(
            estado.desvio + estado.giro * respuesta * dt,
            -limiteDesvio,
            limiteDesvio
        );
    }

    if (Math.abs(estado.giro) < 0.05) {
        estado.desvio = suavizar(estado.desvio, 0, 1.4, dt);
    }

    estado.progreso = modulo(estado.progreso + (estado.velocidad * dt) / circuito.longitud, 1);
    estado.tiempo += dt;

    const muestra = circuito.muestraEn(estado.progreso);
    coche.grupo.position.copy(circuito.posicionEn(estado.progreso, estado.desvio));
    coche.grupo.rotation.y = Math.atan2(muestra.tangente.x, muestra.tangente.z);
    coche.grupo.rotation.x = -Math.asin(limitar(muestra.tangente.y, -1, 1));

    coche.actualizar({ dt, velocidad: estado.velocidad, giro: estado.giro });

    return muestra;
}

function bucle(tiempoMs) {
    const dt = Math.min((tiempoMs - ultimoTiempo) / 1000 || 0, 0.05);
    ultimoTiempo = tiempoMs;
    estado.reloj += dt;

    if (estado.modo === "carrera") {
        const muestra = actualizarCarrera(dt);
        const adelante = Math.atan2(muestra.tangente.x, muestra.tangente.z);
        seguimiento.seguir(coche.grupo.position, adelante, dt, estado.velocidad);
    } else {
        seguimiento.orbitar(estado.reloj, coche.grupo.position);
        coche.actualizar({ dt, velocidad: 0, giro: 0 });
    }

    hudAcumulado += dt;
    if (hudAcumulado > 0.1) {
        hudAcumulado = 0;
        hud.actualizar({
            velocidadKmh: estado.velocidad * 3.6,
            vueltaActual: 1,
            vueltasTotales: VUELTAS,
        });
    }

    renderizador.render(escena, camara);
}

arrancar();
