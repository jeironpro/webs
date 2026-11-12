# Importaciones
from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

def actualizar_registro(id: int, esquema, modelo, db: Session):
    """
    Actualiza un registro en la base de datos.
    
    Recibe:
        - id      = ID del registro a actualizar
        - esquema = clase del modelo que representa datos recibidos en el endpoint
        - modelo  = clase SQLModel que representa la tabla
        - db         = sesión de base de datos

    Devuelve:
        - registro_actualizado = objeto actualizado en la base de datos
    """
    try:
        registro = db.get(modelo, id)

        if not registro:
            raise HTTPException(status_code=404, detail="Registro no encontrado")

        nuevos_datos = esquema.model_dump(exclude_unset=True)
        registro.sqlmodel_update(nuevos_datos)

        db.add(registro)
        db.commit()
        db.refresh(registro)

        return registro

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
            detail="Ocurrió un error inesperado al realizar la operación: " + str(e)
        )
