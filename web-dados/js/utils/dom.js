/*
 * Funciones auxiliares para manipulacion segura del DOM
 * Todas las operaciones evitan el uso de innerHTML
 */

/**
 * Crea un elemento HTML con clases opcionales
 * @param {string} tag - Etiqueta HTML del elemento
 * @param {string[]} classes - Lista de clases CSS a aplicar
 * @returns {HTMLElement} Elemento creado
 */
export function createElement(tag, classes = []) {
    const element = document.createElement(tag);
    if (classes.length > 0) {
        element.classList.add(...classes);
    }
    return element;
}

/**
 * Elimina todos los hijos de un elemento del DOM
 * @param {HTMLElement} element - Elemento a limpiar
 */
export function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Crea un elemento de texto
 * @param {string} text - Contenido textual
 * @returns {Text} Nodo de texto
 */
export function createText(text) {
    return document.createTextNode(text);
}
