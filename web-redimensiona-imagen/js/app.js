const zonaCarga = document.getElementById('zona-carga');
const previsualizacion = document.getElementById('previsualizacion');

function cargarImagen(archivo) {
    if (archivo && archivo.type.startsWith('image/')) {
        const lector = new FileReader();
        lector.onload = function (e) {
            previsualizacion.src = e.target.result;
            previsualizacion.style.display = 'block';
        }
        lector.readAsDataURL(archivo);
    }
}

zonaCarga.addEventListener('click', function () {
    const selectorArchivos = document.createElement('input');
    selectorArchivos.type = 'file';
    selectorArchivos.accept = 'image/*';
    selectorArchivos.style.display = 'none';

    selectorArchivos.addEventListener('change', function () {
        const archivo = selectorArchivos.files[0];
        cargarImagen(archivo);
        document.body.removeChild(selectorArchivos);
    });

    document.body.appendChild(selectorArchivos);
    selectorArchivos.click();
});

// Soporte para Arrastrar y Soltar (Drag and Drop)
zonaCarga.addEventListener('dragover', (e) => {
    e.preventDefault();
    zonaCarga.classList.add('dragover');
});

zonaCarga.addEventListener('dragleave', () => {
    zonaCarga.classList.remove('dragover');
});

zonaCarga.addEventListener('drop', (e) => {
    e.preventDefault();
    zonaCarga.classList.remove('dragover');
    const archivo = e.dataTransfer.files[0];
    cargarImagen(archivo);
});

document.getElementById('boton-descargar').addEventListener('click', function () {
    const imagen = document.getElementById('previsualizacion');

    // Validación para evitar el error de "broken state"
    if (!imagen.src || imagen.src === window.location.href || imagen.naturalWidth === 0) {
        alert('Por favor, selecciona una imagen válida antes de descargar.');
        return;
    }

    const lienzo = document.createElement('canvas');
    const contexto = lienzo.getContext('2d');
    const anchoMaximo = parseInt(document.getElementById('ancho').value) || imagen.naturalWidth;
    const largoMaximo = parseInt(document.getElementById('largo').value) || imagen.naturalHeight;

    let ancho = imagen.naturalWidth;
    let largo = imagen.naturalHeight;

    if (ancho > largo) {
        if (ancho > anchoMaximo) {
            largo *= anchoMaximo / ancho;
            ancho = anchoMaximo;
        }
    } else {
        if (largo > largoMaximo) {
            ancho *= largoMaximo / largo;
            largo = largoMaximo;
        }
    }

    lienzo.width = ancho;
    lienzo.height = largo;

    contexto.drawImage(imagen, 0, 0, ancho, largo);

    const enlace = document.createElement('a');
    enlace.download = 'imagen_redimensionada.png';
    enlace.href = lienzo.toDataURL('image/png');
    enlace.click();
});