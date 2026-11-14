const recoveryPasswordInput = document.getElementById("contrasena");
const recoveryConfirmInput = document.getElementById("contrasena_");
const toggleRecoveryPasswordButton = document.getElementById("toggle-password");
const toggleRecoveryConfirmButton = document.getElementById("toggle-confirm-password");
const changePasswordButton = document.getElementById("change-password");
const recoveryPasswordIcon = document.getElementById("icono-mostrar-ocultar");
const recoveryConfirmIcon = document.getElementById("icono-mostrar-ocultar_");
const minimumRule = document.getElementById("minimo");
const uppercaseRule = document.getElementById("mayuscula");
const specialRule = document.getElementById("especial");
const numberRule = document.getElementById("numero");

const togglePassword = (input, icon) => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
};

const validatePassword = () => {
    const value = recoveryPasswordInput.value;
    minimumRule.classList.toggle("is-valid", value.length >= 8);
    uppercaseRule.classList.toggle("is-valid", /[A-Z]/.test(value));
    specialRule.classList.toggle("is-valid", /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value));
    numberRule.classList.toggle("is-valid", /\d/.test(value));
};

const changePassword = () => {
    window.location.href = "login.html";
};

toggleRecoveryPasswordButton.addEventListener("click", () => {
    togglePassword(recoveryPasswordInput, recoveryPasswordIcon);
});
toggleRecoveryConfirmButton.addEventListener("click", () => {
    togglePassword(recoveryConfirmInput, recoveryConfirmIcon);
});
recoveryPasswordInput.addEventListener("input", validatePassword);
changePasswordButton.addEventListener("click", changePassword);
