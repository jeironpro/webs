const examenes = {
    BBDD: [
        "Introducción diseño",
        "Taller jedai",
        "Introduccion sql",
        "DDL 1",
        "DDL 2",
        "DDL 3",
        "DML",
        "DML 1",
        "DML 2",
        "DML 3",
        "DML 4",
        "DML 5",
        "DML 6",
        "DML 7",
        "Programación",
        "Diseño de base de datos",
        "Introduccion mongodb",
        "Base de datos mongodb",
        "Crud create mongodb",
        "Crud delete mongodb",
        "Crud update mongodb",
        "Crud read mongodb",
        "Crud read arreglos y objectes mongodb",
        "Crud read avanzado mongodb"
    ],
    SI: [
        "Componentes de sistemas informatics",
        "Licencias",
        "Sistemas numericos",
        "Programario",
        "Implantació de sistemes operatius (tvi-vb)",
        "Comandos linux",
        "Comandos windows",
        "Dominios windows",
        "Usuarios linux 1",
        "Usuarios linux 2",
        "Redes TCP",
        "Backup",
        "Peticiones 1",
        "Permisos linux",
        "Permisos windows",
        "Servicios NFS - SAMBA",
        "Aplicaciones"
    ],
    LMSGI: [
        "Introducción a lenguajes de marcas",
        "JSON",
        "XML",
        "CSS",
        "Posicionamiento + div",
        "HTML",
        "Javascript",
        "DTD",
        "Python",
        "Cloud",
        "ERPS"
    ],
    DIW: [
        "Guia de estilos",
        "HTML-CSS",
        "Recursos para la web",
        "Javascript",
        "Recursos multimedia",
        "Accesibilidad",
        "Usabilidad",
        "Fases de diseño"
    ],
    PED: {
        "Elementos basicos de la programación": [
            "Instrucciones secuenciales",
            "Variables y tipos de datos",
            "Operadores y expresiones",
            "Condicionales",
            "Mas sobre tipos de datos",
            "Bucles condicionales",
            "Recorridos (for)",
            "Strings",
            "Control de bucles"
        ],
        "Programación modular": [
            "Modulos",
            "Funciones",
            "Variables y modulos",
            "Arreglos",
            "Recursividad"
        ],
        "Archivos": [
            "Gestión de archivos",
            "Excepciones y manejo de errores"
        ],
        "Programación orientada a objetos": [
            "Clases y objectos",
            "Constructores",
            "Miembros de una instancias y de una clase",
            "Composición",
            "Heréncia"
        ],
        "Bibliotecas": [
            "Bibliotecas estandar",
            "Gestion de dependencias",
            "APIs externas",
            "Documentacion javadoc",
            "Control de versiones git"
        ],
        "Validación de aplicaciones": [
            "Errores",
            "Pruebas",
            "Clases de pruebas",
            "Pruebas unitarias con JUnit"
        ],
        "Persistencia con base de datos": [
            "POO y el modelo relacional",
            "Sistemas de gestión de bases de datos",
            "JDBC de java",
            "Datos persistentes"
        ],
        "Diagramas clases": [
            "Elementos UML",
            "Relaciones UML",
            "Cardinalidad y visibilidad",
            "Diagramas de objetos",
            "Herramientas de modelado"
        ],
        "Diseño orientado a objetos": [
            "Principios SOLID",
            "Patrones de diseño creacionales",
            "Patrones de diseño estructurales",
            "Patrones de diseño de comportamiento",
            "Refactorizacion"
        ],
        "Diagrama de comportamiento": [
            "Diagramas de secuencia",
            "Diagramas de casos de uso",
            "Diagramas de actividad",
            "Diagramas de estado"
        ]
    }
};

// ================= VARIABLES =================
let preguntas = [];
let preguntaActual = 0;
let puntaje = 0;
let temasDebiles = [];
let examenSeleccionado = null;
const letras = ["A", "B", "C", "D"];

