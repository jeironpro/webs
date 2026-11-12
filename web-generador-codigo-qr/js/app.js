'use strict';

const QR_API_URL = 'https://api.qrcode-monkey.com/qr/custom';
const QR_SIZE = 250;

const qrForm = document.getElementById('qr-form');
const urlInput = document.getElementById('url-input');
const qrContainer = document.getElementById('qr-container');
const generateButton = document.getElementById('generate-button');

function setLoading(isLoading) {
    generateButton.disabled = isLoading;
    qrContainer.setAttribute('aria-busy', String(isLoading));
}

function showMessage(message, className) {
    const messageElement = document.createElement('p');

    messageElement.className = className;
    messageElement.textContent = message;
    qrContainer.replaceChildren(messageElement);
}

function generateQrCode(url) {
    const qrUrl = `${QR_API_URL}?size=${QR_SIZE}&data=${encodeURIComponent(url)}`;
    const image = document.createElement('img');

    image.alt = 'Código QR generado';
    setLoading(true);
    showMessage('Generando código QR...', 'empty-message');

    image.addEventListener('load', () => {
        qrContainer.replaceChildren(image);
        setLoading(false);
    });

    image.addEventListener('error', () => {
        showMessage('No se pudo generar el código QR. Inténtalo de nuevo.', 'error-message');
        setLoading(false);
    });

    image.src = qrUrl;
}

qrForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();

    if (url === '') {
        showMessage('Introduce una URL para generar el código QR.', 'error-message');
        urlInput.focus();
        return;
    }

    generateQrCode(url);
});
