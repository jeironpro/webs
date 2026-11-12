# Importaciones
from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

def crear_registro(esquema, modelo, db: Session):
    """
    Crea un registro en la base de datos.
    
    Recibe:
        - esquema = clase del modelo que representa datos recibidos en el endpoint
        - modelo  = clase SQLModel que representa la tabla
        - db         = sesión de base de datos

    Devuelve:
        - nuevo_registro = objeto creado en la base de datos
    """
    try:
        nuevo_registro = modelo(**esquema.dict())

        db.add(nuevo_registro)
        db.commit()
        db.refresh(nuevo_registro)

        return nuevo_registro

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error interno en la base de datos"
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error inesperado al realizar la operación" + str(e)
        )