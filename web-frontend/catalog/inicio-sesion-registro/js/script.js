document.getElementById('mostrar-ocultar').addEventListener('click', function() {
    let input = document.getElementById('contrasena');
    let icono = document.querySelector('.mostrar-ocultar i');

    if (input.type === 'password') {
        input.type = 'text';
        icono.classList.remove('fa-eye');
        icono.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icono.classList.remove('fa-eye-slash');
        icono.classList.add('fa-eye');
    }
})

document.getElementById('mostrar-ocultar-reg').addEventListener('click', function() {
    const input = document.getElementById('contrasena-reg');
    const icono = document.querySelector('.mostrar-ocultar-reg i');

    if (input.type === 'password') {
        input.type = 'text';
        icono.classList.remove('fa-eye');
        icono.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icono.classList.remove('fa-eye-slash');
        icono.classList.add('fa-eye');
    }
})

const contenedor = document.getElementById('contenedor');
const registro = document.getElementById('registro');
const iniciar = document.getElementById('iniciar');

document.getElementById('registrarse').addEventListener('click', function() {
    contenedor.style.height = '400px';
    registro.style.display = 'flex';
    iniciar.style.display = 'none';
})

document.getElementById('iniciarSesion').addEventListener('click', function() {
    contenedor.style.height = '350px';
    registro.style.display = 'none';
    iniciar.style.display = 'flex';
})