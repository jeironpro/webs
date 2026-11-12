# Importaciones
from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

def eliminar_registro(id: int, modelo, db: Session):
    """
    Elimina un registro de la base de datos.
    
    Recibe:
        - id      = ID del registro a eliminar
        - modelo  = clase SQLModel que representa la tabla
        - db         = sesión de base de datos

    Devuelve:
        - registro_eliminado = objeto eliminado de la base de datos
    """
    try:
        registro = db.get(modelo, id)

        if not registro:
            raise HTTPException(status_code=404, detail="Registro no encontrado")

        db.delete(registro)
        db.commit()

        return registro

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error interno en la base de datos" + str(e)
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error inesperado al realizar la operación: " + str(e)
        )
