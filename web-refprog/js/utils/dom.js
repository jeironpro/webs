// Utilidades DOM - selectores, eventos, delegacion y clases

export function qs(selector, ctx) {
  return (ctx || document).querySelector(selector);
}

export function on(el, evt, handler, opts) {
  if (typeof el === 'string') el = qs(el);
  if (!el) return;
  el.addEventListener(evt, handler, opts || {});
}

// Delega eventos en un contenedor padre
export function delegate(parent, selector, evt, handler) {
  if (typeof parent === 'string') parent = qs(parent);
  if (!parent) return;
  parent.addEventListener(evt, function (e) {
    var target = e.target.closest(selector);
    if (target && parent.contains(target)) handler(e, target);
  });
}

export function toggleClass(el, className) {
  if (typeof el === 'string') el = qs(el);
  if (!el) return;
  el.classList.toggle(className);
}
