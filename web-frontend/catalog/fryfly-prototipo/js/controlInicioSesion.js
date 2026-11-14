document.addEventListener("DOMContentLoaded", () => {
    const sessionActive = localStorage.getItem("sessionActive");
    const items = document.getElementById("items");
    const loginLink = document.getElementById("loguearse");
    const ordersPage = document.getElementById("pagina-pedidos");

    if (sessionActive === "true") {
        items.style.display = "flex";
        loginLink.style.display = "none";
        ordersPage.style.display = "flex";
    } else {
        items.style.display = "none";
        loginLink.style.display = "block";
        ordersPage.style.display = "none";
    }

    document.querySelectorAll(".logout-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            logout();
        });
    });

    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });
});

function logout() {
    localStorage.removeItem("sessionActive");
    window.location.href = "login.html";
}
