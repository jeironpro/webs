# Redirección y errores

**Redirección y errores**
En muchas aplicaciones web, después de procesar un formulario o realizar una acción, necesitas redirigir al usuario a otra pagina. En Flask, esto se logra usando la función redirect() junto con url_for().

Flask permite manejar errores comunes de manera personalizada. Esto se hace utilizando el decorador @app.errorhandler.

**Solución**

```python
# Ejemplo básico de redirección
from flask import Flask, redirect, url_for, request

app = Flask(__name__)

@app.route('/')
def main():
    return "Página principal"

@app.route('/inicio')
def inicio():
    return "¡Bienvenido a la página de inicio!"

@app.route('/redirigir')
def redirigir():
    # redirect(): Redirige al usuario a una nueva URL
    # url_for('inicio'): Obtiene dinámicamente la URL para la función inicio. Esto es útil si cambias la ruta de inicio más adelante, ya que url_for actualizará la URL automáticamente.
    return redirect(url_for('inicio')) # Redirige a la ruta asociada a la función 'inicio'

# Redirección después de procesar un formulario
@app.route('/formulario', methods=['GET', 'POST'])
def formulario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        return redirect(url_for('saludo', nombre=nombre))  # Redirigir a otra ruta
    return '''
        <form method="post">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre">
            <button type="submit">Enviar</button>
        </form>
    '''

@app.route('/saludo/<nombre>')
def saludo(nombre):
    return f"Hola, {nombre}!"

# Manejo de errores en Flask
# Personalizar la página de error 404
# @app.errorhandler(404): captura el error 404 (página no encontrada) y devuelve una respuesta personalizada.
@app.errorhandler(404)
def pagina_no_encontrada(e):
    # return ..., 404: el número 404 indica el código de estado HTTP de la respuesta.
    return "¡Oops! Página no encontrada. ¿Seguro que escribiste bien la URL?", 404

# Manejo de otros errores comunes
# Puedes manejar otros errores de forma similar, como el error 500 (Error Interno del Servidor) o el error 403 (Prohibido).
@app.errorhandler(500)
def error_interno(e):
    return "Ocurrio un error en el servidor. Inténtalo más tarde.", 500

# Generar intencionalmente un error 500 en una ruta
# @app.route('/error500')
# def error_interno():
    # Se debe importar desde flask el paquete abort
    # abort(500) # Genera un error 500 intencionadamente 

if __name__ == '__main__':
    app.run(debug=True)
```
