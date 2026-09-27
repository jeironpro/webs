# Importaciones
import sqlite3
from typing import Optional
from flask import current_app, g

def get_db() -> sqlite3.Connection:
    """ Obtiene una conexión SQLite asociada al contexto de la petición """
    if "db" not in g:
        try:
            db_path = current_app.config["DATABASE"]
            g.db = sqlite3.connect(
                db_path,
                detect_types=sqlite3.PARSE_DECLTYPES
            )
            g.db.row_factory = sqlite3.Row
        except sqlite3.Error as e:
            current_app.logger.exception("Error conectando a la base de datos")
            raise e

    return g.db


def init_db() -> None:
    """ Inicializa la base de datos ejecutando el esquema SQL """
    db = get_db()
    try:
        with current_app.open_resource("schema.sql") as f:
            db.executescript(f.read().decode("utf-8"))
        db.commit()
        current_app.logger.info("Base de datos inicializada correctamente.")
    except (sqlite3.Error, OSError) as e:
        db.rollback()
        current_app.logger.exception("Error inicializando la base de datos")
        raise e


def close_db(e: Optional[BaseException] = None) -> None:
    """ Cierra la conexión a la base de datos al finalizar el contexto """
    db = g.pop("db", None)
    if db is not None:
        db.close()


def register_db(app) -> None:
    """ Registra el cierre de la base de datos en el contexto de la app """
    app.teardown_appcontext(close_db)
