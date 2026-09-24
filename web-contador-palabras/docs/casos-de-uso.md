# Casos de uso

## C01 · Contar texto escrito

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Precondición | Página cargada |
| Disparador | El usuario escribe o pega texto en el área principal |

**Flujo principal**

1. El usuario escribe o pega texto en el área.
2. El sistema recalcula las tres métricas (palabras, caracteres y caracteres sin espacios).
3. El sistema actualiza los valores en pantalla al instante.

**Postcondición**: las métricas reflejan el texto actual.

## C02 · Subir un archivo de texto plano

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Disparador | El usuario suelta un archivo sobre la zona de subida o lo elige con el selector |

**Flujo principal**

1. El usuario suelta un archivo de texto plano sobre la zona de subida (o pulsa para abrir el selector y lo elige).
2. El sistema lee el archivo como UTF-8.
3. El sistema sustituye el contenido del área por el del archivo.
4. El sistema recalcula y muestra las métricas.

**Flujo alternativo**: si la lectura falla (archivo ilegible), el área y las métricas no cambian.

## C03 · Limpiar el texto

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Disparador | El usuario pulsa el botón **Limpiar** |

**Flujo principal**

1. El sistema vacía el área de texto.
2. El sistema pone las tres métricas a 0.

**Postcondición**: área vacía; los botones **Limpiar** y **Copiar** quedan deshabilitados.

## C04 · Copiar el resumen

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Disparador | El usuario pulsa el botón **Copiar** |

**Flujo principal**

1. El sistema copia al portapapeles un resumen con las tres métricas actuales.

**Flujo alternativo**: si el portapapeles no está disponible, la acción no produce cambios.

## C05 · Probar con un ejemplo

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Disparador | El usuario pulsa el botón **Ejemplo** |

**Flujo principal**

1. El sistema carga un texto de muestra en el área.
2. El sistema recalcula y muestra las métricas del ejemplo.