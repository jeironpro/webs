# api-correo-smtp-flask

## 📌 Descripción

Este proyecto forma parte de mi portafolio personal.  
El objetivo es demostrar buenas prácticas de programación, organización y documentación en GitHub.

## 🛠️ Uso

Clonar el repositorio:

```bash
git clone https://github.com/jeironpro/api-correo-smtp-flask.git
cd api-correo-smtp-flask
```

Crear y activar entorno virtual:
```bash
python -m venv venv


source venv/bin/activate (Linux)
.\env\Scripts\activate (Windows)
```

Instalar las dependencias:

```bash
pip install -r requirements.txt
```

Crear el archivo .env en la raiz del proyecto con las siguientes variables:

```bash
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_SENDER=tu_email_envio@gmail.com
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_USE_TLS=True
MAIL_USE_SSL=False
```

Iniciar el servidor de desarrollo de Flask:

```bash
python app.py
```

Usar curl para probar la API:

```bash
curl -X POST http://localhost:5000/enviar_correo -H "Content-Type: application/json" -d '{"subject": "Asunto del correo", "to": "destinatario@gmail.com", "message": "Cuerpo del correo"}'
```

```bash
curl -X POST http://localhost:5000/enviar_correo_html -H "Content-Type: application/json" -d '{"subject": "Asunto del correo", "to": "destinatario@gmail.com"}'
```

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
