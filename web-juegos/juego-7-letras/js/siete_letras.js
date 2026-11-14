const elementos = {
    centro: document.querySelector("#centro"),
    lados: [...document.querySelectorAll(".lado")],
    palabra: document.querySelector("#palabra"),
    estado: document.querySelector("#estado"),
    contador: document.querySelector("#contador"),
    totalEncontradas: document.querySelector("#total-encontradas"),
    contenedorPalabras: document.querySelector("#contenedor-palabras"),
    totalPalabras: document.querySelector("#total-palabras"),
    mensaje: document.querySelector("#mensaje"),
    btnBorrar: document.querySelector("#borrar"),
    btnCambiar: document.querySelector("#cambiar"),
    btnAplicar: document.querySelector("#aplicar"),
    btnNueva: document.querySelector("#nueva"),
};

let bloques = [];
let palabras = [];
let palabrasValidas = [];
let palabrasAcertadas = [];
let letraCentro = "";
let otrasLetras = [];
let palabraActual = "";
let bloqueActual = -1;

function mezclar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function elegirLetraCentral(letrasRaiz) {
    const unicas = [...new Set(letrasRaiz)];
    const candidatos = unicas.map((letra) => ({
        letra,
        total: palabras.filter(
            (palabra) =>
                palabra.includes(letra) &&
                [...palabra].every((caracter) => letrasRaiz.includes(caracter))
        ).length,
    }));
    const maximo = Math.max(...candidatos.map((candidato) => candidato.total));
    const mejores = candidatos.filter((candidato) => candidato.total === maximo);
    return mejores[Math.floor(Math.random() * mejores.length)].letra;
}

function nuevaColmena() {
    if (bloques.length === 0) return;

    let indice = Math.floor(Math.random() * bloques.length);
    if (bloques.length > 1 && indice === bloqueActual) {
        indice = (indice + 1) % bloques.length;
    }

    bloqueActual = indice;
    palabras = bloques[indice].map((palabra) => palabra.toLowerCase());
    const raiz = palabras.find((palabra) => palabra.length === 7);

    if (!raiz) {
        nuevaColmena();
        return;
    }

    const letrasRaiz = raiz.split("");
    const letrasDisponibles = [...new Set(letrasRaiz)];
    letraCentro = elegirLetraCentral(letrasRaiz);
    otrasLetras = mezclar(letrasRaiz.filter((letra) => letra !== letraCentro));
    palabrasValidas = [
        ...new Set(
            palabras.filter(
                (palabra) =>
                    palabra.length >= 3 &&
                    palabra.includes(letraCentro) &&
                    [...palabra].every((caracter) => letrasDisponibles.includes(caracter))
            )
        ),
    ];

    palabrasAcertadas = [];
    palabraActual = "";
    elementos.mensaje.className = "mensaje";
    elementos.mensaje.textContent = "";
    elementos.totalPalabras.textContent = `${palabrasValidas.length} palabras en esta colmena`;
    pintarLetras();
    actualizarUI();
    anunciar("Forma una palabra que contenga la letra central.");
}

function pintarLetras() {
    elementos.centro.querySelector(".letra").textContent = letraCentro.toUpperCase();
    elementos.lados.forEach((lado, indice) => {
        lado.querySelector(".letra").textContent = (otrasLetras[indice] ?? "").toUpperCase();
    });
}

function actualizarUI() {
    elementos.palabra.textContent = palabraActual.toUpperCase();
    elementos.contador.textContent = `${palabrasAcertadas.length} / ${palabrasValidas.length}`;
    elementos.totalEncontradas.textContent = String(palabrasAcertadas.length);
    elementos.contenedorPalabras.textContent = "";

    if (palabrasAcertadas.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "vacio";
        vacio.textContent = "Todavía no has formado ninguna.";
        elementos.contenedorPalabras.appendChild(vacio);
        return;
    }

    [...palabrasAcertadas]
        .sort((a, b) => a.localeCompare(b, "es"))
        .forEach((palabra) => {
            const chip = document.createElement("span");
            chip.className = "palabra-chip";
            chip.textContent = palabra;
            elementos.contenedorPalabras.appendChild(chip);
        });
}

function anunciar(texto) {
    elementos.estado.textContent = texto;
}

function mostrarMensaje(texto, tipo = "") {
    elementos.mensaje.className = "mensaje";
    if (tipo) elementos.mensaje.classList.add(tipo);
    elementos.mensaje.textContent = texto;
}

function agregarLetra(letra) {
    if (!letra) return;
    palabraActual += letra;
    elementos.palabra.textContent = palabraActual.toUpperCase();
    elementos.mensaje.textContent = "";
}

function borrarLetra() {
    palabraActual = palabraActual.slice(0, -1);
    elementos.palabra.textContent = palabraActual.toUpperCase();
}

function cambiarOrden() {
    otrasLetras = mezclar(otrasLetras);
    pintarLetras();
}

function probarPalabra() {
    const palabra = palabraActual.toLowerCase();

    if (palabra.length < 3) {
        mostrarMensaje("La palabra debe tener al menos 3 letras.", "error");
        return;
    }

    if (!palabra.includes(letraCentro)) {
        mostrarMensaje(
            `La palabra debe contener la letra central: ${letraCentro.toUpperCase()}.`,
            "error"
        );
        return;
    }

    if (!palabrasValidas.includes(palabra)) {
        mostrarMensaje("Esa palabra no está en esta colmena.", "error");
        return;
    }

    if (palabrasAcertadas.includes(palabra)) {
        mostrarMensaje("Ya has encontrado esa palabra.", "aviso");
        return;
    }

    palabrasAcertadas.push(palabra);
    palabraActual = "";
    actualizarUI();
    mostrarMensaje("¡Palabra encontrada!", "exito");

    if (palabrasAcertadas.length === palabrasValidas.length) {
        anunciar("¡Colmena completa!");
        mostrarMensaje("¡Has encontrado todas las palabras de la colmena!", "exito");
    } else {
        anunciar("Sigue buscando palabras con la letra central.");
    }
}

async function cargarJuego() {
    try {
        const respuesta = await fetch("data/siete_letras.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo de colmenas.");
        bloques = await respuesta.json();
        elementos.totalPalabras.textContent = `${bloques.flat().length.toLocaleString("es-ES")} palabras`;
        nuevaColmena();
    } catch {
        anunciar("No se pudo cargar el juego. Recarga la página.");
    }
}

elementos.lados.forEach((lado) => {
    lado.addEventListener("click", () =>
        agregarLetra(lado.querySelector(".letra").textContent.toLowerCase())
    );
});

elementos.centro.addEventListener("click", () => agregarLetra(letraCentro));
elementos.btnBorrar.addEventListener("click", borrarLetra);
elementos.btnCambiar.addEventListener("click", cambiarOrden);
elementos.btnAplicar.addEventListener("click", probarPalabra);
elementos.btnNueva.addEventListener("click", nuevaColmena);

document.addEventListener("keydown", (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    const tecla = evento.key.toLowerCase();

    if (tecla === "enter") {
        evento.preventDefault();
        probarPalabra();
    } else if (tecla === "backspace") {
        evento.preventDefault();
        borrarLetra();
    } else if (/^[a-zñ]$/.test(tecla)) {
        evento.preventDefault();
        agregarLetra(tecla);
    }
});

cargarJuego();
