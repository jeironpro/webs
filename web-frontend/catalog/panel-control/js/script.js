function toggleSubmenu(index) {
    const items = document.querySelectorAll(".si-submenu");

    items.forEach((item, itemIndex) => {
        const icon = item.querySelector(".icono i");
        const submenu = item.querySelector(".submenu");
        if (itemIndex === index) {
            if (item.classList.contains("activo")) {
                item.classList.remove("activo");
                submenu.style.display = "none";
                icon.classList.remove("fa-chevron-down");
                icon.classList.add("fa-chevron-right");
            } else {
                item.classList.add("activo");
                submenu.style.display = "block";
                icon.classList.remove("fa-chevron-right");
                icon.classList.add("fa-chevron-down");
            }
        } else {
            item.classList.remove("activo");
            submenu.style.display = "none";
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-right");
        }
    });
}

document.querySelectorAll("[data-menu-index]").forEach((item) => {
    item.addEventListener("click", () => toggleSubmenu(Number(item.dataset.menuIndex)));
});

document.getElementById("menu-burger").addEventListener("click", () => {
    const navigationMenu = document.getElementById("menu-navegacion");
    const burgerMenu = document.getElementById("menu-burger");
    const icon = burgerMenu.querySelector(".menu-burger i");
    const barTitle = document.getElementById("titulo-bar");
    const barLogo = document.getElementById("logo-bar");
    const header = document.querySelector("header");

    if (navigationMenu.style.display === "none") {
        navigationMenu.style.display = "block";
        header.style.width = "";
        header.style.height = "";
        burgerMenu.style.left = "";
        burgerMenu.style.padding = "";
        burgerMenu.style.position = "";
        burgerMenu.style.width = "";
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-x");
        barLogo.style.display = "none";
        barTitle.style.display = "none";
    } else {
        navigationMenu.style.display = "none";
        header.style.width = "64rem";
        header.style.height = "fit-content";
        burgerMenu.style.boxSizing = "border-box";
        burgerMenu.style.left = "0";
        burgerMenu.style.marginLeft = "0.625rem";
        burgerMenu.style.padding = "0.625rem 0";
        burgerMenu.style.position = "relative";
        burgerMenu.style.width = "64rem";
        icon.classList.remove("fa-x");
        icon.classList.add("fa-bars");
        barLogo.style.display = "block";
        barTitle.style.display = "block";
    }
});
