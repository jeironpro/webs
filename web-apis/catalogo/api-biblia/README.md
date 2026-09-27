# api-biblia

## 📌 Descripción
Este proyecto forma parte de mi portafolio personal.  
El objetivo es demostrar buenas prácticas de programación, organización y documentación en GitHub.

## 📋 Requisitos
- Python >= 3.12

## 🛠️ Configuración
- Crear una base de datos en MySQL
- Crear un archivo .env con las variables de entorno

## 📚 Estructura del proyecto
la estructura del proyecto es la siguiente:
```
api-biblia/
├── .env
├── .gitignore
├── README.md
├── requirements.txt
├── LICENSE
├── main.py
├── models/
│   ├── Biblia.py
│   ├── Testamento.py
│   ├── Libro.py
│   ├── Capitulo.py
│   └── Versiculo.py
├── schemas/
│   ├── __init__.py
│   ├── biblia.py
│   ├── testamento.py
│   ├── libro.py
│   ├── capitulo.py
│   └── versiculo.py
├── database/
│   ├── __init__.py
│   ├── config.py
├── services/
│   ├── __init__.py
│   ├── post.py
│   ├── get.py
│   ├── patch.py
│   └── delete.py
```

## 📝 Nota
Esta estructura que utiliza services (post, get, patch, delete) para las operaciones CRUD no lo habia visto en ningun proyecto, por lo que no se si esta bien o no, pero es funcional y modular.

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
