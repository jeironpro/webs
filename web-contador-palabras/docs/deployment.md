# Despliegue

## Página estática

El proyecto es 100 % estático; no hay build step. Se despliegan los archivos del repositorio tal cual.

## GitHub Pages

1. En el repositorio, ve a *Settings → Pages*.
2. En *Source*, elige **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta raíz (`/`).
4. Guarda. La página estará disponible en `https://<usuario>.github.io/web-contador-palabras/`.

El sitio usa ES Modules y Google Fonts; ambos funcionan sobre GitHub Pages sin configuración adicional.

## Otros hosts

- **Netlify / Vercel / Cloudflare Pages**: importa el repositorio, sin comando de build y directorio raíz `/`.
- **Nginx / Apache**: copia los archivos al directorio servido (o usa GitHub Pages como CDN).

## Verificación post-despliegue

- Carga la página en una pestaña en modo incógnito.
- Escribe texto y comprueba que las tres métricas se actualizan.
- Comprueba que no hay error en consola.
- Probar responsividad a 320 / 375 / 414 / 768 px (sin scroll horizontal).