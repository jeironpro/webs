function calcular() {
    const fechaInput = document.getElementById("fecha");
    const tarjetaResultado = document.getElementById("tarjetaResultado");
    const textoEdad = document.getElementById("textoEdad");

    if (!fechaInput.value) {
        alert("Por favor selecciona una fecha de nacimiento");
        return;
    }

    const fechaUsuario = new Date(fechaInput.value);
    const fechaActual = new Date();

    let años = fechaActual.getFullYear() - fechaUsuario.getFullYear();
    let meses = fechaActual.getMonth() - fechaUsuario.getMonth();
    let dias = fechaActual.getDate() - fechaUsuario.getDate();

    if (meses < 0 || (meses === 0 && fechaActual.getDate() < fechaUsuario.getDate())) {
        años--;
        meses += 12;
    }

    if (dias < 0) {
        let diaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0).getDate();
        dias += diaMes;
        meses--;
    }

    textoEdad.innerText = `Tienes ${años} años, ${meses} meses y ${dias} días`;

    tarjetaResultado.classList.remove("oculto");
    tarjetaResultado.classList.add("visible");
}