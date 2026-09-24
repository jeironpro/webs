let balanceInicial = 0;
let gastosTotales = 0;

const agregarIngresos = () => {
    const inputIngresos = document.getElementById('ingresos');
    const ingresos = parseInt(inputIngresos.value) || 0;
    const totalIngresos = document.getElementById("totalIngresos");
    
    totalIngresos.textContent = ingresos;
    balanceInicial = ingresos;
    actualizarBalance();
    limpiarInput();
};

const agregarGastos = () => {
    const inputGastos = document.getElementById('gastos');
    const gastos = parseInt(inputGastos.value) || 0;
    
    balanceInicial -= gastos;
    gastosTotales += gastos; 
    actualizarBalance();
    actualizarGastos();
    limpiarInput();
};

const actualizarGastos = () => {
    const totalGastos = document.getElementById("totalGastos");
    totalGastos.textContent = gastosTotales;
};

const actualizarBalance = () => {
    const balance = document.getElementById("balance");

    if (balanceInicial <= 0) {
        balance.textContent = 0;
    } else {
        balance.textContent = balanceInicial;
    }
};

const limpiarInput = () => {
    document.getElementById('ingresos').value = '';
    document.getElementById('gastos').value = '';
};