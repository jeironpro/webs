/* Punto de entrada principal */
import { Roulette } from './modules/roulette.js';
import { SidebarManager } from './modules/sidebar.js';
import { $ } from './utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
	const roulette = new Roulette('rouletteCanvas');
	const spinBtn = $('#spinBtn');
	const resultValue = $('#resultValue');

	let currentSegments = [];

	roulette.onComplete = (result) => {
		resultValue.textContent = result;
		spinBtn.disabled = false;
	};

	const sidebar = new SidebarManager((segments) => {
		currentSegments = segments;
		roulette.setSegments(segments);
		resultValue.textContent = '---';
		spinBtn.disabled = false;
	});

	spinBtn.addEventListener('click', () => {
		if (currentSegments.length === 0) {
			sidebar.open();
			return;
		}
		spinBtn.disabled = true;
		resultValue.textContent = '...';
		roulette.spin();
	});
});
