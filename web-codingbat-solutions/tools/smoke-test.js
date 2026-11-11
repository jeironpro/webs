/*
 * Smoke test de la web (sin navegador).
 * Comprueba que js/data.js contiene los ejercicios y que js/app.js
 * renderiza estadísticas, chips, rejilla de tarjetas, "ver solución",
 * paleta ⌘K, paginación, copiado y estado vacío sin errores,
 * usando un stub mínimo del DOM.
 *
 * Uso: node tools/smoke-test.js
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const leer = (rel) => fs.readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

function classListFor(el) {
    const set = new Set();
    return {
        add: c => set.add(c),
        remove: c => set.delete(c),
        toggle: (c, force) => {
            const on = force === undefined ? !set.has(c) : force;
            if (on) set.add(c); else set.delete(c);
            return on;
        },
        contains: c => set.has(c),
    };
}

class El {
    constructor(tag) {
        this.tagName = tag;
        this.nodeType = 1;
        this.children = [];
        this.listeners = {};
        this.dataset = {};
        this.attrs = {};
        this.hidden = false;
        this.disabled = false;
        this.className = '';
        this.textContent = '';
        this.value = '';
        this.style = {};
        this.classList = classListFor(this);
    }
    append(...nodos) {
        for (const nodo of nodos) {
            if (nodo !== null && nodo !== undefined) this.children.push(nodo);
        }
    }
    replaceChildren(...nodos) {
        this.children = [];
        this.append(...nodos);
    }
    appendChild(child) { this.children.push(child); return child; }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    querySelectorAll() { return []; }
    querySelector() { return null; }
    scrollIntoView() { }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k]; }
    focus() { }
    remove() { }
    before() { }
    select() { }
}

const textoDe = (el) => {
    if (!el) return '';
    if (el.nodeType === 3) return el.textContent;
    return (el.textContent || '') + (el.children || []).map(textoDe).join('');
};

const tieneClase = (el, clase) => (el.className || '').split(/\s+/).includes(clase);

function recoger(el, pred, acc = []) {
    for (const hijo of el.children || []) {
        if (pred(hijo)) acc.push(hijo);
        recoger(hijo, pred, acc);
    }
    return acc;
}

const conClase = (el, clase) => recoger(el, (hijo) => tieneClase(hijo, clase));

const failures = [];
function check(name, cond) {
    console.log((cond ? '  OK   ' : '  FAIL ') + name);
    if (!cond) failures.push(name);
}

function fakeClick(el, listenersKey, selector, node) {
    el.listeners[listenersKey][0]({ target: { closest: sel => (sel === selector ? node : null) } });
}

async function main() {
    let copied = null;
    const elements = {};
    const keyHandlers = [];
    Object.defineProperty(global, 'window', { value: {}, configurable: true, writable: true });
    Object.defineProperty(global, 'navigator', {
        value: { clipboard: { writeText: async t => { copied = t; } } },
        configurable: true, writable: true,
    });
    global.setTimeout = fn => fn(); // type-in, debounce y reverts corren síncronos
    global.document = {
        getElementById: id => (elements[id] ||= new El('div')),
        querySelectorAll: () => [],
        createElement: tag => new El(tag),
        createTextNode: text => ({ nodeType: 3, textContent: text }),
        addEventListener: (type, fn) => { if (type === 'keydown') keyHandlers.push(fn); },
        activeElement: null,
        body: new El('body'),
        execCommand: () => true,
    };

    eval(leer('../js/data.js'));
    eval(leer('../js/app.js'));

    const data = global.window.EXERCISES;
    const resultados = () => elements['results'];
    const tarjetas = () => recoger(resultados(), (el) => el.tagName === 'article');
    const textoResultados = () => textoDe(resultados());
    const textoPaginacion = () => textoDe(elements['pagination-top']);
    const botonPagina = (page) => recoger(elements['pagination-top'], (el) => el.attrs['data-page'] === page)[0];
    const countText = () => elements['count'].textContent;

    console.log('Smoke test');
    check('se cargaron los ejercicios (222)', data.length === 222);
    check('la banda de stats muestra cifras reales', textoDe(elements['stats']).includes('222'));
    check('los chips de lenguaje se renderizan', elements['lang-chips'].children.map(c => c.textContent).join(',') === 'todos,java,python');
    check('los chips de categoría se renderizan',
        elements['cat-chips'].children.some(c => c.textContent === 'todas') &&
        elements['cat-chips'].children.some(c => c.textContent === 'cadenas') &&
        elements['cat-chips'].children.some(c => c.textContent === 'lógica'));
    check('el contador muestra el total', countText().includes('222 ejercicios'));
    check('el código del hero se resalta', conClase(elements['hero-code-out'], 'tok').length > 0);

    /* Paginación inicial */
    check('la página 1 muestra 10 tarjetas', tarjetas().length === 10);
    check('la paginación muestra página 1 de 23', textoPaginacion().includes('página 1 de 23'));
    check('el botón anterior está deshabilitado en la página 1', botonPagina('prev').disabled === true);
    check('la primera tarjeta contiene el ejercicio correcto', textoDe(tarjetas()[0]).includes(data[0].name + '()'));
    check('las tarjetas incluyen el botón ver solución', textoResultados().includes('Ver solución'));
    check('las tarjetas muestran la línea de preview', conClase(resultados(), 'card__preview').length > 0);
    check('cada ejercicio tiene lenguaje válido', data.every(e => ['java', 'python'].includes(e.lang)));
    check('cada ejercicio tiene categoría y nivel', data.every(e => e.category && e.level));

    /* Siguiente página */
    fakeClick(elements['pagination-top'], 'click', '.page-btn', { disabled: false, dataset: { page: 'next' } });
    check('la página 2 empieza en el ejercicio 11', textoResultados().includes(data[10].name + '()'));
    check('la paginación muestra página 2 de 23', textoPaginacion().includes('página 2 de 23'));

    /* Modal: abrir la solución desde la tarjeta (filtro python, índice correcto) */
    fakeClick(elements['lang-chips'], 'click', '.chip', elements['lang-chips'].children[2]); // chip python
    const firstPythonIdx = data.findIndex(e => e.lang === 'python');
    const firstCopyIdx = Number(conClase(tarjetas()[0], 'card__view')[0].attrs['data-idx']);
    check('el filtro python reinicia a la página 1', textoPaginacion().includes('página 1 de 8'));
    check('la primera tarjeta python tiene el índice correcto', firstCopyIdx === firstPythonIdx);
    await openCardSolution(firstPythonIdx);
    check('el modal se abre', elements['modal'].classList.contains('is-open'));
    check('el modal muestra el ejercicio correcto', elements['modal-title'].textContent === data[firstPythonIdx].name + '()');
    check('el modal muestra la solución resaltada', conClase(elements['modal-body'], 'tok').length > 0);
    check('el modal incluye el botón copiar', conClase(elements['modal-body'], 'copy').length > 0);
    await elements['modal-body'].listeners['click'][0]({
        target: {
            closest: sel => (sel === '.copy'
                ? { dataset: { idx: String(firstPythonIdx) }, classList: { add() { }, remove() { } }, textContent: '' }
                : null),
        },
    });
    check('copiar dentro del modal guarda el código correcto', copied === data[firstPythonIdx].code);
    keyHandlers[0]({ key: 'Escape', preventDefault() { } });
    check('esc cierra el modal', elements['modal'].classList.contains('is-open') === false);

    /* Búsqueda: filtra y reinicia la página (con el filtro de lenguaje en 'todos') */
    fakeClick(elements['lang-chips'], 'click', '.chip', elements['lang-chips'].children[0]); // chip todos
    const searchEl = elements['search'];
    searchEl.value = 'fizz';
    searchEl.listeners['input'][0]();
    check('la búsqueda filtra resultados',
        countText().includes('2 de 222') &&
        textoResultados().includes('cadenaEfervescencia()') &&
        textoPaginacion().includes('página 1 de'));

    /* Estado vacío y limpiar filtros */
    searchEl.value = 'zzznadaexiste';
    searchEl.listeners['input'][0]();
    check('la búsqueda sin coincidencias muestra el estado vacío', elements['empty'].hidden === false);
    check('la paginación se oculta sin resultados', elements['pagination-top'].hidden === true);
    elements['clear'].listeners['click'][0]();
    check('limpiar filtros restablece el listado completo',
        countText().includes('222 ejercicios') &&
        elements['empty'].hidden === true &&
        searchEl.value === '' &&
        textoPaginacion().includes('página 1 de 23'));

    /* Paleta ⌘K: abre con atajo, filtra y abre el ejercicio */
    keyHandlers[0]({ metaKey: true, key: 'k', preventDefault() { } });
    check('⌘K abre la paleta de comandos', elements['cmdk'].classList.contains('is-open'));
    const cmdkInput = elements['cmdk-input'];
    cmdkInput.value = 'diferencia21';
    cmdkInput.listeners['input'][0]();
    check('la paleta filtra por nombre', textoDe(elements['cmdk-results']).includes('diferencia21'));
    keyHandlers[0]({ key: 'Enter', preventDefault() { } });
    check('enter en la paleta abre el ejercicio en el modal y cierra',
        textoResultados().includes('diferencia21()') &&
        elements['cmdk'].classList.contains('is-open') === false &&
        elements['modal'].classList.contains('is-open'));
    check('la paleta se restableció a todos los ejercicios', countText().includes('222 ejercicios'));

    async function openCardSolution(idx) {
        await elements['results'].listeners['click'][0]({
            target: { closest: sel => (sel === '.card__view' ? { dataset: { idx: String(idx) } } : null) },
        });
    }

    if (failures.length) {
        console.error('\nFALLOS: ' + failures.join(', '));
        process.exit(1);
    }
    console.log('\nSmoke test OK');
}

main().catch(err => { console.error(err); process.exit(1); });
