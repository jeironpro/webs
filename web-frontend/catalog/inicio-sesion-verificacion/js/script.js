document.getElementById('mostrar-ocultar').addEventListener('click', function() {
    const input = document.getElementById('contrasena');

    if (input.type === 'password') {
        input.type = 'text';
        this.textContent = 'Ocultar';
    } else {
        input.type = 'password';
        this.textContent = 'Mostrar';
    }
})

function generarTexto(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let captcha = '';
    const longitudCaracteres = caracteres.length;

    for (let i = 0; i < longitud; i++) {
        captcha += caracteres.charAt(Math.floor(Math.random() * longitudCaracteres));
    }
    return captcha;
}

function generarCaptcha() {
    const longitudCaptcha = 6;
    let textoCaptcha = generarTexto(longitudCaptcha);
    document.getElementById('captcha').textContent = textoCaptcha;
}

function verificarCaptcha() {
    const textoCaptcha = document.getElementById('captcha').textContent;
    const captchaUsuario = document.getElementById('captcha-usuario').value;

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