/* Modulo: Sidebar - configuracion de la ruleta (numeros y nombres) */
import { $, $$ } from "../utils/dom.js";

export class SidebarManager {
    constructor(onApply) {
        this.onApply = onApply;
        this.names = [];

        this._cacheElements();
        this._bindEvents();
        this._applyNumbers();
    }

    _cacheElements() {
        this.sidebar = $("#sidebar");
        this.backdrop = $("#sidebarBackdrop");
        this.toggleBtn = $("#sidebarToggle");
        this.closeBtn = $("#sidebarClose");

        this.tabNumbers = $("#tabNumbers");
        this.tabNames = $("#tabNames");
        this.numbersTab = $("#numbersTab");
        this.namesTab = $("#namesTab");

        this.rangeFrom = $("#rangeFrom");
        this.rangeTo = $("#rangeTo");
        this.includeZero = $("#includeZero");
        this.applyNumbersBtn = $("#applyNumbers");

        this.nameInput = $("#nameInput");
        this.addNameBtn = $("#addNameBtn");
        this.nameList = $("#nameList");
        this.applyNamesBtn = $("#applyNames");
    }

    _bindEvents() {
        this.toggleBtn.addEventListener("click", () => this.open());
        this.closeBtn.addEventListener("click", () => this.close());
        this.backdrop.addEventListener("click", () => this.close());

        this.tabNumbers.addEventListener("click", () => this._switchTab("numbers"));
        this.tabNames.addEventListener("click", () => this._switchTab("names"));

        this.applyNumbersBtn.addEventListener("click", () => this._applyNumbers());

        this.addNameBtn.addEventListener("click", () => this._addName());
        this.nameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this._addName();
            }
        });
        this.applyNamesBtn.addEventListener("click", () => this._applyNames());
    }

    open() {
        this.sidebar.classList.add("open");
        this.backdrop.classList.add("open");
    }

    close() {
        this.sidebar.classList.remove("open");
        this.backdrop.classList.remove("open");
    }

    _switchTab(tab) {
        $$(".sidebar-tab").forEach((t) => t.classList.remove("active"));
        $$(".tab-content").forEach((t) => t.classList.remove("active"));

        if (tab === "numbers") {
            this.tabNumbers.classList.add("active");
            this.numbersTab.classList.add("active");
        } else {
            this.tabNames.classList.add("active");
            this.namesTab.classList.add("active");
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
            this.nameInput.value = "";
            return;
        }

        this.names.push(value);
        this.nameInput.value = "";
        this.nameInput.focus();
        this._renderNames();
    }

    _removeName(index) {
        this.names.splice(index, 1);
        this._renderNames();
    }

    _renderNames() {
        /* Se reconstruye la lista con nodos: nada de HTML inyectado. */
        this.nameList.replaceChildren();

        if (this.names.length === 0) {
            const vacio = document.createElement("p");
            vacio.className = "name-list-empty";
            vacio.textContent = "No hay nombres agregados";
            this.nameList.appendChild(vacio);
            return;
        }

        const fragmento = document.createDocumentFragment();

        this.names.forEach((name, i) => {
            const item = document.createElement("div");
            item.className = "name-item";

            const color = document.createElement("span");
            color.className = "name-item-color";
            color.style.backgroundColor = this._getColor(i);

            const texto = document.createElement("span");
            texto.className = "name-item-text";
            texto.textContent = name;

            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "name-item-remove";
            boton.setAttribute("aria-label", `Eliminar ${name}`);
            boton.addEventListener("click", () => this._removeName(i));

            const icono = document.createElement("span");
            icono.className = "material-symbols-outlined";
            icono.textContent = "close";
            boton.appendChild(icono);

            item.append(color, texto, boton);
            fragmento.appendChild(item);
        });

        this.nameList.appendChild(fragmento);
    }

    _applyNames() {
        if (this.names.length === 0) return;

        const segments = [...this.names];
        this.onApply(segments);
        this.close();
    }

    _getColor(index) {
        const colors = [
            "#e74c3c",
            "#3498db",
            "#2ecc71",
            "#f39c12",
            "#9b59b6",
            "#1abc9c",
            "#e67e22",
            "#e84393",
            "#00b894",
            "#6c5ce7",
            "#fd79a8",
            "#0984e3",
            "#00cec9",
            "#d63031",
            "#fdcb6e",
            "#a29bfe",
            "#55a3e8",
            "#74b9ff",
            "#ff7675",
            "#fab1a0",
        ];
        return colors[index % colors.length];
    }
}
