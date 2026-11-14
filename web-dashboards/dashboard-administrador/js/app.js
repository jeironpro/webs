const app = document.documentElement.dataset.app;
const page = document.body.dataset.page;
const tableStates = new WeakMap();
let activeFilterMenu = null;
let toastTimer = 0;

function findTable(element) {
    const main = element.closest("main");
    if (main) {
        const table = main.querySelector("table");
        if (table) return table;
    }
    const section = element.closest("section");
    return section ? section.querySelector("table") : null;
}

function getTableState(table) {
    let state = tableStates.get(table);
    if (!state) {
        state = { query: "", filters: {} };
        tableStates.set(table, state);
    }
    return state;
}

function applyTableState(table) {
    const state = getTableState(table);
    const headers = [...table.querySelectorAll("thead th")].map((cell) => cell.textContent.trim().toLowerCase());
    const rows = [...table.querySelectorAll("tbody tr")];
    const matched = rows.filter((row) => {
        const text = row.textContent.toLowerCase();
        const matchesQuery = state.query.length === 0 || text.includes(state.query);
        const matchesFilters = Object.entries(state.filters).every(([column, value]) => {
            if (value.length === 0) return true;
            const index = headers.indexOf(column.toLowerCase());
            if (index < 0) return true;
            return row.children[index]?.textContent.trim() === value;
        });
        return matchesQuery && matchesFilters;
    });
    const pageSize = Number(table.dataset.pageSize);
    if (pageSize > 0) {
        const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
        if (!state.page || state.page > totalPages) state.page = 1;
        const start = (state.page - 1) * pageSize;
        const pageRows = new Set(matched.slice(start, start + pageSize));
        rows.forEach((row) => {
            row.hidden = !pageRows.has(row);
        });
        const main = table.closest("main");
        const pager = main ? [...main.querySelectorAll("button")].filter((button) => /^(Anterior|Siguiente)$/.test(button.textContent.trim())) : [];
        const label = main ? [...main.querySelectorAll("span")].find((span) => /^\d+\s*\/\s*\d+$/.test(span.textContent.trim())) : null;
        pager.forEach((button) => {
            button.disabled = button.textContent.trim() === "Anterior" ? state.page <= 1 : state.page >= totalPages;
        });
        if (label) label.textContent = `${state.page} / ${totalPages}`;
        return;
    }
    rows.forEach((row) => {
        row.hidden = !matched.includes(row);
    });
}

function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        document.body.append(toast);
    }
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toast.hidden = true;
    }, 2600);
}

function closeOverlays() {
    document.querySelectorAll("[data-overlay-panel]").forEach((panel) => {
        panel.hidden = true;
    });
    document.querySelectorAll("[data-overlay-trigger]").forEach((trigger) => {
        trigger.setAttribute("aria-expanded", "false");
    });
    closeFilterMenu();
}

function closeFilterMenu() {
    if (!activeFilterMenu) return;
    activeFilterMenu.remove();
    activeFilterMenu = null;
}

function setupOverlays() {
    const panels = [...document.querySelectorAll("[data-overlay-panel]")];
    document.querySelectorAll("[data-overlay-trigger]").forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const name = trigger.dataset.overlayTrigger;
            const panel = panels.find((item) => item.dataset.overlayPanel === name);
            if (!panel) return;
            const shouldOpen = panel.hidden;
            closeOverlays();
            panel.hidden = !shouldOpen;
            trigger.setAttribute("aria-expanded", String(shouldOpen));
            if (shouldOpen) {
                const field = panel.querySelector("input");
                if (field) window.setTimeout(() => field.focus(), 20);
            }
        });
    });
    panels.forEach((panel) => {
        panel.querySelectorAll("[data-href]").forEach((item) => {
            item.addEventListener("click", () => {
                window.location.href = item.dataset.href;
            });
            item.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    window.location.href = item.dataset.href;
                }
            });
        });
        panel.querySelectorAll("[data-nav]").forEach((item) => {
            item.addEventListener("click", () => {
                window.location.href = item.dataset.nav;
            });
        });
        panel.querySelectorAll("a[href]").forEach((link) => {
            link.addEventListener("click", () => closeOverlays());
        });
        panel.querySelectorAll("button").forEach((button) => {
            const label = button.getAttribute("aria-label") ?? "";
            const text = button.textContent.trim();
            if (/cerrar/i.test(label) || /^(cerrar|cancelar)$/i.test(text)) {
                button.addEventListener("click", () => closeOverlays());
            }
        });
        panel.querySelectorAll("form").forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                const name = panel.dataset.overlayPanel;
                showToast(name === "new-ticket" ? "Ticket creado correctamente" : "Usuario creado correctamente");
                closeOverlays();
            });
        });
    });
    document.addEventListener("click", (event) => {
        if (event.target.closest("[data-overlay-panel]")) return;
        if (event.target.closest("[data-overlay-trigger]")) return;
        closeOverlays();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeOverlays();
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            const panel = panels.find((item) => item.dataset.overlayPanel === "palette");
            if (!panel) return;
            event.preventDefault();
            closeOverlays();
            panel.hidden = false;
            panel.querySelector("input")?.focus();
        }
    });
}

