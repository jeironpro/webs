# Importaciones
from typing import List
from sqlmodel import Session, select
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError


def obtener_registros(modelo, db: Session) -> List:
    """
    Obtiene todos los registros en la base de datos.
    
    Recibe:
        - modelo  = clase SQLModel que representa la tabla
        - db      = sesión de base de datos

    Devuelve:
        - registros = lista de objetos encontrados en la base de datos
    """ 
    try:
        consulta = select(modelo)
        registros = db.exec(consulta).all()
        return registros

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno en la base de datos: {str(e)}"
        )


def obtener_por_id(id: int, modelo, db: Session):
    """
    Obtiene un registro en la base de datos por su ID.
    
    Recibe:
        - id = ID del registro a obtener
        - modelo  = clase SQLModel que representa la tabla
        - db      = sesión de base de datos

    Devuelve:
        - registro = objeto encontrado en la base de datos o None si no se encuentra
    """
    try:
        registro = db.get(modelo, id)
        return registro

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno en la base de datos: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ocurrió un error inesperado al realizar la operación: {str(e)}"
        )


def obtener_rango(capitulo_id: int, inicio: int, fin: int, modelo_capitulo, modelo_versiculo, db: Session) -> List:
    """
    Obtiene un rango de versículos en la base de datos por el ID del capítulo.
    
    Recibe:
        - capitulo_id      = ID del capítulo
        - inicio           = número inicial del versículo
        - fin              = número final del versículo
        - modelo_capitulo  = clase SQLModel que representa la tabla del capítulo
        - modelo_versiculo = clase SQLModel que representa la tabla del versículo
        - db               = sesión de base de datos

    Devuelve:
        - versiculos = lista de versículos encontrados en la base de datos
    """
    try:
        if inicio > fin or inicio <= 0 or fin <= 0:
            raise HTTPException(
                status_code=400,
                detail="Rango de versículos inválido"
            )

        consulta_capitulo = select(modelo_capitulo).where(modelo_capitulo.id == capitulo_id)
        capitulo = db.exec(consulta_capitulo).first()

        if not capitulo:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró el capítulo con id {capitulo_id}"
            )

        consulta_versiculos = select(modelo_versiculo).where(
            modelo_versiculo.capitulo_id == capitulo_id,
            modelo_versiculo.numero.between(inicio, fin)
        ).order_by(modelo_versiculo.numero)
        versiculos = db.exec(consulta_versiculos).all()

        if not versiculos:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron versículos en el rango indicado"
            )

        return versiculos

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno en la base de datos: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )


def obtener_versiculos_por_libro_capitulo(
    nombre_libro: str,
    numero_capitulo: int,
    modelo_libro,
    modelo_capitulo,
    modelo_versiculo,
    db: Session,
    inicio: int | None = None,
    fin: int | None = None
) -> List:
    """
    Obtiene los versículos de un capítulo específico de un libro.
    Permite opcionalmente filtrar un rango de versículos usando inicio y fin.
    """
    try:
        if not nombre_libro.strip():
            raise HTTPException(status_code=400, detail="Nombre del libro no puede estar vacío")
        if numero_capitulo <= 0:
            raise HTTPException(status_code=400, detail="Número de capítulo inválido")
        if (inicio is not None and inicio <= 0) or (fin is not None and fin <= 0):
            raise HTTPException(status_code=400, detail="Rango de versículos inválido")
        if inicio is not None and fin is not None and inicio > fin:
            raise HTTPException(status_code=400, detail="El versículo inicial no puede ser mayor que el final")

        # Buscar libro
        consulta_libro = select(modelo_libro).where(modelo_libro.nombre == nombre_libro)
        libro = db.exec(consulta_libro).first()

        if not libro:
            raise HTTPException(status_code=404, detail=f"Libro '{nombre_libro}' no encontrado")

        # Buscar capítulo
        consulta_capitulo = select(modelo_capitulo).where(
            modelo_capitulo.numero == numero_capitulo,
            modelo_capitulo.libro_id == libro.id
        )
        capitulo = db.exec(consulta_capitulo).first()

        if not capitulo:
            raise HTTPException(
                status_code=404,
                detail=f"Capítulo {numero_capitulo} no encontrado en '{nombre_libro}'"
            )

        # Buscar versículos
        consulta_versiculos = select(modelo_versiculo).where(
            modelo_versiculo.capitulo_id == capitulo.id
        )
        if inicio is not None and fin is not None:
            consulta_versiculos = consulta_versiculos.where(
                modelo_versiculo.numero.between(inicio, fin)
            )

        consulta_versiculos = consulta_versiculos.order_by(modelo_versiculo.numero)
        versiculos = db.exec(consulta_versiculos).all()

        if not versiculos:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron versículos en este capítulo"
            )

        return versiculos

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno en la base de datos: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )