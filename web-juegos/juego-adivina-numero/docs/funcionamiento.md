# Funcionamiento

## Objetivo del juego

Adivinar el número secreto que elige el navegador entre **1 y 100** (ambos inclusive), haciendo la menor cantidad de intentos posible. Tras cada suposición, el juego indica si el número es más alto o más bajo que la suposición. La partida permite un máximo de **10 intentos** (un globo por intento); si se agotan, la partida termina en derrota.

## Flujo de una partida

### 1. Inicio

Al cargar la página, `js/modules/game.js` genera el número secreto con `Math.random()` dentro del rango:

```js
Math.floor(Math.random() * (100 - 1 + 1)) + 1;
```

El contador de intentos comienza en `0` y el campo de suposición está habilitado.

Al arrancar se lee el mejor récord guardado en `localStorage` y se muestra junto a "Mejor récord" o un guion `—` si aún no existe.

### 2. Envío de una suposición

Cuando el jugador pulsa **Adivinar**:

1. **Validación**: el valor debe ser un entero entre 1 y 100.
   - Si no lo es, se muestra un mensaje de error accesible (`role="alert"`) y el campo se marca con `aria-invalid="true"`. El juego no consume intentos.
2. **Evaluación**: incrementa el contador de intentos y compara la suposición con el número secreto.
3. **Retroalimentación**:
   - Si la suposición es menor → "Es más alto que X."
   - Si la suposición es mayor → "Es más bajo que X."
   - Si acierta → mensaje de victoria y actualización del récord.
4. El mensaje se publica en una región `aria-live="polite"` para que los lectores de pantalla lo anuncien.

### 3. Victoria

Al acertar:

- El mensaje de victoria muestra el número secreto y la cantidad de intentos.
- Se compara con el récord guardado: si se mejora (menos intentos) o es el primero, se guarda en `localStorage` y se indica "¡Nuevo récord!".
- El personaje decorativo (la marca "?") hace una animación de celebración y suelta una estrella (microinteracción de éxito).
- Los globos restantes vuelan hacia arriba en celebración.
- El formulario se deshabilita hasta que se inicia un nuevo juego.

### 4. Derrota

Al fallar en el décimo intento (cuando se usan los 10 globos):

- Se muestra el mensaje "¡Te quedaste sin globos!" revelando el número secreto.
- **No** se guarda ningún récord en `localStorage`.
- El formulario se deshabilita hasta que se inicia un nuevo juego.

### 5. Nuevo juego

El botón **Nuevo juego** genera un nuevo número secreto, resetea el contador de intentos, restaura los 10 globos y habilita el formulario de nuevo. El mejor récord histórico se conserva.

## Persistencia

El mejor récord se guarda en `localStorage` con la clave `adivina-numero:mejor-record`. Todo acceso a `localStorage` se envuelve en `try/catch` porque puede fallar (navegadores con almacenamiento deshabilitado o modo incógnito) y el juego debe seguir funcionando sin él.

### Cómo lo sabe el jugador

El botón **?** de la esquina de la tarjeta (un botón real con `aria-label`) abre un modal informativo que explica qué se guarda, que los datos viven solo en el dispositivo y cómo borrarlos desde el navegador. Se garantiza el cierre con **Entendido**, `Esc`, clic fuera del diálogo y la gestión de foco (trampa de Tab y devolución del foco al cerrar).

## Accesibilidad incorporada

- Formulario con `label` asociado al campo mediante `for`/`id`.
- Zona de retroalimentación con `role="status"` y `aria-live="polite"`.
- Campo de error con `role="alert"` y `aria-invalid` conmutable.
- Enlace "Saltar al juego" para navegación por teclado.
- Modal de datos accesible: `role="dialog"`, `aria-modal="true"`, título asociado con `aria-labelledby`, trampa de foco y cierre con `Esc`.
- Anillos de foco visibles en todos los elementos interactivos.
- Soporte de `prefers-reduced-motion`: con movimiento reducido se muestran los valores finales sin animación.
- Los globos se dibujan como SVG con `aria-hidden="true"` (son decorativos); la información funcional viaja por el contador de intentos y los mensajes en `aria-live`.