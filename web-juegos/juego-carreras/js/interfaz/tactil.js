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
