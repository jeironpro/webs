# Hashes y contraseñas

**Bóveda** reúne dos herramientas locales: un generador de huellas **SHA-256 y MD5** y un **comprobador de fuerza de contraseñas** con entropía, avisos y tiempos de ataque estimados. Nada se envía a ningún servidor.

## Características

- SHA-256 y MD5 de cualquier texto UTF-8, calculados en el navegador y actualizados al escribir.
- Resultado en hexadecimal, contador de caracteres y bytes y copia al portapapeles.
- Aviso explícito de que MD5 solo sirve para integridad y no para seguridad.
- Análisis de contraseñas por longitud, clases de caracteres y entropía estimada.
- Penalizaciones por contraseñas comunes, palabras habituales, secuencias, repeticiones, años y poca variedad.
- Veredicto de fuerza, medidor de cinco niveles, clases presentes y consejos concretos.
- Tiempos medios de ruptura para tres escenarios: ataque en línea, servidor con KDF y GPU contra un hash rápido.
- Mostrar u ocultar la contraseña, limpiar el campo y ejemplos precargados.
- Sin cuentas, sin almacenamiento y sin consultas a servicios de filtraciones: la lista de contraseñas comunes es local.

## Stack

- HTML5 semántico.
- CSS3 con custom properties y diseño mobile-first.
- JavaScript como módulos ES nativos, sin dependencias de ejecución.
- Implementaciones propias de SHA-256 y MD5, probadas con vectores de referencia.
- Google Fonts (Familjen Grotesk y Spline Sans Mono).

## Uso

Los módulos ES requieren servir el proyecto por HTTP, no abrir `index.html` con `file://`.

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-hashes-contrasenas/`.

## Estructura

```
web-hashes-contrasenas/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── modules/
│       ├── hash.js
│       └── strength.js
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

- `js/modules/hash.js`: SHA-256, MD5 y `hashTexts`.
- `js/modules/strength.js`: `checkPassword`, entropía, penalizaciones y `estimateCrackTimes`.
- `tests/web-hashes-contrasenas/`: vectores de hash, análisis de fuerza y formato de tiempos.

## Accesibilidad

- Campos etiquetados, medidor con `role="meter"` y valor textual, estados de copia anunciados.
- Botón de mostrar/ocultar con `aria-pressed` y `aria-controls`.
- Foco visible adaptado al fondo claro y oscuro, enlace para saltar a las herramientas y contraste conforme al libro de estilo.
- `prefers-reduced-motion` desactiva las transiciones.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
