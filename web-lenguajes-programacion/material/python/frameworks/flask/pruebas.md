# Pruebas

**Pruebas en Flask**
Realizar pruebas es fundamental para garantizar que tu aplicación funciona correctamente y que los cambios no introducen errores. Flask facilita la escritura de pruebas unitarias e integración mediante su cliente de pruebas integrado.

**Tipos de pruebas en Flask**
1. Pruebas unitarias: verifican partes específicas de tu código, como funciones o métodos individuales.

- **2.** Pruebas de integración: validan cómo interactúan diferentes partes de tu aplicación, como las ruyas y la base de datos.

**Herramientas comunes para pruebas en Flask**
1. unittest: módulo estándar de Python para realizar pruebas unitarias.

- **2.** pytest: biblioteca externa que simplifica la escritura de pruebas.

- **3.** Flask Test Client: cliente de pruebas integrado en Flask para simular solicitudes HTTP.

**Crear un entorno para pruebas**
1. Configurar tu aplicación para pruebas:
- Activa el modo de prueba en Flask.
- Usa una base de datos separada para las pruebas.

```python
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Base de datos en memoria
```

- **2.** Estructura del proyecto (opcional):
- Organiza tus pruebas en un directorio llamado test/.
- Usa un archivo separado para cada módulo o componente.

**Solución**

```python
# Ejemplo básico: Pruebas de una API RESTful
from flask import Flask, jsonify, request

app = Flask(__name__)

usuarios = [{"id": 1, "nombre": "Jeiron"}, {"id": 2, "nombre": "Junior"}]

@app.route('/usuarios', methods=['GET'])
def obtener_usuario():
    return jsonify(usuarios), 200

@app.route('/usuarios', methods=['POST'])
def agregar_usuario():
    nuevo_usuario = request.get_json()
    usuarios.append(nuevo_usuario)
    return jsonify(nuevo_usuario), 201

import unittest
import pytest
from pruebas import app

# Escribiendo pruebas con unittest
class TestAPI(unittest.TestCase):
    def setUp(self):
        # Configurar la apliación para pruebas
        app.config['TESTING'] = True
        self.client = app.test_client() # Cliente de pruebas

    def test_obtener_usuarios(self):
        # Simular una solicitud GET
        response = self.client.get('/usuarios')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.json, list))

    def test_agregar_usuario(self):
        # Simular una solicitud POST
        nuevo_usuario = {"id": 3, "nombre": "JeyJey"}
        response = self.client.post('/usuarios', json=nuevo_usuario)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json['nombre'], "Jeiron")

# Escribiendo pruebas con pytest
@pytest.fixture
def client():
    app.config['TESTING'] = True
    return app.test_client()

def test_obtener_usuarios(client):
    response = client.get('/usuarios')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_agregar_usuario(client):
    nuevo_usuario = {"id": 3, "nombre": "JeyJey"}
    response = client.post('/usuarios', json=nuevo_usuario)
    assert response.status_code == 201
    assert response.json['nombre'] == "JeyJey"

if __name__ == '__main__':
    unittest.main()
```
