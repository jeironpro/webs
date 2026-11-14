# Web Generador CV

Generador de currículum vitae en PDF con un formulario de cuatro pasos que se
ejecuta por completo en el navegador. Aplicación estática de HTML, CSS y
JavaScript, sin framework ni proceso de compilación.

## Características

- Asistente de cuatro pasos: datos personales, perfiles, revisión y descarga.
- Perfiles en español, catalán e inglés.
- Foto, redes sociales, experiencia, formación, idiomas y competencias.
- Revisión de toda la información antes de exportar.
- PDF de dos columnas generado con jsPDF, sin enviar datos a ningún servidor.
- Diseño responsive con partículas de fondo y navegación por pasos.

## Estructura

```
index.html        Estructura del asistente
app.js            Estado, vistas y generación del PDF
styles.css        Estilos propios de la aplicación
css/react.css     Hoja compilada del diseño original
shared/           Tema, etiquetas i18n e idiomas
vendor/           jsPDF vendorizado
```

## Uso local

```bash
python3 -m http.server 8080 --directory web-generador-cv
```

Abre <http://localhost:8080>.

## Generación del PDF

El botón «Descargar CV en PDF» genera el documento en el navegador con jsPDF.
El archivo se descarga como `curriculum-es.pdf`, `curriculum-ca.pdf` o
`curriculum-en.pdf` según el perfil activo.

## Licencia

MIT. Consulta [LICENSE](../LICENSE).
