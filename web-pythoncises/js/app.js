/* Hum · Pythoncises — N10 floating-on-scroll morph · counter tick-up · stage reveal ·
 * star-burst · búsqueda + filtros por categoría · copiar / descargar. */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── N10 · morph the bar into a floating pill past a threshold ── */
  const nav = document.getElementById("nav");
  if (nav) {
    let ticking = false;
    function onScroll() {
      nav.classList.toggle("is-floating", window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }

  /* ── Counter tick-up on view-enter ── */
  const counters = Array.prototype.slice.call(document.querySelectorAll(".count"));
  function runCount(el) {
    const to = parseInt(el.dataset.to || "0", 10) || 0;
    function fmt(n) { return n.toLocaleString("es-ES"); }
    if (reduce) { el.textContent = fmt(to); return; }
    const dur = 1200, start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(to * eased));
      if (p < 1) { requestAnimationFrame(tick); }
      else {
        el.textContent = fmt(to);
        if (el.animate) {
          el.animate([{ transform: "scale(1)" }, { transform: "scale(1.07)" }, { transform: "scale(1)" }],
            { duration: 320, easing: "ease-out" });
        }
      }
    }
    requestAnimationFrame(tick);
  }

  /* ── Stage reveal · sweep in as each enters the viewport ── */
  const stages = Array.prototype.slice.call(document.querySelectorAll(".stage"));

  if ("IntersectionObserver" in window) {
    if (counters.length) {
      const ioCount = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); ioCount.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { ioCount.observe(c); });
    }
    if (stages.length) {
      const ioStage = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); ioStage.unobserve(e.target); } });
      }, { threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
      stages.forEach(function (s) { ioStage.observe(s); });
    }
  } else {
    counters.forEach(runCount);
    stages.forEach(function (s) { s.classList.add("is-in"); });
  }

  /* ── Star-burst micro-celebration + character reaction ── */
  const snake = document.getElementById("snake");
  function burst(x, y) {
    if (reduce) return;
    const s = document.createElement("span");
    s.className = "star-burst";
    s.style.position = "absolute";
    s.style.left = (x - 12) + "px";
    s.style.top = (y - 12) + "px";
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 460);
  }
  function react() {
    if (!snake || reduce) return;
    snake.classList.remove("is-react");
    void snake.offsetWidth;
    snake.classList.add("is-react");
  }
  document.querySelectorAll("[data-burst]").forEach(function (el) {
    el.addEventListener("click", function (ev) {
      burst(ev.pageX, ev.pageY);
      react();
    });
  });

  /* ── Índice · búsqueda + filtro por categoría ── */
  const input = document.getElementById("buscar");
  const chips = Array.prototype.slice.call(document.querySelectorAll(".filtro"));
  const categorias = Array.prototype.slice.call(document.querySelectorAll(".categoria"));
  const tarjetas = Array.prototype.slice.call(document.querySelectorAll(".tarjeta"));
  const vacio = document.getElementById("sin-resultados");
  let activa = "todos";

  function normaliza(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function aplica() {
    const termino = normaliza(input ? input.value.trim() : "");
    let visibles = 0;
    tarjetas.forEach(function (tarjeta) {
      const coincide = (activa === "todos" || tarjeta.dataset.cat === activa) &&
        (!termino || normaliza(tarjeta.dataset.busqueda).indexOf(termino) !== -1);
      tarjeta.hidden = !coincide;
      if (coincide) visibles++;
    });
    categorias.forEach(function (categoria) {
      categoria.hidden = categoria.querySelectorAll(".tarjeta:not([hidden])").length === 0;
    });
    if (vacio) vacio.hidden = visibles !== 0;
  }

  if (input) input.addEventListener("input", aplica);

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activa = chip.dataset.cat;
      chips.forEach(function (c) { c.classList.toggle("chip-activo", c === chip); });
      aplica();
    });
  });

  /* ── Detalle · copiar y descargar ── */
  const codigo = document.querySelector(".detalle pre code");

  document.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton || !codigo) return;
    burst(evento.pageX, evento.pageY);
    const texto = codigo.textContent.replace(/\s+$/, "");
    const accion = boton.dataset.accion;
    if (accion === "copiar") {
      copiar(boton, texto);
    } else if (accion === "descargar") {
      descargar(boton.dataset.nombre, texto);
    }
  });

  async function copiar(boton, texto) {
    const hecho = function () {
      boton.textContent = "Copiado ✓";
      boton.dataset.copiado = "true";
      setTimeout(function () {
        boton.textContent = "Copiar";
        delete boton.dataset.copiado;
      }, 2500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(texto);
        hecho();
      } catch (error) {
        copiarPorSeleccion(texto, hecho);
      }
    } else {
      copiarPorSeleccion(texto, hecho);
    }
  }

  function copiarPorSeleccion(texto, hecho) {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      hecho();
    } catch (error) { /* sin acción */ }
    document.body.removeChild(area);
  }

  function descargar(nombre, texto) {
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  }
})();
