// Rangos de índices de Pokémon por generación (inicio inclusivo, fin exclusivo)
export const GENERACIONES = [
  { id: 1, nombre: 'primera', inicio: 0, fin: 151 },
  { id: 2, nombre: 'segunda', inicio: 151, fin: 251 },
  { id: 3, nombre: 'tercera', inicio: 251, fin: 386 },
  { id: 4, nombre: 'cuarta', inicio: 386, fin: 493 },
  { id: 5, nombre: 'quinta', inicio: 493, fin: 649 },
  { id: 6, nombre: 'sexta', inicio: 649, fin: 721 },
  { id: 7, nombre: 'septima', inicio: 721, fin: 809 },
  { id: 8, nombre: 'octava', inicio: 809, fin: 905 },
  { id: 9, nombre: 'novena', inicio: 905, fin: 1025 },
];

// Mapa de colores por tipo de Pokémon para la UI (fondo y versión clara)
export const TIPO_COLORS = {
  acero: { bg: '#B8B8D0', light: '#D1D1E0' },
  agua: { bg: '#6890F0', light: '#9DB7F5' },
  bicho: { bg: '#A8B820', light: '#C6D16E' },
  dragón: { bg: '#7038F8', light: '#A27DFA' },
  dragon: { bg: '#7038F8', light: '#A27DFA' },
  electrico: { bg: '#F8D030', light: '#FAE078' },
  eléctrico: { bg: '#F8D030', light: '#FAE078' },
  fantasma: { bg: '#705898', light: '#A292BC' },
  fuego: { bg: '#F08030', light: '#F5AC78' },
  hada: { bg: '#EE99AC', light: '#F4BDC9' },
  hielo: { bg: '#98D8D8', light: '#BCE6E6' },
  lucha: { bg: '#C03028', light: '#D67873' },
  normal: { bg: '#A8A878', light: '#C6C6A7' },
  planta: { bg: '#78C850', light: '#A7DB8D' },
  psiquico: { bg: '#F85888', light: '#FA92B2' },
  psíquico: { bg: '#F85888', light: '#FA92B2' },
  roca: { bg: '#B8A038', light: '#D1C17D' },
  siniestro: { bg: '#705848', light: '#A29288' },
  tierra: { bg: '#E0C068', light: '#EBD69D' },
  veneno: { bg: '#A040A0', light: '#C183C1' },
  volador: { bg: '#A890F0', light: '#C6B7F5' },
};

// Traducción de claves de estadísticas a etiquetas legibles en español
export const NOMBRES_TIPO = {
  ps: 'PS',
  ataque: 'Ataque',
  defensa: 'Defensa',
  ataque_especial: 'At. Esp',
  defensa_especial: 'Def. Esp',
  velocidad: 'Velocidad',
};
