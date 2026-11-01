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
import { crearMenu } from "./interfaz/menu.js";
import { crearPaneles } from "./interfaz/paneles.js";
import { crearAudio } from "./interfaz/audio.js";
import { limitar } from "./juego/utilidades.js";

const VUELTAS_POR_DEFECTO = 3;
const DURACION_CUENTA_ATRAS = 3;

const lienzo = document.getElementById("lienzo");
const velo = document.getElementById("velo-carga");
const mensajeCarga = document.getElementById("carga-mensaje");
const aviso = document.getElementById("aviso");
const avisoTexto = document.getElementById("aviso-texto");

const hud = crearHud();
const paneles = crearPaneles();
const entrada = crearEntrada();
const audio = crearAudio();

const estado = {
    modo: "menu",
    reloj: 0,
    cuentaAtras: 0,
    posicion: 1,
    record: false,
};

let opciones = {
    dificultad: 1,
    semilla: 2026,
    vueltas: VUELTAS_POR_DEFECTO,
    sonido: true,
};
let renderizador;
let escena;
let camara;
let seguimiento;
let circuito;
let coche;
let rivales;
let carrera;
let menu;
let ultimoTiempo = 0;
let hudAcumulado = 0;
let seguirSombra = () => {};

async function arrancar() {
    try {
        mensajeCarga.textContent = "Inicializando el motor gráfico…";
        const creado = await crearRenderizador(lienzo);
        renderizador = creado.renderizador;
        hud.backend(creado.backend);

        mensajeCarga.textContent = "Cargando el núcleo WebAssembly…";
        const nucleo = await cargarNucleo({ semilla: opciones.semilla, muestras: 640 });

        mensajeCarga.textContent = "Generando circuito…";
        const mundo = crearEscena();
        escena = mundo.escena;
        seguirSombra = mundo.luces.seguirSombra;

        circuito = crearCircuito({ nucleo });
        escena.add(circuito.grupo);

        carrera = crearCarrera({
            nucleo,
            dificultad: opciones.dificultad,
            vueltas: opciones.vueltas,
        });

        coche = crearCoche();
        escena.add(coche.grupo);

        rivales = crearRivales(carrera.rivales);
        rivales.anadirA(escena);

        camara = crearCamara(lienzo.clientWidth / lienzo.clientHeight || 16 / 9);
        seguimiento = crearSeguimiento(camara);
        hud.configurarCircuito(circuito.muestras);

        menu = crearMenu({ alIniciar: (nuevas) => comenzar(nuevas) });

        conectarBotones();
        colocarEnParrilla(false);

        mensajeCarga.textContent = "Compilando materiales…";
        await renderizador.compileAsync?.(escena, camara);

        renderizador.render(escena, camara);
        velo.classList.add("velo--oculto");

        globalThis.addEventListener("resize", alRedimensionar);
        document.addEventListener("visibilitychange", alCambiarVisibilidad);
        entrada.alAccion("pausa", alternarPausa);
        entrada.alAccion("reiniciar", reiniciarCuenta);

        ultimoTiempo = performance.now();
        renderizador.setAnimationLoop(bucle);
    } catch (error) {
        console.error("No se pudo iniciar el juego:", error);
        mostrarAviso(error);
    }
}

function conectarBotones() {
    document.getElementById("boton-reanudar").addEventListener("click", alternarPausa);
    document.getElementById("boton-reiniciar").addEventListener("click", reiniciarCuenta);
    document.getElementById("boton-menu").addEventListener("click", volverAlMenu);
    document.getElementById("boton-otra-vez").addEventListener("click", reiniciarCuenta);
    document.getElementById("boton-volver-menu").addEventListener("click", volverAlMenu);
}

function mostrarAviso(error) {
    velo.classList.add("velo--oculto");
    document.getElementById("menu").classList.add("menu--oculto");
    aviso.hidden = false;
    if (error?.message) {
        avisoTexto.textContent = `El navegador no ha podido dibujar la carrera (${error.message}). Activa la aceleración por hardware o prueba en un navegador actualizado.`;
    }
}

