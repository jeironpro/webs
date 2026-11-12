# Imports
import sqlite3
from typing import Optional
from flask import current_app, g

def get_db() -> sqlite3.Connection:
    """ Get a SQLite connection bound to the request context """
    if "db" not in g:
        try:
            db_path = current_app.config["DATABASE"]
            g.db = sqlite3.connect(
                db_path,
                detect_types=sqlite3.PARSE_DECLTYPES
            )
            g.db.row_factory = sqlite3.Row
        except sqlite3.Error as e:
            current_app.logger.exception("Error connecting to the database")
            raise e

    return g.db


def init_db() -> None:
    """ Initialize the database by running the SQL schema """
    db = get_db()
    try:
        with current_app.open_resource("schema.sql") as f:
            db.executescript(f.read().decode("utf-8"))
        db.commit()
        current_app.logger.info("Database initialized successfully.")
    except (sqlite3.Error, OSError) as e:
        db.rollback()
        current_app.logger.exception("Error initializing the database")
        raise e


def close_db(e: Optional[BaseException] = None) -> None:
    """ Close the connection at the end of the context """
    db = g.pop("db", None)
    if db is not None:
        db.close()


def register_db(app) -> None:
    """ Register the database teardown in the app context """
    app.teardown_appcontext(close_db)
