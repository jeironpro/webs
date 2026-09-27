# Sesiones y cookies

**Sesiones y Cookies**
Cookies: son pequeños archivos que se almacenan en el navegador del cliente para mantener información entre solicitudes HTTP. Flask permite establecer y recuperar cookies fácilmente.

Sesiones: en Flask, las sesiones se utilizan para almacenar información específica del usuario entre solicitudes. A diferencia de las cookies, las sesiones almacenan los datos en el servidor y solo envían un identificador único al cliente.

**Cookies en Flask**
Cómo establecer una cookie:

- **1.** Usa el objeto make_response para modificar la respuesta.
  2. Establece una cookie con el método set_cookie.

**Como eliminar un cookie**

```python
    Usa el método set_cookie con el valor '' y un tiempo de expiración pasado
```

**Sesiones en Flask**
Configuración inicial:
Flask utiliza una clave secreta (SECRET_KEY) para proteger los datos de la sesión. Asegúrate de definirla en tu aplicación.

app.secret_key = 'clave_secreta_super_segura'

**Cómo usar sesiones**
1. Usa el objeto session para almacenar y recuperar datos.
2. Los daots de la sesión se manejan como un diccionario de Python.

**Comparación entre Cookies y Sesiones**
Aspecto          Cookies                                   Sesiones
Almacenamiento   En el navegador del cliente               En el servidor
Seguridad        Menos segura, datos visibles al cliente   Más segura, datos protegidos por la clave
Uso típico       Preferida para datos de bajo riegos       Ideal para datos sensibles

**Solución**

```python
# Cookies en Flask
from flask import Flask, make_response, request, session

app = Flask(__name__)

app.secret_key = 'clave_secreta_super_segura'

@app.route('/set_cookie')
def set_cookie():
    response = make_response("Cookie configurada")
    response.set_cookie('nombre', 'Usuario Flask', max_age=60*60*24) # La cookie expira en 1 día
    return response

@app.route('/get_cookie')
def get_cookie():
    nombre = request.cookies.get('nombre') # Recupera la cookie
    return f"El valor de la cookie es: {nombre}"

# Eliminar una cookie
@app.route('/delete_cookie')
def delete_cookie():
    response = make_response("Cookie eliminada")
    response.set_cookie('nombre', '', expires=0)
    return response

# Sesiones en Flask
@app.route('/set_session')
def set_sesion():
    session['usuario'] = 'Usuario Flask'
    return "Sesión iniciada para el usuario"

@app.route('/get_session')
def get_session():
    usuario = session.get('Usuario', 'No hay usuario en la sesión')
    return f"El usuario en sesión es: {usuario}"

@app.route('/clear_session')
def clear_session():
    session.pop('usuario', None) # Elimina el dato específico
    return "Sesión eliminada"

if __name__ == '__main__':
    app.run(debug=True)
```
