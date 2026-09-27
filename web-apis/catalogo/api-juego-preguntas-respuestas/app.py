import json
import os
from functools import wraps

from flask import Flask, jsonify, request
from flasgger import Swagger, swag_from
from dotenv import load_dotenv
from flask_cors import CORS

from models import Pregunta, db

# Carga variables de entorno desde .env (solo desarrollo; en produccion
# se usan las variables del contenedor / Fly.io secrets).
load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# API_KEYS: lista separada por comas. Si esta vacia, la autenticacion
# se deshabilita (util en desarrollo local).
API_KEYS = [k.strip() for k in os.getenv('API_KEYS', '').split(',') if k.strip()]

app.config['SWAGGER'] = {
    'title': 'Juego de Preguntas y Respuestas API',
    'description': 'API para gestionar preguntas de un juego de trivia. CRUD completo y endpoints para consumir desde un frontend.',
    'version': '1.0.0',
    'uiversion': 3,
    'securityDefinitions': {
        'ApiKeyAuth': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'X-API-Key',
            'description': 'API key de acceso. Enviar en header X-API-Key o query param api_key.'
        }
    },
    'security': [{'ApiKeyAuth': []}],
}

CORS(app)
db.init_app(app)
swagger = Swagger(app)

CATEGORIAS_VALIDAS = [
    "Geografia", "Literatura", "Historia",
    "Ciencia", "Arte", "Deporte", "Algebra"
]


def requiere_api_key(f):
    # Decorador que protege los endpoints de la API.
    # Si API_KEYS esta vacio, permite el paso sin clave.
    # Acepta la clave via header X-API-Key o query param api_key.
    @wraps(f)
    def decorada(*args, **kwargs):
        if not API_KEYS:
            return f(*args, **kwargs)

        api_key = request.headers.get('X-API-Key') or request.args.get('api_key')
        if not api_key or api_key not in API_KEYS:
            return jsonify({'error': 'API key inválida o no proporcionada'}), 401
        return f(*args, **kwargs)
    return decorada


def init_db():
    # Crea las tablas si no existen. Se ejecuta al importar el modulo
    # para que gunicorn (multi-worker) las tenga disponibles.
    with app.app_context():
        db.create_all()


def obtener_pregunta_aleatoria(categoria=None, excluir_ids=None):
    # Query optimizada para el frontend: una pregunta al azar,
    # con filtro opcional de categoria y exclusion de IDs ya mostrados.
    query = Pregunta.query
    if categoria:
        query = query.filter_by(categoria=categoria)
    if excluir_ids:
        query = query.filter(~Pregunta.id.in_(excluir_ids))
    return query.order_by(db.func.random()).first()


# ---------------------------------------------------------------------------
# Endpoints CRUD de preguntas
# ---------------------------------------------------------------------------

@app.route('/api/preguntas', methods=['GET'])
@requiere_api_key
@swag_from({
    'tags': ['Preguntas'],
    'summary': 'Listar todas las preguntas',
    'parameters': [
        {
            'name': 'categoria',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filtrar por categoría'
        }
    ],
    'responses': {
        200: {
            'description': 'Lista de preguntas',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'pregunta': {'type': 'string'},
                        'respuestas': {'type': 'array', 'items': {'type': 'string'}},
                        'respuesta_correcta': {'type': 'string'},
                        'categoria': {'type': 'string'}
                    }
                }
            }
        }
    }
})
def api_listar_preguntas():
    categoria = request.args.get('categoria')
    query = Pregunta.query
    if categoria:
        query = query.filter_by(categoria=categoria)
    preguntas = query.order_by(Pregunta.categoria, Pregunta.id).all()
    return jsonify([p.to_dict() for p in preguntas])


@app.route('/api/preguntas/<int:id>', methods=['GET'])
@requiere_api_key
@swag_from({
    'tags': ['Preguntas'],
    'summary': 'Obtener una pregunta por ID',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID de la pregunta'
        }
    ],
    'responses': {
        200: {'description': 'Pregunta encontrada'},
        404: {'description': 'Pregunta no encontrada'}
    }
})
def api_obtener_pregunta(id):
    pregunta = db.session.get(Pregunta, id)
    if pregunta is None:
        return jsonify({'error': 'Pregunta no encontrada'}), 404
    return jsonify(pregunta.to_dict())


