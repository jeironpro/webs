# API Juego de Preguntas y Respuestas

API RESTful para un juego de trivia con 350 preguntas distribuidas en 7 categorias. Construida con Flask + PostgreSQL, desplegada en Fly.io.

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/api/categorias` | Lista las categorias disponibles |
| `GET` | `/api/preguntas` | Lista todas las preguntas (admite `?categoria=` y `?page=`) |
| `POST` | `/api/preguntas` | Crea una nueva pregunta |
| `GET` | `/api/preguntas/aleatoria` | Obtiene una pregunta al azar (admite `?categoria=` y `?excluir_ids=`) |
| `GET` | `/api/preguntas/<id>` | Obtiene una pregunta por ID |
| `PUT` | `/api/preguntas/<id>` | Actualiza una pregunta |
| `DELETE` | `/api/preguntas/<id>` | Elimina una pregunta |
| `POST` | `/api/preguntas/<id>/validar` | Valida una respuesta (`{"respuesta": "texto"}`) |
| `GET` | `/apidocs/` | Swagger UI con documentacion interactiva |

## Autenticacion

Via header `X-API-Key` o query param `api_key`. Si la variable `API_KEYS` esta vacia, la autenticacion se deshabilita (dev local).

## Stack

- Python 3.12 + Flask
- PostgreSQL (Neon)
- SQLAlchemy + psycopg2-binary
- Flasgger (Swagger)
- Docker + Fly.io

## Desarrollo local

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env  # editar DATABASE_URL y API_KEYS
python app.py
```

## Despliegue

```bash
fly launch
fly secrets set DATABASE_URL=postgresql://...
fly secrets set API_KEYS=key1,key2
fly deploy
```

## Licencia

MIT
