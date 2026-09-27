# Introducción a Flask

**Introducción a Flask**
Flask es un framework para el desarrollo web que te permite crear aplicaciones de forma modular y ligera. Fue diseñado con la idea de ser flexible y fácil de usar, lo que lo hace perfecto tanto para principiantes como para desarrolladores avanzados.

**Características principales Flask**
1. Minimalista y flexible:
- No impone una estructura rígida para el proyecto.
- Puedes usar solo las herramientas que necesitas.

- **2.** Basado en Python:
- Todo el desarrollo se realiza en Python, aprovechando su sintaxis clara y poderosa.

- **3.** Extensible:
- Tiene muchas extensiones que puedes añadir según las necesidades de tu proyecto (ej., autenticación, bases de datos).

- **4.** Ligero:
- No incluye funcionalidades innecesarias, dejando al desarrollador decidir que integrar.

- **5.** Comunicación directa con WSGI:
- Flask utiliza Werkzeug, un toolkit que permite manejar la comunicación entre el navegador y la aplicación Python.

- **6.** Plantillas con Jinja2:
- Incluye un motor de plantillas llamado Jinja2 para generar contenido dinámico en las páginas HTML.

**¿Como usar Flask?**
Flask es ideal cuando:
- Quieres construir aplicaciones web simples y rápidas.
- Necesitas flexibilidad para diseñar tu aplicación.
- Quieres aprender los fundamentos de desarrollo web con Python.
- Estás desarrollando APIs o microservicios.

**¿Qué No es Flas?**
- No es un framework completo como Django.

```python
        Esto significa que no incluye por defecto herramientas avanzadas como administración de bases de datos o autenticación.
```

**Comparativa básica con otros frameworks**
Característica           Flask                          Django
Filosofía                Minimalista y flexible         Todo incluido
Curva de aprendizaje     Baja                           Moderada
Estructura de proyecto   No impuesta                    Estructurada
Casos ideales            APIs y aplicaciones pequeñas   Aplicaciones grandes

**Requisitos para empezar con Flask**
1. Tener Python instalado en tu máquina.
2. Instalar Flask con:

```python
    pip install flask
```

**¿Qué más necesitas saber antes de empezar?**
1. Conceptos básicos de Python: funciones, clases, decoradores.
2. Entender cómo funciona el flujo HTTP: métodos como GET, POST, etc.
3. Familiaridad con HTML y algo de CSS (opcional, pero útil).

**Solución**

