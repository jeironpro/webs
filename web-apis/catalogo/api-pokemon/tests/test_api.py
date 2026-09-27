# Define los headers estándar que se enviarán en cada petición autenticada
# Incluye la API Key de prueba configurada en conftest.py
HEADERS = {"X-API-Key": "test-api-key-123"}


# Prueba que una petición sin API Key sea rechazada con error 401
def test_sin_api_key_devuelve_401(client):
    """Verifica que una petición sin API Key sea rechazada."""
    # Realiza una petición GET sin enviar el header X-API-Key
    response = client.get("/pokemones")
    # Verifica que el código de estado sea 401 (No autorizado)
    assert response.status_code == 401
    # Verifica que el mensaje de error indique que falta la API Key
    assert response.json()["detail"] == "API Key requerida"


# Prueba que una API Key incorrecta sea rechazada con error 403
def test_api_key_invalida_devuelve_403(client):
    """Verifica que una API Key incorrecta sea rechazada."""
    # Realiza una petición GET con una API Key que no coincide con la configurada
    response = client.get("/pokemones", headers={"X-API-Key": "clave-incorrecta"})
    # Verifica que el código de estado sea 403 (Prohibido)
    assert response.status_code == 403
    # Verifica que el mensaje de error indique que la API Key es inválida
    assert response.json()["detail"] == "API Key inválida"


# Prueba que la lista de Pokémon devuelva vacía al iniciar la aplicación
def test_obtener_pokemones_vacio(client):
    """Verifica que la lista de Pokémon devuelva vacía al inicio."""
    # Realiza una petición GET autenticada al endpoint de pokemones
    response = client.get("/pokemones", headers=HEADERS)
    # Verifica que la petición sea exitosa (código 200)
    assert response.status_code == 200
    # Verifica que la respuesta sea una lista vacía
    assert response.json() == []


