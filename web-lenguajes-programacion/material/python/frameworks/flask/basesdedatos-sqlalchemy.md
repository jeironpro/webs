# Bases de datos (SQLAlchemy)

**Introducción a SQLAlchemy**
SQLAlchemy es una biblioteca para trabajar con bases de datos en Python. Es compatible con Flask y permite interactuar con bases de datos relacionales de manera sencilla utilizando un enfoque de mapeo objeto-relacional (ORM).

**Ventajas de usar SQLAlchemy en Flask**
- Simplifica la interacción con bases de datos.
- Permite manejar modelos como objetos Python.
- Admite múltiples motores de bases de datos como SQLite, MySQL, PostgreSQL, entre otros.

**Instalación**
pip install flask-sqlalchemy

**Configuración básica de Flask-SQLAlchemy**
1. Configura la base de datos en tu aplicación Flask.
2. Define modelos que representen las tablas de tu base de datos.

**Concepto clave**
1. URI de la base de datos:
- Define el tipo de base de datos y su ubicación.
- Ejemplo: sqlite:///mi_base_datos.db, mysql+pymysql://usuario:password@localhost/mi_base

- **2.** Modelos
- Cada modelo representa una tabla en la base de datos
- Usa db.Column para definir las columnas y sus atributos (tipo, claves primarias, restricciones).

- **3.** CRUD básico
- Crear: usa db.session.add() y  db.session.commit().
- Leer: usa consultas con métodos como query.all(), query.filter_by().
- Actualizar: modifica atributos y guarda con db.session.commit().
- Eliminar: usa db.session.delete() y guarda con db.session.commit().

**Solución**

```python
# Ejemplo básico
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

# Configuración de la aplicación Flask
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mi_base_datos.db' # Base de datos SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Desactiva el seguimiento para ahorrar recursos

# Inicializa SQLAlchemy
db = SQLAlchemy(app)

# Definir un modelo (tabla)
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True) # Clave primaria
    nombre = db.Column(db.String(80), nullable=False) # Columna de tipo texto
    correo = db.Column(db.String(120), unique=True, nullable=False) # Columna única

    def __repr__(self): # Representación legible del objeto
        return f"<Usuario {self.nombre}>"

# Crear la tablas en la base de datos
with app.app_context():  # Es necesario establecer el contexto de la app
    db.create_all() # Crea las tablas si no existen

# Ruta para agregar un usuario
@app.route('/agregar_usuario', methods=['POST'])
def agregar_usuario():
    data = request.get_json() # Obtener datos del cuerpo de la solicitud
    nuevo_usuario = Usuario(nombre=data['nombre'], correo=data['correo'])
    db.session.add(nuevo_usuario) # Agregar usuario a la sesión
    db.session.commit() # Guardar cambios en la base de datos
    return jsonify({"mensaje": "Usuario agregado exitosamente"}, 201)

# Ruta para obtener todos los usuarios
@app.route('/obtener_usuarios', methods=['GET'])
def obtener_usuarios():
    usuarios = Usuario.query.all() # Consultar todos los usuarios
    resultado = [{"id": u.id, "nombre": u.nombre, "correo": u.correo} for u in usuarios]
    return jsonify(resultado), 200

# Ruta para actualizar un usuario
@app.route('/actualizar_usuario/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = request.get_json() # obtener datos del cuerpo de la solicitud
    usuario = Usuario.query.get_or_404(id) # Buscar usuario por ID o devolver error 404
    usuario.nombre = data['nombre']
    usuario.correo = data['correo']
    db.session.commit() # Guardar cambios
    return jsonify({"mensaje": "Usuario actualizado exitosamente"}), 200

# Ruta para eliminar un usuario
@app.route('/eliminar_usuario/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    usuario = Usuario.query.get_or_404(id) # Buscar usuario por ID o devolver error 404
    db.session.delete(usuario) # Eliminar el usuario de la sesión
    db.session.commit() # Guardar los cambios en la base de datos
    return jsonify({"mensaje": "Usuario eliminado exitosamente"}), 200

if __name__ == '__main__':
    app.run(debug=True)

""" Explicación de las Secciones
Definición del modelo:
    Usuario es una clase que representa la tabla en la base de datos.
    Sus atributos (id, nombre, correo) son las columnas de la tabla.

Operaciones CRUD:
    Crear: Se usa db.session.add() para añadir registros.
    Leer: Se consulta la base de datos con query.all() o query.get().
    Actualizar: Se modifican atributos del objeto y se guarda con db.session.commit().
    Eliminar: Se usa db.session.delete() para eliminar un registro.

Rutas Flask:
    Cada ruta maneja una operación específica:
        · POST /agregar_usuario: Crear un nuevo usuario.
        · GET /obtener_usuarios: Listar todos los usuarios.
        · PUT /actualizar_usuario/<id>: Actualizar un usuario existente.
        · DELETE /eliminar_usuario/<id>: Eliminar un usuario.
"""
```
