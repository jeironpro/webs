/**
 * Funciones auxiliares para la manipulacion del DOM
 */

/**
 * Selecciona un elemento del DOM usando un selector CSS
 * @param {string} selector - Selector CSS
 * @param {HTMLElement} context - Contexto donde buscar (por defecto document)
 * @returns {HTMLElement|null}
 */
export const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Selecciona todos los elementos que coinciden con el selector
 * @param {string} selector - Selector CSS
 * @param {HTMLElement} context - Contexto donde buscar
 * @returns {HTMLElement[]}
 */
export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/**
 * Crea un elemento HTML con atributos y contenido
 * @param {string} tag - Etiqueta del elemento
 * @param {object} attrs - Atributos del elemento
 * @param {string|HTMLElement} content - Contenido del elemento
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, content = '') {
	const element = document.createElement(tag);

	Object.entries(attrs).forEach(([key, value]) => {
		if (key === 'className') {
			element.className = value;
		} else if (key === 'dataset') {
			Object.assign(element.dataset, value);
		} else {
			element.setAttribute(key, value);
		}
	});

	if (content) {
		if (typeof content === 'string') {
			element.textContent = content;
		} else {
			element.appendChild(content);
		}
	}

	return element;
}
