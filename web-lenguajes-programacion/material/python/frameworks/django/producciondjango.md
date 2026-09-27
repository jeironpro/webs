# Producción con Django

**Despliegue en producción con Django**
Preparar una aplicación Django para un entorno de producción implica varios pasos importantes para garantizar seguridad, rendimiento y escalabilidad.

- **1.** Configuración básica para producción
  Asegúrate de revisar los siguientes puntos en settings.py:
- DEBUG: debe ser False en producción.
- ALLOWED_HOSTS: lista de dominios o direcciones IP permitidas.

```python
        ALLOWED_HOSTS = ['tu-dominio.com', 'www.tu-dominio.com']
```

- SECRET_KEY: usa una clave secreta segura y no la compartas.

- **2.** Configurar servidor WSGI
  En producción, Django no utiliza su servidor de desarrollo. Usa WSGI con un servidor como Gunicorn o uWSGI.
- Instala Gunicorn:

```python
        pip install gunicorn
```

- Ejecuta el servidor:

```python
        gunicorn mi_proyecto.wsgi:application --bind 0.0.0.0:8000
```

- **3.** Configuración de servidor web
  Es común usar un servidor web como Nginx para gestionar solicitudes.
Ejemplo básico de configuración para Nginx:
Archivo /etc/nginx/sites-available/mi_proyecto:

```text
    server {
        server_name tu-dominio.com www.tu-dominio.com;

        location = /favicon.ico { access_log off; log_not_found off; }
        location /static/ {
            root /ruta/a/tu/proyecto/;
        }

        location / {
            proxy_pass http://127.0.0.1:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
```

**Habilita el archivo**

```text
    sudo ln -s /etc/nginx/sites-available/mi_proyecto /etc/nginx/sites-enabled
    sudo systemctl restart nginx
```

- **4.** Migrar la base de datos
  Ejecuta las migraciones para asegurarte de que la base de datos esté actualizada:

```python
    python manage.py migrate
```

- **5.** Servir archivos estáticos
  Recopila archivos estáticos para que el servidor los pueda servir:

```python
    python manage.py collectstatic
```

- **6.** Configuración de certificados SSL
  Usa Certbot para habilitar HTTPS con certificados gratiutos de Let's Encrypt:

```text
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx
```

- **7.** Monitoreo y logs
  Configura registros para supervisar tu aplicación en producción:
- Configura LOGGIN en settings.py para guardar errores en archivos.
- Usa herramientas como supervisord para gestionar procesos.
