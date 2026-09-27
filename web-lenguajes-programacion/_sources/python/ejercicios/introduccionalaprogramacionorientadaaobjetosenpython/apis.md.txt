# Ejercicios — Apis

## apis_adicionales1

Solicitar datos de una API pública

Usa la API de Open-Meteo para obtener el clima de una provincia en la República Dominicana. Utiliza el método GET para obtener información sobre el clima de la provincia y muestra la temperatura y el estado del clima.

**Pasos**
1. Realiza una solicitud GET a la API de Open-Meteo.

- **2.** Muestra la temperatura y el estado del clima de la provincia.

**Solución**

```python
import requests

def obtener_clima(provincia):
    url = f'https://api.open-meteo.com/v1/forecast?latitude={provincia["lat"]}&longitude={provincia["lon"]}&current_weather=true'
    
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        clima = data['current_weather']
        temperatura = clima['temperature']
        estado_clima = clima['weathercode']

        print(f"Temperatura actual: {temperatura}°C")
        print(f"Estado del clima: {estado_clima}")
    else:
        print("Error al obtener los datos del clima.")

provincias_rd = {
    "Azua": {"lat": 18.4833, "lon": -70.7386},
    "Bahoruco": {"lat": 18.2269, "lon": -71.1497},
    "Barahona": {"lat": 18.2197, "lon": -71.1353},
    "Dajabón": {"lat": 19.3972, "lon": -71.6892},
    "Distrito Nacional": {"lat": 18.4861, "lon": -69.9312},
    "Duarte": {"lat": 19.3000, "lon": -69.9833},
    "El Seibo": {"lat": 18.7181, "lon": -68.9233},
    "Espaillat": {"lat": 19.4783, "lon": -70.5542},
    "Hato Mayor": {"lat": 18.6781, "lon": -69.2697},
    "Independencia": {"lat": 18.4936, "lon": -71.4236},
    "La Altagracia": {"lat": 18.6167, "lon": -68.7069},
    "La Romana": {"lat": 18.4231, "lon": -68.9440},
    "La Vega": {"lat": 19.2194, "lon": -70.5328},
    "Monte Cristi": {"lat": 19.8156, "lon": -71.6347},
    "Monte Plata": {"lat": 19.2206, "lon": -69.7608},
    "Pedernales": {"lat": 18.1500, "lon": -71.7500},
    "Peravia": {"lat": 18.2833, "lon": -70.3333},
    "Puerto Plata": {"lat": 19.7732, "lon": -70.6936},
    "Hermanas Mirabal": {"lat": 19.3294, "lon": -70.5572},
    "Samaná": {"lat": 19.2000, "lon": -69.3000},
    "San Cristóbal": {"lat": 18.4150, "lon": -70.0980},
    "San José de Ocoa": {"lat": 18.4644, "lon": -70.5922},
    "San Juan": {"lat": 18.8208, "lon": -71.5247},
    "San Pedro de Macorís": {"lat": 18.4528, "lon": -69.3000},
    "Santiago": {"lat": 19.4511, "lon": -70.6969},
    "Santiago Rodríguez": {"lat": 19.2644, "lon": -71.2106},
    "Santo Domingo": {"lat": 18.4861, "lon": -69.9312},
    "Valverde": {"lat": 19.3300, "lon": -71.3700},
    "Monte Plata": {"lat": 19.2206, "lon": -69.7608},
    "María Trinidad Sánchez": {"lat": 19.3000, "lon": -69.2000}
}

print("Elija una provincia de la República Dominicana:")
for provincia in provincias_rd:
    print(f"- {provincia}")

provincia = input("Ingrese el nombre de la provincia: ")

if provincia.title() in provincias_rd:
    obtener_clima(provincias_rd[provincia.title()])
else:
    print("Provincia no encontrada en la base de datos.")
```

## apis_adicionales2

Consumir la API de JSONPlaceholder

JSONPlaceholder es una API falsa para hacer pruebas. Usa su endpoint /posts para obtener los primeros 5 posts de los usuarios.

**Pasos**
1. Realiza una solicitud GET al endpoint https://jsonplaceholder.typicode.com/posts.

- **2.** Muestra los primeros 5 posts (puedes mostrar el título y el cuerpo del post).

**Solución**

```python
import requests

def obtener_posts():
    url = 'https://jsonplaceholder.typicode.com/posts'

    response = requests.get(url)

    if response.status_code == 200:
        posts = response.json()

        for i in range(5):
            post = posts[i]
            print(f"Post {i+1}:")
            print(f"Título: {post['title']}")
            print(f"Cuerpo: {post['body']}\n")
    else:
        print("Error al obtener los posts.")

obtener_posts()
```

## apis_adicionales3

Consultar información de un usuario

Usa la API de GitHub para obtener información de un usuario. Realiza una solicitud GET al endpoint de GitHub para obtener los detalles de un usuario por su nombre de usuario.

**Pasos**
1. Pide al usuario ingresar un nombre de usuario de GitHub.

- **2.** Realiza una solicitud GET al endpoint https://api.github.com/users/{username}.

- **3.** Muestra el nombre completo y la cantidad de repositorios del usuario.

**Solución**

```python
import requests

def obtener_usuario_github():
    usuario = input("Ingresa el nombre de usuario de GitHub: ")
    url = f'https://api.github.com/users/{usuario}'

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        nombre_completo = data.get('name', 'No disponible')
        cantidad_repos = data.get('public_repos', 0)

        print(f"Nombre completo: {nombre_completo}")
        print(f"Cantidad de repositorios públicos: {cantidad_repos}")
    else:
        print("Usuario no encontrado o error en la solicitud.")

obtener_usuario_github()
```

## apis_adicionales4

API de la NASA (Imagen del Día)

Usa la API de la NASA para obtener la imagen del día. La API proporciona imágenes del espacio junto con su descripción.

**Pasos**
1. Realiza una solicitud GET a https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY.

- **2.** Muestra el título y la URL de la imagen del día.

**Solución**

```python
import requests

def obtener_info_imagen_del_dia():
    url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        titulo_imagen = data.get('title', 'No disponible')
        url_imagen = data.get('url', 'No disponible')

        print(f"Título de la imagen del día: {titulo_imagen}")
        print(f"URL de la imagen: {url_imagen}")
    else:
        print("Error al obtener la imagen del día.")

obtener_info_imagen_del_dia()
```

## apis_adicionales5

Enviar datos a una API

Usa la API de JSONPlaceholder para crear un nuevo post. Utiliza el método POST para enviar datos como el título y el cuerpo del post.

**Pasos**
1. Pide al usuario que ingrese un título y un cuerpo para un post.

- **2.** Realiza una solicitud POST a https://jsonplaceholder.typicode.com/posts con los datos del post.

- **3.** Muestra la respuesta de la API, que debería contener el ID del nuevo post creado.

**Solución**

```python
import requests

def crear_post():
    titulo = input("Ingrese el título del post: ")
    cuerpo = input("Ingrese el cuerpo del post: ")

    datos = {
        "title": titulo,
        "cuerpo": cuerpo,
        "userId": 1
    }

    url = 'https://jsonplaceholder.typicode.com/posts'
    response = requests.post(url, json=datos)

    if response.status_code == 201:
        post_creado = response.json()
        print(f"Nuevo posrt creado con ID: {post_creado['id']}")
    else:
        print("Error al crear el post.")

crear_post()
```
