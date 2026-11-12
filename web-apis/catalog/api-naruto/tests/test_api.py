# Define los headers estándar que se enviarán en cada petición autenticada
# Incluye la API Key de prueba configurada en conftest.py
HEADERS = {"X-API-Key": "test-api-key-123"}


# Prueba que una petición sin API Key sea rechazada con error 401
def test_sin_api_key_devuelve_401(client):
    """Verifica que una petición sin API Key sea rechazada."""
    # Realiza una petición GET sin enviar el header X-API-Key
    response = client.get("/personajes")
    # Verifica que el código de estado sea 401 (No autorizado)
    assert response.status_code == 401
    # Verifica que el mensaje de error indique que falta la API Key
    assert response.json()["detail"] == "API Key requerida"


# Prueba que una API Key incorrecta sea rechazada con error 403
def test_api_key_invalida_devuelve_403(client):
    """Verifica que una API Key incorrecta sea rechazada."""
    # Realiza una petición GET con una API Key que no coincide con la configurada
    response = client.get("/personajes", headers={"X-API-Key": "clave-incorrecta"})
    # Verifica que el código de estado sea 403 (Prohibido)
    assert response.status_code == 403
    # Verifica que el mensaje de error indique que la API Key es inválida
    assert response.json()["detail"] == "API Key inválida"


# Prueba que la lista de personajes devuelva vacía al iniciar la aplicación
def test_obtener_personajes_vacio(client):
    """Verifica que la lista de personajes devuelva vacía al inicio."""
    # Realiza una petición GET autenticada al endpoint de personajes
    response = client.get("/personajes", headers=HEADERS)
    # Verifica que la petición sea exitosa (código 200)
    assert response.status_code == 200
    # Verifica que la respuesta sea una lista vacía
    assert response.json() == []