// ================= ELEMENTOS =================
const introduccion = document.getElementById("introduccion");
const seccionPreguntas = document.getElementById("preguntas");
const resumen = document.getElementById("resumen");
const barraProgreso = document.getElementById("progreso");
const contenedorProgreso = document.getElementById("barra-progreso");
const puntajeDiv = document.getElementById("puntaje");
const temasDebilesDiv = document.getElementById("temas-debiles");
const panelRetroalimentacion = document.getElementById("panel-retroalimentacion");
const textoRetroalimentacion = document.getElementById("texto-retroalimentacion");
const botonIniciar = document.getElementById("boton-iniciar");
const botonReiniciar = document.getElementById("boton-reiniciar");
const listaExamenes = document.getElementById("lista-examenes");
const botonHamburguesa = document.getElementById("boton-hamburguesa");
const menu = document.querySelector(".menu-plegable");

// Elementos de estadísticas
const totalExamenesElem = document.getElementById("total-examenes");
const totalPreguntasElem = document.getElementById("total-preguntas");
const progresoRapidoElem = document.getElementById("progreso-rapido");

const insignias = [
    { puntaje: 5, titulo: "Maestro DAW", icono: "🏆" },
    { puntaje: 3, titulo: "Avanzado DAW", icono: "🥈" },
    { puntaje: 1, titulo: "Principiante DAW", icono: "🥉" },
];

// ================= UTILIDADES =================
function normalizarTexto(texto) {
    return texto.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/ /g, "_") // Reemplazar espacios con guiones bajos
        .replace(/\+/g, "_") // Reemplazar + con _
        .replace(/,/g, "") // Eliminar comas
        .replace(/\./g, ""); // Eliminar puntos
}

// ================= ESTADÍSTICAS Y PERSISTENCIA =================
function obtenerProgreso() {
    return JSON.parse(localStorage.getItem("testsDawProgress")) || {
        completedTests: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0
    };
}

function guardarProgreso(estadisticas) {
    localStorage.setItem("testsDawProgress", JSON.stringify(estadisticas));
    actualizarEstadisticasUI();
}

function actualizarEstadisticasUI() {
    let totalExamenesCount = 0;
    for (let cat in examenes) {
        if (Array.isArray(examenes[cat])) {
            totalExamenesCount += examenes[cat].length;
        } else {
            for (let sub in examenes[cat]) {
                totalExamenesCount += examenes[cat][sub].length;
            }
        }
    }
    
    const progreso = obtenerProgreso();
    
    if (totalExamenesElem) totalExamenesElem.textContent = totalExamenesCount;
    // Preguntas estimadas (asumiendo promedio de 10 por test si no están cargadas) o solo las respondidas
    if (totalPreguntasElem) totalPreguntasElem.textContent = progreso.totalQuestionsAnswered; 
    
    if (progresoRapidoElem) {
        const porcentaje = totalExamenesCount > 0 ? Math.round((progreso.completedTests / totalExamenesCount) * 100) : 0;
        progresoRapidoElem.textContent = `${porcentaje}%`;
    }
}

// ================= CREAR MENÚ =================
function crearMenu() {
    // Limpiar existente
    while (listaExamenes.firstChild) {
        listaExamenes.removeChild(listaExamenes.firstChild);
    }
    for (let cat in examenes) {
        const liCat = document.createElement("li");
        liCat.textContent = cat;
        const subtemas = examenes[cat];
        const ulSub = document.createElement("ul"); ulSub.className = "submenu";

        if (Array.isArray(subtemas)) {
            subtemas.forEach(sub => {
                const liSub = document.createElement("li");
                liSub.textContent = sub;
                liSub.addEventListener("click", e => {
                    e.stopPropagation(); 
                    cargarExamen(cat, sub);
                });
                ulSub.appendChild(liSub);
            });
        } else {
            for (let sec in subtemas) {
                const liSec = document.createElement("li");
                liSec.textContent = sec;
                const ulSubSub = document.createElement("ul"); ulSubSub.className = "submenu";
                subtemas[sec].forEach(subsub => {
                    const liSubSub = document.createElement("li");
                    liSubSub.textContent = subsub;
                    liSubSub.addEventListener("click", e => {
                        e.stopPropagation(); 
                        cargarExamen(cat, subsub, sec);
                    });
                    ulSubSub.appendChild(liSubSub);
                });
                liSec.appendChild(ulSubSub);
                liSec.classList.add("tiene-sub");
                liSec.addEventListener("click", e => {
                    e.stopPropagation();
                    
                    // Lógica de acordeón para sub-sub-menú
                    const estaAbierto = liSec.classList.contains("abierto");
                    
                    // Cerrar hermanos
                    const hermanos = liSec.parentElement.querySelectorAll(".tiene-sub.abierto");
                    hermanos.forEach(sib => {
                        if (sib !== liSec) {
                            sib.classList.remove("abierto");
                            const sub = sib.querySelector(".submenu");
                            if (sub) sub.classList.remove("abierto");
                        }
                    });

                    liSec.classList.toggle("abierto");
                    ulSubSub.classList.toggle("abierto");
                });
                ulSub.appendChild(liSec);
            }
        }

        liCat.appendChild(ulSub);
        liCat.classList.add(subtemas ? "tiene-sub" : "");
        liCat.addEventListener("click", () => {
            const submenu = liCat.querySelector(".submenu");
            if (submenu) {
                const estaAbierto = submenu.classList.contains("abierto");
                
                // Cerrar otros menús de nivel superior
                const todosAbiertos = listaExamenes.querySelectorAll(".submenu.abierto");
                todosAbiertos.forEach(s => {
                    if (s !== submenu && !submenu.contains(s)) {
                        s.classList.remove("abierto");
                        s.parentElement.classList.remove("abierto"); // Eliminar clase abierto del li padre si es necesario
                    }
                });

                submenu.classList.toggle("abierto");
                liCat.classList.toggle("abierto"); // Opcional: estilizar categoría activa
            }
        });

        listaExamenes.appendChild(liCat);
    }
}

