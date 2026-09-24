/**
 * Punto de entrada de la aplicacion Color Picker
 * Inicializa el modulo principal cuando el DOM esta listo
 */
import { initColorPicker } from './modules/colorPicker.js';

document.addEventListener('DOMContentLoaded', () => {
	initColorPicker();
});
