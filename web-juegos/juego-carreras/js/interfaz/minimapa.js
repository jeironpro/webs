/**
 * Minimapa del circuito: dibuja el trazado una vez configurado y recoloca los
 * puntos de coche y rivales a la frecuencia del HUD. No bloquea el render 3D.
 */
export function crearMinimapa(lienzo) {
    const contexto = lienzo.getContext("2d");
    let puntos = [];
    let escala = 1;
    let centroX = 0;
    let centroZ = 0;
    let ancho = 132;
    let alto = 132;

    function ajustarLienzo() {
        const proporcion = Math.min(globalThis.devicePixelRatio || 1, 2);
        const rect = lienzo.getBoundingClientRect();
        ancho = rect.width || ancho;
        alto = rect.height || alto;
        lienzo.width = Math.max(1, Math.round(ancho * proporcion));
        lienzo.height = Math.max(1, Math.round(alto * proporcion));
        contexto.setTransform(proporcion, 0, 0, proporcion, 0, 0);
    }

    function configurar(muestras) {
        ajustarLienzo();

        let minX = Infinity;
        let maxX = -Infinity;
        let minZ = Infinity;
        let maxZ = -Infinity;

        for (const muestra of muestras) {
            minX = Math.min(minX, muestra.posicion.x);
            maxX = Math.max(maxX, muestra.posicion.x);
            minZ = Math.min(minZ, muestra.posicion.z);
            maxZ = Math.max(maxZ, muestra.posicion.z);
        }

        centroX = (minX + maxX) / 2;
        centroZ = (minZ + maxZ) / 2;

        const margen = 16;
        const anchoUtil = Math.max(ancho - margen * 2, 1);
        const altoUtil = Math.max(alto - margen * 2, 1);
        escala = Math.min(anchoUtil / Math.max(maxX - minX, 1), altoUtil / Math.max(maxZ - minZ, 1));

        puntos = muestras.map((muestra) => [muestra.posicion.x, muestra.posicion.z]);
    }

    function proyectar(x, z) {
        return [ancho / 2 + (x - centroX) * escala, alto / 2 + (z - centroZ) * escala];
    }

    function dibujar({ coche, rivales }) {
        if (puntos.length === 0) return;

        contexto.clearRect(0, 0, ancho, alto);

        contexto.lineJoin = "round";
        contexto.lineWidth = 5;
        contexto.strokeStyle = "rgba(96, 116, 176, 0.55)";
        contexto.beginPath();
        puntos.forEach(([x, z], indice) => {
            const [px, py] = proyectar(x, z);
            if (indice === 0) contexto.moveTo(px, py);
            else contexto.lineTo(px, py);
        });
        contexto.closePath();
        contexto.stroke();

        contexto.lineWidth = 1;
        contexto.strokeStyle = "rgba(53, 198, 219, 0.5)";
        contexto.stroke();

        for (const rival of rivales) {
            const [px, py] = proyectar(rival.x, rival.z);
            contexto.fillStyle = "#ff6b8a";
            contexto.beginPath();
            contexto.arc(px, py, 3, 0, Math.PI * 2);
            contexto.fill();
        }

        const [px, py] = proyectar(coche.x, coche.z);
        contexto.fillStyle = "#35c6db";
        contexto.beginPath();
        contexto.arc(px, py, 4.5, 0, Math.PI * 2);
        contexto.fill();
        contexto.lineWidth = 1.5;
        contexto.strokeStyle = "#f2f4ff";
        contexto.stroke();
    }

    return { configurar, dibujar };
}