function setupPalette() {
    const panel = document.querySelector('[data-overlay-panel="palette"]');
    if (!panel) return;
    const input = panel.querySelector("input");
    const options = [...panel.querySelectorAll('li[role="option"]')];
    if (!input || options.length === 0) return;
    input.addEventListener("input", () => {
        const term = input.value.trim().toLowerCase();
        options.forEach((option) => {
            option.hidden = term.length > 0 && !option.textContent.toLowerCase().includes(term);
        });
        const first = options.find((option) => !option.hidden);
        options.forEach((option) => option.setAttribute("aria-selected", String(option === first)));
    });
    input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        const first = options.find((option) => !option.hidden);
        first?.querySelector("button")?.click();
    });
}

function finishMotion(element) {
    window.setTimeout(() => {
        element.getAnimations().forEach((animation) => animation.finish());
    }, 40);
}

function setupMobileMenu() {
    const triggers = [...document.querySelectorAll('button[aria-label="Abrir menú"], button[aria-label="Abrir menú de navegación"]')];
    if (triggers.length === 0) return;
    const nativeAside = [...document.querySelectorAll("aside")].find((aside) => aside.classList.contains("lg:hidden"));
    const nativeNav = document.querySelector("[data-mobile-nav]");
    const backdrop = document.createElement("div");
    backdrop.className = nativeAside ? "mobile-backdrop mobile-backdrop-admin" : nativeNav ? "mobile-backdrop mobile-backdrop-soporte" : "mobile-backdrop";
    backdrop.hidden = true;
    document.body.append(backdrop);
    let drawer = null;
    let open = null;
    let close = null;
    if (nativeAside) {
        drawer = nativeAside;
        open = () => {
            drawer.classList.remove("-translate-x-full");
            drawer.classList.add("translate-x-0", "admin-drawer-open");
            drawer.removeAttribute("inert");
            drawer.removeAttribute("aria-hidden");
            backdrop.hidden = false;
            finishMotion(drawer);
        };
        close = () => {
            drawer.classList.add("-translate-x-full");
            drawer.classList.remove("translate-x-0", "admin-drawer-open");
            backdrop.hidden = true;
            finishMotion(drawer);
        };
    } else if (nativeNav) {
        drawer = nativeNav;
        open = () => {
            drawer.dataset.open = "true";
            backdrop.hidden = false;
            finishMotion(drawer);
        };
        close = () => {
            drawer.dataset.open = "false";
            backdrop.hidden = true;
            finishMotion(drawer);
        };
    } else {
        const source = document.querySelector("aside");
        if (!source) return;
        const content = source.querySelector("nav")?.parentElement ?? source.firstElementChild;
        if (!content) return;
        drawer = document.createElement("div");
        drawer.className = "mobile-drawer";
        drawer.dataset.open = "false";
        const clone = content.cloneNode(true);
        clone.querySelectorAll("[id]").forEach((item) => item.removeAttribute("id"));
        clone.querySelectorAll("[inert]").forEach((item) => item.removeAttribute("inert"));
        drawer.append(clone);
        document.body.append(drawer);
        open = () => {
            drawer.dataset.open = "true";
            backdrop.hidden = false;
            finishMotion(drawer);
        };
        close = () => {
            drawer.dataset.open = "false";
            backdrop.hidden = true;
            finishMotion(drawer);
        };
    }
    triggers.forEach((trigger) => trigger.addEventListener("click", open));
    backdrop.addEventListener("click", close);
    drawer.querySelectorAll("a[href]").forEach((link) => link.addEventListener("click", close));
    drawer.querySelectorAll('button[aria-label="Cerrar menú"], button[aria-label="Cerrar menú de navegación"], button[aria-label="Colapsar sidebar"]').forEach((button) => {
        button.addEventListener("click", close);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
    });
}

