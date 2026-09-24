let datosMostrar = document.getElementById('calculo'); 
let operador = ''; 
let primerosNumeros = '';
let segundosNumeros = '';
let operadorSeleccion = false;

function datosCalculo(value) { 
    if (operador === '') {
        if (primerosNumeros === '' && value === '.') {
            primerosNumeros += '0.';
            datosMostrar.value += '0.';
        } else if (primerosNumeros === '' && value === '0') {
            return;
        } else if (value === '-' && primerosNumeros === '') {
            primerosNumeros += value;
            datosMostrar.value += value;
        } else {
            primerosNumeros += value;
            if (operadorSeleccion) { 
                datosMostrar.value = '';
                operadorSeleccion = false;
            }
            datosMostrar.value += value; 
        }
    } else {
        if (segundosNumeros === '' && value === '.') {
            segundosNumeros += '0';
        } else if (segundosNumeros === '0' && value !== '.') {
            segundosNumeros = '';
        }
        segundosNumeros += value;
        datosMostrar.value = '';
    }
    datosMostrar.value += segundosNumeros;
} 

function operadorSeleccionado(operadorCalculo) { 
    if (segundosNumeros !== '') {
        calcular();
    }
    
    operador = operadorCalculo; 
    operadorSeleccion = true;

    // Selector en español
    let botones = document.querySelectorAll('.boton-operador');
    botones.forEach(boton => boton.classList.remove('seleccionado'))

    let operadorSeleccionado = document.querySelector(`button[data-operador="${operador}"]`);

    if (operadorSeleccionado) {
        operadorSeleccionado.classList.add('seleccionado');
    }
} 

function calcular() { 
    let resultado;

    // Selector en español
    let operadorSeleccionado = document.querySelector(`button[data-operador="${operador}"]`);

    if (operadorSeleccionado) {
        operadorSeleccionado.classList.remove('seleccionado');
    }

    if (operador === "%") {
        resultado = parseFloat(primerosNumeros / 100)
    }
    else if (operador === "√") {
        resultado = Math.sqrt(primerosNumeros)
    } else {
        try {
            resultado = eval(primerosNumeros + operador + segundosNumeros);
        } catch (e) {
            resultado = "Error";
        }
    }
    
    // Validar infinito o NaN
    if (!isFinite(resultado) || isNaN(resultado)) {
        resultado = "Error";
    }

    datosMostrar.value = resultado; 
    operador = ''; 
    primerosNumeros = resultado.toString();
    segundosNumeros = '';
    operadorSeleccion = false;    
}

function limpiar() {
    let valorActual = datosMostrar.value;
    datosMostrar.value = valorActual.slice(0, -1);
    if (operador === '') {
        primerosNumeros = datosMostrar.value;
    } else {
        segundosNumeros = datosMostrar.value; 
    }
}

function limpiarTodo() { 
    datosMostrar.value = ''; 
    operador = '';
    primerosNumeros = '';
    segundosNumeros = ''; 
    operadorSeleccion = false;
    
    // Selector en español
    let botones = document.querySelectorAll('.boton-operador');
    botones.forEach(boton => boton.classList.remove('seleccionado'));
}