@app.route('/api/preguntas', methods=['POST'])
@requiere_api_key
@swag_from({
    'tags': ['Preguntas'],
    'summary': 'Crear una nueva pregunta',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'required': ['pregunta', 'respuestas', 'respuesta_correcta', 'categoria'],
                'properties': {
                    'pregunta': {'type': 'string', 'example': '¿Cuál es la capital de Francia?'},
                    'respuestas': {
                        'type': 'array',
                        'items': {'type': 'string'},
                        'example': ['París', 'Londres', 'Madrid', 'Berlín']
                    },
                    'respuesta_correcta': {'type': 'string', 'example': 'París'},
                    'categoria': {
                        'type': 'string',
                        'example': 'Geografia',
                        'description': f'Válidas: {", ".join(CATEGORIAS_VALIDAS)}'
                    }
                }
            }
        }
    ],
    'responses': {
        201: {'description': 'Pregunta creada'},
        400: {'description': 'Error de validación'}
    }
})
def api_crear_pregunta():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Se requiere JSON en el cuerpo'}), 400

    errores = validar_pregunta(data)
    if errores:
        return jsonify({'error': errores}), 400

    pregunta = Pregunta(
        pregunta=data['pregunta'],
        respuestas=json.dumps(data['respuestas']),
        respuesta_correcta=data['respuesta_correcta'],
        categoria=data['categoria']
    )
    db.session.add(pregunta)
    db.session.commit()
    return jsonify(pregunta.to_dict()), 201


@app.route('/api/preguntas/<int:id>', methods=['PUT'])
@requiere_api_key
@swag_from({
    'tags': ['Preguntas'],
    'summary': 'Actualizar una pregunta existente',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'required': ['pregunta', 'respuestas', 'respuesta_correcta', 'categoria'],
                'properties': {
                    'pregunta': {'type': 'string'},
                    'respuestas': {'type': 'array', 'items': {'type': 'string'}},
                    'respuesta_correcta': {'type': 'string'},
                    'categoria': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {'description': 'Pregunta actualizada'},
        400: {'description': 'Error de validación'},
        404: {'description': 'Pregunta no encontrada'}
    }
})
def api_actualizar_pregunta(id):
    pregunta = db.session.get(Pregunta, id)
    if pregunta is None:
        return jsonify({'error': 'Pregunta no encontrada'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Se requiere JSON en el cuerpo'}), 400

    errores = validar_pregunta(data)
    if errores:
        return jsonify({'error': errores}), 400

    pregunta.pregunta = data['pregunta']
    pregunta.respuestas = json.dumps(data['respuestas'])
    pregunta.respuesta_correcta = data['respuesta_correcta']
    pregunta.categoria = data['categoria']
    db.session.commit()
    return jsonify(pregunta.to_dict())


@app.route('/api/preguntas/<int:id>', methods=['DELETE'])
@requiere_api_key
@swag_from({
    'tags': ['Preguntas'],
    'summary': 'Eliminar una pregunta',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True
        }
    ],
    'responses': {
        200: {'description': 'Pregunta eliminada'},
        404: {'description': 'Pregunta no encontrada'}
    }
})
def api_eliminar_pregunta(id):
    pregunta = db.session.get(Pregunta, id)
    if pregunta is None:
        return jsonify({'error': 'Pregunta no encontrada'}), 404
    db.session.delete(pregunta)
    db.session.commit()
    return jsonify({'mensaje': 'Pregunta eliminada correctamente'})


