/**
 * Controles táctiles: se muestran al arrancar la carrera y desaparecen en el
 * menú, la pausa y los resultados. La visibilidad la manda `app.js` con el
 * modo actual; aquí solo se evita escribir el DOM en cada frame.
 */
export function crearTactil() {
    const contenedor = document.getElementById("tactil");
    let visible = false;

    contenedor.hidden = true;

    return {
        mostrar(mostrar) {
            if (mostrar === visible) return;
            visible = mostrar;
            contenedor.hidden = !mostrar;
        },
    };
}
