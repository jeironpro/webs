import { formatearTiempo } from "../juego/utilidades.js";

export function crearPaneles() {
    const cuentaAtras = document.getElementById("cuenta-atras");
    const valorCuentaAtras = document.getElementById("cuenta-atras-valor");
    const pausa = document.getElementById("pausa");
    const resultados = document.getElementById("resultados");

    const campos = {
        tiempo: document.getElementById("resultado-tiempo"),
        mejor: document.getElementById("resultado-mejor"),
        posicion: document.getElementById("resultado-posicion"),
        choques: document.getElementById("resultado-choques"),
        record: document.getElementById("resultado-record"),
    };

    return {
        mostrarCuentaAtras(texto) {
            if (texto === null) {
                cuentaAtras.hidden = true;
                return;
            }
            valorCuentaAtras.textContent = texto;
            cuentaAtras.hidden = false;
        },
        mostrarPausa(visible) {
            pausa.hidden = !visible;
        },
        mostrarResultados({ tiempo, mejorVuelta, posicion, total, choques, record }) {
            campos.tiempo.textContent = formatearTiempo(tiempo);
            campos.mejor.textContent = mejorVuelta > 0 ? formatearTiempo(mejorVuelta) : "—";
            campos.posicion.textContent = `${posicion}/${total}`;
            campos.choques.textContent = String(choques);
            campos.record.hidden = !record;
            resultados.hidden = false;
        },
        ocultarResultados() {
            resultados.hidden = true;
        },
    };
}
