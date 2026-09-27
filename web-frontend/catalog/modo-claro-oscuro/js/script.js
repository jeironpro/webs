const botonModo = document.getElementById('boton-modo');
const body = document.body;

botonModo.addEventListener('click', function() {
    if (!body.classList.contains('dark-mode')) {
        body.classList.add('dark-mode');
        botonModo.textContent = 'Modo Claro';
    } else {
        body.classList.remove('dark-mode');
        botonModo.textContent = 'Modo Oscuro';
    }
});