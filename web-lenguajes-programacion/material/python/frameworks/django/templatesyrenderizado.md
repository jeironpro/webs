# Templates y renderizado

**Templates y Renderizado en Django**
Django utiliza un sistema de plantillas (templates) para separar la lógica del servidor (backend) de la presentación (frontend). Los templates son archivos HTML que pueden contener etiquetas y variables de Django para mostrar datos dinámicos en las páginas web.

- **1.** Configuración inicial de los Templates
  1. Ubicación de los templates:
- Por convención, los archivos de templates se almacenan en una carpeta llamada templates dentro de cada aplicación o en una carpeta de nivel superior del proyecto.

```python
    Estructura sugerida:
        mi_proyecto/
            mi_aplicacion/
                templates/
                    mi_aplicacion/
                        ejemplo.html
```

- **2.** Configurar la carpeta de templates en el proyecto: asegúrate de que en el archivo settings.py esté definida la configuración de templates:

```python
        TEMPLATES = [
            {
                'BACKEND': 'django.template.backends.django.DjangoTemplates',
                'DIRS': [BASE_DIR / 'templates'],  # Carpeta global de templates
                'APP_DIRS': True,  # Busca templates dentro de cada aplicación
                'OPTIONS': {
                    'context_processors': [
                        'django.template.context_processors.debug',
                        'django.template.context_processors.request',
                        'django.contrib.auth.context_processors.auth',
                        'django.contrib.messages.context_processors.messages',
                    ],
                },
            },
        ]
```

- **2.** Crear un Template
  1. Archivo de template básico: crea un archivo llamado ejemplo.html en la carpeta templates/mi_aplicacion:

```text
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ejemplo de Template</title>
        </head>
        <body>
            <h1>Hola, {{ usuario }}!</h1>
            <p>Hoy es {{ fecha_actual }}</p>
        </body>
        </html>
```

- **3.** Renderizar un Template
  1. Renderizar un template desde una vista: modifica tu vista en views.py para usar un template:

```python
        from django.shortcuts import render
        from datetime import datetime

        def ejemplo_vista(request):
            contexto = {
                'usuario': 'Jeiron',
                'fecha_actual': datetime.now().strftime('%d-%m-%Y')
            }
            return render(request, 'mi_aplicacion/ejemplo.html', contexto)
```

- **2.** Configurar la URL correspondiente: en urls.py, añadimos la ruta para esta vista:

```python
        from django.urls import path
        from . import views

        urlpatterns = [
            path('ejemplo/', views.ejemplo_vista, name='ejemplo'),
        ]
```

- **3.** Acceder en el navegador: entrar en http://127.0.0.1:8000/ejemplo/ para ver el resultado.

- **4.** Etiquetas y Filtros en Templates

```python
    Django proporciona un lenguaje propio para los templates. Algunos conceptos importantes:
```

  1. Variables: se representan usando {{ variable }} y muestran datos enviados de sde el contexto.

- **2.** Etiquetas: se usan para lógica dentro del template. Por ejemplo:

```text
            {% if usuario %}
                <p>Bienvenido, {{ usuario }}!</p>
            {% else %}
                <p>¡Por favor inicia sesión!</p>
            {% endif %}
```

- **3.** Filtros: modifican el contenido de las variables, como lower, upper, o date:

```text
            <p>{{ fecha_actual|date:"d-m-Y" }}</p>
```

- **5.** Extender templates
  Django soporta herencia de templates para evitar duplicación de código.
1. Template base: Crea un archivo base.html:

```text
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <title>{% block title %}Mi Proyecto{% endblock %}</title>
        </head>
        <body>
            <header>
                <h1>Cabecera del sitio</h1>
            </header>
            <main>
                {% block content %}{% endblock %}
            </main>
            <footer>
                <p>Pie de página</p>
            </footer>
        </body>
        </html>
```

- **2.** Template hijo: usa {% extends %} para heredar la estructura de base.html:

```text
        {% extends 'base.html' %}

        {% block title %}Página Ejemplo{% endblock %}

        {% block content %}
            <h2>Contenido de la página</h2>
            <p>¡Hola, este es el contenido dinámico!</p>
        {% endblock %}
```
