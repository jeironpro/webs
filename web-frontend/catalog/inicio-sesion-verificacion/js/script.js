document.getElementById('mostrar-ocultar').addEventListener('click', function() {
    var input = document.getElementById('contrasena');

    if (input.type === 'password') {
        input.type = 'text';
        this.textContent = 'Ocultar';
    } else {
        input.type = 'password';
        this.textContent = 'Mostrar';
    }
})

function generarTexto(longitud) {
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var captcha = '';
    var longitudCaracteres = caracteres.length;

    for (var i = 0; i < longitud; i++) {
        captcha += caracteres.charAt(Math.floor(Math.random() * longitudCaracteres));
    }
    return captcha;
}

function generarCaptcha() {
    var longitudCaptcha = 6;
    var textoCaptcha = generarTexto(longitudCaptcha);
    document.getElementById('captcha').textContent = textoCaptcha;
}

function verificarCaptcha() {
    var textoCaptcha = document.getElementById('captcha').textContent;
    var captchaUsuario = document.getElementById('captcha-usuario').value;

    if (captchaUsuario === textoCaptcha) {
        alert('Captcha Correcto');
    } else {
        alert('Captcha Incorrecto');
    }
}

document.getElementById('reiniciar-captcha').addEventListener('click', generarCaptcha);

window.onload = () => {
    generarCaptcha();
}