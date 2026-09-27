# Admin de Django

**El Administrador de Django**
El admin de Django es una interfaz de administración generada automáticamente que permite realizar operaciones CRUD(Crear, Leer, Actualizar, Eliminar) sobre los modelos de tu aplicación.

**Configuración básica del admin**
1. Registrar un modelo en el admin

```python
    En el archivo admin.py de la aplicación (mi_aplicacion/admin.py), registra tus modelos para que aparezcan en el admin:
        from django.contrib import admin
        from .models import Usuario

        admin.site.register(Usuario)
    Esto hará que el modelo Usuario sea visible y gestionable en el panel de administración.
```

**Personalización del admin**
Puedes personalizar cómo se muestran y gestionan los modelos en el panel de adminsitración. Para ello, debes usar una clase que herede de admin.ModelAdmin.

- **1.** Personalizar la lista de modelos: en el archivo admin.py puedes añadir opciones como list_display, search_fields, y list_filter:

```python
        from django.contrib import admin
        from .models import Usuario

        class UsuarioAdmin(admin.ModelAdmin):
            list_display = ('nombre', 'email', 'edad') # Campos que se mostrarán en la lista
            search_fields = ('nombre', 'email') # Campos que se pueden buscar
            list_filter = ('edad') # Campos para filtrar resultados

        admin.site.register(Usuario, UsuarioAdmin)
```

- **2.** Añadir un formulario detallado: si quieres personalizar cómo se ve el formulario de detalle de un modelo:

```python
        class UsuarioAdmin(admin.ModelAdmin):
            list_display = ('nombre', 'email', 'edad')
            fields = ('nombre', 'email')  # Campos visibles en el formulario de edición

        admin.site.register(Usuario, UsuarioAdmin)
```

- **3.** Editar campos relacionados (Inlines): si un modelo tiene una relación ForeignKey o ManyToManyField, puedes agregar un formulario inline para editar los modelos relacionados directamente:

```python
        from .models import Perfil

        class PerfilInline(admin.StackedInline): # O usar admin.TabularInline
            model = Perfil
            extra = 1 # Número de formularios en blanco adicionales

        class UsuarioAdmin(admin.ModelAdmin):
            inlines = [PerfilInline]

        admin.site.register(Usuario, UsuarioAdmin)
```

**Cambiar el texto o logotipo del admin**
1. Modificar el título y encabezado: en el archivo admin.py añade:

```python
    admin.site.site_header = "Panel de Administración de Mi Proyecto"
    admin.site.site_title = "Admin Django"
    admin.site.index_title = "Gestión de la Aplicación"
```

- **2.** Personalizar el diseño del admin: puedes modificar el diseño del admin utilizando archivos CSS o incluso instalando paquetes de terceros como django-grappelli o django-suit.

**Funciones avanzadas del admin**
- Acciones personalizadas: define acciones que se puedan ejecutar en lotes desde la lista de modelos.

```python
    def marcar_mayores_de_edad(modeladmin, request, queryset):
        queryset.filter(edad__get=18).update(edad=18)

    marcar_mayores_de_edad.short_description = "Marcar usuarios como mayores de edad"

    class UsuarioAdmin(admin.ModelAdmin):
        actions = [marcar_mayores_de_edad]

    admin.site.register(Usuario, UsuarioAdmin)
```

- Filtros personalizados: crear filtros más complejos para los modelos.

- Permisos y acceso restringido: usar el sistema de usuarios y permisos para limitar quién puede acceder y qué puede hacer en el admin.
