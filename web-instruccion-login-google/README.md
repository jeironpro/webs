# web-instruccion-login-google

Web estática que **instruye paso a paso a cualquier programador** para implementar
el login con Google (OAuth 2.0 · flujo Authorization Code) en una aplicación Flask.

Cada fase de la guía corresponde a un archivo real del proyecto de referencia, que
viaja junto a la web en `codigo/` para consultarlo o descargarlo desde la propia página.

## Estructura

```
web-instruccion-login-google/
├── index.html          # la guía (7 fases + flujo del protocolo + errores comunes)
├── css/styles.css      # estilos (tema Cobalt: tokens OKLCH, hairlines, código como héroe)
├── js/main.js          # revelado al hacer scroll (IntersectionObserver)
├── img/google.png      # icono
└── codigo/             # implementación Flask de referencia
    ├── app.py          # rutas y flujo OAuth (/login, /login/callback, /logout)
    ├── config.py       # configuración por variables de entorno
    ├── db.py           # conexión SQLite por contexto de petición
    ├── user.py         # modelo de usuario (get/create por google_id)
    ├── schema.sql      # esquema de la tabla user
    ├── requirements.txt
    ├── templates/index.html
    └── static/
```

## Las siete fases de la guía

1. **1.0 Credenciales** — crear el ID de cliente OAuth 2.0 en Google Cloud.
2. **2.0 Configuración** — centralizar variables de entorno en `config.py`.
3. **3.0 Redirección** — `/login` construye la URL de autorización.
4. **4.0 Callback** — `/login/callback` canjea el `code` por un token.
5. **5.0 Perfil** — `userinfo` + verificación de `email_verified`.
6. **6.0 Persistencia** — alta del usuario en SQLite con `sub` como clave.
7. **7.0 Sesión** — Flask-Login: `login_user`, `@login_required` y logout.

## Servir

Es HTML/CSS/JS plano — cualquier servidor estático sirve la carpeta:

```bash
python3 -m http.server 8080
# http://127.0.0.1:8080
```

Para probar la implementación Flask de `codigo/`, sigue su `README.md` original
(archivos `.env` con `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`).

## Licencia

MIT.
