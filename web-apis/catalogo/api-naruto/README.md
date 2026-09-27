# API Naruto

API REST para gestionar personajes de Naruto con habilidades, debilidades, fortalezas, estadísticas e imágenes. Construida con FastAPI y desplegada en Render con base de datos PostgreSQL.

## Tecnologías

- **FastAPI** — Framework web Python
- **SQLModel** — ORM sobre SQLAlchemy + Pydantic
- **PostgreSQL (Render)** — Base de datos
- **Render** — Despliegue
- **Pytest** — Tests

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/personajes` | Crear un personaje |
| `GET` | `/personajes` | Listar todos los personajes |
| `GET` | `/personajes/{id}` | Obtener personaje por ID |
| `GET` | `/personajes/aldea/{aldea}` | Filtrar por aldea |
| `GET` | `/personajes/rango/{rango}` | Filtrar por rango |
| `GET` | `/personajes/equipo/{equipo}` | Filtrar por equipo |

### Crear Personaje

```
POST /personajes
X-API-Key: tu-clave

{
    "nombre": "Naruto Uzumaki",
    "aldea": "Konoha",
    "equipo": "Equipo 7",
    "rango": "Genin",
    "habilidades": ["Rasengan", "Multiclones de Sombras"],
    "debilidades": ["Impaciencia"],
    "fortalezas": ["Voluntad inquebrantable"],
    "estadisticas": {
        "fuerza": 7,
        "habilidad": 6,
        "resistencia": 9,
        "estrategia": 5
    }
}
```

Respuesta: `{ "msg": "Personaje creado correctamente" }`

### Listar Personajes

```
GET /personajes
X-API-Key: tu-clave
```

Respuesta:
```json
[
    {
        "id": 1,
        "nombre": "Naruto Uzumaki",
        "aldea": "Konoha",
        "equipo": "Equipo 7",
        "rango": "Genin",
        "imagen_url": null,
        "habilidades": ["Rasengan", "Multiclones de Sombras"],
        "debilidades": ["Impaciencia"],
        "fortalezas": ["Voluntad inquebrantable"],
        "estadisticas": {
            "fuerza": 7,
            "habilidad": 6,
            "resistencia": 9,
            "estrategia": 5
        }
    }
]
```

### Obtener Personaje por ID

```
GET /personajes/1
X-API-Key: tu-clave
```

### Filtrar por Aldea

```
GET /personajes/aldea/konoha
X-API-Key: tu-clave
```

Búsqueda insensible a mayúsculas/minúsculas.

### Filtrar por Rango

```
GET /personajes/rango/jōnin
X-API-Key: tu-clave
```

### Filtrar por Equipo

```
GET /personajes/equipo/equipo 7
X-API-Key: tu-clave
```

## Autenticación

Todas las peticiones requieren el header `X-API-Key` con el valor configurado en la variable de entorno `API_KEY`.

| Código | Significado |
|--------|-------------|
| `401` | API Key no enviada |
| `403` | API Key inválida |
| `500` | API_KEY no configurada en el servidor |

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/bd
API_KEY=mi_clave_secreta
FRONTEND_URL=https://tufrontend.com
```

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | Sí | URL de conexión PostgreSQL (Render) |
| `API_KEY` | Sí | Clave para autenticar peticiones |
| `FRONTEND_URL` | No | URL del frontend para CORS |

## Instalación Local

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Editar .env con tus credenciales

uvicorn main:app --reload
```

## Tests

```bash
pytest tests/ -v
```

## Poblar Base de Datos

El script `scripts/registrar_personajes.py` crea los 129 personajes desde `data/personajes.json`.

```bash
python3 scripts/registrar_personajes.py \
    --api-key "$(grep API_KEY .env | cut -d= -f2)" \
    --api-url http://localhost:8000
```

## Despliegue en Render

1. Conectar repositorio
2. Crear Web Service (Python)
3. Comando de inicio:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Variables de entorno en Render Dashboard:
   - `DATABASE_URL`
   - `API_KEY`
   - `FRONTEND_URL`

## Licencia

MIT
