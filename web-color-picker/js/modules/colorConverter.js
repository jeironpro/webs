/**
 * Modulo de conversion entre espacios de color:
 * RGB, HSV, HSL y CMYK
 */

/**
 * Convierte de HSV a RGB
 * @param {number} h - Matiz (0-360)
 * @param {number} s - Saturacion (0-100)
 * @param {number} v - Valor/Brillo (0-100)
 * @returns {{r: number, g: number, b: number}}
 */
export function hsvToRgb(h, s, v) {
	s /= 100;
	v /= 100;

	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;

	let r = 0;
	let g = 0;
	let b = 0;

	const hi = Math.floor(h / 60) % 6;

	switch (hi) {
	case 0: r = c; g = x; break;
	case 1: r = x; g = c; break;
	case 2: g = c; b = x; break;
	case 3: g = x; b = c; break;
	case 4: r = x; b = c; break;
	case 5: r = c; b = x; break;
	default: break;
	}

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
}

/**
 * Convierte de RGB a HSV
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {{h: number, s: number, v: number}}
 */
export function rgbToHsv(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0;
	let s = 0;
	const v = max;

	if (delta !== 0) {
		s = delta / max;

		if (max === r) {
			h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
		} else if (max === g) {
			h = ((b - r) / delta + 2) / 6;
		} else {
			h = ((r - g) / delta + 4) / 6;
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		v: Math.round(v * 100),
	};
}

/**
 * Convierte de RGB a HSL
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {{h: number, s: number, l: number}}
 */
export function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (delta !== 0) {
		s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

		if (max === r) {
			h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
		} else if (max === g) {
			h = ((b - r) / delta + 2) / 6;
		} else {
			h = ((r - g) / delta + 4) / 6;
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

/**
 * Convierte de RGB a CMYK
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {{c: number, m: number, y: number, k: number}}
 */
export function rgbToCmyk(r, g, b) {
	const cr = r / 255;
	const cg = g / 255;
	const cb = b / 255;

	const k = 1 - Math.max(cr, cg, cb);

	if (k === 1) {
		return { c: 0, m: 0, y: 0, k: 100 };
	}

	return {
		c: Math.round(((1 - cr - k) / (1 - k)) * 100),
		m: Math.round(((1 - cg - k) / (1 - k)) * 100),
		y: Math.round(((1 - cb - k) / (1 - k)) * 100),
		k: Math.round(k * 100),
	};
}
