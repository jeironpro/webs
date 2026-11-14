# programmer-day

Landing del Día del Programador: el día 256 del año (2⁸, un byte completo). El
13 de septiembre —o el 12 en años bisiestos— la web muestra una celebración; el
resto del año mantiene una cuenta atrás en vivo hacia esa fecha.

## Características

- Cuenta atrás en días, horas, minutos y segundos hasta el día 256.
- Sección «por qué 256» con la tabla de valores de un byte.
- Byte interactivo de ocho bits que recompone `0b........ = N`.
- Celebración a pantalla completa con confeti, fanfarria sintetizada y ocho
  cubos 3D con sus bits.
- Cambio de idioma español/inglés y preferencia de movimiento reducido.
- Sin proceso de compilación: HTML, CSS y JavaScript, con Three.js vendorizado.

## Estructura

```
index.html        Página única
css/styles.css    Estilos y animaciones
js/app.js         Cuenta atrás, i18n, byte y celebración
vendor/           Three.js
assets/fonts/     JetBrains Mono
```

## Uso local

```bash
python3 -m http.server 8080 --directory web-programmer-day
```

Abre <http://localhost:8080>.

## Modos de previsualización

- `/?day=256` muestra la celebración del día 256 del año actual.
- `/?day=256&lang=en` muestra la celebración en inglés.

Sin parámetros se calcula el día real: durante el día 256 se celebra y el resto
del año se muestra la cuenta atrás.

## Licencia

MIT. Consulta [LICENSE](../LICENSE).
