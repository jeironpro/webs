# Importaciones
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import SQLModel, Session
from database.config import engine, obtener_db
from models.Biblia import Biblia
from models.Testamento import Testamento
from models.Libro import Libro
from models.Capitulo import Capitulo
from models.Versiculo import Versiculo
from schemas.biblia import BibliaRequest, BibliaResponse, BibliaUpdate
from schemas.testamento import TestamentoRequest, TestamentoResponse, TestamentoUpdate
from schemas.libro import LibroRequest, LibroResponse, LibroUpdate
from schemas.capitulo import CapituloRequest, CapituloResponse, CapituloUpdate
from schemas.versiculo import VersiculoRequest, VersiculoResponse, VersiculoTextoResponse, VersiculoUpdate
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from services.post import crear_registro
from services.get import obtener_registros, obtener_por_id, obtener_rango, obtener_versiculos_por_libro_capitulo
from services.patch import actualizar_registro
from services.delete import eliminar_registro

# Iniciar la API con FastAPI, agregando el título y la versión
app = FastAPI(
    title="API Biblia",
    version="1.0.0"
)

# CORS (Cross-Origin Resource Sharing) permite que las peticiones se hagan desde diferentes orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear todas las tablas en la base de datos
SQLModel.metadata.create_all(engine)

# Creación de registros (POST)
@app.post("/biblia", response_model=BibliaResponse, tags=["Crear biblia"])
def crear_biblia(biblia: BibliaRequest, db: Session = Depends(obtener_db)):
    return crear_registro(biblia, Biblia, db)

@app.post("/testamento", response_model=TestamentoResponse, tags=["Crear testamento"])
def crear_testamento(testamento: TestamentoRequest, db: Session = Depends(obtener_db)):
    return crear_registro(testamento, Testamento, db)

@app.post("/libro", response_model=LibroResponse, tags=["Crear libro"])
def crear_libro(libro: LibroRequest, db: Session = Depends(obtener_db)):
    return crear_registro(libro, Libro, db)

@app.post("/capitulo", response_model=CapituloResponse, tags=["Crear capitulo"])
def crear_capitulo(capitulo: CapituloRequest, db: Session = Depends(obtener_db)):
    return crear_registro(capitulo, Capitulo, db)

@app.post("/versiculo", response_model=VersiculoResponse, tags=["Crear versiculo"])
def crear_versiculo(versiculo: VersiculoRequest, db: Session = Depends(obtener_db)):
    return crear_registro(versiculo, Versiculo, db)

# Obtener registros (GET)
@app.get("/biblias", response_model=List[BibliaResponse], tags=["Mostrar todas las biblias"])
def obtener_biblias(db: Session = Depends(obtener_db)):
    return obtener_registros(Biblia, db)

@app.get("/testamentos", response_model=List[TestamentoResponse], tags=["Mostrar todas los testamentos"])
def obtener_testamentos(db: Session = Depends(obtener_db)):
    return obtener_registros(Testamento, db)

@app.get("/libros", response_model=List[LibroResponse], tags=["Mostrar todas los libros"])
def obtener_libros(db: Session = Depends(obtener_db)):
    return obtener_registros(Libro, db)

@app.get("/capitulos", response_model=List[CapituloResponse], tags=["Mostrar todas los capitulos"])
def obtener_capitulos(db: Session = Depends(obtener_db)):
    return obtener_registros(Capitulo, db)

@app.get("/versiculos", response_model=List[VersiculoResponse], tags=["Mostrar todas los versiculos"])
def obtener_versiculos(db: Session = Depends(obtener_db)):
    return obtener_registros(Versiculo, db)

# Obtenciones por ID (GET)
@app.get("/biblias/{biblia_id}", response_model=BibliaResponse, tags=["Mostrar biblia por ID"])
def obtener_biblia_id(biblia_id: int, db: Session = Depends(obtener_db)):
    return obtener_por_id(biblia_id, Biblia, db) 

@app.get("/testamentos/{testamento_id}", response_model=TestamentoResponse, tags=["Mostrar testamento por ID"])
def obtener_testamento_id(testamento_id: int, db: Session = Depends(obtener_db)):
    return obtener_por_id(testamento_id, Testamento, db) 
    
@app.get("/libros/{libro_id}", response_model=LibroResponse, tags=["Mostrar libro por ID"])
def obtener_libro_id(libro_id: int, db: Session = Depends(obtener_db)):
    return obtener_por_id(libro_id, Libro, db) 
    
