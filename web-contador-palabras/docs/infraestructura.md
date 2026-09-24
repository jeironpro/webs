# Infraestructura

## Hosting

El proyecto es una **página estática** (HTML, CSS y JS Vanilla). No requiere backend, base de datos ni build step, por lo que se desplega tal cual en cualquier hosting estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages, un servidor Nginx, etc.).

## Ejecución local

Requiere servirse por HTTP porque usa ES Modules (no funciona con `file://`):

```bash
python3 -m http.server
# o
npx serve
```

## Dependencias

No hay dependencias en runtime ni gestor de paquetes. Todo el código se ejecuta en el navegador.

## Recursos externos

- **Fuentes**: Google Fonts se cargan mediante `<link>` (Newsreader, Source Serif 4 y JetBrains Mono). Si no se dispone de red, se usan las familias de respaldo (`serif`, `monospace`).

## Características

- Sin sesiones, cuentas ni cookies.
- Sin llamadas de red: el texto del usuario permanece en su dispositivo.
- Compatible con navegadores modernos (ES Modules, `FileReader`, `clipboard`, `prefers-reduced-motion`).