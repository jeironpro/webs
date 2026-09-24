/* Modulo: Sidebar - configuracion de la ruleta (numeros y nombres) */
import { $, $$ } from '../utils/dom.js';

export class SidebarManager {
	constructor(onApply) {
		this.onApply = onApply;
		this.names = [];

		this._cacheElements();
		this._bindEvents();
		this._applyNumbers();
	}

	_cacheElements() {
		this.sidebar = $('#sidebar');
		this.backdrop = $('#sidebarBackdrop');
		this.toggleBtn = $('#sidebarToggle');
		this.closeBtn = $('#sidebarClose');

		this.tabNumbers = $('#tabNumbers');
		this.tabNames = $('#tabNames');
		this.numbersTab = $('#numbersTab');
		this.namesTab = $('#namesTab');

		this.rangeFrom = $('#rangeFrom');
		this.rangeTo = $('#rangeTo');
		this.includeZero = $('#includeZero');
		this.applyNumbersBtn = $('#applyNumbers');

		this.nameInput = $('#nameInput');
		this.addNameBtn = $('#addNameBtn');
		this.nameList = $('#nameList');
		this.applyNamesBtn = $('#applyNames');
	}

	_bindEvents() {
		this.toggleBtn.addEventListener('click', () => this.open());
		this.closeBtn.addEventListener('click', () => this.close());
		this.backdrop.addEventListener('click', () => this.close());

		this.tabNumbers.addEventListener('click', () => this._switchTab('numbers'));
		this.tabNames.addEventListener('click', () => this._switchTab('names'));

		this.applyNumbersBtn.addEventListener('click', () => this._applyNumbers());

		this.addNameBtn.addEventListener('click', () => this._addName());
		this.nameInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				this._addName();
			}
		});
		this.applyNamesBtn.addEventListener('click', () => this._applyNames());
	}

	open() {
		this.sidebar.classList.add('open');
		this.backdrop.classList.add('open');
	}

	close() {
		this.sidebar.classList.remove('open');
		this.backdrop.classList.remove('open');
	}

	_switchTab(tab) {
		$$('.sidebar-tab').forEach((t) => t.classList.remove('active'));
		$$('.tab-content').forEach((t) => t.classList.remove('active'));

		if (tab === 'numbers') {
			this.tabNumbers.classList.add('active');
			this.numbersTab.classList.add('active');
		} else {
			this.tabNames.classList.add('active');
			this.namesTab.classList.add('active');
		}
	}

	_applyNumbers() {
		const from = parseInt(this.rangeFrom.value, 10);
		const to = parseInt(this.rangeTo.value, 10);
		const includeZero = this.includeZero.checked;

		if (isNaN(from) || isNaN(to) || from >= to) {
			this.rangeTo.focus();
			return;
		}

		const segments = [];
		if (includeZero) {
			segments.push(0);
		}
		for (let i = from; i <= to; i++) {
			segments.push(i);
		}

		this.onApply(segments);
		this.close();
	}

	_addName() {
		const value = this.nameInput.value.trim();
		if (!value) return;

		if (this.names.includes(value)) {
			this.nameInput.value = '';
			return;
		}

		this.names.push(value);
		this.nameInput.value = '';
		this.nameInput.focus();
		this._renderNames();
	}

	_removeName(index) {
		this.names.splice(index, 1);
		this._renderNames();
	}

	_renderNames() {
		if (this.names.length === 0) {
			this.nameList.innerHTML = '<p class="name-list-empty">No hay nombres agregados</p>';
			return;
		}

		this.nameList.innerHTML = this.names
			.map(
				(name, i) => `
        <div class="name-item">
          <span class="name-item-color" style="background-color: ${this._getColor(i)}"></span>
          <span class="name-item-text">${this._escapeHtml(name)}</span>
          <button class="name-item-remove" data-index="${i}" aria-label="Eliminar ${name}">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      `,
			)
			.join('');

		$$('.name-item-remove').forEach((btn) => {
			btn.addEventListener('click', () => {
				this._removeName(parseInt(btn.dataset.index, 10));
			});
		});
	}

	_applyNames() {
		if (this.names.length === 0) return;

		const segments = [...this.names];
		this.onApply(segments);
		this.close();
	}

	_getColor(index) {
		const colors = [
			'#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
			'#1abc9c', '#e67e22', '#e84393', '#00b894', '#6c5ce7',
			'#fd79a8', '#0984e3', '#00cec9', '#d63031', '#fdcb6e',
			'#a29bfe', '#55a3e8', '#74b9ff', '#ff7675', '#fab1a0',
		];
		return colors[index % colors.length];
	}

	_escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
}
