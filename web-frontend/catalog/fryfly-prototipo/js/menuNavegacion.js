function toggleMenu() {
    const navigation = document.querySelector("nav ul");
    const items = document.getElementById("contenedor-items");
    const burgerIcon = document.getElementById("icono-burger");
    const main = document.querySelector("main");

    navigation.classList.toggle("active");
    items.classList.toggle("active");

    if (navigation.classList.contains("active")) {
        burgerIcon.classList.remove("fa-burger");
        burgerIcon.classList.add("fa-x");
        burgerIcon.style.fontSize = "1.1875rem";
        burgerIcon.style.marginTop = "0.3125rem";
        main.style.marginTop = "12.5rem";
    } else {
        burgerIcon.classList.remove("fa-x");
        burgerIcon.classList.add("fa-burger");
        burgerIcon.style.fontSize = "1.3125rem";
    }
}

const menuButton = document.getElementById("boton-menu");
if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
}
