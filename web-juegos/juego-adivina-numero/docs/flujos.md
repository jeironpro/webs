# Flujos y mapa de navegación

## Mapa de navegación

El sitio es una sola página con dos zonas ancladas y un enlace externo:

```
index.html
├── #game             (hero: el juego)
├── #como-se-juega    (reglas del juego)
└── GitHub            (enlace externo al repositorio)
```

Enlace "Saltar al juego" (solo visible al enfocar) permite saltar al contenido principal.

## Diagrama de flujo: carga de la página

```
[Entrada al sitio]
        │
        ▼
[Carga index.html]
        │
        ├── Se aplican estilos (tokens + componentes)
        ▼
[Carga js/app.js (módulo ES)]
        │
        ├── Crea la partida (número secreto 1–100)
        ├── Lee el mejor récord de localStorage
        ▼
[Muestra contador de intentos = 0 y récord (o —)]
```

## Diagrama de flujo: suposición del usuario

```
[Usuario escribe un valor y pulsa "Adivinar"]
                     │
                     ▼
          ¿Es entero entre 1 y 100?
              /               \
            No                Sí
             │                 │
             ▼                 ▼
   [Muestra error +        [Incrementa intentos]
    aria-invalid]               │
             │                  ▼
             │      ¿Coincide con el número secreto?
             │              /              \
             │            No               Sí
             │             │               │
             │             ▼               ▼
             │   [Pista: más alto /        [Mensaje de victoria]
             │    más bajo]                [Actualiza récord si mejora]
             │             │               [Deshabilita el formulario]
             │             │               [Animación de celebración]
             └─────────────┘
                          │
                          ▼
              [Se muestra en aria-live]
```

## Diagrama de flujo: nuevo juego

```
[Pulsa "Nuevo juego"]
        │
        ▼
[Genera nuevo número secreto]
        │
        ▼
[Resetea intentos a 0 · limpia campo y error]
        │
        ▼
[Habilita el formulario · mensaje de inicio]
```

## Reglas transversales

- Las suposiciones inválidas **no consumen intentos**.
- El mejor récord solo se actualiza cuando la partida ganada mejora el valor guardado.
- Todo el estado de la partida vive en memoria; al recargar la página empieza una nueva partida (solo persiste el récord).
