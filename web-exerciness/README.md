# Web Exerciness

Catálogo de ejercicios de gimnasio con búsqueda, filtros, detalle, favoritos y
comparador. Aplicación estática de HTML, CSS y JavaScript, sin framework ni
proceso de compilación.

## Características

- Catálogo de 1.324 ejercicios con búsqueda por nombre y filtros por grupo
  corporal, equipo, objetivo y músculo principal.
- Detalle con imagen, animación, instrucciones en español paso a paso y
  atribución obligatoria (© Gym visual).
- Favoritos persistidos en `localStorage` con contador en la cabecera.
- Comparador de hasta 4 ejercicios con tabla lado a lado y barra flotante.
- Tema claro/oscuro con detección de la preferencia del sistema y persistencia.
- Menú móvil y navegación entre las cinco páginas.

## Estructura

```
index.html        Inicio
ejercicios.html   Catálogo completo con filtros
ejercicio.html    Detalle de un ejercicio (?id=0001)
favoritos.html    Ejercicios guardados
comparar.html     Comparador lado a lado
css/styles.css    Estilos
js/app.js         Catálogo, detalle, favoritos, comparador y tema
data/             Dataset de ejercicios
images/           Imágenes
videos/           Animaciones
```

## Uso local

No necesita instalación. Sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080 --directory web-exerciness
```

Abre <http://localhost:8080>. También puedes abrir `index.html` directamente,
aunque el servidor local evita restricciones de carga de datos y medios.

## Datos y estado

El catálogo se carga desde `data/exercises.json`. Las claves de `localStorage`
son `exerciness-theme`, `exerciness-favorites` y `exerciness-compare`.

## Créditos

Los datos y la media (1.324 ejercicios con imágenes y animaciones) provienen de
[exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) de
[@hasaneyldrm](https://github.com/hasaneyldrm). La media se muestra con la
atribución obligatoria © Gym visual en cada detalle.

## Licencia

MIT. Consulta [LICENSE](../LICENSE).
