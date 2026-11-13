const QR_API_URL = "https://api.qrcode-monkey.com/qr/custom";
const QR_SIZE = 250;

const qrForm = document.getElementById("qr-form");
const urlInput = document.getElementById("url-input");
const qrContainer = document.getElementById("qr-container");
const generateButton = document.getElementById("generate-button");

let isLoading = false;

function setLoading(value) {
    isLoading = value;
    generateButton.disabled = value;
    qrContainer.setAttribute("aria-busy", String(value));
}

function showMessage(message, type) {
    const messageElement = document.createElement("p");
    messageElement.className = `qr__${type}`;
    messageElement.textContent = message;
    qrContainer.replaceChildren(messageElement);
}

function generateQrCode(url) {
    const params = new URLSearchParams({
        size: String(QR_SIZE),
        data: url,
    });
    const image = document.createElement("img");

    image.className = "qr__image";
    image.alt = "Código QR generado";
    setLoading(true);
    showMessage("Generando código QR...", "empty");

    image.addEventListener("load", () => {
        qrContainer.replaceChildren(image);
        setLoading(false);
    });

    image.addEventListener("error", () => {
        showMessage("No se pudo generar el código QR. Inténtalo de nuevo.", "error");
        setLoading(false);
    });

    image.src = `${QR_API_URL}?${params.toString()}`;
}

qrForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isLoading) return;

    const url = urlInput.value.trim();
    if (url === "") {
        showMessage("Introduce una URL para generar el código QR.", "error");
        urlInput.focus();
        return;
    }

    generateQrCode(url);
});