function filterInvoices(label) {
    const table = document.querySelector("main table");
    if (!table) return;
    const headers = [...table.querySelectorAll("thead th")].map((cell) => cell.textContent.trim().toLowerCase());
    const statusIndex = headers.indexOf("estado");
    if (statusIndex < 0) return;
    const wanted = label.startsWith("Pendientes") ? "Pendiente" : label.startsWith("Exitosas") ? "Pagada" : label.startsWith("Fallidas") ? "Fallida" : "";
    [...table.querySelectorAll("tbody tr")].forEach((row) => {
        const status = row.children[statusIndex]?.textContent.trim() ?? "";
        row.hidden = wanted.length > 0 && status !== wanted;
    });
}

function filterLogs(label) {
    const section = [...document.querySelectorAll("section")].find((item) => item.textContent.includes("Errores recientes"));
    if (!section) return;
    const rows = [...section.querySelectorAll("li")].filter((row) => /Crítico|Error|Excepción|Advertencia/.test(row.textContent));
    const wanted = label.startsWith("Críticos") ? "Crítico" : label.startsWith("Errores") ? "Error" : label.startsWith("Excepciones") ? "Excepción" : label.startsWith("Avisos") ? "Advertencia" : "";
    rows.forEach((row) => {
        row.hidden = wanted.length > 0 && !row.textContent.includes(wanted);
    });
}

function showTrend(label) {
    const section = [...document.querySelectorAll("section")].find((item) => item.querySelector("[data-trend-panel]"));
    if (!section) return;
    const key = label.startsWith("Diario") ? "diario" : label.startsWith("Semanal") ? "semanal" : label.startsWith("Mensual") ? "mensual" : "";
    if (!key) return;
    const panels = [...section.querySelectorAll("[data-trend-panel]")];
    const selected = panels.find((panel) => panel.dataset.trendPanel === key);
    panels.forEach((panel) => {
        panel.hidden = panel !== selected;
    });
    const subtitle = section.querySelector("[data-trend-subtitle]");
    if (subtitle && selected) subtitle.textContent = selected.dataset.trendSub;
}

function setupTabs() {
    document.querySelectorAll('[role="tablist"]').forEach((list) => {
        const tabs = [...list.querySelectorAll('[role="tab"]')];
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((item) => {
                    const active = item === tab;
                    item.setAttribute("aria-selected", String(active));
                    item.dataset.state = active ? "active" : "inactive";
                });
                const panels = tabs.map((item) => document.getElementById(item.getAttribute("aria-controls") ?? ""));
                if (panels.some(Boolean)) {
                    const selected = document.getElementById(tab.getAttribute("aria-controls") ?? "");
                    panels.forEach((panel) => {
                        if (!panel) return;
                        panel.hidden = panel !== selected;
                        panel.dataset.state = panel === selected ? "active" : "inactive";
                    });
                    return;
                }
                const label = tab.textContent.trim();
                if (app === "dashboard-financiero") filterInvoices(label);
                if (app === "dashboard-monitoreo") filterLogs(label);
                if (app === "dashboard-operativo-analitico") showTrend(label);
            });
        });
    });
}

function setupSearch() {
    document.querySelectorAll('input[type="search"], input[placeholder*="Buscar"]').forEach((input) => {
        if (input.closest("[data-overlay-panel]")) return;
        const table = findTable(input);
        if (!table) return;
        input.addEventListener("input", () => {
            const state = getTableState(table);
            state.query = input.value.trim().toLowerCase();
            state.page = 1;
            applyTableState(table);
        });
    });
}