# Prueba que se pueda crear un Pokémon y luego recuperarlo en la lista general
def test_agregar_y_obtener_pokemon(client):
    """Crea un Pokémon y verifica que aparezca en la lista general."""
    # Define los datos de un Pokémon de prueba llamado Pikachu
    pokemon_data = {
        "nombre": "Pikachu",
        "descripcion": "Electric type",
        "tipos": [{"nombre": "Electrico"}],
        "estadisticas": {
            "punto_salud": 100,
            "ataque": 55,
            "defensa": 40,
            "ataque_especial": 50,
            "defensa_especial": 50,
            "velocidad": 90
        }
    }

    # Envía una petición POST autenticada para crear el Pokémon
    response = client.post("/agregar_pokemon", json=pokemon_data, headers=HEADERS)
    # Verifica que la creación sea exitosa
    assert response.status_code == 200
    # Verifica el mensaje de confirmación
    assert response.json() == {"msg": "Pokemon creado correctamente"}

    # Envía una petición GET autenticada para obtener todos los Pokémon
    response = client.get("/pokemones", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Obtiene los datos de la respuesta
    data = response.json()
    # Verifica que haya exactamente un Pokémon registrado
    assert len(data) == 1
    # Verifica que el nombre del Pokémon sea Pikachu
    assert data[0]["nombre"] == "Pikachu"
    # Verifica que los puntos de salud sean 100
    assert data[0]["estadisticas"]["punto_salud"] == 100


# Prueba que se pueda crear un Pokémon y recuperarlo mediante su ID
def test_obtener_pokemon_por_id(client):
    """Crea un Pokémon y lo recupera mediante su ID."""
    # Define los datos de un Pokémon de prueba llamado Charmander
    pokemon_data = {
        "nombre": "Charmander",
        "descripcion": "Fire type",
        "tipos": [{"nombre": "Fuego"}],
        "estadisticas": {
            "punto_salud": 80,
            "ataque": 52,
            "defensa": 43,
            "ataque_especial": 60,
            "defensa_especial": 50,
            "velocidad": 65
        }
    }

    # Crea el Pokémon de prueba con una petición POST autenticada
    client.post("/agregar_pokemon", json=pokemon_data, headers=HEADERS)

    # Recupera el Pokémon creado usando su ID (debería ser 1)
    response = client.get("/pokemones/1", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Verifica que el nombre del Pokémon sea Charmander
    assert response.json()["nombre"] == "Charmander"


# Prueba que se retorne un error 404 al buscar un ID que no existe
def test_obtener_pokemon_por_id_no_existe(client):
    """Verifica que se retorne 404 al buscar un ID inexistente."""
    # Realiza una petición GET autenticada con un ID que no existe en la base de datos
    response = client.get("/pokemones/999", headers=HEADERS)
    # Verifica que el código de estado sea 404 (No encontrado)
    assert response.status_code == 404
    # Verifica que el mensaje de error sea el esperado
    assert response.json()["detail"] == "Pokemon no encontrado"


# Prueba que se puedan filtrar Pokémon por tipo (búsqueda insensible a mayúsculas)
def test_obtener_pokemones_por_tipo(client):
    """Crea un Pokémon y lo filtra por tipo (búsqueda insensible a mayúsculas)."""
    # Define los datos de un Pokémon de prueba llamado Squirtle
    pokemon_data = {
        "nombre": "Squirtle",
        "descripcion": "Water type",
        "tipos": [{"nombre": "Agua"}],
        "estadisticas": {
            "punto_salud": 90,
            "ataque": 48,
            "defensa": 65,
            "ataque_especial": 50,
            "defensa_especial": 64,
            "velocidad": 43
        }
    }

    # Crea el Pokémon de prueba con una petición POST autenticada
    client.post("/agregar_pokemon", json=pokemon_data, headers=HEADERS)

    # Filtra los Pokémon por el tipo "agua" (en minúsculas para probar la insensibilidad)
    response = client.get("/pokemones/tipo/agua", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Verifica que se encuentre exactamente un Pokémon
    assert len(response.json()) == 1
    # Verifica que el nombre del Pokémon sea Squirtle
    assert response.json()[0]["nombre"] == "Squirtle"


# Prueba que se pueda subir una imagen a un Pokémon existente
def test_subir_imagen_a_pokemon(client):
    """Crea un Pokémon, sube una imagen y verifica que se devuelva la URL."""
    # Define los datos del Pokémon de prueba
    pokemon_data = {
        "nombre": "Bulbasaur",
        "descripcion": "Grass type",
        "tipos": [{"nombre": "Planta"}],
        "estadisticas": {
            "punto_salud": 90,
            "ataque": 49,
            "defensa": 49,
            "ataque_especial": 65,
            "defensa_especial": 65,
            "velocidad": 45
        }
    }

    # Crea el Pokémon de prueba con una petición POST autenticada
    response = client.post("/agregar_pokemon", json=pokemon_data, headers=HEADERS)
    assert response.status_code == 200

    # Prepara un archivo de imagen simulado (bytes PNG ficticios)
    imagen_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100

    # Envía una petición POST autenticada para subir la imagen
    response = client.post(
        "/pokemones/1/imagen",
        files={"file": ("bulbasaur.png", imagen_bytes, "image/png")},
        headers=HEADERS
    )
    # Verifica que la subida sea exitosa
    assert response.status_code == 200
    # Verifica que la respuesta contenga la URL de la imagen
    data = response.json()
    assert "imagen_url" in data
    # Verifica que la URL sea la devuelta por el mock de Supabase
    assert data["imagen_url"] == "https://test.supabase.co/pokemon-imagenes/test-image.png"

    # Verifica que el Pokémon ahora tenga la imagen en su respuesta
    response = client.get("/pokemones/1", headers=HEADERS)
    assert response.status_code == 200
    assert response.json()["imagen_url"] == "https://test.supabase.co/pokemon-imagenes/test-image.png"


# Prueba que devuelva error 404 al subir imagen a un Pokémon que no existe
def test_subir_imagen_pokemon_no_existe(client):
    """Verifica que devuelva 404 al intentar subir imagen a un Pokémon inexistente."""
    # Prepara un archivo de imagen simulado
    imagen_bytes = b"datos_de_imagen_falsos"

    # Intenta subir una imagen a un Pokémon con ID que no existe
    response = client.post(
        "/pokemones/999/imagen",
        files={"file": ("test.png", imagen_bytes, "image/png")},
        headers=HEADERS
    )
    # Verifica que el código de estado sea 404
    assert response.status_code == 404


# Prueba que un tipo sin Pokémon devuelva una lista vacía
def test_obtener_pokemones_por_tipo_sin_resultados(client):
    """Verifica que un tipo sin Pokémon devuelva una lista vacía."""
    # Realiza una búsqueda autenticada de un tipo que no existe en la base de datos
    response = client.get("/pokemones/tipo/inexistente", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Verifica que la respuesta sea una lista vacía
    assert response.json() == []
