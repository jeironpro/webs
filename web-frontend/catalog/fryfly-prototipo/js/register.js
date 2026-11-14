const phoneInput = document.getElementById("telefono");
const registerPasswordInput = document.getElementById("contrasena");
const confirmPasswordInput = document.getElementById("contrasena_");
const toggleRegisterPasswordButton = document.getElementById("toggle-password");
const toggleConfirmPasswordButton = document.getElementById("toggle-confirm-password");
const registerButton = document.getElementById("register-button");
const notificationContainer = document.getElementById("contenedorNotificacion");
const notification = document.getElementById("notificacion");
const notificationTitle = document.getElementById("titulo-notificacion");
const notificationContent = document.getElementById("contenido-notificacion");
const registerPasswordIcon = document.getElementById("icono-mostrar-ocultar");
const confirmPasswordIcon = document.getElementById("icono-mostrar-ocultar_");

const togglePassword = (input, icon) => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
};

const formatPhone = () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");

    if (phoneInput.value.length > 3) {
        phoneInput.value = phoneInput.value.slice(0, 3) + "-" + phoneInput.value.slice(3);
    }

    if (phoneInput.value.length > 7) {
        phoneInput.value = phoneInput.value.slice(0, 7) + "-" + phoneInput.value.slice(7);
    }
};

const registerUser = () => {
    if (registerPasswordInput.value !== confirmPasswordInput.value) {
        notificationTitle.textContent = "Error!";
        notification.classList.add("is-error");
        notificationContent.textContent = "Las contraseñas no coinciden.";
    }

    notificationContainer.classList.add("mostrar");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2500);
};

toggleRegisterPasswordButton.addEventListener("click", () => {
    togglePassword(registerPasswordInput, registerPasswordIcon);
});
toggleConfirmPasswordButton.addEventListener("click", () => {
    togglePassword(confirmPasswordInput, confirmPasswordIcon);
});
phoneInput.addEventListener("input", formatPhone);
registerButton.addEventListener("click", registerUser);
