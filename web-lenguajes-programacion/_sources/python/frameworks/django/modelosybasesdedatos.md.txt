# Modelos y bases de datos

**Modelos y Bases de datos en Django**
En Django, los modelos son la forma de representar la estructura de datos en el código. Cada modelo corresponde a una tabla en la base de datos, y los atributos del modelo corresponden a las columnas de esa tabla.

- **1.** Configurar la base de datos
  Por defecto, Django usa SQLite como base de datos. Si prefieres usar otra (como PostgreSQL o MySQL), se puede configurar en el archivo settings.py.

- **2.** Crear un modelo
  En el archivo models.py dentro de la aplicación (mi_aplicacion/models.py), define un modelo:

```python
    from django.db import models

    class Usuario(models.Model):
        nombre = models.CharField(max_length=100) # Campo de texto con longitud máxima de 100
        email = models.EmailField(unique=True) # Campo correo electrónico único
        edad = models.IntegerField() # Campo para enteros

        def __str__(self):
            return self.nombre # Devuelve el nombre del usaurio al representarlo como texto
```

- **3.** Aplicar migraciones
  Las migraciones son la forma en que Django sincroniza el esquema de la base datos con los modelos definidos.
1. Crear las migraciones:

```python
        python manage.py makemigrations
    Esto genera un archivo de migración en la carpeta migrations/.
```

- **2.** Aplicar las migraciones a la base de datos:

```python
        python manage.py migrate
```

- **4.** Registrar el modelo en el panel de administración
  Para gestionar este modelo desde el panel de administración, editamos el archivo admin.py de la aplicación (mi_aplicacion/admin.py):

```python
    from django.contrib import admin
    from .models import Usuario

    admin.site.register(Usuario)
```

**4.1. Crear un usuario administrador en Django**
1. Ejecutar el comando para crear un superusuario: en la terminal, dentro de la carpeta del proyecto, escribimos:

```python
        python manage.py createsuperuser
```

- **2.** Completa la información requerida: Django te pedirá algunos datos para el usuario administrador:
- Username: elige un nombre de usuario (por ejemplo, "admin").
- Email address: proporciona un correo electrónico válido (opcional, pero recomendado).
- Password: crea una contraseña segura y confirmala.

```python
        Ejemplo de salida:
            Username: admin
            Email address: admin@example.com
            Password: **********
            Password (again): **********
            Superuser created successfully.
```

**Luego, inicia el servidor**

```python
    python manage.py runserver
```

Accede al panel de administración en http://127.0.0.1:8000/admin/. Puedes usar el usuario administrador creado previamente.

- **5.** Interactuar con la base de datos desde el shell de Django
  Abre el shell de Django:

```python
    python manage.py shell
```

**Ejemplo de operaciones con el modelo Usuario**

```python
    from mi_aplicacion.models import Usuario

    # Crear un nuevo usuario
    usuario = Usuario(nombre="Jeiron Espinal", email="jeiron@gmail.com", edad=21)
    usuario.save()

    # Consultar usuarios
    usuarios = Usuario.objects.all()
    print(usuarios)

    # Filtrar usuarios
    usuario = Usuario.objects.get(nombre="Jeiron Espinal")
    print(usuario.email)

    # Actualizar un usuario
    usuario.edad = 22
    usuario.save()

    # Eliminar un usuario
    usuario.delete()
```
