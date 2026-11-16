import {
    formatBytes,
    formatDuration,
    formatJsonBody,
    formatResponseBody,
    headersFromRows,
    normalizeUrl,
} from "./modules/http.js";
import { DEFAULT_PRESET_ID, PRESETS, getPreset } from "./modules/presets.js";

const els = {
    method: document.querySelector("#method"),
    url: document.querySelector("#url"),
    send: document.querySelector("#send"),
    body: document.querySelector("#body"),
    bodyHint: document.querySelector("#body-hint"),
    formatBody: document.querySelector("#format-body"),
    addHeader: document.querySelector("#add-header"),
    headerRows: document.querySelector("#header-rows"),
    headerCount: document.querySelector("#header-count"),
    presetList: document.querySelector("#preset-list"),
    presetNote: document.querySelector("#preset-note"),
    requestStatus: document.querySelector("#request-status"),
    responseMeta: document.querySelector("#response-meta"),
    responseStatus: document.querySelector("#response-status"),
    responseTime: document.querySelector("#response-time"),
    responseSize: document.querySelector("#response-size"),
    responseUrl: document.querySelector("#response-url"),
    responseEmpty: document.querySelector("#response-empty"),
    responseLoading: document.querySelector("#response-loading"),
    responseError: document.querySelector("#response-error"),
    errorTitle: document.querySelector("#error-title"),
    errorDetail: document.querySelector("#error-detail"),
    responseBody: document.querySelector("#response-body"),
    responseHeaderRows: document.querySelector("#response-header-rows"),
    responseHeaderCount: document.querySelector("#response-header-count"),
    responseNote: document.querySelector("#response-note"),
    copy: document.querySelector("#copy"),
    requestTabs: [
        document.querySelector("#request-tab-headers"),
        document.querySelector("#request-tab-body"),
    ],
    requestPanels: {
        "request-tab-headers": document.querySelector("#request-panel-headers"),
        "request-tab-body": document.querySelector("#request-panel-body"),
    },
    responseTabs: [
        document.querySelector("#response-tab-body"),
        document.querySelector("#response-tab-headers"),
    ],
    responsePanels: {
        "response-tab-body": document.querySelector("#response-panel-body"),
        "response-tab-headers": document.querySelector("#response-panel-headers"),
    },
};

const state = {
    method: "GET",
    url: "",
    headers: [{ key: "", value: "" }],
    body: "",
    response: null,
    error: null,
    loading: false,
    controller: null,
    activePreset: null,
};

function setRequestStatus(message, tone = "neutral") {
    els.requestStatus.textContent = message;
    els.requestStatus.dataset.tone = tone;
}

function updateSendButton() {
    els.send.disabled = state.loading;
    els.send.textContent = state.loading ? "Enviando…" : "Enviar";
    els.send.setAttribute("aria-busy", String(state.loading));
}

function updateHeaderCount() {
    els.headerCount.textContent = String(Object.keys(headersFromRows(state.headers)).length);
}

function syncBodyState() {
    const bodyDisabled = state.method === "GET" || state.method === "HEAD";
    els.body.disabled = bodyDisabled;
    els.bodyHint.textContent = bodyDisabled
        ? `El método ${state.method} no envía cuerpo.`
        : "Se envía tal cual. Añade Content-Type si tu API lo necesita.";
    els.bodyHint.dataset.disabled = String(bodyDisabled);
}

