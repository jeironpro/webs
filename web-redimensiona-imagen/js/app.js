const dropZone = document.getElementById("drop-zone");
const preview = document.getElementById("preview");

function loadImage(file) {
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

dropZone.addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        loadImage(file);
        document.body.removeChild(fileInput);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
});

// Soporte para Arrastrar y Soltar (Drag and Drop)
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    loadImage(file);
});

document.getElementById("download-button").addEventListener("click", function () {
    const image = document.getElementById("preview");

    // Validación para evitar el error de "broken state"
    if (!image.src || image.src === window.location.href || image.naturalWidth === 0) {
        alert("Por favor, selecciona una imagen válida antes de descargar.");
        return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const maxWidth = parseInt(document.getElementById("width").value) || image.naturalWidth;
    const maxHeight = parseInt(document.getElementById("height").value) || image.naturalHeight;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    context.drawImage(image, 0, 0, width, height);

    const link = document.createElement("a");
    link.download = "imagen_redimensionada.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
