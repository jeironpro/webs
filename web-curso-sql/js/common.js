document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = new Date().getFullYear();
});
