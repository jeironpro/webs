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
- JavaScript ES6+ (módulos ES, servido por HTTP)
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
├── style-guide.md
└── README.md
```

## Uso

Sirve la carpeta con cualquier servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre `http://localhost:8000`. Al usar módulos ES, abrir `index.html` directamente desde el sistema de archivos puede fallar en algunos navegadores. En GitHub Pages funciona directamente.

## Licencia

MIT