// ================= CARGAR EXAMEN =================
async function cargarExamen(categoria, tema, subcategoria = null) {
    try {
        examenSeleccionado = { categoria, tema, subcategoria };
        
        let ruta = "";
        const catNorm = normalizarTexto(categoria);
        const temaNorm = normalizarTexto(tema);
        
        if (subcategoria) {
            const subCatNorm = normalizarTexto(subcategoria);
            ruta = `json/${catNorm}/${subCatNorm}/${temaNorm}.json`;
        } else {
            ruta = `json/${catNorm}/${temaNorm}.json`;
        }

        console.log("Intentando cargar:", ruta);

        const respuesta = await fetch(ruta);
        if (!respuesta.ok) throw new Error(`No se pudo cargar el JSON: ${ruta}`);
        preguntas = await respuesta.json();

        // Reiniciamos variables
        preguntaActual = 0;
        puntaje = 0;
        temasDebiles = [];

        // Actualizaciones de UI
        document.getElementById("titulo-introduccion").textContent = tema;
        document.querySelector(".intro-izquierda p").textContent = `Test de ${categoria} - ${preguntas.length} preguntas. ¡Buena suerte!`;

        // Mostramos solo el botón de iniciar
        botonIniciar.classList.remove("oculto"); // Asegurar que sea visible si estaba oculto
        botonIniciar.classList.add("activa");
        botonIniciar.style.animation = "aparecer-boton 0.5s ease forwards";
        
        // Ocultar resultados previos si los hay
        resumen.classList.add("oculto");
        seccionPreguntas.classList.add("oculto");
        
        // Cerrar menú en móvil
        if (window.innerWidth <= 900) {
            menu.classList.remove("activo");
            botonHamburguesa.setAttribute("aria-expanded", "false");
        }

    } catch (err) {
        console.error(err);
        mostrarRetroalimentacion("⚠️ No se pudo cargar el test. Verifica que el archivo exista.", "info");
    }
}

// ================= FUNCIONES DEL EXAMEN =================
botonIniciar.addEventListener("click", () => {
    if (!preguntas.length) {
        mostrarRetroalimentacion("⚠️ Primero selecciona un test del menú.", "info");
        return;
    }

    // Ocultamos botón
    botonIniciar.classList.add("oculto");

    // Mostramos sección de preguntas
    seccionPreguntas.classList.remove("oculto");
    seccionPreguntas.classList.add("activa");
    contenedorProgreso.classList.remove("oculto");
    
    // Desplazar a preguntas
    seccionPreguntas.scrollIntoView({ behavior: "smooth" });

    cargarPregunta();
    actualizarProgreso();
});