```python
# Al ejecutar este archvio, iniciará un servidor en tu máquina en la dirección 127.0.0.1 y el puerto 5000
# Abre tu navegador: Visita http://127.0.0.1:5000

# Importamos la clase Flask desde el paquete flask
# Importamos 'request' para manejar los métodos HTTP en las rutas.
from LenguajesProgramacion.PythonDCSINFOTEP.Frameworks.Flask.introduccionflask import Flask, request

# Creamo una instancia de la clase Flask
# Esta instancia será nuestra aplicación principal
app = Flask(__name__)

# Usamos un decorador para definir una ruta
# La ruta "/" indica que esta función se ejecutará cuando accedamos a la raíz del sitio.
@app.route("/")
def inicio(): # Función que manejará las solicitudes a la ruta "/"
    # Esta función devuelve un mensaje de texto como respuesta al navegador
    return "Esta es la página principal"

# Definimos otra ruta para la URL "/nosotros"
# Abre tu navegador: Visita http://127.0.0.1:5000/nosotros
@app.route("/nosotros")
def nosotros():
    # Devuelve un mensaje para esta página específica
    return "¡Bienvenido a la página sobre nosotros!"

# Métodos HTTP básicos
# Flask permite manejar diferentes métodos HTTP como GET (solicitar datos) y POST (enviar datos)
# Abre tu navegador: Visita http://127.0.0.1:5000/solicitud (esto hará una solicitud GET)
@app.route("/solicitud", methods=["GET", "POST"])
def solicitud():
    # Si la solicitud es de tipo POST
    if request.method == "POST":
        # Devuelve un mensaje indicando que fue un POST
        # Para hacer una solicitud POST usa herramientas como Postman o formularios HTML para enviar un POST a esta ruta.
        return "Has enviado un POST"
    # Si no es POST (por defecto será GET)
    return "Has accedido con GET"

# Este bloque asegura que el servidor solo se ejecute si el archivo es ejecutado directamente
if __name__ == "__main__":
    # Ejecutamos el servidor en modo desarrollo (debug=True)
    # Esto mostrará mensajes de error detallados y reiniciará el servidor automáticamente si cambias el código
    app.run(debug=True)

""" Explicación del código
app: assignamos una instancia de Flask a la variable app. Esta instancia es la representación de nuestra aplicación web. Es el objeto que gestiona las rutas, la configuración y los componentes.

Flask: es la clase principal del framework Flask. Esta clase se utiliza para crear un instancia de la aplicación web.

__name__: el parámetro es una variable especial de Python que contiene el nombre del módulo actual (por ejemplo, "__main__" si el código se está ejecutando como el programa principal).

Flask utiliza esta información para localizar recursos como plantillas HTML o archivos estáticos, ya que indica dónde se encuentra el código de la aplicación.

@app.route("/"):
@app.route: este es un decorador proporcionado por Flask. Un decorador es una forma de modificar el comportamiento de una función, en este caso, asociando una URL con un función de Python.

"/": esta es la ruta o URL específica que se va a asociar con la función. En este caso, se está indicando que la función a continuación se ejecutará cuando un usuario visite la página principal de la aplicación (es decir, cuando acceda a la URL http://localhost:5000/ si está ejecutando el servidor Flask).

Cuando el usuario visita la URL /, Flask ejecutará la función definida justo debajo del decorador @app.route("/") y devolverá su resultado (por lo general, una respuesta HTTP).

def inicio(): es la función que se ejecuta cuando un usuario accede a la ruta /. El return dentro de la función devuelve un texto.

@app.route("/solicitud", methods=["GET", "POST"]):
El decorador @app.route("/solicitud", methods=["GET", "POST"]) en Flask se utiliza para asociar una ruta con una función que puede manejar tanto solicitudes GET como POST

@app.route("/solicitud"): esta parte define la URL (en este caso, /solicitud) a la cual se asociará la función que sigue a este decorador. En este caso, la ruta /solicitud será accesible a través de una solicitud HTTP (ya sea GET o POST).

methods=["GET", "POST"]: 
GET: Se utiliza para obtener datos del servidor. Cuando un usuario accede a la URL /solicitud, el navegador realiza una solicitud GET para obtener una página o información.

POST: Se utiliza para enviar datos al servidor, generalmente a través de un formulario o para realizar alguna acción en el servidor (como agregar datos a una base de datos).

Al especificar ambos métodos, la función podrá manejar tanto las solicitudes GET como POST para esa ruta.

El if dentro de la funcion soliciud: verifica que tipo de solicitud se le hace a la URL, si es de tipo POST, retorna un mensaje y si es de tipo GET muestra otro mensaje diferente.

__main__: es una variable especial en Python que se utiliza para determinar si un archivo o módulo está siendo ejecutado directamente como un programa principal, o si está siendo importado en otro módulo.

¿Qué significa "__main__"?
En python, cada módulo tiene un atributo especial llamado __name__. Si un módulo se ejecuta como el programa principal (es decir, si se ejecuta directamente en la terminal o mediante un comando), el valor de __name__ es asignado a "__main__". Si el módulo es importado desde otro archivo, el valor de __name__ será el nombre del propio módulo.

Un uso común de "__main__" es para controlar el flujo de ejecución de un archivo de Python. Se usa para que una parte del código solo se ejecute cuando el archivo se ejecuta directamente, no cuando se importa desde otro módulo.

app.run(debug=True): es un método utilizado en Flask para iniciar el servidor de desarrollo de la aplicación web.

app.run(): este método inicia el servidor de desarrollo de Flask. Cuando se ejecuta, Flask comienza a escuchar las solicitudes HTTP en un puerto determinado (por defecto, el puerto 5000 en http://localhost:5000/). Permite que la aplicacion web se ejecute y esté disponible para recibir solicitudes y mostrar respuestas.

debug=True: el parámetro activa el modo de depuración (debug mode) en Flask. Esto es útil durante el desarrollo porque proporciona:
    · Errores detallados: si hay un error en el código, Flask mostrará un mensaje de error detallado con el rastreo de la pila (stack trace), lo que facilita encontrar y corregir problemas.

    · Recarga automática: cuando realizas cambios en el código (por ejemplo, editas un archivo Python), Flask recargará automáticamente la aplicación sin necesidad de detenerla y volverla a ejecutar. Esto acelera el proceso de desarrollo.

debug=True es ideal solo para entornos de desarrollo. En un entorno de producción, no se recomienda usarlo, ya que puede exponer detalles sensibles del código y los errores.
"""
```
