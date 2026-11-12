const $ = (id) => document.getElementById(id);

const CIRCUNFERENCIA = 2 * Math.PI * 120;
const MINUTOS_FOCO = 25;
const MINUTOS_DESCANSO = 5;

const elementos = {
    estrellas: $("estrellas"),
    infoAbrir: $("info-abrir"),
    info: $("info"),
    infoCerrar: $("info-cerrar"),
    selectorModo: $("selector-modo"),
    modoFocus: $("modo-focus"),
    modoBreak: $("modo-break"),
    selectorDuracion: $("selector-duracion"),
    minutos: $("minutos"),
    menosMinutos: $("menos-minutos"),
    masMinutos: $("mas-minutos"),
    presets: $("presets"),
    botonesPreset: [...document.querySelectorAll(".preset")],
    progreso: $("progreso"),
    tiempo: $("tiempo"),
    tiempoLabel: $("tiempo-label"),
    titulo: $("titulo"),
    tituloActivo: $("titulo-activo"),
    tituloTexto: $("titulo-texto"),
    tituloEdicion: $("titulo-edicion"),
    editarTitulo: $("editar-titulo"),
    principal: $("principal"),
    iconoPlay: $("icono-play"),
    iconoPause: $("icono-pause"),
    reiniciar: $("reiniciar"),
    contador: $("contador"),
    puntosContador: [...document.querySelectorAll(".contador-punto")],
    contadorCompleto: $("contador-completo"),
    dialogo: $("dialogo"),
    dialogoIcono: $("dialogo-icono"),
    dialogoTitulo: $("dialogo-titulo"),
    dialogoTexto: $("dialogo-texto"),
    dialogoPrincipal: $("dialogo-principal"),
    dialogoSecundario: $("dialogo-secundario"),
};

const estado = {
    modo: "focus",
    minutosFoco: MINUTOS_FOCO,
    minutosDescanso: MINUTOS_DESCANSO,
    pomodoros: 0,
    titulo: "",
    haEmpezado: false,
    dialogo: false,
    editando: false,
    restante: MINUTOS_FOCO * 60,
    duracion: MINUTOS_FOCO * 60,
    corriendo: false,
    pausado: false,
    terminado: false,
    intervalo: null,
};

let audioContext = null;

function acento() {
    return estado.modo === "focus" ? "#00d4ff" : "#f59e0b";
}

function minutosActuales() {
    return estado.modo === "focus" ? estado.minutosFoco : estado.minutosDescanso;
}

