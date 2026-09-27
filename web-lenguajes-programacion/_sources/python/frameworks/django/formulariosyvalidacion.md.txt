# Formularios y validación

**Formularios y Validación en Django**
Los formularios en Django son un herramienta poderosa que facilita la creación, validación y procesamiento de datos enviados por los usuarios, como datos de registro, inicio de sesión o cualquier entrada interactiva.

- **1.** Creación de un formulario
  Django proporciona la clase forms.Form para definir formularios.
1. Crear un formulario simple: crear un archivo forms.py en la aplicación (si no existe):

```python
        from django import forms

        class RegistroForm(forms.Form):
            nombre = forms.CharField(max_length=100, label="Nombre")
            email = forms.EmailField(label="Correo Electrónico")
            contraseña = forms.CharField(widget=forms.PasswordInput, label="Contraseña")
```

- **2.** Definir la vista para el formulario: en views.py, renderiza el formulario y procesa los datos enviados:

```python
        from django.shortcuts import render
        from .forms import RegistroForm

        def registro(request):
            if request.method == 'POST':
                form = RegistroForm(request.POST)
                if form.is_valid():
                    # Procesar los datos del formulario
                    nombre = form.cleaned_data['nombre']
                    email = form.cleaned_data['email']
                    contraseña = form.cleaned_data['contraseña']
                    return render(request, 'mi_aplicacion/success.html', {'nombre': nombre})
            else:
                form = RegistroForm()

            return render(request, 'mi_aplicacion/registro.html', {'form': form})
```

- **3.** Crear el template del formulario: crea registro.html para mostrar el formulario:

```text
        <!DOCTYPE html>
        <html>
        <head>
            <title>Registro</title>
        </head>
        <body>
            <h1>Registro de Usuario</h1>
            <form method="post">
                {% csrf_token %}
                {{ form.as_p }}
                <button type="submit">Registrar</button>
            </form>
        </body>
        </html>
```

- **4.** Configurar la URL: en urls.py, añade la ruta para esta vista:

```python
        from django.urls import path
        from . import views

        urlpatterns = [
            path('registro/', views.registro, name='registro'),
        ]
```

- **2.** Validación de formularios
  Django valida automáticamente ciertos campos (como correso electrónicos o contraseñas). Además, puedes añadir validaciones personalizadas.
1. Agregar validación personalizada: modifica el formulario para incluir un método clean_<campo>:

```python
        class RegistroForm(forms.Form):
            nombre = forms.CharField(max_length=100, label="Nombre")
            email = forms.EmailField(label="Correo Electrónico")
            contraseña = forms.CharField(widget=forms.PasswordInput, label="Contraseña")

            def clean_nombre(self):
                nombre = self.cleaned_data['nombre']
                if len(nombre) < 3:
                    raise forms.ValidationError("El nombre debe tener al menos 3 caracteres.")
                return nombre
```

- **2.** Validar múltiples campos: usa el método clean para validaciones que dependan de varios campos:

```python
        def clean(self):
            cleaned_data = super().clean()
            email = cleaned_data.get('email')
            contraseña = cleaned_data.get('contraseña')

            if email and "spam" in email:
                raise forms.ValidationError("No se permite el uso de 'spam' en el correo.")
```

- **3.** Formularios basados en modelos
  Si tienes un modelo relacionado, puedes usar forms.ModelForm para crear formularios automáticamente.
1. Definir el modelo: en models.py:

```python
        from django.db import models

        class Usuario(models.Model):
            nombre = models.CharField(max_length=100)
            email = models.EmailField()
            contraseña = models.CharField(max_length=100)
```

- **2.** Crear el formulario basado en el modelo: en forms.py:

```python
        from django import forms
        from .models import Usuario

        class UsuarioForm(forms.ModelForm):
            class Meta:
                model = Usuario
                fields = ['nombre', 'email', 'contraseña']
```

- **3.** Procesar el formulario en la vista:

```python
        from django.shortcuts import render
        from .forms import UsuarioForm

        def registro_modelo(request):
            if request.method == 'POST':
                form = UsuarioForm(request.POST)
                if form.is_valid():
                    form.save()  # Guarda el usuario directamente en la base de datos
                    return render(request, 'mi_aplicacion/success.html')
            else:
                form = UsuarioForm()

            return render(request, 'mi_aplicacion/registro_modelo.html', {'form': form})
```

- **4.** Mejorar la interfaz de usuario
  1. Personalizar el formulario: usa widgets para moficar cómo se ven los campos:

```python
        class RegistroForm(forms.Form):
            nombre = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}))
            email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
            contraseña = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))
```

- **2.** Estilizar con CSS: añade clases a los campos usando atributos o frameworks como Bootstrap.