botonReiniciar.addEventListener("click", () => {
    if (!preguntas.length) return;
    
    preguntaActual = 0;
    puntaje = 0;
    temasDebiles = [];

    resumen.classList.remove("activa");
    resumen.classList.add("oculto");

    seccionPreguntas.classList.remove("oculto");
    seccionPreguntas.classList.add("activa");
    contenedorProgreso.classList.remove("oculto");

    while (seccionPreguntas.firstChild) {
        seccionPreguntas.removeChild(seccionPreguntas.firstChild);
    }
    panelRetroalimentacion.classList.remove("activa");

    cargarPregunta();
    actualizarProgreso();
});

function cargarPregunta() {
    while (seccionPreguntas.firstChild) {
        seccionPreguntas.removeChild(seccionPreguntas.firstChild);
    }
    const p = preguntas[preguntaActual];
    let opcionSeleccionada = false;

    const tarjeta = document.createElement("div");
    tarjeta.id = "contenedor-pregunta";
    
    const h3 = document.createElement("h3");
    h3.textContent = `${preguntaActual + 1}. ${p.pregunta}`;
    tarjeta.appendChild(h3);
    
    seccionPreguntas.appendChild(tarjeta);

    p.opciones.forEach((opcion, idx) => {
        const div = document.createElement("div");
        div.className = "opcion";
        div.textContent = `${letras[idx]}. ${opcion}`;
        div.addEventListener("click", () => {
            if (!opcionSeleccionada) {
                opcionSeleccionada = true;
                seleccionarOpcion(idx, p, div);
            }
        });
        tarjeta.appendChild(div);
    });

    const botonSiguiente = document.createElement("button");
    botonSiguiente.textContent = preguntaActual === preguntas.length - 1 ? "Finalizar" : "Siguiente";
    botonSiguiente.className = "boton";
    botonSiguiente.style.marginTop = "20px";
    botonSiguiente.addEventListener("click", () => {
        if (opcionSeleccionada) siguientePregunta();
        else mostrarRetroalimentacion("⚠️ Por favor selecciona una respuesta antes de continuar.", "info");
    });
    tarjeta.appendChild(botonSiguiente);
}

function seleccionarOpcion(idx, p, div) {
    const opciones = document.querySelectorAll(".opcion");
    opciones.forEach(o => o.style.pointerEvents = "none");

    const esCorrecta = idx === p.respuesta;
    
    if (esCorrecta) {
        div.classList.add("correcta");
        puntaje++;
        confeti(true);
        mostrarRetroalimentacion(p.explicacion || "¡Correcto!", "correcta");
    } else {
        div.classList.add("incorrecta");
        // Resaltar respuesta correcta
        opciones[p.respuesta].classList.add("correcta");
        
        temasDebiles.push(p.pregunta);
        mostrarRetroalimentacion(p.explicacion || "Incorrecto", "incorrecta");
    }
    
    // Actualizar estadísticas
    const estadisticasActuales = obtenerProgreso();
    estadisticasActuales.totalQuestionsAnswered++;
    if (esCorrecta) estadisticasActuales.correctAnswers++;
    guardarProgreso(estadisticasActuales);
}

function siguientePregunta() {
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        cargarPregunta();
        actualizarProgreso();
        panelRetroalimentacion.classList.remove("activa");
    } else {
        mostrarResumen();
    }
}

function actualizarProgreso() {
    const porcentaje = ((preguntaActual) / preguntas.length * 100);
    barraProgreso.style.width = porcentaje + "%";
    document.getElementById("progreso-texto").textContent = Math.round(porcentaje) + "%";
}

function mostrarRetroalimentacion(texto, tipo = "info") {
    panelRetroalimentacion.classList.remove("oculto");
    panelRetroalimentacion.classList.add("activa");
    const icono = tipo === "correcta" ? "✅" : tipo === "incorrecta" ? "❌" : "ℹ️";
    textoRetroalimentacion.textContent = `${icono} ${texto}`;
    
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
        panelRetroalimentacion.classList.remove("activa");
        setTimeout(() => panelRetroalimentacion.classList.add("oculto"), 300);
    }, 4000);
}

