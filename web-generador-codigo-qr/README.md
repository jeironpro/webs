# web-generador-codigo-qr

Generador de códigos QR a partir de una URL, mediante la API pública de QRcode Monkey.

## Características

- Campo de texto para introducir la URL que se quiere codificar.
- Generación del QR llamando a la API de QRcode Monkey (`api.qrcode-monkey.com`) con el tamaño por defecto.
- Inserción de la imagen del código generado en la propia página.
- Validación de entrada con mensaje de error si el campo esta vacío.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+).
- API externa: QRcode Monkey para generar los códigos QR.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local.
3. Introduce la URL y pulsa el botón para generar el código QR.

## Estructura del proyecto

```
web-generador-codigo-qr/
├── index.html
├── css/                   # estilos del generador
├── js/                    # lógica de generación
└── icon/                  # favicon
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
