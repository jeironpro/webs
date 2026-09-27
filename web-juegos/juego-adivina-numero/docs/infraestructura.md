# Infraestructura

## Tipo de proyecto

Sitio web estático de una sola página. No existe backend ni base de datos.

## Componentes en ejecución

| Componente | Descripción |
|---|---|
| Navegador del usuario | Ejecuta HTML, CSS y JS del proyecto |
| Servidor HTTP (estático) | Entrega los archivos al navegador |
| `localStorage` del navegador | Almacena el mejor récord (persistencia en el cliente) |

El juego no requiere servicios externos en tiempo de ejecución. La única dependencia externa es la carga de las tipografías Plus Jakarta Sans y JetBrains Mono desde **Google Fonts** (solo estética; si falla, se usan fuentes de respaldo del sistema).

## Requisitos de ejecución

- Un servidor HTTP que sirva archivos estáticos (por ejemplo `python3 -m http.server`, `npx serve`, Netlify, Vercel o GitHub Pages).
- Un navegador moderno con soporte de ES Modules, CSS custom properties, `oklch()` y `prefers-reduced-motion`.

> Nota: `oklch()` requiere un navegador de 2023 o posterior. Los navegadores que no lo soporten degradarán el color (el proyecto no define fallbacks de color, por lo que la experiencia visual óptima se obtiene en navegadores recientes).

## Consideraciones de despliegue

- **Ruta de recursos**: todos los enlaces de CSS y JS son relativos (`css/...`, `js/...`), por lo que el proyecto funciona tanto en la raíz como en una subcarpeta.
- **ES Modules**: como se usan `import`/`export`, el servidor debe responder `Content-Type: text/javascript` para los archivos `.js` (la mayoría de servidores estáticos lo hacen automáticamente).
- **HTTPS**: recomendable para un despliegue público; GitHub Pages y Netlify lo ofrecen de forma gratuita.
- **Caché**: al no haber build step, no hace falta pipeline de compilación antes de desplegar.

Ver [deployment.md](deployment.md) para el procedimiento de despliegue en GitHub Pages.