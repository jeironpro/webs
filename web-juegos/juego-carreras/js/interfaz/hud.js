import { formatearTiempo } from "../juego/utilidades.js";
import { crearMinimapa } from "./minimapa.js";

export function crearHud() {
    const contenedor = document.getElementById("hud");
    const backend = document.getElementById("hud-backend");
    const backendTexto = document.getElementById("hud-backend-texto");

    const campos = {
        velocidad: document.getElementById("hud-velocidad"),
        posicion: document.getElementById("hud-posicion"),
        vuelta: document.getElementById("hud-vuelta"),
        tiempo: document.getElementById("hud-tiempo"),
        mejor: document.getElementById("hud-mejor"),
        choques: document.getElementById("hud-choques"),
    };

    const minimapa = crearMinimapa(document.getElementById("minimapa"));
    const cache = new Map();

    function escribir(campo, texto) {
        if (cache.get(campo) === texto) return;
        cache.set(campo, texto);
        campos[campo].textContent = texto;
    }

    return {
        mostrar(visible) {
            contenedor.hidden = !visible;
        },
        backend(nombre) {
            const esWebGPU = nombre === "webgpu";
            backendTexto.textContent = esWebGPU ? "WebGPU activo" : "WebGL 2 (fallback)";
            backend.classList.add(esWebGPU ? "chip--gpu" : "chip--webgl");
        },
        configurarCircuito(muestras) {
            minimapa.configurar(muestras);
        },
        dibujarMinimapa(estadoCarrera) {
            minimapa.dibujar(estadoCarrera);
        },
        actualizar({
            velocidadKmh,
            posicion,
            totalCoches,
            vueltaActual,
            vueltasTotales,
            tiempo,
            mejorVuelta,
            choques,
        }) {
            escribir("velocidad", String(Math.round(velocidadKmh)));
            escribir("posicion", `${posicion}/${totalCoches}`);
            escribir("vuelta", `${vueltaActual}/${vueltasTotales}`);
            escribir("tiempo", formatearTiempo(tiempo));
            escribir("mejor", mejorVuelta > 0 ? formatearTiempo(mejorVuelta) : "—");
            escribir("choques", String(choques));
        },
    };
}
