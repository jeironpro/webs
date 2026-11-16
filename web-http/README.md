# Cliente HTTP

Relay es un playground HTTP que se ejecuta por completo en el navegador. Sirve para lanzar peticiones contra las APIs del catálogo —**api-biblia** y **api-pokemon**— o contra cualquier endpoint, sin cuentas, backend ni registro de lo enviado.

## Qué incluye

- Métodos `GET`, `POST`, `PUT`, `PATCH`, `DELETE` y `HEAD`.
- URL libre con normalización: añade `http://` a hosts locales y `https://` al resto.
- Editor de cabeceras por filas y cuerpo en bruto con formateo de JSON.
- Presets para `/biblias`, `/capitulos/1/versiculos`, `/pokemones` y `/pokemones/1`.
- Respuesta con código, tiempo, tamaño, cabeceras y cuerpo JSON embellecido.
- Copia del cuerpo de la respuesta y envío con `Ctrl + Enter` o `Cmd + Enter`.
- Límite de espera de 20 segundos y mensajes específicos para errores de red o CORS.
- Estado vacío con instrucciones y una demo pública que no requiere arrancar nada.

## Cómo probar las APIs del catálogo

Las APIs de `web-apis/catalog/` no tienen despliegue público: se ejecutan en local. Para que el navegador no bloquee la petición por CORS, sirve esta web en el origen que las APIs permiten (`127.0.0.1:5500` o `127.0.0.1:5173`).

```sh
# Terminal 1: una API del catálogo
cd web-apis/catalog/api-biblia
uvicorn main:app --reload

# Terminal 2: esta web
python3 -m http.server 5500 --bind 127.0.0.1
# → http://127.0.0.1:5500/web-http/
```

Cada API puede usar su propio puerto si ajustas la URL en el cliente. `api-pokemon` protege sus endpoints con `X-API-Key`: el preset ya incluye la fila, solo hay que escribir el valor en **Cabeceras**. `api-biblia` no pide autenticación.

El preset **Demo · JSONPlaceholder** apunta a una API pública con CORS abierto y permite comprobar el cliente sin instalar nada.

## Comportamiento

- Las filas de cabecera con nombre o valor vacío se ignoran.
- `GET` y `HEAD` no envían cuerpo.
- El cuerpo se manda tal cual; añade `Content-Type` si la API lo exige.
- Los errores de CORS no exponen el cuerpo de la respuesta al navegador; el cliente lo explica en el panel.
- Las cabeceras y los cuerpos no se guardan en `localStorage`, `sessionStorage` ni en la URL.

## Estructura

```text
web-http/
├── assets/icons/favicon.svg
├── css/style.css
├── index.html
└── js/
    ├── app.js
    └── modules/
        ├── http.js
        └── presets.js
```

La lógica pura de cabeceras, URL, JSON y métricas vive en `js/modules/http.js`; los presets en `js/modules/presets.js`. Ambos están cubiertos por `tests/web-http/http.test.js`.

## Dirección visual

**Relay**: consola de señal partida en solicitud y respuesta, sobre grafito con retícula tenue, menta para la respuesta y violeta para la solicitud. Space Grotesk + Fira Code; bordes rectos, métricas monoespaciadas y una línea de escaneo mientras se espera. Sin hero ni tarjetas redondeadas.

## Accesibilidad

Las pestañas usan `role="tab"` y responden a flechas, `Home` y `End`; los campos tienen etiqueta, el foco es visible y los estados se anuncian con `aria-live`. Los controles deshabilitados reflejan cuándo no hay respuesta o el método no admite cuerpo. El panel de respuesta se puede recorrer con teclado.

## Comprobaciones

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-http
npx eslint web-http
npx prettier --check web-http
```
