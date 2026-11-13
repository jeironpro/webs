const fileInput = document.querySelector("#file-input");
const dropZone = document.querySelector("#drop-zone");
const preview = document.querySelector("#preview");
const widthInput = document.querySelector("#width");
const heightInput = document.querySelector("#height");
const downloadButton = document.querySelector("#download-button");
const status = document.querySelector("#status");

const setStatus = (message) => {
    status.textContent = message;
};

const loadImage = (file) => {
    if (!file) {
        return;
    }
    if (!file.type.startsWith("image/")) {
        setStatus("El archivo seleccionado no es una imagen válida.");
        return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") {
            setStatus("No se pudo leer la imagen seleccionada.");
            return;
        }
        preview.src = reader.result;
        preview.classList.remove("is-hidden");
        widthInput.value = "";
        heightInput.value = "";
        setStatus("");
    });
    reader.addEventListener("error", () => {
        setStatus("No se pudo leer la imagen seleccionada.");
    });
    reader.readAsDataURL(file);
};

fileInput.addEventListener("change", (event) => {
    loadImage(event.target.files[0]);
    fileInput.value = "";
});

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-dragover");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragover");
    loadImage(event.dataTransfer.files[0]);
});

downloadButton.addEventListener("click", () => {
    const naturalWidth = preview.naturalWidth;
    const naturalHeight = preview.naturalHeight;

    if (!preview.getAttribute("src") || naturalWidth === 0 || naturalHeight === 0) {
        setStatus("Selecciona una imagen válida antes de descargar.");
        fileInput.focus();
        return;
    }

    const requestedWidth = Number.parseInt(widthInput.value, 10);
    const requestedHeight = Number.parseInt(heightInput.value, 10);
    const maxWidth = requestedWidth > 0 ? requestedWidth : naturalWidth;
    const maxHeight = requestedHeight > 0 ? requestedHeight : naturalHeight;
    const scale = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        setStatus("El navegador no pudo procesar la imagen.");
        return;
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(preview, 0, 0, width, height);

    const link = document.createElement("a");
    link.download = "imagen-redimensionada.png";
    link.href = canvas.toDataURL("image/png");
    document.body.append(link);
    link.click();
    link.remove();
    setStatus("");
});
