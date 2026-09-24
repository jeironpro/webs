const campoContrasena = document.getElementById('campo-contrasena');
const botonGenerar = document.getElementById('boton-generar');
const mensajeEstado = document.getElementById('mensaje-estado');

/**
 * Genera una contraseña aleatoria de longitud variable entre 12 y 16 caracteres.
 */
function generarContrasena() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_=+';
    let contrasenaGenerada = '';
    const longitud = Math.floor(Math.random() * (16 - 12 + 1)) + 12;

    for (let i = 0; i < longitud; i++) {
        contrasenaGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    campoContrasena.value = contrasenaGenerada;

    // Limpiar mensaje de estado anterior
    while (mensajeEstado.firstChild) {
        mensajeEstado.removeChild(mensajeEstado.firstChild);
    }

    const textoInformativo = document.createTextNode('¡Contraseña generada con éxito!');
    mensajeEstado.appendChild(textoInformativo);
}

// Event Listeners
botonGenerar.addEventListener('click', generarContrasena);

// Generar una contraseña inicial al cargar
window.addEventListener('DOMContentLoaded', generarContrasena);