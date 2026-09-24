document.addEventListener('DOMContentLoaded', renderizarCalendario);

let fechaActual = new Date();
let calendarioActual = fechaActual.getFullYear();

function obtenerPrimerDiaSemana(mes) {
    // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    // Ajustamos para que 1 = Lunes, ..., 7 = Domingo
    const dia = new Date(calendarioActual, mes, 1).getDay();
    return dia === 0 ? 7 : dia;
}

function renderizarCalendario() {
    const contenedorCalendario = document.querySelector('.contenedor-calendario');
    contenedorCalendario.innerHTML = '';

    const tituloCalendario = document.querySelector('.titulo');
    tituloCalendario.textContent = 'CALENDARIO ' + calendarioActual.toString();

    const nombresMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

    for (let mes = 0; mes < 12; mes++) {
        // Contenedor del mes (antes table)
        const contenedorMes = document.createElement('div');
        contenedorMes.classList.add('contenedor-mes');

        // Título del mes (antes caption)
        const tituloMes = document.createElement('div');
        tituloMes.classList.add('titulo-mes');
        tituloMes.textContent = nombresMeses[mes];
        contenedorMes.appendChild(tituloMes);

        // Tabla de días
        const tablaDias = document.createElement('div');
        tablaDias.classList.add('tabla-dias');

        // Encabezados de días (L, M, X...)
        const filaEncabezados = document.createElement('div');
        filaEncabezados.classList.add('fila-encabezados');
        const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
        diasSemana.forEach(dia => {
            const celdaEncabezado = document.createElement('div');
            celdaEncabezado.classList.add('celda-encabezado');
            celdaEncabezado.textContent = dia;
            filaEncabezados.appendChild(celdaEncabezado);
        });
        tablaDias.appendChild(filaEncabezados);

        // Cuerpo de los días
        const cuerpoDias = document.createElement('div');
        cuerpoDias.classList.add('cuerpo-dias');

        const diasEnMes = new Date(calendarioActual, mes + 1, 0).getDate();
        const primerDiaSemana = obtenerPrimerDiaSemana(mes);

        // Celdas vacías previas al primer día
        for (let i = 1; i < primerDiaSemana; i++) {
            const celdaVacia = document.createElement('div');
            celdaVacia.classList.add('celda-dia', 'vacia');
            cuerpoDias.appendChild(celdaVacia);
        }

        // Celdas de los días
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const celdaDia = document.createElement('div');
            celdaDia.classList.add('celda-dia');
            celdaDia.textContent = dia;
            cuerpoDias.appendChild(celdaDia);
        }

        tablaDias.appendChild(cuerpoDias);
        contenedorMes.appendChild(tablaDias);
        contenedorCalendario.appendChild(contenedorMes);
    }
}