# Importaciones
from flask_login import UserMixin
from db import get_db

# Clase que representa un usuario y maneja la integración con Flask-Login
class User(UserMixin):
    def __init__(self, _id, name, email, profile_picture):
        """
        Inicializa un objeto User.
        
        Args:
            _id (str): ID único del usuario (generalmente provisto por OAuth).
            name (str): Nombre del usuario.
            email (str): Correo electrónico del usuario.
            profile_picture (str): URL de la imagen de perfil del usuario.
        """
        self.id = _id
        self.name = name
        self.email = email
        self.profile_picture = profile_picture

    @staticmethod
    def get(user_id):
        """
        Obtiene un usuario de la base de datos por su ID.

        Args:
            user_id (str): ID único del usuario a buscar.

        Returns:
            User | None: Retorna un objeto User si se encuentra en la base de datos,
                         de lo contrario retorna None.
        """
        # Obtiene la conexión a la base de datos
        db = get_db()
        
        # Ejecuta la consulta para buscar el usuario por ID
        user = db.execute(
            "SELECT * FROM user WHERE id = ?", (user_id,)
        ).fetchone()

        # Si no existe el usuario, retorna None
        if not user:
            return None

        # Crea un objeto User con los datos obtenidos de la DB
        user = User(
            _id=user[0], name=user[1], email=user[2], profile_picture=user[3]
        )

        return user

    @staticmethod
    def create(_id, name, email, profile_picture):
        """
        Crea un nuevo usuario en la base de datos y retorna el objeto User.

        Args:
            _id (str): ID único del usuario.
            name (str): Nombre del usuario.
            email (str): Correo electrónico del usuario.
            profile_picture (str): URL de la imagen de perfil.

        Returns:
            User: El objeto User recién creado.
        """
        # Obtiene la conexión a la base de datos
        db = get_db()

        # Inserta el usuario en la tabla 'user'
        db.execute(
            "INSERT INTO user (id, name, email, profile_picture) VALUES(?, ?, ?, ?)", 
            (_id, name, email, profile_picture),
        )
        db.commit()

        # Retorna el objeto User creado
        return User(_id=_id, name=name, email=email, profile_picture=profile_picture)