# Endpoint especifico para el juego: devuelve una pregunta sin la
# respuesta correcta, para que el frontend la evalue.
@app.route('/api/preguntas/aleatoria', methods=['GET'])
@requiere_api_key
@swag_from({
    'tags': ['Preguntas'],
    'summary': 'Obtener una pregunta aleatoria',
    'description': 'Devuelve una pregunta sin el campo respuesta_correcta. Soporta filtro por categoría y exclusión de IDs.',
    'parameters': [
        {
            'name': 'categoria',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filtrar por categoría'
        },
        {
            'name': 'excluir_ids',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'IDs a excluir, separados por coma (ej: 1,2,3)'
        }
    ],
    'responses': {
        200: {
            'description': 'Pregunta aleatoria (sin respuesta_correcta)',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'pregunta': {'type': 'string'},
                    'respuestas': {'type': 'array', 'items': {'type': 'string'}},
                    'categoria': {'type': 'string'}
                }
            }
        },
        404: {'description': 'No hay preguntas disponibles'}
    }
})
def api_pregunta_aleatoria():
    categoria = request.args.get('categoria')
    excluir_ids = request.args.get('excluir_ids')
    excluir = []
    if excluir_ids:
        try:
            excluir = [int(x) for x in excluir_ids.split(',')]
        except ValueError:
            return jsonify({'error': 'excluir_ids debe ser una lista de IDs separados por coma'}), 400

    pregunta = obtener_pregunta_aleatoria(categoria=categoria, excluir_ids=excluir or None)
    if pregunta is None:
        return jsonify({'error': 'No hay preguntas disponibles'}), 404
    return jsonify(pregunta.to_dict_safe())


@app.route('/api/preguntas/<int:id>/validar', methods=['POST'])
@requiere_api_key
@swag_from({
    'tags': ['Preguntas'],
    'summary': 'Validar una respuesta',
    'description': 'Recibe la respuesta del usuario y devuelve si es correcta. Pensado para el frontend.',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'required': ['respuesta'],
                'properties': {
                    'respuesta': {'type': 'string', 'example': 'París'}
                }
            }
        }
    ],
    'responses': {
        200: {'description': 'Resultado de la validación'},
        400: {'description': 'Falta el campo respuesta'},
        404: {'description': 'Pregunta no encontrada'}
    }
})
def api_validar_respuesta(id):
    data = request.get_json()
    if not data or 'respuesta' not in data:
        return jsonify({'error': 'El campo "respuesta" es obligatorio'}), 400

    pregunta = db.session.get(Pregunta, id)
    if pregunta is None:
        return jsonify({'error': 'Pregunta no encontrada'}), 404

    correcta = data['respuesta'] == pregunta.respuesta_correcta
    return jsonify({
        'correcta': correcta,
        'respuesta_correcta': pregunta.respuesta_correcta
    })


@app.route('/api/categorias', methods=['GET'])
@requiere_api_key
@swag_from({
    'tags': ['Categorías'],
    'summary': 'Listar categorías disponibles',
    'description': 'Devuelve las categorías que tienen al menos una pregunta en la base de datos.',
    'responses': {
        200: {
            'description': 'Lista de categorías',
            'schema': {
                'type': 'array',
                'items': {'type': 'string'}
            }
        }
    }
})
def api_listar_categorias():
    rows = db.session.query(Pregunta.categoria).distinct().order_by(Pregunta.categoria).all()
    return jsonify([r[0] for r in rows])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def validar_pregunta(data):
    # Valida los campos requeridos de una pregunta y que respuesta_correcta
    # este dentro de respuestas. Devuelve lista de errores (vacia si es valida).
    errores = []
    if not data.get('pregunta'):
        errores.append('El campo "pregunta" es obligatorio')
    if not data.get('respuestas') or not isinstance(data['respuestas'], list) or len(data['respuestas']) < 2:
        errores.append('El campo "respuestas" debe ser un array con al menos 2 opciones')
    if not data.get('respuesta_correcta'):
        errores.append('El campo "respuesta_correcta" es obligatorio')
    if not data.get('categoria'):
        errores.append('El campo "categoria" es obligatorio')
    elif data['categoria'] not in CATEGORIAS_VALIDAS:
        errores.append(f'Categoría no válida. Válidas: {", ".join(CATEGORIAS_VALIDAS)}')
    if data.get('respuesta_correcta') and data.get('respuestas') and data['respuesta_correcta'] not in data['respuestas']:
        errores.append('"respuesta_correcta" debe estar incluida en "respuestas"')
    return errores


# Inicializa tablas al importar (compatible con gunicorn).
init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=True)
