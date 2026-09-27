# Casos de uso

## C01 · Jugar una partida

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Precondición | Página cargada con un número secreto generado |
| Disparador | El usuario escribe su primera suposición |

**Flujo principal**

1. El usuario escribe un número entero entre 1 y 100.
2. Pulsa el botón **Adivinar**.
3. El sistema incrementa los intentos y compara con el número secreto.
4. El sistema muestra una pista: "Es más alto que X" o "Es más bajo que X".
5. El usuario repite los pasos 1–4 hasta acertar.
6. El sistema muestra el mensaje de victoria con el número secreto y los intentos.
7. El sistema actualiza el mejor récord si corresponde.

**Postcondición**: partida terminada; el formulario queda deshabilitado.

## C02 · Suposición fuera de rango

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Disparador | El usuario escribe un valor no válido |

**Flujo alternativo**

1. El usuario escribe un valor que no es un entero entre 1 y 100 (por ejemplo `0`, `150`, `3.5`, texto o vacío).
2. Pulsa **Adivinar**.
3. El sistema muestra el mensaje de error "Escribe un número entero entre 1 y 100."
4. El sistema marca el campo como inválido (`aria-invalid`).
5. **No se incrementan los intentos.**

## C03 · Nuevo juego

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Disparador | El usuario pulsa el botón **Nuevo juego** |

**Flujo principal**

1. El sistema genera un nuevo número secreto.
2. El sistema resetea el contador de intentos a 0.
3. El sistema limpia el campo y el error, y habilita el formulario.
4. El sistema muestra el mensaje de inicio.

**Postcondición**: nueva partida lista; el mejor récord se conserva.

## C04 · Mejorar el récord

| Campo | Valor |
|---|---|
| Actor | Visitante del sitio |
| Precondición | Existe un récord guardado en `localStorage` |

**Flujo principal**

1. El usuario gana una partida con menos intentos que el récord guardado.
2. El sistema guarda el nuevo valor en `localStorage`.
3. El sistema muestra "¡Nuevo récord!" junto al mensaje de victoria.

**Flujo alternativo**: si la partida no mejora el récord (o no existe), solo se muestra el mensaje de victoria sin aviso de récord.