# Prueba que se pueda crear un personaje y luego recuperarlo en la lista general
def test_agregar_y_obtener_personaje(client):
    """Crea un personaje y verifica que aparezca en la lista general."""
    # Define los datos de un personaje de prueba: Naruto Uzumaki
    personaje_data = {
        "nombre": "Naruto Uzumaki",
        "aldea": "Konoha",
        "equipo": "Equipo 7",
        "rango": "Genin",
        "habilidades": ["Rasengan", "Multiclones de Sombras"],
        "debilidades": ["Impaciencia"],
        "fortalezas": ["Voluntad inquebrantable"],
        "estadisticas": {"fuerza": 7, "habilidad": 6, "resistencia": 9, "estrategia": 5}
    }

    # Envía una petición POST autenticada para crear el personaje
    response = client.post("/personajes", json=personaje_data, headers=HEADERS)
    # Verifica que la creación sea exitosa
    assert response.status_code == 200
    # Verifica el mensaje de confirmación
    assert response.json() == {"msg": "Personaje creado correctamente"}

    # Envía una petición GET autenticada para obtener todos los personajes
    response = client.get("/personajes", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Obtiene los datos de la respuesta
    data = response.json()
    # Verifica que haya exactamente un personaje registrado
    assert len(data) == 1
    # Verifica que el nombre del personaje sea Naruto Uzumaki
    assert data[0]["nombre"] == "Naruto Uzumaki"
    # Verifica los campos principales del personaje
    assert data[0]["aldea"] == "Konoha"
    assert data[0]["rango"] == "Genin"
    assert data[0]["equipo"] == "Equipo 7"
    # Verifica que las habilidades, debilidades y fortalezas sean listas de strings
    assert "Rasengan" in data[0]["habilidades"]
    assert "Impaciencia" in data[0]["debilidades"]
    assert "Voluntad inquebrantable" in data[0]["fortalezas"]
    # Verifica los valores de las estadísticas
    assert data[0]["estadisticas"]["fuerza"] == 7
    assert data[0]["estadisticas"]["estrategia"] == 5


# Prueba que se pueda crear un personaje y recuperarlo mediante su ID
def test_obtener_personaje_por_id(client):
    """Crea un personaje y lo recupera mediante su ID."""
    # Define los datos de un personaje de prueba: Sasuke Uchiha
    personaje_data = {
        "nombre": "Sasuke Uchiha",
        "aldea": "Konoha",
        "equipo": "Equipo 7",
        "rango": "Genin",
        "habilidades": ["Chidori", "Sharingan"],
        "debilidades": ["Arrogancia"],
        "fortalezas": ["Genio táctico"],
        "estadisticas": {"fuerza": 8, "habilidad": 9, "resistencia": 7, "estrategia": 8}
    }

    # Crea el personaje de prueba con una petición POST autenticada
    client.post("/personajes", json=personaje_data, headers=HEADERS)

    # Recupera el personaje creado usando su ID (debería ser 1)
    response = client.get("/personajes/1", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Verifica que el nombre del personaje sea Sasuke Uchiha
    assert response.json()["nombre"] == "Sasuke Uchiha"


# Prueba que se retorne un error 404 al buscar un ID que no existe
def test_obtener_personaje_por_id_no_existe(client):
    """Verifica que se retorne 404 al buscar un ID inexistente."""
    # Realiza una petición GET autenticada con un ID que no existe en la base de datos
    response = client.get("/personajes/999", headers=HEADERS)
    # Verifica que el código de estado sea 404 (No encontrado)
    assert response.status_code == 404
    # Verifica que el mensaje de error sea el esperado
    assert response.json()["detail"] == "Personaje no encontrado"


# Prueba que se puedan filtrar personajes por aldea (búsqueda insensible a mayúsculas)
def test_obtener_personajes_por_aldea(client):
    """Crea un personaje y lo filtra por aldea (búsqueda insensible a mayúsculas)."""
    # Define los datos de un personaje de prueba: Gaara de Sunagakure
    personaje_data = {
        "nombre": "Gaara",
        "aldea": "Sunagakure",
        "equipo": "Hermanos de Arena",
        "rango": "Genin",
        "habilidades": ["Arena Shukaku"],
        "debilidades": ["Insomnio"],
        "fortalezas": ["Defensa automática"],
        "estadisticas": {"fuerza": 9, "habilidad": 8, "resistencia": 9, "estrategia": 7}
    }

    # Crea el personaje de prueba con una petición POST autenticada
    client.post("/personajes", json=personaje_data, headers=HEADERS)

    # Filtra los personajes por la aldea "sunagakure" (en minúsculas para probar la insensibilidad)
    response = client.get("/personajes/aldea/sunagakure", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Verifica que se encuentre exactamente un personaje
    assert len(response.json()) == 1
    # Verifica que el nombre del personaje sea Gaara
    assert response.json()[0]["nombre"] == "Gaara"


# Prueba que se puedan filtrar personajes por rango (búsqueda insensible a mayúsculas)
def test_obtener_personajes_por_rango(client):
    """Crea un personaje y lo filtra por rango (búsqueda insensible a mayúsculas)."""
    personaje_data = {
        "nombre": "Kakashi Hatake",
        "aldea": "Konoha",
        "equipo": "Equipo 7",
        "rango": "Jōnin",
        "habilidades": ["Chidori"],
        "debilidades": ["Falta de motivación"],
        "fortalezas": ["Experiencia"],
        "estadisticas": {"fuerza": 8, "habilidad": 9, "resistencia": 7, "estrategia": 10}
    }

    # Crea el personaje de prueba
    client.post("/personajes", json=personaje_data, headers=HEADERS)

    # Filtra por rango "jōnin"
    response = client.get("/personajes/rango/jōnin", headers=HEADERS)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["nombre"] == "Kakashi Hatake"


# Prueba que se puedan filtrar personajes por equipo (búsqueda insensible a mayúsculas)
def test_obtener_personajes_por_equipo(client):
    """Crea un personaje y lo filtra por equipo (búsqueda insensible a mayúsculas)."""
    personaje_data = {
        "nombre": "Shikamaru Nara",
        "aldea": "Konoha",
        "equipo": "Equipo 10",
        "rango": "Genin",
        "habilidades": ["Sombra Imitadora"],
        "debilidades": ["Pereza"],
        "fortalezas": ["Estratega"],
        "estadisticas": {"fuerza": 4, "habilidad": 7, "resistencia": 5, "estrategia": 10}
    }

    # Crea el personaje de prueba
    client.post("/personajes", json=personaje_data, headers=HEADERS)

    # Filtra por equipo "equipo 10"
    response = client.get("/personajes/equipo/equipo 10", headers=HEADERS)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["nombre"] == "Shikamaru Nara"


# Prueba que una aldea sin personajes devuelva una lista vacía
def test_obtener_personajes_por_aldea_sin_resultados(client):
    """Verifica que una aldea sin personajes devuelva una lista vacía."""
    # Realiza una búsqueda autenticada de una aldea que no existe en la base de datos
    response = client.get("/personajes/aldea/inexistente", headers=HEADERS)
    # Verifica que la consulta sea exitosa
    assert response.status_code == 200
    # Verifica que la respuesta sea una lista vacía
    assert response.json() == []


# Prueba que un rango sin personajes devuelva una lista vacía
def test_obtener_personajes_por_rango_sin_resultados(client):
    """Verifica que un rango sin personajes devuelva una lista vacía."""
    response = client.get("/personajes/rango/inexistente", headers=HEADERS)
    assert response.status_code == 200
    assert response.json() == []
