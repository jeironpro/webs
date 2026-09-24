# Generador de Clave Secreta

Genera claves criptograficamente seguras con opciones personalizables. Diseno inspirado en tarjetas fisicas premium, con acabados dorados y estetica clasica de boveda.

## Caracteristicas

- **Longitud**: de 8 a 128 caracteres
- **Tipos**: mayusculas, minusculas, numeros y simbolos
- **Excluir ambiguos**: evita caracteres confundibles (O0Il1)
- **Auto-copia**: copia al portapapeles al generar
- **Fortaleza**: indicador visual con bits de entropia
- **Seguridad**: usa `crypto.getRandomValues()` con rejection sampling
- **100% local**: sin servidores, sin tracking, sin conexion necesaria

## Stack

- HTML5 semantico
- CSS3 (custom properties, Flexbox, Grid)
- JavaScript ES6+ (IIFE, compatible con `file://`)
- Google Fonts (Inter + JetBrains Mono)
- Material Symbols

## Estructura

```
├── index.html
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── components.css
│   └── style.css
├── js/
│   └── app.js
├── libro-de-estilos.md
└── README.md
```

## Uso

Abre `index.html` en cualquier navegador moderno. Funciona directamente desde el sistema de archivos y en GitHub Pages.

## Licencia

MIT
