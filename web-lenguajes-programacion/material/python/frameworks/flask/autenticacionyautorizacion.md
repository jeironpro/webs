# Autenticación y autorización

**Autenticación y Autorización**
Autenticación con Sesiones en Flask
1. Configuración básica de sesiones en Flask
Para comenzar a usar sesiones en Flask necesitamos configurar una clave secreta que se usará para firmar la sesión y asegurarse de que los datos no puedan ser modificados por el cliente.

**Cómo funciona la autenticación con sesiones**
1. Login: El usuario ingresa su correo y, si el correo coincide con uno registrado en la base de datos, se crea una sesión que almacena el id y nombre del usuario.

- **2.** Protección de rutas: La ruta /bienvenida está protegida por la sesión. Si no hay sesión activa, el usuario es redirigido al login.

- **3.** Logout: Al hacer logout, los datos de la sesión se eliminan, y el usuario es redirigido al login.

**Solución**

```python
# Código básico de autenticación con sesiones
# from flask import Flask, render_template, redirect, url_for, request, session
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)

# # Configuración de la base de datos y clave secreta para las sesiones
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mi_base_datos.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.secret_key = 'mi_clave_secreta' # Debes cambiar esto por una clave más segura

# db = SQLAlchemy(app)

# # Definir el modelo Usuario
# class Usuario(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     nombre = db.Column(db.String(100), nullable=False)
#     correo = db.Column(db.String(100), unique=True, nullable=False)

# # Ruta de login
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         correo = request.form['correo']
#         usuario = Usuario.query.filter_by(correo=correo).first()

#         if usuario:
#             # Autenticación existosa
#             session['usuario_id'] = usuario.id # Guardar el ID del usuario en la sesión
#             session['nombre'] = usuario.nombre # Guardar el nombre en la sesión
#             return redirect(url_for('bienvenida'))
#         else:
#             return "Usuario no encontrado", 404
#     return render_template('login.html')

# # Ruta protegida - bienvenida
# @app.route('/bienvenida')
# def bienvenida():
#     if 'usuario_id' not in session:
#         return redirect(url_for('login')) # Si mo está autenticado, redirigir al login
    
#     nombre = session['nombre']
#     return f"Bienvenido, {nombre}"

# # Ruta de logout
# @app.route('/logout')
# def logout():
#     session.pop('usuario_id', None) # Eliminar el ID de la sesión
#     session.pop('nombre', None) # Eliminar el nombre de la sesión
#     return redirect(url_for('login'))

# if __name__ == '__main__':
#     app.run(debug=True)

""" Explicación del código:
Configuración de Flask:
    · Usamos app.secret_key para asegurar que las sesiones no puedan ser manipuladas por el cliente.
    · SQLAlchemy se utiliza para gestionar la base de datos, donde almacenamos los usuarios.

Modelo Usuario:
    · Tiene los atributos id, nombre y correo. Los datos de los usuarios se almacenan en esta tabla.

Ruta /login:
    · Si el método es POST, se obtiene el correo proporcionado por el usuario, y se consulta en la base de datos si existe un usuario con ese correo.
    · Si el usuario es encontrado, guardamos su id y nombre en la sesión para usarlos posteriormente.
    · Si no se encuentra el usuario, se devuelve un error.

Ruta /bienvenida:
    · Si el usuario está autenticado (es decir, tiene un valor en la sesión), se muestra un mensaje de bienvenida con su nombre.
    · Si el usuario no está autenticado, lo redirige a la página de login.

Ruta /logout:
    · Elimina los datos de la sesión, desconectando al usuario.
"""

""" Autenticación con JWT en Flask
JWT es un estándar abierto que se utiliza para la transmisión segura de información entre un cliente y un servidor. En el contexto de la autenticación, el servidor genera un JWT cuando el usuario inicia sesión y lo envía al cliente, quien lo almacena (normalmente en cookies o almacenamiento local). Este tokem se enviará en cada solicitud subsecuente para que el servidor verifique la identidad del usuario.

Pasos para implementar la autenticación con JWT:
    1. Instalar dependencias: necesitamos instalar el paquete PyJWT para crear y verificar tokens JWT.
        pip install pyjwt flask
    
    2. Estructura básica de la aplicación Flask con JWT:
        abajo...

Ventajas de usar JWT:
    · Escalabilidad: Los tokens son independientes del servidor, por lo que es más fácil escalar tu aplicación sin necesidad de mantener sesiones en el servidor.

    · Sin estado (Stateless): El servidor no necesita almacenar ningún dato de sesión; toda la información se transporta con cada solicitud.

    · Seguridad: Los tokens se pueden firmar digitalmente y se pueden configurar para caducar después de un tiempo específico.
"""

from flask import Flask, request, jsonify
import jwt
import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuración de la base de datos y el secreto para firmar el JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mi_base_datos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'mi_clave_secreta'  # Cambiar por una clave secreta más segura

db = SQLAlchemy(app)

# Modelo de usuario
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=False)

# Función para crear el JWT
def crear_token(usuario_id):
    # Definir la expiración del token
    expiracion = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    # Crear el payload del token
    payload = {
        'exp': expiracion,
        'iat': datetime.datetime.utcnow(),
        'sub': usuario_id # 'sub' es el identificador del usuario
    }
    # Firmar el token usando la clave secreta
    token = jwt.encode(payload, app.secret_key, algorithm='HS256')
    return token

# Ruta de login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    usuario = Usuario.query.filter_by(correo=correo).first()

    if usuario:
        # Crear el token de autenticación
        token = crear_token(usuario.id)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

# Ruta protegida por JWT
@app.route('/perfil', methods=['GET'])
def perfil():
    # Obtener el token de los encabezados de la solicitud
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token no proporcionado'}), 403

    try:
        # Decodificar el token
        payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        usuario_id = payload['sub']
        usuario = Usuario.query.get(usuario_id)

        return jsonify({'nombre': usuario.nombre, 'correo': usuario.correo}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expirado'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Token inválido'}), 403

if __name__ == '__main__':
    app.run(debug=True)

""" Explicación del código:
Instalación y Configuración:
    · Usamos flask_sqlalchemy para interactuar con la base de datos.
    · Configuramos una clave secreta para firmar los tokens JWT.

Modelo Usuario:
    · Definimos el modelo de usuario con los campos id, nombre y correo.

Función crear_token:
    · Esta función toma el usuario_id como entrada y crea un JWT con un payload que incluye:
        · iat (Issued At): el momento en que el token fue creado.
        · exp (Expiration): la expiración del token (en este caso, 1 hora).
        · sub (Subject): el identificador del usuario.
    · El token se firma usando la clave secreta configurada en Flask.

Ruta /login:
    · Esta ruta recibe una solicitud POST con los datos del usuario (en este caso, el correo). Si el usuario existe en la base de datos, se genera un JWT y se devuelve al cliente.
    · El cliente debe almacenar este token (generalmente en cookies o almacenamiento local).

Ruta /perfil:
    · Esta ruta está protegida por JWT. Para acceder a ella, el cliente debe enviar el token en los encabezados de la solicitud (Authorization).
    · El servidor valida el token usando jwt.decode(). Si el token es válido y no ha expirado, se muestra la información del usuario.

Manejo de errores de JWT:
    · Si el token ha expirado, se devuelve un error 401 (No autorizado).
    · Si el token es inválido, se devuelve un error 403 (Acceso denegado).
    · Si el token no se proporciona, se devuelve un error 403.
"""
```
