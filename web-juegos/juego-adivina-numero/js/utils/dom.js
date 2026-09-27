/**
 * Utilidades de acceso al DOM.
 * @module utils/dom
 */

/**
 * Selecciona el primer elemento que coincide con el selector.
 * @param {string} selector Selector CSS.
 * @param {ParentNode} [root=document] Nodo raíz de la búsqueda.
 * @returns {Element|null} Elemento encontrado o null.
 */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * Crea un elemento con clase y opcionalmente texto, sin inyectar HTML.
 * @param {string} tag Etiqueta del elemento.
 * @param {string} [className] Clase o lista de clases separadas por espacio.
 * @param {string} [text] Texto inicial del elemento.
 * @returns {HTMLElement} Elemento creado.
 */
export function createElement(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}