function colocarEnParrilla(contarCuentaAtras = true) {
    const { coche: cocheEstado, rivales: rivalesEstado } = carrera.iniciar({
        dificultad: opciones.dificultad,
        vueltas: opciones.vueltas,
    });

    colocarCoche(cocheEstado);
    rivales.actualizar(rivalesEstado, 0);
    seguimiento.colocar(coche.grupo.position, cocheEstado.rumbo);
    hud.dibujarMinimapa({ coche: cocheEstado, rivales: rivalesEstado });
    hud.actualizar({
        velocidadKmh: 0,
        posicion: 1,
        totalCoches: rivalesEstado.length + 1,
        vueltaActual: 1,
        vueltasTotales: opciones.vueltas,
        tiempo: 0,
        mejorVuelta: 0,
        choques: 0,
    });

    estado.posicion = 1;
    estado.record = false;

    if (contarCuentaAtras) {
        estado.modo = "cuenta";
        estado.cuentaAtras = DURACION_CUENTA_ATRAS;
        paneles.mostrarCuentaAtras(String(DURACION_CUENTA_ATRAS));
    }
}

function comenzar(nuevas) {
    opciones = nuevas;
    audio.aplicarSilencio(!opciones.sonido);

    if (opciones.semilla !== circuito.semilla) {
        regenerarCircuito(opciones.semilla);
    }

    menu.ocultar();
    paneles.ocultarResultados();
    paneles.mostrarPausa(false);
    hud.mostrar(true);
    audio.activar(!opciones.sonido);
    colocarEnParrilla(true);
}

function regenerarCircuito(semilla) {
    escena.remove(circuito.grupo);
    circuito.grupo.traverse((objeto) => {
        objeto.geometry?.dispose?.();
    });

    circuito.nucleo.regenerar(semilla);
    circuito = crearCircuito({ nucleo: circuito.nucleo });
    escena.add(circuito.grupo);

    carrera = crearCarrera({
        nucleo: circuito.nucleo,
        dificultad: opciones.dificultad,
        vueltas: opciones.vueltas,
    });

    hud.configurarCircuito(circuito.muestras);
}

function reiniciarCuenta() {
    if (estado.modo === "menu") return;
    paneles.mostrarPausa(false);
    paneles.ocultarResultados();
    audio.activar(!opciones.sonido);
    colocarEnParrilla(true);
}

function volverAlMenu() {
    estado.modo = "menu";
    paneles.mostrarPausa(false);
    paneles.ocultarResultados();
    paneles.mostrarCuentaAtras(null);
    hud.mostrar(false);
    audio.pausar();
    menu.mostrar();
    colocarEnParrilla(false);
}

function alternarPausa() {
    if (estado.modo === "carrera" || estado.modo === "cuenta") {
        estado.modoAnterior = estado.modo;
        estado.modo = "pausa";
        paneles.mostrarPausa(true);
        audio.pausar();
    } else if (estado.modo === "pausa") {
        estado.modo = estado.modoAnterior === "cuenta" ? "cuenta" : "carrera";
        paneles.mostrarPausa(false);
        audio.activar(!opciones.sonido);
        ultimoTiempo = performance.now();
    }
}

function alRedimensionar() {
    redimensionar(renderizador, camara, lienzo);
    hud.configurarCircuito(circuito.muestras);
}

function alCambiarVisibilidad() {
    if (document.hidden && (estado.modo === "carrera" || estado.modo === "cuenta")) {
        estado.modoAnterior = estado.modo;
        estado.modo = "pausa";
        paneles.mostrarPausa(true);
        audio.pausar();
    }
}

function colocarCoche(cocheEstado) {
    coche.grupo.position.set(cocheEstado.x, cocheEstado.y, cocheEstado.z);
    coche.grupo.rotation.y = cocheEstado.rumbo;

    const muestra = circuito.muestras[Math.round(cocheEstado.indice) % circuito.muestras.length];
    if (muestra) {
        coche.grupo.rotation.x = -Math.asin(limitar(muestra.tangente.y, -1, 1));
        // El coche se apoya en el peralte: si no rueda con la curva, las ruedas
        // del lado alto quedan enterradas en el asfalto.
        coche.grupo.rotation.z = muestra.peralte;
    }
}

