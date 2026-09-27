# Manejo de formularios

**Manejo de formularios en Flask**
Cuando una aplicación web necesita interactuar con los usuarios (como en el caso de iniciar sesión o enviar comentarios), es común utilizar formularios. En Flask, procesar formularios es una tarea sencilla.

**Cómo se manejan los formulario en Flask**
1. Definir un formulario HTML (templates/formulario.html)
2. Obtener los datos del formulario en Flask usando la solicitud POST.
3. Validar y procesar los datos enviados.

**Solución**

```python
# Obtener los datos del formulario en Flask
# Cuando un usuario envía el formulario, los datos se envían al servidor. Flask permite acceder a esos datos usando el objeto request
# Ejemplo de cómo procesar el formulario
from flask import Flask, request, render_template

app = Flask(__name__)

# 2. Ruta para mostrar el formulario (GET)
@app.route('/formulario', methods=['GET'])
def formulario():
    return render_template('formulario.html') # El formulario HTML definido previamente

# 3. Ruta para procesar los datos del formulario (POST)
@app.route('/procesar', methods=['POST'])
def procesar():
    nombre = request.form['nombre'] # Recuperamos el valor del campo 'nombre' del formulario
    # Para asegurarnos de que los datos recibidos sean válidos, podemos realizar validaciones en Flask
    if not nombre:
        return "El campo nombre es obligatorio" # Validación simple
    return f"Hola, {nombre}!" # Si todo está bien, mostrar el nombre ingresado

if __name__ == '__main__':
    app.run(debug=True)

"""
Mejorar la experiencia con el módulo WTForms (para más adelante):
para formularios más complejos, WTForms es un módulo que simplifica la validación y manejo de formularios en Flask. Se encarga de muchos detalles por ti, como la validación de campos, la prevención de inyecciones de código y la gestión de formularios complejos.
"""
```
