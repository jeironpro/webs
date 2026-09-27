# API

**API (Interfaz de Programación de Aplicaciones)**
Una API (Application Programming Interface, por sus siglas en inglés) es un conjunto de definiciones y protocolos que permite que una aplicación se comunique con otra. En términos sencillos, una API es un intermediario entre diferentes programas, permitiendo que interactúen entre sí. A través de una API, se pueden enviar y recibir datos de manera estructurada sin necesidad de entender los detalles internos de cada aplicación.

Que es una api? Es un conjunto de funciones que se utiliza para integrar un software y comunicar dos aplicaciones.

**Tipos de APIs**
1. APIs Web: son aquellas que permiten la interacción entre aplicaciones a través de la web. Comúnmente se utilizan protocolos como HTTP/HTTPS y formatos como JSON o XML para la comunicación de datos.

- **2.** APIs de Librerías o Frameworks: son proporcionadas por librerías o frameworks, y permiten que las aplicaciones se comuniquen con las funciones y características que esas librerías ofrecen.

- **3.** APIs de Sistemas Operativos: estas APIs proporcionan interfaces para interactuar con el sistema operativo, como acceso al sistema de archivos o gestión de procesos.

**Componentes pricipales de una API Web**
- Endpoint: una URL específica donde la API puede ser accesada y se puede hacer una solicitud.

- Métodos HTTP: las solicitudes se pueden hacer utilzando los métodos HTTP, como:
- GET: recupera datos de un servidor.
- POST: envia datos al servidor.
- PUT: actualiza datos en el servidor.
- DELETE: elimina datos en el servidor.

- Formato de los datos: generalmente se utilizan formatos como JSON o XML para estructurar los datos que se envían y reciben.

- Autenticación y Autorización: muchas APIs requieren una clave o token de autenticación para garantizar que el usuario o la aplicación tenga permisos para acceder a los recursos.

**Ventajas de las APIs**
1. Facilita la integración: las APis permiten que diferentes aplicaciones y servicios interactúen sin necesidad de reescribir código.

- **2.** Reutilización de funcionalidades: puedes utilizar APIs para integrar funciones ya desarrolladas, como pagos en línea, geolocalización, y procesamiento de imágenes, sin tener que desarrollarlas desde cero.

- **3.** Modularidad: usar APIs permite que las aplicaciones sean modulares, dividiendo las funcionalidades en servicios distintos.

**Conclusión**
Las APIs son esenciales para el desarrollo moderno de software, ya que permiten que diferentes sistemas, servicios y aplicaciones interactúen entre sí de manera eficiente, sin tener que conocer su implementación interna.

```python
# Ejemplo básico de uso de una API en Python (con requests)
# En Python, podemos interactuar con una API utilizando la librería requests. Aquí tienes un ejemplo de cómo hacer una solicitud GET a una API pública:
# Este ejemplo hace una solicitud a la API de OpenWeather para obtener el clima en Londres. La clave appid=your_api_key es necesaria para autenticar la solicitud.

import requests

# URL de la API pública de ejemplo
url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=your_api_key"

# Hacer una solicitud GET a la API
response = requests.get(url)

# Verificar si la solicitud fue exitosa
if response.status_code == 200:
    # Convertir la respuesta JSON a un diccionario de Python
    data = response.json()

    # Acceder a los datos del clima
    print(f"Clima en {data['name']}: {data['weather'][0]['description']}")
else:
    print("Error al obtener datos de la API")

# Otro ejemplo
import requests

# Mostrar todos los personajes
# url = 'https://rickandmortyapi.com/api/character'
# Realizar la solicitud GET a la API de Rick and Morty
response = requests.get("https://rickandmortyapi.com/api/character")

# Comprobar si la solicitud fue exitosa
if response.status_code == 200:
    # Parsear los datos JSON recibidos
    character_data = response.json()

    # Extraer la lista de personajes
    characters = character_data["results"]

    # Imprimir los nombres de los personajes
    for character in characters:
        print(character["name"])
else:
    print("Error al obtener los datos:", response.status_code)
```
