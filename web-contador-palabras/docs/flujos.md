# Flujos y mapa de navegación

## Mapa de la página

Una única pantalla de arriba abajo:

```
Carga de la página
 │
 ├─ Header (marca + enlaces externos)
 ├─ Título y descripción
 ├─ Área de escritura + controles
 ├─ Métricas (palabras · caracteres · caracteres sin espacios)
 ├─ Zona de subida de archivos
 └─ Footer / colofón
```

## Flujo 1 · Conteo en vivo

```
Carga → renderStats inicial (0) → usuario escribe/pega
      → evento input → recálculo → texto en pantalla
      → (evento input se repite en cada cambio)
```

## Flujo 2 · Subida de archivo

```
Zona de subida → arrastra archivo (dragenter/dragover/drop)
               o pulsa → selector de archivos → change
      → readTextFile(file) [FileReader, UTF-8]
      → text → área.value = text → renderStats
      → controles Limpiar/Copiar habilitados
```

## Estado de los controles

| Texto | Limpiar | Copiar | Ejemplo |
|---|---|---|---|
| Vacío | Deshabilitado | Deshabilitado | Habilitado |
| Con contenido | Habilitado | Habilitado | Habilitado |

## Accesibilidad del flujo

- La zona de subida es operable con teclado (foco + Enter abre el selector).
- Las métricas anuncian cambios con `aria-live`.
- El enlace "Saltar al contador" permite saltar directamente al área de texto.