function mostrarResumen() {
    seccionPreguntas.classList.add("oculto");
    resumen.classList.remove("oculto");
    resumen.classList.add("activa");
    contenedorProgreso.classList.add("oculto");

    barraProgreso.style.width = "100%";
    puntajeDiv.textContent = `Puntaje: ${puntaje}/${preguntas.length}`;

    let textoInsignia = "¡Sigue practicando!";
    for (let i of insignias) {
        if (puntaje >= i.puntaje) { // Esta lógica podría necesitar ajuste basado en el total de preguntas
            // Lógica simple: si puntaje > 80% -> Oro, > 50% -> Plata, sino Bronce
            const porcentaje = (puntaje / preguntas.length) * 100;
            if (porcentaje >= 90) textoInsignia = "🏆 Maestro DAW";
            else if (porcentaje >= 70) textoInsignia = "🥈 Avanzado DAW";
            else textoInsignia = "🥉 Principiante DAW";
            break;
        }
    }

    // Limpiar contenido anterior
    while (temasDebilesDiv.firstChild) {
        temasDebilesDiv.removeChild(temasDebilesDiv.firstChild);
    }
    
    if (temasDebiles.length > 0) {
        const titulo = document.createElement("strong");
        titulo.textContent = "Temas a repasar:";
        temasDebilesDiv.appendChild(titulo);
        temasDebilesDiv.appendChild(document.createElement("br"));
        
        temasDebiles.forEach(tema => {
            const lineaTema = document.createTextNode(`• ${tema}`);
            temasDebilesDiv.appendChild(lineaTema);
            temasDebilesDiv.appendChild(document.createElement("br"));
        });
        
        temasDebilesDiv.appendChild(document.createElement("br"));
        const insignia = document.createElement("strong");
        insignia.textContent = textoInsignia;
        temasDebilesDiv.appendChild(insignia);
    } else {
        const excelente = document.createElement("strong");
        excelente.textContent = "¡Excelente! Has respondido todo correctamente.";
        temasDebilesDiv.appendChild(excelente);
        temasDebilesDiv.appendChild(document.createElement("br"));
        temasDebilesDiv.appendChild(document.createTextNode(textoInsignia));
    }

    resumen.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => dibujarGrafico(), 200);
    confeti(true);
    
    // Actualizar estadísticas de tests completados
    const estadisticasActuales = obtenerProgreso();
    estadisticasActuales.completedTests++;
    guardarProgreso(estadisticasActuales);
}

function confeti(avanzado = false) {
    const cantidad = avanzado ? 60 : 30;
    for (let i = 0; i < cantidad; i++) {
        const div = document.createElement("div");
        div.className = "pieza-confeti";
        div.style.position = "fixed";
        div.style.left = Math.random() * window.innerWidth + "px";
        div.style.top = "-20px";
        const tamano = 6 + Math.random() * 10;
        div.style.width = tamano + "px";
        div.style.height = tamano + "px";
        div.style.borderRadius = "50%";
        div.style.background = ["#00ff99", "#ffdd00", "#ff4d4d", "#00dfff"][Math.floor(Math.random() * 4)];
        div.style.opacity = 0.9;
        div.style.zIndex = "9999";
        div.style.animation = `confetiCaida ${(1.5 + Math.random() * 2)}s linear forwards`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}

function dibujarGrafico() {
    const canvas = document.getElementById("grafico");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const correctas = puntaje;
    const incorrectas = preguntas.length - puntaje;
    const total = correctas + incorrectas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let inicio = -0.5 * Math.PI;
    const colores = ["#00ff99", "#ff4d4d"];
    const valores = [correctas, incorrectas];
    valores.forEach((v, i) => {
        const porcion = (v / total) * (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, 100, inicio, inicio + porcion);
        ctx.closePath();
        ctx.fillStyle = colores[i];
        ctx.fill();
        inicio += porcion;
    });
}

// ===== MENÚ RESPONSIVE CON ARIA =====
botonHamburguesa.addEventListener("click", () => {
    menu.classList.toggle("activo");
    botonHamburguesa.setAttribute("aria-expanded", menu.classList.contains("activo"));
});

// ===== ACCESIBILIDAD DE TECLADO =====
document.addEventListener("keydown", e => {
    if (seccionPreguntas.classList.contains("activa") && preguntas[preguntaActual]) {
        const tecla = e.key.toUpperCase();
        const idx = ["A", "B", "C", "D"].indexOf(tecla);
        if (idx >= 0) {
            document.querySelectorAll(".opcion")[idx]?.click();
        }
    }
});

// ===== INICIALIZACIÓN =====
crearMenu();
actualizarEstadisticasUI();
