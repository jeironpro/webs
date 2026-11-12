import json
from flask_sqlalchemy import SQLAlchemy

# Instancia global de SQLAlchemy. Se inicializa en app.py con db.init_app(app)
db = SQLAlchemy()


class Pregunta(db.Model):
    # Las respuestas se guardan como JSON en texto para evitar crear
    # una tabla separada, ya que siempre se leen y escriben completas.
    __tablename__ = 'preguntas'

    id = db.Column(db.Integer, primary_key=True)
    pregunta = db.Column(db.String(500), nullable=False)
    respuestas = db.Column(db.Text, nullable=False)         # JSON array de opciones
    respuesta_correcta = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)

    @property
    def respuestas_list(self):
        # Deserializa el JSON a lista de Python para uso en la API
        return json.loads(self.respuestas)

    @respuestas_list.setter
    def respuestas_list(self, value):
        # Serializa la lista a JSON para almacenamiento en DB
        self.respuestas = json.dumps(value)

    def to_dict(self):
        # Serializa la pregunta completa, incluyendo la respuesta correcta
        return {
            'id': self.id,
            'pregunta': self.pregunta,
            'respuestas': self.respuestas_list,
            'respuesta_correcta': self.respuesta_correcta,
            'categoria': self.categoria
        }

    def to_dict_safe(self):
        # Serializa sin respuesta_correcta para el endpoint público /aleatoria
        d = self.to_dict()
        del d['respuesta_correcta']
        return d
