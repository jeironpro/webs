# Contador de palabras

Aplicación web que cuenta **palabras, caracteres y caracteres sin espacios** en el texto que escribes, pegas o subes desde un archivo. Las métricas se actualizan mientras escribes.

## Características

- Conteo de palabras, caracteres y caracteres sin espacios.
- Entrada manual, texto de ejemplo y carga de archivos de texto plano.
- Zona de arrastrar y soltar, o selector de archivos.
- Botones para copiar el resumen y limpiar el área de texto.
- Todo se procesa en el navegador, sin enviar datos a ningún servidor.
- Interfaz responsive y accesible por teclado.

## Stack

- HTML5 semántico.
- CSS3 con custom properties, capas y diseño responsive.
- JavaScript como módulos ES nativos, sin dependencias de ejecución.

## Uso

Los módulos ES requieren servir el proyecto por HTTP, no abrir `index.html` con `file://`.

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-contador-palabras/`.

## Estructura

```
web-contador-palabras/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   ├── tokens.css
│   ├── components/
│   │   ├── textarea.css
│   │   ├── stats.css
│   │   └── dropzone.css
│   └── pages/
│       └── home.css
├── js/
│   ├── app.js
│   ├── modules/
│   │   ├── counter.js
│   │   └── uploader.js
│   └── utils/
│       └── dom.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
