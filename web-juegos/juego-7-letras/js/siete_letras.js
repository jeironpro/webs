let palabrasAcertadas = [];
let palabras = [];
let letraComun = "";
let otrasLetras = [];

const centro = document.getElementById("centro");
const lados = document.querySelectorAll(".lado");
const letrasUI = document.querySelectorAll(".hexagono");
const palabraUI = document.getElementById("palabra");
const botonBorrar = document.getElementById("borrar");
const botonCambiar = document.getElementById("cambiar");
const botonAplicar = document.getElementById("aplicar");
const contadorPalabrasAcertadas = document.getElementById("contador-palabras-validas");
const contenedorPalabrasAcertadas = document.getElementById("contenedor-palabras-acertadas");

let letrasHabilitadas = true;

async function iniciarJuego() {
    try {
        const respuesta = await fetch('json/siete_letras.json');
        const datos = await respuesta.json();
        
        const indiceAleatorio = Math.floor(Math.random() * datos.length);
        palabras = datos[indiceAleatorio];
        
        const palabraRaiz = palabras.find(p => p.length === 7);
        if (!palabraRaiz) {
            console.error("No se encontró palabra de 7 letras en el bloque");
            return;
        }
        
        const letras = palabraRaiz.toUpperCase().split("");
        cambiarOrden(letras);
        
        letraComun = letras[0];
        otrasLetras = letras.slice(1);
        
        actualizarUI();
        actualizarContador();
        
    } catch (error) {
        console.error("Error al cargar datos del juego:", error);
        mostrarMensaje("Error al cargar el juego", "error");
    }
}

function actualizarUI() {
    const spanCentro = document.createElement("span");
    spanCentro.className = "letra";
    spanCentro.textContent = letraComun;
    centro.textContent = "";
    centro.appendChild(spanCentro);
    
    lados.forEach((lado, indice) => {
        const spanLado = document.createElement("span");
        spanLado.className = "letra";
        spanLado.textContent = otrasLetras[indice] ?? "";
        lado.textContent = "";
        lado.appendChild(spanLado);
    });
}

function cambiarOrden(arreglo) {
    for (let i = arreglo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
    }
    return arreglo;
}

letrasUI.forEach(letra => {
    letra.addEventListener("click", () => {
        if (!letrasHabilitadas) return;
        const valor = letra.querySelector("span").textContent.toUpperCase();
        palabraUI.textContent += valor;
    });
});

botonBorrar.addEventListener("click", () => {
    palabraUI.textContent = palabraUI.textContent.slice(0, -1);
});

botonCambiar.addEventListener("click", () => {
    cambiarOrden(otrasLetras);
    actualizarUI();
});

function mostrarMensaje(texto, tipo = "") {
    const divMensaje = document.createElement("div");
    divMensaje.className = tipo;
    divMensaje.textContent = texto;
    
    palabraUI.textContent = "";
    palabraUI.appendChild(divMensaje);
    
    botonBorrar.disabled = true;
    botonCambiar.disabled = true;
    botonAplicar.disabled = true;
    letrasHabilitadas = false;

    setTimeout(() => {
        botonBorrar.disabled = false;
        botonCambiar.disabled = false;
        botonAplicar.disabled = false;
        letrasHabilitadas = true;
        palabraUI.textContent = "";
    }, 2000);
}

function verificarPalabra(palabra) {
    palabra = palabra.toLowerCase();

    if (!palabra.includes(letraComun.toLowerCase())) {
        mostrarMensaje("La palabra debe contener la letra del centro.", "error");
    } else if (palabra.length < 3) {
        mostrarMensaje("La palabra debe tener al menos 3 letras.", "error");
    } else if (!palabras.some(palab => palab.toLowerCase() === palabra)) {
        mostrarMensaje("La palabra no es válida.", "error");
    } else if (palabrasAcertadas.includes(palabra)) {
        mostrarMensaje("La palabra ya ha sido acertada.", "aviso");
    } else {
        palabrasAcertadas.push(palabra);
        actualizarContador();
        mostrarMensaje("¡Palabra acertada!", "exito");
    }
}

function actualizarContador() {
    contadorPalabrasAcertadas.textContent = "";
    
    const marcadorPA = document.createElement("span");
    marcadorPA.className = "marcador contador-palabras";
    
    const tituloPA = document.createElement("span");
    tituloPA.className = "titulo-estadistica";
    tituloPA.textContent = "PA";
    
    const contadorSpan = document.createElement("span");
    contadorSpan.className = "contador";
    contadorSpan.textContent = palabrasAcertadas.length;
    
    marcadorPA.appendChild(tituloPA);
    marcadorPA.appendChild(contadorSpan);
    
    const separador = document.createTextNode(" / ");
    
    const marcadorTP = document.createElement("span");
    marcadorTP.className = "marcador total-palabras";
    
    const tituloTP = document.createElement("span");
    tituloTP.className = "titulo-estadistica";
    tituloTP.textContent = "TP";
    
    const totalSpan = document.createElement("span");
    totalSpan.className = "total";
    totalSpan.textContent = palabras.length;
    
    marcadorTP.appendChild(tituloTP);
    marcadorTP.appendChild(totalSpan);
    
    contadorPalabrasAcertadas.appendChild(marcadorPA);
    contadorPalabrasAcertadas.appendChild(separador);
    contadorPalabrasAcertadas.appendChild(marcadorTP);
    
    contenedorPalabrasAcertadas.textContent = "";
    
    const spanPalabras = document.createElement("span");
    spanPalabras.className = "palabras-acertadas";
    spanPalabras.textContent = palabrasAcertadas.join(", ");
    
    contenedorPalabrasAcertadas.appendChild(spanPalabras);
    
    if(contadorSpan) {
        contadorSpan.classList.add("animar");
        setTimeout(() => contadorSpan.classList.remove("animar"), 300);
    }
}

botonAplicar.addEventListener("click", () => {
    verificarPalabra(palabraUI.textContent);
});

iniciarJuego();