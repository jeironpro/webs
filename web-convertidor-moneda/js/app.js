const API_TASAS = 'https://open.er-api.com/v6/latest/USD';
let tasasCache = null;

async function tasaCambio() {
    if (tasasCache !== null) {
        return tasasCache;
    }
    const respuesta = await fetch(API_TASAS);
    if (!respuesta.ok) {
        throw new Error(`No se pudieron obtener las tasas (${respuesta.status})`);
    }
    const data = await respuesta.json();
    if (data.result !== 'success' || !data.rates) {
        throw new Error('La respuesta de tasas no es válida');
    }
    tasasCache = data.rates;
    return tasasCache;
}

function monedaSeleccionada(id) {
    return document.getElementById(id).value;
}

function rellenarSelectores(tasas) {
    const monedas = Object.keys(tasas).sort();
    ['selector-origen', 'selector-destino'].forEach(id => {
        const select = document.getElementById(id);
        select.replaceChildren();
        monedas.forEach(moneda => {
            const opcion = document.createElement('option');
            opcion.value = moneda;
            opcion.textContent = moneda;
            select.appendChild(opcion);
        });
    });
    document.getElementById('selector-origen').value = 'USD';
    document.getElementById('selector-destino').value = 'EUR';
}

async function monedasSelect() {
    const caja = document.getElementById('caja-resultado');
    try {
        const tasas = await tasaCambio();
        rellenarSelectores(tasas);
        caja.textContent = '';
    } catch (error) {
        caja.textContent = 'No se pudieron cargar las monedas. Revisa tu conexión.';
        console.error(error);
    }
}

function escribirResultado(texto) {
    document.getElementById('caja-resultado').textContent = texto;
}

async function convertirMoneda() {
    const monedaDesde = monedaSeleccionada('selector-origen');
    const monedaHasta = monedaSeleccionada('selector-destino');
    const cantidad = Number(document.getElementById('input-cantidad').value);

    if (!Number.isFinite(cantidad) || cantidad < 0) {
        escribirResultado('Escribe una cantidad válida.');
        return;
    }

    try {
        const tasas = await tasaCambio();
        const tasaDesde = tasas[monedaDesde];
        const tasaHasta = tasas[monedaHasta];
        if (!tasaDesde || !tasaHasta) {
            throw new Error('Moneda no disponible');
        }
        const conversion = (cantidad / tasaDesde) * tasaHasta;
        escribirResultado(
            `${cantidad} ${monedaDesde} = ${conversion.toFixed(2)} ${monedaHasta}`,
        );
    } catch (error) {
        escribirResultado('No se pudo hacer la conversión. Inténtalo de nuevo.');
        console.error(error);
    }
}

function cambiarMoneda() {
    const selectDesde = document.getElementById('selector-origen');
    const selectHasta = document.getElementById('selector-destino');
    const desdeValor = selectDesde.value;
    selectDesde.value = selectHasta.value;
    selectHasta.value = desdeValor;
    escribirResultado('');
}

document.querySelector('.boton-convertir').addEventListener('click', convertirMoneda);
document.getElementById('control-intercambio').addEventListener('click', cambiarMoneda);
window.addEventListener('load', monedasSelect);