function calcularPosicion(cocheEstado, rivalesEstado) {
    const miDistancia = (cocheEstado.vuelta - 1) + cocheEstado.progreso;
    let delante = 0;

    for (const rival of rivalesEstado) {
        const suDistancia = (rival.vuelta - 1) + rival.progreso;
        if (suDistancia > miDistancia) delante += 1;
    }

    return delante + 1;
}

function guardarRecord(cocheEstado) {
    const clave = `carreras:mejor:${circuito.semilla}:${opciones.dificultad}`;
    try {
        const anterior = Number.parseFloat(globalThis.localStorage.getItem(clave) ?? "0");
        if (cocheEstado.mejorVuelta > 0 && (anterior === 0 || cocheEstado.mejorVuelta < anterior)) {
            globalThis.localStorage.setItem(clave, String(cocheEstado.mejorVuelta));
            return true;
        }
    } catch {
        // Almacenamiento no disponible (modo privado): se juega sin récord.
    }
    return false;
}

function terminarCarrera(cocheEstado, rivalesEstado) {
    estado.modo = "resultado";
    estado.posicion = calcularPosicion(cocheEstado, rivalesEstado);
    estado.record = guardarRecord(cocheEstado);

    audio.pausar();
    paneles.mostrarResultados({
        tiempo: cocheEstado.tiempo,
        mejorVuelta: cocheEstado.mejorVuelta,
        posicion: estado.posicion,
        total: rivalesEstado.length + 1,
        choques: cocheEstado.choques,
        record: estado.record,
    });
}

function actualizarCarrera(dt) {
    const input = entrada.leer();
    const { coche: cocheEstado, rivales: rivalesEstado } = carrera.paso(dt, input);

    colocarCoche(cocheEstado);
    coche.actualizar({ dt, velocidad: cocheEstado.velocidad, giro: input.giro });
    rivales.actualizar(rivalesEstado, dt);
    seguimiento.seguir(coche.grupo.position, cocheEstado.rumbo, dt, cocheEstado.velocidad);
    audio.actualizar({ velocidad: cocheEstado.velocidad, derrape: input.derrape });

    hudAcumulado += dt;
    if (hudAcumulado > 0.1) {
        hudAcumulado = 0;
        estado.posicion = calcularPosicion(cocheEstado, rivalesEstado);
        hud.actualizar({
            velocidadKmh: cocheEstado.velocidad * 3.6,
            posicion: estado.posicion,
            totalCoches: rivalesEstado.length + 1,
            vueltaActual: Math.min(Math.round(cocheEstado.vuelta), opciones.vueltas),
            vueltasTotales: opciones.vueltas,
            tiempo: cocheEstado.tiempo,
            mejorVuelta: cocheEstado.mejorVuelta,
            choques: cocheEstado.choques,
        });
        hud.dibujarMinimapa({ coche: cocheEstado, rivales: rivalesEstado });
    }

    if (cocheEstado.terminado) {
        terminarCarrera(cocheEstado, rivalesEstado);
    }
}

function bucle(tiempoMs) {
    const dt = Math.min((tiempoMs - ultimoTiempo) / 1000 || 0, 0.05);
    ultimoTiempo = tiempoMs;
    estado.reloj += dt;

    if (estado.modo === "cuenta") {
        estado.cuentaAtras -= dt;
        const restante = Math.ceil(estado.cuentaAtras);
        paneles.mostrarCuentaAtras(restante > 0 ? String(restante) : "¡YA!");

        if (estado.cuentaAtras <= -0.5) {
            paneles.mostrarCuentaAtras(null);
            estado.modo = "carrera";
        }
        coche.actualizar({ dt, velocidad: 0, giro: 0 });
    } else if (estado.modo === "carrera") {
        actualizarCarrera(dt);
    } else if (estado.modo === "resultado") {
        seguimiento.orbitar(estado.reloj, coche.grupo.position, 18);
        coche.actualizar({ dt, velocidad: 0, giro: 0 });
    } else if (estado.modo === "menu") {
        seguimiento.orbitar(estado.reloj, coche.grupo.position);
        coche.actualizar({ dt, velocidad: 0, giro: 0 });
    }

    seguirSombra(coche.grupo.position);
    renderizador.render(escena, camara);
}

arrancar();
