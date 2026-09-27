# Autenticación y autorización

**Autenticación y Autorización**
1. Introducción al sistema de usuarios de Django
Django incluye un sistema de autenticación integrado, que permite:
- Crear usuarios (administradores y normales).
- Gestionar contraseñas.
- Verificar la identidad de los usuarios.
- Asignar permisos y roles.

**Configuración básica**
Asegúrate de que 'django.contrib.auth' y 'django.contrib.contenttypes' están incluidos en INSTALLED_APPS en tu archivo settings.py. Estos son esenciales para manejar la autenticación y los permisos.

- **2.** Crear usuarios desde el administrador
  Una vez configurado el admin de Django, puedes gestionar usuarios desde la interfaz web en /admin. Para crear un usuario administrador:

```python
    python manage.py createsuperuser
```

Sigue las instrucciones para definir el nombre, correo y contraseña. Luego accede al panel de admin para gestionarlos.

- **3.** Inicio y cierre de sesión
  Django proporciona vistas predefinidas para manejar el inicio y cierre de sesión.

**Configura las URLs**
En urls.py:

```python
    from django.contrib.auth import views as auth_views

    urlpatterns = [
        # Vista de inicio de sesión
        path('login/', auth_views.LoginView.as_view(), name='login'),
        # Vista de cierre de sesión
        path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    ]
```

**Plantillas para login y logout**
Crea un archivo llamado login.html en tu directorio de plantillas:

```text
    <h2>Iniciar Sesión</h2>
    <form method="post">
        {% csrf_token %}
        {{ form.as_p }}
        <button type="submit">Ingresar</button>
    </form>
```

El logout redirige automáticamente a una página de confirmación o personalizada según configuración.

- **4.** Restringir acceso a vistas con @login_required
  Usa este decorador para limitar el acceso a usuarios autenticados:

```python
    from django.contrib.auth.decorators import login_required

    @login_required
    def perfil_usuario(request):
        return HttpResponse("Bienvenido a tu perfil.")
```

Configura en settings.py la URL a la que redirigirá si el usuario no está autenticado:

```python
    LOGIN_URL = '/login/'
```

- **5.** Gestión de grupos y permisos
  Django permite crear grupos para asignar permisos fácilmente.

**Crear y asignar grupos**
En admin.py:

```python
    from django.contrib.auth.models import Group

    # Crear un grupo de ejemplo
    mi_grupo, created = Group.objects.get_or_create(name='Editores')
```

Los permisos pueden ser gestionados desde el admin o el código:

```python
    from django.contrib.auth.models import Permission
    permiso = Permission.objects.get(codename='add_post')
    mi_grupo.permissions.add(permiso)
```

- **6.** Extender el modelo de usuario
  Puedes extender el modelo de usuario predeterminado si necesitas más campos, como avatar o fecha de nacimiento.

**from django.contrib.auth.models import AbstractUser**
from django.db import models

```python
class UsuarioPersonalizado(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/')
    fecha_nacimiento = models.DateField(null=True, blank=True)
```

**En settings.py, indica que estás usando este modelo**

```python
    AUTH_USER_MODEL = 'miapp.UsuarioPersonalizado'
```
