const passwordInput = document.getElementById("password-input");
const passwordToggle = document.getElementById("show-password");
const captchaCode = document.getElementById("captcha-code");
const captchaInput = document.getElementById("captcha-input");
const captchaRefresh = document.getElementById("captcha-refresh");
const verifyButton = document.getElementById("verify-captcha");

passwordToggle.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggle.textContent = "Ocultar";
    } else {
        passwordInput.type = "password";
        passwordToggle.textContent = "Mostrar";
    }
});

function generateText(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    const characterCount = characters.length;

    for (let index = 0; index < length; index++) {
        captcha += characters.charAt(Math.floor(Math.random() * characterCount));
    }
    return captcha;
}

function generateCaptcha() {
    const captchaLength = 6;
    captchaCode.textContent = generateText(captchaLength);
}

function verifyCaptcha() {
    if (captchaInput.value === captchaCode.textContent) {
        alert("Captcha Correcto");
    } else {
        alert("Captcha Incorrecto");
    }
}

captchaRefresh.addEventListener("click", generateCaptcha);
verifyButton.addEventListener("click", verifyCaptcha);
window.addEventListener("load", generateCaptcha);
