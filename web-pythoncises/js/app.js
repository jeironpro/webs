/* Hum · Pythoncises — N10 floating-on-scroll morph · counter tick-up · stage reveal ·
 * star-burst · búsqueda + filtros por categoría · copiar / descargar. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── N10 · morph the bar into a floating pill past a threshold ── */
  var nav = document.getElementById("nav");
  if (nav) {
    var ticking = false;
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
  var counters = Array.prototype.slice.call(document.querySelectorAll(".count"));
  function runCount(el) {
    var to = parseInt(el.dataset.to || "0", 10) || 0;
    function fmt(n) { return n.toLocaleString("es-ES"); }
    if (reduce) { el.textContent = fmt(to); return; }
    var dur = 1200, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
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
  var stages = Array.prototype.slice.call(document.querySelectorAll(".stage"));

  if ("IntersectionObserver" in window) {
    if (counters.length) {
      var ioCount = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); ioCount.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { ioCount.observe(c); });
    }
    if (stages.length) {
      var ioStage = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); ioStage.unobserve(e.target); } });
      }, { threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
      stages.forEach(function (s) { ioStage.observe(s); });
    }
  } else {
    counters.forEach(runCount);
    stages.forEach(function (s) { s.classList.add("is-in"); });
  }

  /* ── Star-burst micro-celebration + character reaction ── */
  var snake = document.getElementById("snake");
  function burst(x, y) {
    if (reduce) return;
    var s = document.createElement("span");
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
  var input = document.getElementById("buscar");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filtro"));
  var categorias = Array.prototype.slice.call(document.querySelectorAll(".categoria"));
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll(".tarjeta"));
  var vacio = document.getElementById("sin-resultados");
  var activa = "todos";

  function normaliza(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function aplica() {
    var termino = normaliza(input ? input.value.trim() : "");
    var visibles = 0;
    tarjetas.forEach(function (tarjeta) {
      var coincide = (activa === "todos" || tarjeta.dataset.cat === activa) &&
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
  var codigo = document.querySelector(".detalle pre code");

  document.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button[data-accion]");
    if (!boton || !codigo) return;
    burst(evento.pageX, evento.pageY);
    var texto = codigo.textContent.replace(/\s+$/, "");
    var accion = boton.dataset.accion;
    if (accion === "copiar") {
      copiar(boton, texto);
    } else if (accion === "descargar") {
      descargar(boton.dataset.nombre, texto);
    }
  });

  function copiar(boton, texto) {
    var hecho = function () {
      boton.textContent = "Copiado ✓";
      boton.dataset.copiado = "true";
      setTimeout(function () {
        boton.textContent = "Copiar";
        delete boton.dataset.copiado;
      }, 2500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(hecho, function () {
        copiarPorSeleccion(texto, hecho);
      });
    } else {
      copiarPorSeleccion(texto, hecho);
    }
  }

  function copiarPorSeleccion(texto, hecho) {
    var area = document.createElement("textarea");
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
    var blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  }
})();
