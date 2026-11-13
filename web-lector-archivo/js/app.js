const filePicker = document.getElementById("file-picker");
const fileTitle = document.getElementById("file-title");
const fileInput = document.getElementById("file-input");
const fileContent = document.getElementById("file-content");
const resetButton = document.getElementById("reset-button");

const READ_ERROR_MESSAGE = "No se pudo leer el archivo.";

function showFile(name, content) {
    fileContent.textContent = content;
    fileContent.hidden = false;
    fileTitle.textContent = name;
    fileTitle.hidden = false;
    filePicker.hidden = true;
}

function showReadError() {
    fileContent.textContent = READ_ERROR_MESSAGE;
    fileContent.hidden = false;
    fileTitle.textContent = "";
    fileTitle.hidden = true;
    filePicker.hidden = true;
}

function resetViewer() {
    fileContent.textContent = "";
    fileContent.hidden = true;
    fileTitle.textContent = "";
    fileTitle.hidden = true;
    filePicker.hidden = false;
    fileInput.value = "";
}

fileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.addEventListener("load", (loadEvent) => {
        showFile(selectedFile.name, loadEvent.target.result);
    });

    reader.addEventListener("error", showReadError);

    reader.readAsText(selectedFile);
});

resetButton.addEventListener("click", resetViewer);

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});
