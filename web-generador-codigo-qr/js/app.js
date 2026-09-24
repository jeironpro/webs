document.getElementById('boton-generar').addEventListener('click', function() {
    let url = document.getElementById('entrada-url').value;
    let contenedorQr = document.getElementById('contenedor-codigo-qr');

    // Limpiar contenido previo
    while (contenedorQr.firstChild) {
        contenedorQr.removeChild(contenedorQr.firstChild);
    }

    if (url !== '') {
        // Usamos una API para generar QRs
        let qrUrl = 'https://api.qrcode-monkey.com/qr/custom?size=250&data=' + encodeURIComponent(url);
        
        let img = document.createElement('img');
        img.src = qrUrl;
        img.alt = 'Código QR Generado';
        contenedorQr.appendChild(img);
    } else {
        let mensajeError = document.createElement('p');
        mensajeError.className = 'mensaje-error';
        mensajeError.textContent = 'Por favor, introduce una URL válida';
        contenedorQr.appendChild(mensajeError);
    }
});