@app.get("/capitulos/{capitulo_id}", response_model=CapituloResponse, tags=["Mostrar capitulo por ID"])
def obtener_capitulo_id(capitulo_id: int, db: Session = Depends(obtener_db)):
    return obtener_por_id(capitulo_id, Capitulo, db) 
    
@app.get("/versiculos/{versiculo_id}", response_model=VersiculoResponse, tags=["Mostrar versiculo por ID"])
def obtener_versiculo_id(versiculo_id: int, db: Session = Depends(obtener_db)):
    return obtener_por_id(versiculo_id, Versiculo, db)

# Obtenciones por rango (GET)
@app.get("/versiculos/{capitulo_id}", response_model=List[VersiculoTextoResponse], tags=["Obtener un rango de versiculos por el id del capitulo"])
def obtener_rango_versiculos(capitulo_id: int, inicio: int, fin: int, db: Session = Depends(obtener_db)):
    return obtener_rango(capitulo_id, inicio, fin, Capitulo, Versiculo, db)

# Obtenciones por nombre libro y número capitulo (GET)
@app.get("/versiculos/{nombre_libro}/{numero_capitulo}", response_model=List[VersiculoResponse], tags=["Obtener versiculos por nombre libro y número capitulo"])
def obtener_versiculos_libro_capitulo(nombre_libro: str, numero_capitulo: int, db: Session = Depends(obtener_db)):
    return obtener_versiculos_por_libro_capitulo(nombre_libro, numero_capitulo, Libro, Capitulo, Versiculo, db)

# Actualizaciones (PATCH)
@app.patch("/biblias/{biblia_id}", response_model=BibliaResponse, tags=["Actualizar biblia por ID"])
def actualizar_biblia(biblia_id: int, biblia: BibliaUpdate, db: Session = Depends(obtener_db)):
    return actualizar_registro(biblia_id, biblia, Biblia, db)   

@app.patch("/testamentos/{testamento_id}", response_model=TestamentoResponse, tags=["Actualizar testamento por ID"])
def actualizar_testamento(testamento_id: int, testamento: TestamentoUpdate, db: Session = Depends(obtener_db)):
    return actualizar_registro(testamento_id, testamento, Testamento, db)   

@app.patch("/libros/{libro_id}", response_model=LibroResponse, tags=["Actualizar libro por ID"])
def actualizar_libro(libro_id: int, libro: LibroUpdate, db: Session = Depends(obtener_db)):
    return actualizar_registro(libro_id, libro, Libro, db)   

@app.patch("/capitulos/{capitulo_id}", response_model=CapituloResponse, tags=["Actualizar capitulo por ID"])
def actualizar_capitulo(capitulo_id: int, capitulo: CapituloUpdate, db: Session = Depends(obtener_db)):
    return actualizar_registro(capitulo_id, capitulo, Capitulo, db)   

@app.patch("/versiculos/{versiculo_id}", response_model=VersiculoResponse, tags=["Actualizar versiculo por ID"])
def actualizar_versiculo(versiculo_id: int, versiculo: VersiculoUpdate, db: Session = Depends(obtener_db)):
    return actualizar_registro(versiculo_id, versiculo, Versiculo, db) 

# Eliminaciones (DELETE)
@app.delete("/biblias/{biblia_id}", tags=["Eliminar biblia por ID"])
def eliminar_biblia(biblia_id: int, db: Session = Depends(obtener_db)):
    return eliminar_registro(biblia_id, Biblia, db) 

@app.delete("/testamentos/{testamento_id}", tags=["Eliminar testamento por ID"])
def eliminar_testamento(testamento_id: int, db: Session = Depends(obtener_db)):
    return eliminar_registro(testamento_id, Testamento, db) 

@app.delete("/libros/{libro_id}", tags=["Eliminar libro por ID"])
def eliminar_libro(libro_id: int, db: Session = Depends(obtener_db)):
    return eliminar_registro(libro_id, Libro, db) 

@app.delete("/capitulos/{capitulo_id}", tags=["Eliminar capitulo por ID"])
def eliminar_capitulo(capitulo_id: int, db: Session = Depends(obtener_db)):
    return eliminar_registro(capitulo_id, Capitulo, db) 

@app.delete("/versiculos/{versiculo_id}", tags=["Eliminar versiculo por ID"])
def eliminar_versiculo(versiculo_id: int, db: Session = Depends(obtener_db)):
    return eliminar_registro(versiculo_id, Versiculo, db) 