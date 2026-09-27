# Despliegue

## Despliegue en GitHub Pages

Este repositorio puede publicarse en GitHub Pages sin configuración adicional, ya que el sitio es estático y usa rutas relativas.

### Paso 1 · Publicar desde la rama `main`

1. Ve a **Settings → Pages** del repositorio en GitHub.
2. En **Build and deployment**, en *Source* selecciona **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/ (root)`.
4. Pulsa **Save**.

El sitio quedará disponible en `https://<usuario>.github.io/juego-adivina-numero/` tras el primer build (unos minutos).

### Paso 2 · Verificar

- El juego debe funcionar completo por HTTP (los ES Modules requieren servidor; GitHub Pages los sirve correctamente).
- Probar en los anchos 320, 375, 414 y 768 px.

## Ejecutar el proyecto en local

El doble clic sobre `index.html` no funciona porque los ES Modules necesitan un servidor HTTP. Usar uno de estos:

```bash
# Python 3
python3 -m http.server 8090

# Node (sin instalar nada)
npx serve .

# PHP
php -S localhost:8090
```

Abrir luego `http://localhost:8090`.

## Notas técnicas

- **ES Modules**: requieren `Content-Type: text/javascript`, que todos los servidores estáticos modernos envían por defecto.
- **`oklch()`**: se necesita un navegador de 2023 o posterior para los colores exactos; el resto de funcionalidad es independiente del color.
- **Google Fonts**: las tipografías se cargan desde la CDN; si no estuvieran disponibles, se usan fuentes de respaldo del sistema.
- No hay build step ni variables de entorno: el despliegue es una simple copia de archivos.

## Alternativas

- **Netlify Drop**: arrastrar la carpeta del proyecto a https://app.netlify.com/drop.
- **Vercel**: `npx vercel` desde la raíz del proyecto.
- **Cloudflare Pages**: *Direct Upload* de la carpeta del proyecto.
