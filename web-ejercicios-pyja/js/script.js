window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 10);
});

document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
});
