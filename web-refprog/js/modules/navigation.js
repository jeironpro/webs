// Modulo de navegacion - menu movil y enlace activo

import { qs, on, toggleClass } from '../utils/dom.js';

export function initMobileMenu() {
  const toggle = qs('.menu-toggle');
  const nav = qs('.header-nav');
  if (!toggle || !nav) return;

  on(toggle, 'click', function () { toggleClass(nav, 'open'); });

  on(document, 'click', function (e) {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

// Marca el enlace de navegacion activo segun la URL actual
export function initActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.header-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && path.endsWith(href)) link.classList.add('active');
  });
}
