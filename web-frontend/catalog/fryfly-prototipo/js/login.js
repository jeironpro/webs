const emailInput = document.getElementById("correoElectronico");
const passwordInput = document.getElementById("contrasena");
const togglePasswordButton = document.getElementById("toggle-password");
const loginButton = document.getElementById("login-button");
const openRecoveryLink = document.getElementById("open-recovery");
const closeRecoveryButton = document.getElementById("close-recovery");
const recoveryButton = document.getElementById("recover-button");
const recoveryModal = document.getElementById("modalOlvCon");
const recoveryOverlay = document.getElementById("modalOlvConOverlay");
const passwordIcon = document.getElementById("icono-mostrar-ocultar");

const togglePassword = () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    passwordIcon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
};

const openRecovery = (event) => {
    event.preventDefault();
    recoveryModal.classList.add("is-visible");
    recoveryOverlay.classList.add("is-visible");
};

const closeRecovery = () => {
    recoveryModal.classList.remove("is-visible");
    recoveryOverlay.classList.remove("is-visible");
};

const login = () => {
    if (emailInput.value === "admin@admin.com" && passwordInput.value === "admin") {
        localStorage.setItem("sessionActive", "true");
        window.location.href = "inicio.html";
    } else {
        alert("El correo electronico o la contrasena son incorrectos");
    }
};

const goToRecovery = () => {
    window.location.href = "recuperarcontrasena.html";
};

togglePasswordButton.addEventListener("click", togglePassword);
loginButton.addEventListener("click", login);
openRecoveryLink.addEventListener("click", openRecovery);
closeRecoveryButton.addEventListener("click", closeRecovery);
recoveryButton.addEventListener("click", goToRecovery);
recoveryOverlay.addEventListener("click", closeRecovery);
