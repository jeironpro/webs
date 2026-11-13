# La Papeleta

Aplicación web de votación por partidos. Cualquier persona vota por uno de los partidos inscritos y el partido con más votos encabeza el escrutinio.

La papeleta ocupa el viewport: las filas de partidos, sus barras de porcentaje y el recuento llenan la zona principal, mientras el padrón permite inscribir, retirar y recolorear partidos.

## Características

- Un voto por persona, modificable: al cambiar de partido se descuenta el anterior.
- El partido en cabeza se señala en la papeleta y en la mesa de escrutinio.
- Persistencia local con `localStorage`, sin servidores ni cuentas.
- Padrón lateral convertido en cajón accesible en móvil, con foco controlado y cierre con Escape.
- Paleta de campaña con diez colores y selector de color libre.
- Diseño editorial responsive con Fraunces, Source Serif 4 e IBM Plex Mono.

## Stack

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- `localStorage` para el estado.
- ESLint + Prettier.

## Uso

El proyecto no tiene dependencias de ejecución. Sirve la carpeta con un servidor estático para que funcionen los módulos ES:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`. Inscribe un partido desde el padrón, elige su color y pulsa «Inscribir partido». Después vota desde la papeleta.

## Estructura

```text
web-votacion/
├── index.html
├── css/
│   ├── tokens.css
│   ├── style.css
│   ├── layout/
│   │   └── app.css
│   └── components/
│       ├── ballot.css
│       ├── buttons.css
│       ├── forms.css
│       ├── sidebar.css
│       └── toast.css
├── js/
│   ├── app.js
│   ├── modules/
│   │   ├── parties.js
│   │   ├── render.js
│   │   └── votes.js
│   ├── services/
│   │   └── storage.js
│   └── utils/
│       ├── dom.js
│       ├── id.js
│       └── toast.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
