# Despliegue en producción

**Despliegue en Producción con Flask**
1. ¿Qué es un despliegue en producción?
EL despliegue en producción consiste en preparar y alojar tu aplicación en un servidor que permita a los usuarios acceder a ella de manera estable y segura. Incluye la configuración de servidores, entornos y herramientas para manejar tráfico real.

- **2.** ¿Por qué no usar el servidor de desarrollo de Flask?
  El servidor de desarrollo de Flask (ejecutado con flask run) no está diseñado para manejar tráfico real:
- No es seguro.
- No escala bien
- Es solo para pruebas y desarrollo.

En producción, usaremos un servidor WSGI (Web Server Gateway Interface) como Gunicorn o uWSGI.

- **3.** Opciones para desplegar Flask
  1. En tu maquina local o un servidor físico:
- Usar Gunicorn y un servidor como Nginx para manejar tráfico HTPP.
2. En Servicios en la nube:
- Heroku: sencillo para principiantes.
- AWS, GCP o Azure: opciones avanzadas y escalables.
- Railway o Render: alternativas modernas y fáciles de usar.
3. Contenedores:
- Usar Docker para empaquetar y ejecutar tu aplicación en cualquier entorno.

- **4.** Despliegue básico con Gunircorn y Nginx

```python
    a. Instalar Gunicorn
    primero, instala Gunicorn en tu entorno:
        pip install gunicorn
    b. Correr tu aplicación con Gunicorn
    Ejecutar tu aplicación Flask con Gunicorn:
        gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

- -w 4: usa 4 workers (procesos).
- -b 0.0.0.0:8000: ejecuta en el puerto 8000 accesible desde cualquier dirección.

```python
    c. Configurar Nginx
    Usa Nginx como proxy inverso para manejar tráfico y redirigirlo a Gunicorn:
```

1. Instala Nginx:

```text
            sudo apt update
            sudo apt install nginx
```

2. Configura un archivo de sitio para Nginx en /etc/nginx/sites-available/mi_sitio:

```text
            server {
                listen 80;
                server_name tu-dominio.com;

                location / {
                    proxy_pass http://127.0.0.1:8000
                    proxy_set_header Host $host;
                    proxy_set_header X-real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                }
            }
```

- **3.** Habilitar el sitio y reinicia Nginx:

```text
            sudo ln -s /etc/nginx/sites-available/mi_sitio /etc/nginx/sites-enabled
            sudo nginx -t
            sudo systemctl restart nginx
```

  5. Despliegue en Heroku (sencillo y gratuito)

```python
    a. Crear el archivo Procfile
    Agregar un archivo llamado Profile en la raíz de tu proyecto con este contenido:
        web: gunicorn app:app

    b. Subir tu proyecto
```

- **1.** Inicializar un repositorio Git:

```python
            git init
            git add .
            git commit -m "Primer despliegue"
```

  2. Instala Heroku CLI:

```text
            sudo snap install --classic heroku
```

3. Despliega tu aplicación:

```python
            heroku create
            git push heroku main
```
