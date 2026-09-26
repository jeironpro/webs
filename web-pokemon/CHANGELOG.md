# Changelog

## [2.0.0] - 2025-06-23

### Añadido

- Vista Splash con animación y redirección automática a la primera generación.
- Vista de generación con navegación entre generaciones anterior/siguiente.
- Barra de progreso "X de 9" para indicar la generación actual.
- Menú de navegación responsive con hamburger menu en móvil.
- Buscador de Pokémon por nombre.
- Filtro de Pokémon por tipo.
- Paginación de 24 Pokémon por página.
- Tarjetas de Pokémon con imagen, nombre, ID, tipos, descripción y estadísticas.
- Estadísticas representadas con estrellas (★).
- Gradient de fondo en cada carta según el color del tipo principal.
- Skeleton loaders con efecto shimmer mientras se cargan los datos.
- Diseño responsive (hasta 600px).

### API

- Migración de API externa a Cloudflare Pages Function.
- Datos almacenados localmente en `data/pokemon/` por generación.
- Colores de tipo servidos desde la Function combinando `tipos_colores.json`.
- Imágenes servidas desde `public/pokemon-images/`.
- Vite middleware para desarrollo local.
