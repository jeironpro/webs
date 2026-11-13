const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 16;
const RANDOM_RANGE = 0x100000000;
const PASSWORD_CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_=+";

const passwordField = document.getElementById("password-field");
const generateButton = document.getElementById("generate-button");
const statusMessage = document.getElementById("status-message");

function getRandomInt(max) {
    const limit = Math.floor(RANDOM_RANGE / max) * max;
    const bucket = new Uint32Array(1);
    let value;

    do {
        crypto.getRandomValues(bucket);
        value = bucket[0];
    } while (value >= limit);

    return value % max;
}

function generatePassword() {
    const length =
        MIN_PASSWORD_LENGTH + getRandomInt(MAX_PASSWORD_LENGTH - MIN_PASSWORD_LENGTH + 1);
    let password = "";

    for (let index = 0; index < length; index += 1) {
        password += PASSWORD_CHARACTERS[getRandomInt(PASSWORD_CHARACTERS.length)];
    }

    passwordField.value = password;
    statusMessage.textContent = "¡Contraseña generada con éxito!";
}

generateButton.addEventListener("click", generatePassword);

generatePassword();
