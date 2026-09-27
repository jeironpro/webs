# Introducción a Django

**Introducción a Django**
Django es un framework de desarrollo web de alto nivel escrito en Python, diseñado para crear aplicaciones web rápidamente y con una estructura clara. Sigue el principio "baterías incluidas", lo que significa que proporciona muchas funcionalidades listas para usar, como un sistema de autenticación, ORM (Object-Relation Mapping), herramientas de administración, y más.

**Ventjas de Django**
- Rápido desarrollo: ayuda a construir aplicaciones web más rápido al eliminar tareas repetitivas.
- Seguro: incluye herramientas para manejar la seguridad, como protección contra inyecciones SQL, XSS, CSRF, etc.
- Escalable: es apto para proyectos pequeños y grandes.
- Comunidad activa: amplia documentación y soporte gracias a su popularidad.

**Arquitectura de Django**
- Sigue el patrón MTV (Model-Template-View):
- Model: gestiona los datos y la lógica de la base de datos.
- Template: define cómo se muestra la información al usuario.
- View: contiene la lógica de negocio y conecta modelos y plantillas.

**Instalación de Django**
Antes de comenzar, asegurate de tener Python 3.8+ y pip instalados en tu sistema.
1. Crear un entorno virtual: esto es recomendable para evitar conflitos de dependencias.

```python
        python3 -m venv entorno_django
        source entorno_django/bin/activate
        entorno_django\Scripts\activate
```

2. Instalar Django:

```python
        pip install django
```

3. Verificar la instalación:

```python
        python -m django --version
    Esto debería mostrar la versión instalada de Django.
```

**Primer proyecto Django**
1. Crear un proyecto Django:

```python
    django-admin startproject mi_proyecto
    cd mi_proyecto
```

2. Estructura del proyecto:
- manage.py: comando para interactuar con el proyecto.
- mi_proyecto/:
- settings.py: configuraciones del proyecto.
- urls.py: rutas principales del proyecto.
- wsgi.py: configuración para servidores.
- asgi.py: configuración para servidores asíncronos.
- init.py: indica que esta carpeta es un módulo de Python.
3. Ejecutar el servidor de desarrollo:

```python
    python manage.py runserver
```

accede a http://127.0.0.1:8000/ en tu navegador para ver el mensaje de bienvenida de Django.

**Crear primera aplicación en Django**
En Django, un proyecto puede contener varias aplicaciones, cada una con su propósito específico. Ahora añadiremos una aplicación al proyecto creado anteriormente

- **1.** Crear la aplicación
  Dentro del proyecto, ejecuta el siguiente comando en la terminal:

```python
    python manage.py startapp mi_aplicacion
```

Esto crea una carpeta llamada mi_aplicacion con la siguiente estructura:
- admin.py: configuración del panel de administración para esta aplicación.
- apps.py: configuración de la aplicación.
- models.py: definición de modelos y estructura de la base de datos.
- test.py: definición de pruebas unitarias.
- views.py: lógica de las vistas.
- migrations/: archivos de migración para sincronizar la base de datos.

- **2.** Registrar la aplicación en el proyecto
  Para que Django reconozca tu nueva aplicación, debes agregarla en settings.py del proyecto. Busca la variable INSTALLED_APPS y añade el nombre de la aplicación:

```python
    INSTALLED_APPS = [
        # Aplicaciones predeterminadas
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',

        # Mi aplicación
        'mi_aplicacion',
    ]
```

- **3.** Crear una vista básica
  En el archivo views.py de tu aplicación (mi_aplicacion/views.py), crea tu primera vista:

```python
    from django.http import HttpResponse

    def hola_mundo(request):
        return HttpResponse("¡Hola, mundo desde mi primera aplicación Django!")
```

- **4.** Configurar las URLs de la aplicación
  Crea un archivo urls.py dentro de la carpeta mi_aplicacion:

```python
    touch mi_aplicacion/urls.py
```

Agregar el siguiente contenido al archivo mi_aplicacion/urls.py:

```python
    from django.urls import path
    from . import views

    urlpatterns = [
        path('', views.hola_mundo, name='hola_mundo'),
    ]
```

- **5.** Conectar la aplicación al proyecto
  En el archivo urls.py del proyecto (que está en la carpeta principal del proyecto), incluye las URLs de la aplicación:

```python
    from django.contrib import admin
    from django.urls import path, incluye

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('', include('mi_aplicacion.urls')), # Incluir las URLs de la aplicación
    ]
```

- **6.** Ejecutar el servidor
  Inicia el servidor nuevamente:

```python
    python manage.py runserver
```

Abre tu navegador y accede a http://127.0.0.1:8000/. Deberías ver el mensaje:

```text
    ¡Hola, mundo desde mi primera aplicación Django
```