function formatear(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;
    return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function mostrar(elemento, visible) {
    elemento.classList.toggle("hidden", !visible);
}

function pararIntervalo() {
    if (estado.intervalo !== null) {
        window.clearInterval(estado.intervalo);
        estado.intervalo = null;
    }
}

function iniciarIntervalo() {
    pararIntervalo();
    estado.intervalo = window.setInterval(tick, 1000);
}

function tick() {
    if (estado.restante <= 1) {
        estado.restante = 0;
        estado.corriendo = false;
        estado.pausado = false;
        estado.terminado = true;
        pararIntervalo();
        finalizar();
        return;
    }
    estado.restante -= 1;
    pintarTemporizador();
}

function finalizar() {
    reanudarAudio();
    reproducirFin();
    if (estado.modo === "focus") {
        estado.pomodoros = Math.min(estado.pomodoros + 1, 4);
    }
    estado.titulo = "";
    estado.dialogo = true;
    estado.editando = false;
    pintar();
    elementos.dialogoPrincipal.focus({ preventScroll: true });
}

function iniciar() {
    if (estado.corriendo) return;
    if (estado.terminado) {
        estado.restante = estado.duracion;
        estado.terminado = false;
    }
    reanudarAudio();
    estado.haEmpezado = true;
    estado.corriendo = true;
    estado.pausado = false;
    iniciarIntervalo();
    pintar();
}

function pausar() {
    pararIntervalo();
    estado.corriendo = false;
    estado.pausado = true;
    pintar();
}

function detener() {
    pararIntervalo();
    estado.corriendo = false;
    estado.pausado = false;
    estado.terminado = false;
    estado.restante = estado.duracion;
    estado.haEmpezado = false;
    estado.dialogo = false;
    estado.editando = false;
    estado.titulo = "";
    pintar();
}

function cambiarModo(modo) {
    if (estado.corriendo || estado.pausado) return;
    pararIntervalo();
    estado.modo = modo;
    estado.haEmpezado = false;
    estado.dialogo = false;
    estado.editando = false;
    estado.titulo = "";
    estado.duracion = (modo === "focus" ? MINUTOS_FOCO : MINUTOS_DESCANSO) * 60;
    estado.restante = estado.duracion;
    estado.corriendo = false;
    estado.pausado = false;
    estado.terminado = false;
    pintar();
}

function fijarMinutos(valor) {
    if (estado.corriendo || estado.pausado) return;
    const minutos = Math.max(1, Math.min(99, Number(valor) || 1));
    if (estado.modo === "focus") estado.minutosFoco = minutos;
    else estado.minutosDescanso = minutos;
    pararIntervalo();
    estado.haEmpezado = false;
    estado.dialogo = false;
    estado.editando = false;
    estado.duracion = minutos * 60;
    estado.restante = estado.duracion;
    estado.corriendo = false;
    estado.pausado = false;
    estado.terminado = false;
    pintar();
}

function ajustarMinutos(delta) {
    fijarMinutos(minutosActuales() + delta);
}

function pintarModo() {
    const focus = estado.modo === "focus";
    const activo = focus ? elementos.modoFocus : elementos.modoBreak;
    const inactivo = focus ? elementos.modoBreak : elementos.modoFocus;

    elementos.modoFocus.style.backgroundColor = focus ? "#00d4ff" : "transparent";
    elementos.modoFocus.style.color = focus ? "#0c1222" : "#64748b";
    elementos.modoFocus.style.boxShadow = focus ? "0 0 12px rgba(0,212,255,0.3)" : "none";
    elementos.modoBreak.style.backgroundColor = focus ? "transparent" : "#f59e0b";
    elementos.modoBreak.style.color = focus ? "#64748b" : "#0c1222";
    elementos.modoBreak.style.boxShadow = focus ? "none" : "0 0 12px rgba(245,158,11,0.3)";
    elementos.modoFocus.setAttribute("aria-pressed", String(focus));
    elementos.modoBreak.setAttribute("aria-pressed", String(!focus));
    elementos.modoFocus.disabled = estado.corriendo || estado.pausado;
    elementos.modoBreak.disabled = estado.corriendo || estado.pausado;
    activo.setAttribute("aria-pressed", "true");
    inactivo.setAttribute("aria-pressed", "false");
}

function pintarDuracion() {
    const minutos = minutosActuales();
    elementos.minutos.value = String(minutos);
    elementos.minutos.style.textShadow = `0 0 20px ${acento()}33`;
    elementos.selectorDuracion.classList.toggle("hidden", estado.haEmpezado);
    elementos.botonesPreset.forEach((boton) => {
        const activo = Number(boton.dataset.minutos) === minutos;
        boton.style.backgroundColor = activo ? acento() : "transparent";
        boton.style.color = activo ? "#0c1222" : "#94a3b8";
        boton.setAttribute("aria-pressed", String(activo));
    });
}

function pintarTemporizador() {
    const progreso = estado.duracion > 0 ? estado.restante / estado.duracion : 0;
    const color = acento();
    elementos.progreso.setAttribute(
        "stroke-dasharray",
        `${CIRCUNFERENCIA * progreso} ${CIRCUNFERENCIA}`
    );
    elementos.progreso.setAttribute("stroke", color);
    elementos.progreso.setAttribute("filter", estado.terminado ? "none" : "url(#ringGlow)");
    elementos.tiempo.textContent = formatear(estado.restante);
    elementos.tiempo.style.textShadow = `0 0 30px ${color}33, 0 0 60px ${color}11`;
    elementos.tiempoLabel.style.color = color;
    mostrar(elementos.tiempoLabel, estado.terminado);
}

function pintarTitulo() {
    const activo = estado.haEmpezado && !estado.terminado && !estado.editando;
    const editando = estado.haEmpezado && !estado.terminado && estado.editando;
    mostrar(elementos.titulo, !activo && !editando);
    mostrar(elementos.tituloActivo, activo);
    mostrar(elementos.tituloEdicion, editando);
    elementos.tituloTexto.textContent = estado.titulo || "Sin título";

    if (!activo && !editando) {
        elementos.titulo.value = estado.titulo;
    }
}

function pintarControles() {
    mostrar(elementos.reiniciar, estado.haEmpezado);
    mostrar(elementos.iconoPlay, !estado.corriendo);
    mostrar(elementos.iconoPause, estado.corriendo);
    elementos.principal.style.backgroundColor = estado.corriendo ? "#1e293b" : "#00d4ff";
    elementos.principal.style.boxShadow = estado.corriendo
        ? "0 0 0 2px rgba(148,163,184,0.2)"
        : "0 0 20px rgba(0,212,255,0.3)";
    elementos.principal.setAttribute(
        "aria-label",
        estado.corriendo ? "Pausar" : estado.pausado ? "Reanudar" : "Iniciar"
    );
}

function pintarContador() {
    const visible = estado.haEmpezado && !estado.terminado;
    mostrar(elementos.contador, visible);
    elementos.puntosContador.forEach((punto, indice) => {
        const activo = indice < estado.pomodoros;
        punto.style.backgroundColor = activo ? "#00d4ff" : "rgba(148,163,184,0.12)";
        punto.style.boxShadow = activo ? "0 0 8px rgba(0,212,255,0.4)" : "none";
    });
    mostrar(elementos.contadorCompleto, estado.pomodoros >= 4);
}

function pintarDialogo() {
    mostrar(elementos.dialogo, estado.dialogo);
    const focus = estado.modo === "focus";
    const color = focus ? "#f59e0b" : "#00d4ff";
    elementos.dialogoIcono.style.backgroundColor = focus ? "#00d4ff" : "#f59e0b";
    elementos.dialogoIcono.style.boxShadow = focus
        ? "0 0 20px rgba(0,212,255,0.3)"
        : "0 0 20px rgba(245,158,11,0.3)";
    elementos.dialogoTitulo.textContent = focus ? "¡Pomodoro completado!" : "Descanso terminado";
    elementos.dialogoTexto.textContent = focus
        ? "¿Quieres tomar un descanso de 5 minutos?"
        : "¿Listo para volver al trabajo?";
    elementos.dialogoPrincipal.textContent = focus ? "Sí, descansar" : "Sí, trabajar";
    elementos.dialogoPrincipal.style.backgroundColor = color;
    elementos.dialogoPrincipal.style.boxShadow = focus
        ? "0 0 16px rgba(245,158,11,0.3)"
        : "0 0 16px rgba(0,212,255,0.3)";
    elementos.dialogoSecundario.textContent = focus ? "No, seguir" : "No, descansar más";
}

function pintar() {
    pintarModo();
    pintarDuracion();
    pintarTemporizador();
    pintarTitulo();
    pintarControles();
    pintarContador();
    pintarDialogo();
}

function guardarTitulo() {
    estado.titulo = elementos.tituloEdicion.value.trim();
    estado.editando = false;
    pintarTitulo();
}

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function reanudarAudio() {
    const contexto = getAudioContext();
    if (contexto.state === "suspended") contexto.resume();
}

function reproducirFin() {
    const contexto = getAudioContext();
    const ahora = contexto.currentTime;
    [523.25, 659.25, 783.99].forEach((frecuencia, indice) => {
        const oscilador = contexto.createOscillator();
        const ganancia = contexto.createGain();
        oscilador.type = "sine";
        oscilador.frequency.value = frecuencia;
        ganancia.gain.setValueAtTime(0.3, ahora + indice * 0.15);
        ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + indice * 0.15 + 0.4);
        oscilador.connect(ganancia);
        ganancia.connect(contexto.destination);
        oscilador.start(ahora + indice * 0.15);
        oscilador.stop(ahora + indice * 0.15 + 0.4);
    });
}

