# Funcionamiento

## Conteo

La aplicación calcula tres métricas sobre el texto del área de escritura:

| Métrica | Definición | Regla |
|---|---|---|
| Palabras | Tokens separados por espacios | `trim().split(/\s+/).length`, con 0 para texto vacío |
| Caracteres | Todos los caracteres del texto | `text.length` |
| Caracteres sin espacios | Caracteres excluyendo espacios, tabulaciones y saltos de línea | `text.replace(/\s/g, "").length` |

El conteo se recalcula cada vez que cambia el texto (evento `input`), por lo que las métricas se actualizan en vivo mientras el usuario escribe o pega contenido.

## Subida de archivos

La zona de subida acepta archivos de dos formas:

1. **Drag & drop**: soltar el archivo sobre la zona.
2. **Selector de archivos**: pulsar sobre la zona abre el diálogo del sistema.

Ambas vías terminan leyendo el archivo como texto UTF-8 con `FileReader.readAsText`. Al terminar la lectura, el contenido sustituye al del área de texto y se recalculan las métricas. Se acepta cualquier extensión de texto plano (`.txt`, `.md`, `.html`, `.css`, `.js`, `.csv`, `.log`, `.xml`, …).

Toda la lógica es pura y local: el texto nunca se envía a un servidor.

## Controles

- **Limpiar**: vacía el área de texto y pone las métricas a 0.
- **Copiar**: copia al portapapeles un resumen con las tres métricas.
- **Ejemplo**: carga un texto de muestra para probar la aplicación.
- **Subir**: abre el selector de archivos o acepta soltar un archivo sobre la zona.