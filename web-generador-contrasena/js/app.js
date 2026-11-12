"use strict";

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 16;
const PASSWORD_CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_=+";

const passwordField = document.getElementById("password-field");
const generateButton = document.getElementById("generate-button");
const statusMessage = document.getElementById("status-message");

/**
 * Returns an unbiased integer in the range [0, max).
 * Values above the last complete bucket are discarded to avoid modulo bias.
 */
function getRandomInt(max) {
    const limit = Math.floor(0x100000000 / max) * max;
    const bucket = new Uint32Array(1);
    let value;

    do {
        crypto.getRandomValues(bucket);
        value = bucket[0];
    } while (value >= limit);

    return value % max;
}

/**
 * Generates a cryptographically secure password between 12 and 16 characters.
 */
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

// Generate an initial password as soon as the script loads.
generatePassword();