function crearEstrellas() {
    const contenedor = elementos.estrellas;
    const estrella =
        "polygon(50% 0%, 40% 40%, 0% 50%, 40% 60%, 50% 100%, 60% 60%, 100% 50%, 60% 40%)";
    const aleatorio = (min, max) => Math.random() * (max - min) + min;

    for (let i = 0; i < 80; i += 1) {
        const tamano = aleatorio(1.5, 3.5);
        const tamanoSvg = tamano * 4;
        const color = i % 7 === 0 ? "#f59e0b" : "#ffffff";
        const opacidad = aleatorio(0.2, 0.9);
        const brillo = document.createElement("div");
        brillo.style.cssText = `
            position:absolute;left:${aleatorio(0, 100)}%;top:${aleatorio(0, 100)}%;
            width:${tamanoSvg}px;height:${tamanoSvg}px;margin-left:-${tamanoSvg / 2}px;margin-top:-${tamanoSvg / 2}px;
            border-radius:50%;background:radial-gradient(circle,${color} ${tamano * 0.8}px,transparent ${tamano * 2.5}px);
            opacity:${opacidad * 0.4};animation:twinkle ${aleatorio(3, 7)}s ease-in-out infinite;
            animation-delay:${aleatorio(0, 8)}s;`;
        contenedor.appendChild(brillo);

        const punto = document.createElement("div");
        punto.style.cssText = `
            position:absolute;left:${aleatorio(0, 100)}%;top:${aleatorio(0, 100)}%;
            width:${tamanoSvg}px;height:${tamanoSvg}px;margin-left:-${tamanoSvg / 2}px;margin-top:-${tamanoSvg / 2}px;
            background:${color};clip-path:${estrella};opacity:${opacidad};
            animation:twinkle ${aleatorio(3, 7)}s ease-in-out infinite;animation-delay:${aleatorio(0, 8)}s;`;
        contenedor.appendChild(punto);
    }

    for (let i = 0; i < 3; i += 1) {
        const meteoro = document.createElement("div");
        const brillo = document.createElement("div");
        brillo.style.cssText =
            "position:absolute;top:-5px;left:-5px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.5) 0%,transparent 100%)";
        const cabeza = document.createElement("div");
        cabeza.style.cssText = `position:absolute;top:-6px;left:-6px;width:14px;height:14px;background:#ffffff;clip-path:${estrella};box-shadow:0 0 6px #00d4ff;`;
        meteoro.append(brillo, cabeza);
        meteoro.style.cssText = `position:absolute;left:${aleatorio(65, 100)}%;top:${aleatorio(5, 35)}%;width:2px;height:2px;animation:shooting-cycle 30s ease-out infinite;animation-delay:${i * 10}s;`;
        contenedor.appendChild(meteoro);
    }
}