function openFilterMenu(trigger, column, table) {
    closeFilterMenu();
    const headers = [...table.querySelectorAll("thead th")].map((cell) => cell.textContent.trim());
    const index = headers.findIndex((header) => header.toLowerCase() === column.toLowerCase());
    if (index < 0) return;
    const values = [...new Set([...table.querySelectorAll("tbody tr")].map((row) => row.children[index]?.textContent.trim()).filter(Boolean))];
    const menu = document.createElement("div");
    menu.className = "filter-menu";
    ["Todos", ...values].forEach((value) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "filter-option";
        option.textContent = value;
        option.addEventListener("click", () => {
            const state = getTableState(table);
            state.filters[column] = value === "Todos" ? "" : value;
            state.page = 1;
            applyTableState(table);
            const label = trigger.querySelector("span");
            if (label) label.textContent = value === "Todos" ? trigger.dataset.defaultLabel : value;
            trigger.setAttribute("aria-expanded", "false");
            closeFilterMenu();
        });
        menu.append(option);
    });
    document.body.append(menu);
    const rect = trigger.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 6}px`;
    menu.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - 236))}px`;
    trigger.setAttribute("aria-expanded", "true");
    activeFilterMenu = menu;
}

function setupFilters() {
    const columns = {
        "Filtrar por rol": "Rol",
        "Filtrar por estado": "Estado",
        "Estado": "Estado",
        "Prioridad": "Prioridad",
        "Categoría": "Categoría",
        "Región": "Región",
        "Canal": "Canal",
    };
    document.querySelectorAll('button[role="combobox"]').forEach((trigger) => {
        const column = columns[trigger.getAttribute("aria-label") ?? ""];
        if (!column) return;
        const table = findTable(trigger);
        if (!table) return;
        const label = trigger.querySelector("span");
        trigger.dataset.defaultLabel = label?.textContent.trim() ?? "Todos";
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (activeFilterMenu) {
                closeFilterMenu();
                trigger.setAttribute("aria-expanded", "false");
                return;
            }
            openFilterMenu(trigger, column, table);
        });
    });
    document.addEventListener("click", (event) => {
        if (event.target.closest(".filter-menu") || event.target.closest('button[role="combobox"]')) return;
        closeFilterMenu();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeFilterMenu();
    });
}

function setupPagination() {
    document.querySelectorAll("table[data-page-size]").forEach((table) => {
        const main = table.closest("main");
        if (!main) return;
        const buttons = [...main.querySelectorAll("button")].filter((button) => /^(Anterior|Siguiente)$/.test(button.textContent.trim()));
        const previous = buttons.find((button) => button.textContent.trim() === "Anterior");
        const next = buttons.find((button) => button.textContent.trim() === "Siguiente");
        previous?.addEventListener("click", () => {
            const state = getTableState(table);
            state.page = Math.max(1, (state.page || 1) - 1);
            applyTableState(table);
        });
        next?.addEventListener("click", () => {
            const state = getTableState(table);
            state.page = (state.page || 1) + 1;
            applyTableState(table);
        });
        applyTableState(table);
    });
}

function setupRefresh() {
    document.querySelectorAll('button[aria-label="Refrescar datos"], button[aria-label="Actualizar datos"]').forEach((button) => {
        button.addEventListener("click", () => {
            const icon = button.querySelector("svg");
            icon?.classList.add("animate-spin");
            window.setTimeout(() => icon?.classList.remove("animate-spin"), 800);
            showToast("Datos actualizados");
        });
    });
}

function downloadTable(table, name) {
    const rows = [...table.querySelectorAll("tr")].map((row) => [...row.children].map((cell) => `"${cell.textContent.trim().replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([`\ufeff${rows.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function setupExports() {
    document.querySelectorAll("button").forEach((button) => {
        const text = button.textContent.trim();
        if (text !== "CSV" && text !== "Excel" && text !== "PDF") return;
        button.addEventListener("click", () => {
            if (text === "PDF") {
                window.print();
                return;
            }
            const table = findTable(button);
            if (table) downloadTable(table, `${app}-${page}`);
        });
    });
}

setupOverlays();
setupPalette();
setupMobileMenu();
setupTabs();
setupSearch();
setupFilters();
setupPagination();
setupRefresh();
setupExports();
