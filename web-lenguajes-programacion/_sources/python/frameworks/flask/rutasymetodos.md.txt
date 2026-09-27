# rutasymetodos

**Rutas y métodos HTTP**
Rutas en Flask:
Las rutas en Flask son los puntos de acceso a tu aplicación web. Cada ruta se asocia con una url y puedes manejar diferentes métodos HTTP, como GET, POST, etc.

Usamos el decorador @app.route() para definir las rutas en Flask.

**Métodos HTTP**
Los principales métodos HTTP que Flask maneja son:
- GET: se usa para obtener datos de un servidor. Es el método por defecto para obtener información de una URL.

- POST: se usa para enviar datos al servidor (por ejemplo, cuando se envía un formulario).

- PUT: se usa para actualizar recursos en el servidor.

- DELETE: se usa para eliminar recursos en el servidor.

**Solución**

```python
# Defenicón básica de rutas en Flask
# Importamos de flask el paquete redirect y url_for
from flask import Flask, redirect, url_for

app = Flask(__name__)

# Ruta GET
# Esta ruta maneja las solicitudes GET en la URL raíz /. La función inicio() se ejecuta cuando un usuario visita la página principal de la aplicación.
@app.route('/')
def inicio():
    return "¡Bienvenido a mi página web!"

# Ruta POST
# Esta ruta maneja solicitudes POST en la URL /enviar. Es útil para manejar envíos de formularios. La función enviar() se ejecutará cuando se reciba una solicitud POST.
@app.route('/enviar', methods=['POST'])
def enviar():
    return "Formulario enviado con éxito."

# Ruta con múltiples métodos
# Aquí la ruta maneja tanto solicitudes GET como PUT. Usamos múltiples métodos para manejar distintos tipos de interacciones con los recursos.
@app.route('/actualizar', methods=['PUT', 'GET'])
def actualizar():
    return "Recurso actualizado o recuperado."

# Ruta con parámetros dinámicos:
# Flask también permite definir rutas con parámetros dinámicos, lo que hace que la aplicación sea más flexible
@app.route('/usuario/<nombre>')
# <nombre> es un parámetro dinámico que se pasa a la función. cuando se accede a una URL como /usuario/jeiron, Flask pasa el valor "Jeiron" como argumentos a la función mostrar_usuario
def mostrar_usuario(nombre):
    return f"Bienvenido, {nombre}"

# Redirigir a otras rutas
# Flask ofrece una función redirect() que te permite redirigir a otras rutas dentro de tu aplicación
@app.route('/redirigir')
def redirigir():
    # url_for('inicio') obtiene la URL asociada a la función inicio(), y redirect() redirige a esa URL.
    return redirect(url_for('inicio'))

if __name__ == '__main__':
    app.run(debug=True)
```
