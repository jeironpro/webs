# API Pokemón

API REST para gestionar una colección completa de los 1025 Pokémon (9 generaciones) con tipos, estadísticas, colores e imágenes. Construida con FastAPI y desplegada en Render con base de datos PostgreSQL en Supabase.

## Tecnologías

- **FastAPI** — Framework web Python
- **SQLModel** — ORM sobre SQLAlchemy + Pydantic
- **PostgreSQL (Supabase)** — Base de datos
- **Supabase Storage** — Almacenamiento de imágenes
- **Render** — Despliegue
- **Pytest** — Tests

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/agregar_pokemon` | Crear un Pokémon |
| `GET` | `/pokemones` | Listar todos los Pokémon |
| `GET` | `/pokemones/{id}` | Obtener Pokémon por ID |
| `GET` | `/pokemones/tipo/{tipo}` | Filtrar por tipo |
| `POST` | `/pokemones/{id}/imagen` | Subir imagen del Pokémon |

### Crear Pokémon

```
POST /agregar_pokemon
X-API-Key: tu-clave

{
    "nombre": "Pikachu",
    "descripcion": "Cuando se enfada, lanza potentes descargas eléctricas.",
    "generacion": 1,
    "tipos": [
        { "nombre": "Electrico", "color": "#F8D030" }
    ],
    "estadisticas": {
        "punto_salud": 3,
        "ataque": 3,
        "defensa": 3,
        "ataque_especial": 3,
        "defensa_especial": 3,
        "velocidad": 5
    }
}
```

Respuesta: `{ "msg": "Pokemon creado correctamente" }`

### Listar Pokémon

```
GET /pokemones
X-API-Key: tu-clave
```

Respuesta:
```json
[
    {
        "id": 1,
        "nombre": "Bulbasaur",
        "descripcion": "Tras nacer, crece alimentándose...",
        "generacion": 1,
        "imagen_url": "https://...",
        "tipos": [
            { "nombre": "Planta", "color": "#78C850" },
            { "nombre": "Veneno", "color": "#A040A0" }
        ],
        "estadisticas": {
            "punto_salud": 3,
            "ataque": 3,
            "defensa": 3,
            "ataque_especial": 4,
            "defensa_especial": 4,
            "velocidad": 3
        }
    }
]
```

### Obtener Pokémon por ID

```
GET /pokemones/1
X-API-Key: tu-clave
```

### Filtrar por tipo

```
GET /pokemones/tipo/fuego
X-API-Key: tu-clave
```

Búsqueda insensible a mayúsculas/minúsculas.

### Subir imagen

```
POST /pokemones/1/imagen
X-API-Key: tu-clave
Content-Type: multipart/form-data

file: (imagen.png)
```

La imagen se almacena en Supabase Storage y la URL pública se guarda en el registro del Pokémon.

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
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key
FRONTEND_URL=https://tufrontend.com
```

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | Sí | URL de conexión PostgreSQL |
| `API_KEY` | Sí | Clave para autenticar peticiones |
| `SUPABASE_URL` | No (sin imágenes) | URL del proyecto Supabase |
| `SUPABASE_SERVICE_KEY` | No (sin imágenes) | Service Role Key de Supabase |
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

El script `scripts/registrar_pokemones.py` crea los 1025 Pokémon y sube sus imágenes a Supabase Storage.

Requiere los datos en `~/Repositorios/privado/`:

```
privado/
├── coleccion-pokemon-json/
│   ├── pokemons_primera_generacion.json
│   ├── ...
│   └── tipos_colores.json
└── imagenes-pokemon/
    ├── primera_generacion/
    │   ├── Bulbasaur.png
    │   └── ...
    └── ...
```

Ejecutar:

```bash
python3 scripts/registrar_pokemones.py \
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
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
5. Crear bucket `pokemon-imagenes` en Supabase Storage (público)

## Licencia

MIT
