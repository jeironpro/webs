/**
 * Utilidades para formateo y conversion de colores
 */

/**
 * Convierte valores RGB a hexadecimal
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {string} Color en formato #RRGGBB
 */
export function rgbToHex(r, g, b) {
	const toHex = (n) => {
		const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Convierte un color hexadecimal a RGB
 * @param {string} hex - Color en formato #RRGGBB
 * @returns {{r: number, g: number, b: number}|null}
 */
export function hexToRgb(hex) {
	const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	if (!match) return null;

	return {
		r: parseInt(match[1], 16),
		g: parseInt(match[2], 16),
		b: parseInt(match[3], 16),
	};
}

/**
 * Calcula la luminancia relativa de un color (para determinar contraste)
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {number} Valor entre 0 y 1
 */
export function getLuminance(r, g, b) {
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
