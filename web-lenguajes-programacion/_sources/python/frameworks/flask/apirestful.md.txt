# API RESTful

**Introducción a API RESTful**
Una API RESTful permite que dos sistemas se comuniquen utilizando el protocolo HTTP. Es ampliamente usada para construir servicios web. En Flask, podemos crear APIs RESTful fácilmente gracias a su simplicidad y extensibilidad.

**Elementos principales de una API RESTful**
1. Rutas y métodos HTTP:
- GET: para obtener recursos.
- POST: para crear nuevos recursos.
- PUT: para actualizar recursos existentes.
- DELETE: para eliminar recursos.

- **2.** Estructura JSON: la comunicación entre cliente y servidor se realiza a través de datos en formato JSON.

- **3.** Códigos de estado HTTP:
- 200: éxito.
- 201: recurso creado.
- 404: recurso no encontrado.
- 500: error interno del servidor.

- **4.** Endpoints: son las URL donde los clientes pueden interactuar con la API.

**Solución**

```python
# Crear una API RESTful básica con Flask
from flask import Flask, jsonify, request

app = Flask(__name__)

# Datos simulados (como si fuera una base de datos)
usuarios = [
    {"id": 1, "nombre": "Jeiron", "edad": 21},
    {"id": 2, "nombre": "Junior", "edad": 22}
]

# Obtener todos los usuarios
@app.route("/usuarios", methods=['GET'])
def obtener_usuarios():
    return jsonify(usuarios), 200

# Obtener un usuario por ID
@app.route('/usuarios/<int:id>', methods=['GET'])
def obtener_usuario(id):
    usuario = next((u for u in usuarios if u['id'] == id), None)
    if usuario:
        return jsonify(usuario), 200
    return jsonify({"error": "Usuario no encontrado"}), 404

# Crear un nuevo usuario
@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    nuevo_usuario = request.get_json()
    nuevo_usuario['id'] = len(usuarios) + 1
    usuarios.append(nuevo_usuario)
    return jsonify(nuevo_usuario), 201

# Actualizar un usuario
@app.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    datos = request.get_json()
    usuario = next((u for u in usuarios if u['id'] == id), None)
    if usuario:
        usuario.update(datos)
        return jsonify(usuario), 200
    return jsonify({"error": "Usuario no encontrado"}), 404

# Eliminar un usuario
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    global usuarios
    usuarios = [u for u in usuarios if u['id'] != id]
    return jsonify({"mensaje": "Usuario eliminado"}), 200

if __name__ == '__main__':
    app.run(debug=True)

""" Explicación del código
1. @app.route: define las rutas de la API.
    · El parámetro methods especifica los métodos HTTP permitidos.

2. request.get_json(): extrae datos en formato JSON enviados desde el cliente.

3. jsonify(): convierte los datos de Python a JSON para enviarlos como respuesta.

4. Manejo de errores:
    · Si un recurso no existe, devolvemos un código 404 con un mensaje.
"""
```
