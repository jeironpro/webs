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