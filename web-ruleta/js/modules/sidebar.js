import { $ } from "../utils/dom.js";

export class SidebarManager {
    constructor(onApply) {
        this.onApply = onApply;
        this.names = [];
        this._cacheElements();
        this._bindEvents();
        this._switchTab("numbers");
        this._applyNumbers(false);
    }

    _cacheElements() {
        this.sidebar = $("#sidebar");
        this.backdrop = $("#sidebar-backdrop");
        this.toggleBtn = $("#sidebar-toggle");
        this.closeBtn = $("#sidebar-close");
        this.main = $(".main");
        this.status = $("#sidebar-status");

        this.tabNumbers = $("#tab-numbers");
        this.tabNames = $("#tab-names");
        this.numbersPanel = $("#numbers-panel");
        this.namesPanel = $("#names-panel");
        this.tabs = [this.tabNumbers, this.tabNames];

        this.rangeFrom = $("#range-from");
        this.rangeTo = $("#range-to");
        this.includeZero = $("#include-zero");
        this.applyNumbersBtn = $("#apply-numbers");

        this.nameInput = $("#name-input");
        this.addNameBtn = $("#add-name");
        this.nameList = $("#name-list");
        this.applyNamesBtn = $("#apply-names");
    }

    _bindEvents() {
        this.toggleBtn.addEventListener("click", () => this.open());
        this.closeBtn.addEventListener("click", () => this.close());
        this.backdrop.addEventListener("click", () => this.close());

        this.tabNumbers.addEventListener("click", () => this._switchTab("numbers"));
        this.tabNames.addEventListener("click", () => this._switchTab("names"));
        this.sidebar.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
            }
            const current = this.tabs.indexOf(document.activeElement);
            if (current < 0) {
                return;
            }
            event.preventDefault();
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const next = (current + direction + this.tabs.length) % this.tabs.length;
            const tab = next === 0 ? "numbers" : "names";
            this._switchTab(tab);
            this.tabs[next].focus();
        });

        this.applyNumbersBtn.addEventListener("click", () => this._applyNumbers());
        this.addNameBtn.addEventListener("click", () => this._addName());
        this.nameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this._addName();
            }
        });
        this.applyNamesBtn.addEventListener("click", () => this._applyNames());

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.sidebar.classList.contains("is-open")) {
                this.close();
            }
        });
    }

    open() {
        this._setStatus("");
        this.sidebar.classList.add("is-open");
        this.backdrop.classList.add("is-open");
        document.body.classList.add("has-sidebar");
        this.sidebar.inert = false;
        this.sidebar.setAttribute("aria-hidden", "false");
        this.toggleBtn.setAttribute("aria-expanded", "true");
        this.toggleBtn.inert = true;
        this.main.inert = true;
        this.closeBtn.focus();
    }

    close() {
        this.sidebar.classList.remove("is-open");
        this.backdrop.classList.remove("is-open");
        document.body.classList.remove("has-sidebar");
        this.sidebar.inert = true;
        this.sidebar.setAttribute("aria-hidden", "true");
        this.toggleBtn.setAttribute("aria-expanded", "false");
        this.main.inert = false;
        this.toggleBtn.inert = false;
        this.toggleBtn.focus();
    }

    _switchTab(tab) {
        const showNumbers = tab === "numbers";
        this.tabNumbers.setAttribute("aria-selected", String(showNumbers));
        this.tabNames.setAttribute("aria-selected", String(!showNumbers));
        this.tabNumbers.tabIndex = showNumbers ? 0 : -1;
        this.tabNames.tabIndex = showNumbers ? -1 : 0;
        this.numbersPanel.hidden = !showNumbers;
        this.namesPanel.hidden = showNumbers;
        this._setStatus("");
    }

    _applyNumbers(closeSidebar = true) {
        const from = Number.parseInt(this.rangeFrom.value, 10);
        const to = Number.parseInt(this.rangeTo.value, 10);

        if (
            !Number.isInteger(from) ||
            !Number.isInteger(to) ||
            from < 0 ||
            to > 1000 ||
            from >= to
        ) {
            this._setStatus("Indica un rango válido: el inicio debe ser menor que el final.");
            this.rangeTo.focus();
            return;
        }

        const segments = [];
        if (this.includeZero.checked && from !== 0) {
            segments.push(0);
        }
        for (let value = from; value <= to; value += 1) {
            segments.push(value);
        }

        this._setStatus("");
        this.onApply(segments);
        if (closeSidebar) {
            this.close();
        }
    }

    _addName() {
        const value = this.nameInput.value.trim();
        if (!value) {
            this._setStatus("Escribe un nombre antes de añadirlo.");
            this.nameInput.focus();
            return;
        }
        if (this.names.includes(value)) {
            this._setStatus("Ese nombre ya está en la lista.");
            this.nameInput.select();
            return;
        }

        this.names.push(value);
        this.nameInput.value = "";
        this._setStatus("");
        this.nameInput.focus();
        this._renderNames();
    }

    _removeName(index) {
        this.names.splice(index, 1);
        this._setStatus("");
        this._renderNames();
    }

    _renderNames() {
        this.nameList.replaceChildren();

        if (this.names.length === 0) {
            const empty = document.createElement("p");
            empty.className = "name-list__empty";
            empty.textContent = "No hay nombres agregados";
            this.nameList.append(empty);
            return;
        }

        const fragment = document.createDocumentFragment();

        this.names.forEach((name, index) => {
            const item = document.createElement("div");
            item.className = "name-item";

            const color = document.createElement("span");
            color.className = `name-item__color name-item__color--${(index % 8) + 1}`;

            const text = document.createElement("span");
            text.className = "name-item__text";
            text.textContent = name;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "name-item__remove";
            button.setAttribute("aria-label", `Eliminar ${name}`);
            button.textContent = "×";
            button.addEventListener("click", () => this._removeName(index));

            item.append(color, text, button);
            fragment.append(item);
        });

        this.nameList.append(fragment);
    }

    _applyNames() {
        if (this.names.length === 0) {
            this._setStatus("Añade al menos un nombre antes de aplicar.");
            this.nameInput.focus();
            return;
        }

        this._setStatus("");
        this.onApply([...this.names]);
        this.close();
    }

    _setStatus(message) {
        this.status.textContent = message;
    }
}
