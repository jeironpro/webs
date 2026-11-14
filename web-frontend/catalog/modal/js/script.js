const modal = document.getElementById("modal");
const overlay = document.getElementById("modal-overlay");
const openButton = document.getElementById("open-modal");
const closeButton = document.getElementById("close-modal");

const openModal = () => {
    modal.classList.add("is-open");
    overlay.classList.add("is-open");
};

const closeModal = () => {
    modal.classList.remove("is-open");
    overlay.classList.remove("is-open");
};

openButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});
