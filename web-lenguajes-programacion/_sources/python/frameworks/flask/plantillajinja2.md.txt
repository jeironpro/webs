# Plantillas Jinja2

**Plantilla Jinja2**
Jinja2 es el motor de plantillas que utiliza Flask para generar contenido dinámico en las páginas web. Con jinja2 puedes:
- Incluir variables en tu HTML.
- Usar estructuras de control como bucles y condicionales.
- Crear plantilla reutilizables con bloques y extensiones

**Configurar y usar plantillas en Flask**
Por convención, los archivos de plantillas HTML deben almacenarse en una carpeta llamada templates, ubicada en el mismo directorio que tu archivo principal de Flask.

# Ejemplo básico:
1. Estructura de carpetas:

```python
    /mi_aplicacion
    |-- app.py
    |-- templates
        |-- index.html
```

- **2.** Contenido del archivo app.py:

```python
    from flask import Flask, render_template

    app = Flask(__name__)

    @app.route('/')
    def inicio():
        return render_template('index.html') # Renderizar la plantilla HTML

    if __name__ == '__main__':
        app.run(debug=True)
```

- **3.** Contenido del archivo templates/index.html:

```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página principal</title>
    </head>
    <body>
        <h1>¡Hola, mundo desde Flask!</h1>
    </body>
    </html>
```

Cuando accedes a http://127.0.0.1:5000/, Flask renderiza la plantilla index.html.

**Control de flujo en plantillas**
Jinja2 permite usar condicionales y bucles dentro de las plantillas.

**condicionales**
<p> {% if usuario == 'admin' %} Eres un administrador {% else %} Usuario estándar {% endif %}</p>

**bucles**
<ul>

```text
    {% for item in lista %}
        <li>{{ item }}</li>
    {% endfor %}
```

</ul>

**Herencia de plantillas**
Para evitar duplicar código, puedes usar plantillas base y heredar contenido en otras plantillas.

- **1.** Plantilla base (template/base.html)
  2. Plantilla que hereda (template/inicio.html)

**Solución**

```python
from flask import Flask, render_template

app = Flask(__name__)

# Pasar datos dinámicos a plantillas
# Puedes enviar datos desde tu aplicación Flask a las plantillas usando variables
@app.route('/saludo/<nombre>')
def saludo(nombre):
    return render_template('saludo.html', nombre=nombre)

# Control de flujo
@app.route('/productos')
def productos():
    productos = ['Laptop', 'Celular', 'Tablet']
    return render_template('productos.html', lista=productos)

# Herencia de plantillas
@app.route('/inicio')
def inicio():
    return render_template('inicio.html')

if __name__ == '__main__':
    app.run(debug=True)
```
