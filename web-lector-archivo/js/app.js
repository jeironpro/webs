"use strict";

const filePicker = document.getElementById("file-picker");
const fileTitle = document.getElementById("file-title");
const fileInput = document.getElementById("file-input");
const fileContent = document.getElementById("file-content");
const resetButton = document.getElementById("reset-button");

const READ_ERROR_MESSAGE = "No se pudo leer el archivo.";

function showReadError() {
    fileContent.textContent = READ_ERROR_MESSAGE;
    fileContent.style.display = "block";
    fileTitle.textContent = "";
    filePicker.style.display = "none";
}

fileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const reader = new FileReader();

    reader.addEventListener("load", (loadEvent) => {
        fileContent.textContent = loadEvent.target.result;
        fileContent.style.display = "block";
        fileTitle.textContent = selectedFile.name;
        filePicker.style.display = "none";
    });

    reader.addEventListener("error", showReadError);

    reader.readAsText(selectedFile);
});

resetButton.addEventListener("click", () => {
    fileContent.textContent = "";
    fileContent.style.display = "none";
    filePicker.style.display = "flex";
    fileTitle.textContent = "";
    fileInput.value = "";
});

function renderCurrentYear() {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });
}

renderCurrentYear();
