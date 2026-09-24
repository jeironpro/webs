async function tasaCambio() {
    const respuesta = await fetch('https://open.er-api.com/v6/latest');
    const data = await respuesta.json();
    return data.rates;
}

async function monedasSelect() {
    const obtenerTasaCambio = await tasaCambio();
    const selectDesde = document.getElementById('selector-origen');
    const selectHasta = document.getElementById('selector-destino');

    selectDesde.innerHTML = '';
    selectHasta.innerHTML = '';

    Object.keys(obtenerTasaCambio).forEach(moneda => {
        const opciones = document.createElement('option');
        opciones.value = moneda;
        opciones.textContent = moneda;
        selectDesde.appendChild(opciones);
    });

    Object.keys(obtenerTasaCambio).forEach(moneda => {
        const opciones = document.createElement('option');
        opciones.value = moneda;
        opciones.textContent = moneda;
        selectHasta.appendChild(opciones);
    });
}

async function convertirMoneda() {
    const obtenerTasaCambio = await tasaCambio();
    const monedaDesde = document.getElementById('selector-origen').value;
    const monedaHasta = document.getElementById('selector-destino').value;
    const cantidad = document.getElementById('input-cantidad').value;

    const tasaCambioDesde = obtenerTasaCambio[monedaDesde];
    const tasaCambioHasta = obtenerTasaCambio[monedaHasta];
    const conversion = (cantidad / tasaCambioDesde) * tasaCambioHasta;

    document.getElementById('caja-resultado').innerText = `${cantidad} ${monedaDesde} = ${conversion.toFixed(2)} ${monedaHasta}`;
}

function cambiarMoneda() {
    const selectDesde = document.getElementById('selector-origen');
    const selectHasta = document.getElementById('selector-destino');
    const selectDesdeValor = selectDesde.value;

    selectDesde.value = selectHasta.value;
    selectHasta.value = selectDesdeValor;
}

document.querySelector('.boton-convertir').addEventListener('click', convertirMoneda);
document.getElementById('control-intercambio').addEventListener('click', cambiarMoneda);
window.onload = () => {
    monedasSelect();
}