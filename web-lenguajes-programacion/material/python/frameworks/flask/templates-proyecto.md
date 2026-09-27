# Templates

Ficheros del proyecto original:

## `base.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %} Título por defecto {% endblock %}</title>
</head>
<body>
    <header>
        <h1>Mi aplicación Flask</h1>
    </header>
    <main>
        {% block content %} {% endblock %}
    </main>
    <footer>
        <p>Derechos reservados &copy; 2024</p>
    </footer>
</body>
</html>
```

## `formulario.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de Usuario</title>
</head>
<body>
    <h1>Introduce tu nombre</h1>
    <!-- action="/procesar": el formulario enviará los datos a la ruta /procesar usando el método POST -->
     <!-- method="POST": define que el formulario debe enviarse con el método POST -->
    <form action="/procesar" method="POST">
        <label for="nombre">Nombre:</label>
        <input type="text" name="nombre" id="nombre" required>
        <input type="submit" value="Enviar">
    </form>
</body>
</html>
```

## `inicio.html`

```html
{% extends 'base.html' %}

{% block title %} Inicio {% endblock %}

{% block content %}
    <p>Bienvenido a la página de inicio.</p>
{% endblock %}
```

## `login.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h1>Iniciar sesión</h1>
    <form method="POST">
        <label for="correo">Correo:</label>
        <input type="email" name="correo" id="correo" required>
        <input type="submit" value="Iniciar sesión">
    </form>
</body>
</html>
```

## `productos.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de productos</title>
</head>
<body>
    <h1>Lista de productos</h1>
    <ul>
        {% for producto in lista %}
            <li>{{ producto }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

## `saludo.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saludo</title>
</head>
<body>
    <h1>¡Hola, {{ nombre }}!</h1> <!-- Mostrar la variable 'nombre' -->
    <p>Gracias por visitar nuestro sitio.</p>
</body>
</html>
```