elementos.modoFocus.addEventListener("click", () => cambiarModo("focus"));
elementos.modoBreak.addEventListener("click", () => cambiarModo("break"));
elementos.menosMinutos.addEventListener("click", () => ajustarMinutos(-1));
elementos.masMinutos.addEventListener("click", () => ajustarMinutos(1));
elementos.principal.addEventListener("click", () => {
    if (estado.corriendo) pausar();
    else iniciar();
});
elementos.reiniciar.addEventListener("click", detener);
elementos.minutos.addEventListener("focus", () => mostrar(elementos.presets, true));
elementos.minutos.addEventListener("input", (evento) => {
    const valor = evento.target.value === "" ? 1 : Number(evento.target.value);
    fijarMinutos(valor);
});
elementos.botonesPreset.forEach((boton) => {
    boton.addEventListener("click", () => {
        fijarMinutos(Number(boton.dataset.minutos));
        mostrar(elementos.presets, false);
    });
});
document.addEventListener("pointerdown", (evento) => {
    if (!elementos.selectorDuracion.contains(evento.target)) {
        mostrar(elementos.presets, false);
    }
});

elementos.titulo.addEventListener("input", (evento) => {
    estado.titulo = evento.target.value;
});
elementos.titulo.addEventListener("focus", (evento) => {
    evento.target.style.borderColor = "#00d4ff";
});
elementos.titulo.addEventListener("blur", (evento) => {
    evento.target.style.borderColor = "rgba(148, 163, 184, 0.2)";
});
elementos.editarTitulo.addEventListener("click", () => {
    estado.editando = true;
    elementos.tituloEdicion.value = estado.titulo;
    pintarTitulo();
    elementos.tituloEdicion.focus();
    elementos.tituloEdicion.select();
});
elementos.tituloEdicion.addEventListener("blur", guardarTitulo);
elementos.tituloEdicion.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        guardarTitulo();
    }
    if (evento.key === "Escape") {
        estado.editando = false;
        pintarTitulo();
    }
});

elementos.infoAbrir.addEventListener("click", () => mostrar(elementos.info, true));
elementos.infoCerrar.addEventListener("click", () => mostrar(elementos.info, false));
elementos.info.addEventListener("click", (evento) => {
    if (evento.target === elementos.info) mostrar(elementos.info, false);
});

elementos.dialogoPrincipal.addEventListener("click", () => {
    cambiarModo(estado.modo === "focus" ? "break" : "focus");
});
elementos.dialogoSecundario.addEventListener("click", () => {
    cambiarModo(estado.modo);
});

crearEstrellas();
pintar();