function createHeaderRow(row, index) {
    const wrapper = document.createElement("div");
    wrapper.className = "header-row";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = row.key;
    nameInput.placeholder = "Content-Type";
    nameInput.autocomplete = "off";
    nameInput.spellcheck = false;
    nameInput.setAttribute("aria-label", `Nombre de la cabecera ${index + 1}`);
    nameInput.addEventListener("input", (event) => {
        state.headers[index].key = event.target.value;
        updateHeaderCount();
        dropPresetSelection();
    });

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = row.value;
    valueInput.placeholder = "application/json";
    valueInput.autocomplete = "off";
    valueInput.spellcheck = false;
    valueInput.setAttribute("aria-label", `Valor de la cabecera ${index + 1}`);
    valueInput.addEventListener("input", (event) => {
        state.headers[index].value = event.target.value;
        updateHeaderCount();
        dropPresetSelection();
    });

    const remove = document.createElement("button");
    remove.className = "row-remove";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Eliminar cabecera ${index + 1}`);
    remove.addEventListener("click", () => {
        state.headers.splice(index, 1);
        if (state.headers.length === 0) state.headers.push({ key: "", value: "" });
        renderHeaderRows();
        dropPresetSelection();
    });

    wrapper.append(nameInput, valueInput, remove);
    return wrapper;
}

function renderHeaderRows(focusIndex = null) {
    els.headerRows.replaceChildren();
    state.headers.forEach((row, index) => {
        els.headerRows.append(createHeaderRow(row, index));
    });
    updateHeaderCount();

    if (focusIndex !== null) {
        const inputs = els.headerRows.querySelectorAll("input");
        inputs[focusIndex * 2]?.focus();
    }
}

function dropPresetSelection() {
    if (state.activePreset === null) return;
    state.activePreset = null;
    els.presetList.querySelectorAll(".preset").forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
    });
}

function renderPresets() {
    els.presetList.replaceChildren();
    PRESETS.forEach((preset) => {
        const item = document.createElement("div");
        item.className = "preset-item";
        item.setAttribute("role", "listitem");

        const button = document.createElement("button");
        button.className = "preset";
        button.type = "button";
        button.dataset.presetId = preset.id;
        button.setAttribute("aria-pressed", "false");

        const group = document.createElement("span");
        group.className = "preset__group";
        group.textContent = preset.group;

        const label = document.createElement("span");
        label.className = "preset__label";
        label.textContent = preset.label;

        button.append(group, label);
        button.addEventListener("click", () => selectPreset(preset.id));
        item.append(button);
        els.presetList.append(item);
    });
}

function selectPreset(id) {
    const preset = getPreset(id);
    if (!preset) return;

    state.activePreset = preset.id;
    state.method = preset.method;
    state.url = preset.url;
    state.headers = preset.headers.length > 0 ? preset.headers : [{ key: "", value: "" }];
    state.body = preset.body;

    els.method.value = preset.method;
    els.url.value = preset.url;
    els.body.value = preset.body;
    els.presetNote.textContent = preset.note;
    syncBodyState();
    renderHeaderRows();
    clearResponse();

    els.presetList.querySelectorAll(".preset").forEach((button) => {
        const active = button.dataset.presetId === preset.id;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    setRequestStatus(`${preset.group} · ${preset.label} cargado.`);
}

function activateTab(tabs, panels, target) {
    tabs.forEach((tab) => {
        const selected = tab === target;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[tab.id].hidden = !selected;
    });
}

function setupTabs(tabs, panels) {
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(tabs, panels, tab));
        tab.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const available = tabs.filter((candidate) => !candidate.disabled);
            if (available.length === 0) return;

            let nextIndex = available.indexOf(tab);
            if (event.key === "Home") nextIndex = 0;
            else if (event.key === "End") nextIndex = available.length - 1;
            else if (event.key === "ArrowRight") nextIndex = (nextIndex + 1) % available.length;
            else nextIndex = (nextIndex - 1 + available.length) % available.length;

            const next = available[nextIndex];
            activateTab(tabs, panels, next);
            next.focus();
        });

        if (index === 0) tab.tabIndex = 0;
    });
}

function setResponseTabs(enabled) {
    els.responseTabs.forEach((tab) => {
        tab.disabled = !enabled;
    });
}

function clearResponse() {
    state.response = null;
    state.error = null;
    els.responseEmpty.hidden = false;
    els.responseLoading.hidden = true;
    els.responseError.hidden = true;
    els.responseBody.hidden = true;
    els.responseBody.textContent = "";
    els.responseBody.className = "response-body";
    els.responseMeta.hidden = true;
    els.responseUrl.hidden = true;
    els.responseHeaderRows.replaceChildren();
    els.responseHeaderCount.textContent = "0";
    els.copy.disabled = true;
    setResponseTabs(false);
    activateTab(els.responseTabs, els.responsePanels, els.responseTabs[0]);
    activateTab(els.requestTabs, els.requestPanels, els.requestTabs[0]);
    els.responseNote.textContent = "Sin peticiones todavía.";
    els.responseNote.dataset.tone = "neutral";
}

function showLoading() {
    els.responseEmpty.hidden = true;
    els.responseError.hidden = true;
    els.responseBody.hidden = true;
    els.responseLoading.hidden = false;
    els.responseMeta.hidden = true;
    els.responseUrl.hidden = true;
    els.copy.disabled = true;
    setResponseTabs(false);
    activateTab(els.responseTabs, els.responsePanels, els.responseTabs[0]);
    els.responseNote.textContent = "Esperando al servidor…";
    els.responseNote.dataset.tone = "neutral";
}

function showError(title, detail) {
    els.responseEmpty.hidden = true;
    els.responseLoading.hidden = true;
    els.responseBody.hidden = true;
    els.responseError.hidden = false;
    els.errorTitle.textContent = title;
    els.errorDetail.textContent = detail;
    els.responseMeta.hidden = true;
    els.responseUrl.hidden = true;
    els.responseHeaderRows.replaceChildren();
    els.responseHeaderCount.textContent = "0";
    els.copy.disabled = true;
    setResponseTabs(false);
    activateTab(els.responseTabs, els.responsePanels, els.responseTabs[0]);
    els.responseNote.textContent = "La petición no se completó.";
    els.responseNote.dataset.tone = "bad";
}

function renderResponse() {
    const response = state.response;
    if (!response) return;

    els.responseEmpty.hidden = true;
    els.responseLoading.hidden = true;
    els.responseError.hidden = true;
    els.responseBody.hidden = false;
    els.responseMeta.hidden = false;
    els.responseUrl.hidden = false;

    els.responseStatus.textContent = `${response.status} ${response.statusText}`.trim();
    els.responseStatus.className = "status-pill";
    if (response.status >= 200 && response.status < 300) {
        els.responseStatus.classList.add("status-pill--ok");
    } else if (response.status >= 300 && response.status < 400) {
        els.responseStatus.classList.add("status-pill--warn");
    } else {
        els.responseStatus.classList.add("status-pill--bad");
    }

    els.responseTime.textContent = formatDuration(response.duration);
    els.responseSize.textContent = formatBytes(response.size);
    els.responseUrl.textContent = response.url;

    els.responseBody.textContent = response.display.text;
    els.responseBody.className = `response-body response-body--${response.display.kind}`;

    els.responseHeaderRows.replaceChildren();
    response.headers.forEach(([name, value]) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const valueCell = document.createElement("td");
        nameCell.textContent = name;
        valueCell.textContent = value;
        row.append(nameCell, valueCell);
        els.responseHeaderRows.append(row);
    });
    els.responseHeaderCount.textContent = String(response.headers.length);

    els.copy.disabled = false;
    setResponseTabs(true);
    activateTab(els.responseTabs, els.responsePanels, els.responseTabs[0]);
    els.responseNote.textContent = `${response.method} ${response.url}`;
    els.responseNote.dataset.tone = response.status >= 400 ? "bad" : "ok";
}

async function sendRequest() {
    if (state.loading) return;

    const url = normalizeUrl(state.url);
    if (url === "") {
        setRequestStatus("Escribe una URL HTTP válida antes de enviar.", "bad");
        els.url.focus();
        return;
    }

    state.url = url;
    els.url.value = url;
    state.loading = true;
    state.controller = new AbortController();
    let timedOut = false;
    const timeout = window.setTimeout(() => {
        timedOut = true;
        state.controller.abort();
    }, 20000);
    const started = performance.now();

    updateSendButton();
    showLoading();
    setRequestStatus("Enviando petición…");

    const options = {
        method: state.method,
        headers: headersFromRows(state.headers),
        signal: state.controller.signal,
    };
    if (state.method !== "GET" && state.method !== "HEAD" && state.body.trim() !== "") {
        options.body = state.body;
    }

    try {
        const response = await fetch(url, options);
        const text = await response.text();
        const elapsed = performance.now() - started;
        const contentType = response.headers.get("content-type") ?? "";

        state.response = {
            status: response.status,
            statusText: response.statusText,
            duration: elapsed,
            size: new TextEncoder().encode(text).length,
            headers: [...response.headers],
            url: response.url || url,
            method: state.method,
            display: formatResponseBody(text, contentType),
        };
        renderResponse();
        setRequestStatus(
            `${state.method} ${response.status} · ${formatDuration(elapsed)}`,
            response.status >= 400 ? "bad" : "ok"
        );
    } catch (error) {
        const elapsed = performance.now() - started;
        const networkError = error instanceof TypeError;

        state.response = null;
        if (timedOut) {
            showError(
                "Tiempo de espera agotado.",
                "La petición superó los 20 segundos y se canceló."
            );
        } else if (networkError) {
            showError(
                "La petición no llegó.",
                "El navegador no pudo leer la respuesta. Suele ser CORS, una API apagada o una URL inaccesible."
            );
        } else {
            showError("No se pudo completar.", error.message || "Error desconocido de red.");
        }
        setRequestStatus(
            timedOut ? "Petición cancelada por tiempo de espera." : "Error de red.",
            "bad"
        );
        els.responseNote.textContent = `Falló tras ${formatDuration(elapsed)}.`;
    } finally {
        window.clearTimeout(timeout);
        state.loading = false;
        state.controller = null;
        updateSendButton();
    }
}

async function copyResponse() {
    if (!state.response) return;
    try {
        await navigator.clipboard.writeText(state.response.display.text);
        els.copy.textContent = "Copiado";
        window.setTimeout(() => {
            els.copy.textContent = "Copiar";
        }, 1400);
    } catch {
        els.copy.textContent = "Copia manual";
        window.setTimeout(() => {
            els.copy.textContent = "Copiar";
        }, 1800);
    }
}

function formatRequestBody() {
    const result = formatJsonBody(state.body);
    if (!result.ok) {
        setRequestStatus(result.error, "bad");
        return;
    }
    state.body = result.output;
    els.body.value = result.output;
    setRequestStatus("JSON formateado.", "ok");
}

function initialize() {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = String(new Date().getFullYear());
    });

    renderPresets();
    setupTabs(els.requestTabs, els.requestPanels);
    setupTabs(els.responseTabs, els.responsePanels);
    selectPreset(DEFAULT_PRESET_ID);

    els.method.addEventListener("change", (event) => {
        state.method = event.target.value;
        syncBodyState();
        dropPresetSelection();
    });

    els.url.addEventListener("input", (event) => {
        state.url = event.target.value;
        dropPresetSelection();
    });

    els.body.addEventListener("input", (event) => {
        state.body = event.target.value;
        dropPresetSelection();
    });

    els.addHeader.addEventListener("click", () => {
        state.headers.push({ key: "", value: "" });
        renderHeaderRows(state.headers.length - 1);
        dropPresetSelection();
    });

    els.send.addEventListener("click", sendRequest);
    els.formatBody.addEventListener("click", formatRequestBody);
    els.copy.addEventListener("click", copyResponse);

    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            sendRequest();
        }
    });

    syncBodyState();
    updateSendButton();
}

initialize();
