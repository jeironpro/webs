// Constantes de la aplicación: opciones de filtro y etiquetas en español.
// Los valores provienen del dataset real (data/exercises.json).

export const ALL = 'all'

// Etiquetas en español para los grupos corporales.
export const BODY_PART_LABELS = {
  back: 'Espalda',
  cardio: 'Cardio',
  chest: 'Pecho',
  'lower arms': 'Antebrazos',
  'lower legs': 'Piernas inferiores',
  neck: 'Cuello',
  shoulders: 'Hombros',
  'upper arms': 'Brazos',
  'upper legs': 'Piernas superiores',
  waist: 'Cintura',
}

// Etiquetas en español para los equipos.
export const EQUIPMENT_LABELS = {
  assisted: 'Máquina asistida',
  band: 'Banda elástica',
  barbell: 'Barra',
  'body weight': 'Peso corporal',
  'bosu ball': 'Bosu',
  cable: 'Poleas',
  dumbbell: 'Mancuernas',
  'elliptical machine': 'Elíptica',
  'ez barbell': 'Barra Z',
  hammer: 'Martillo',
  kettlebell: 'Kettlebell',
  'leverage machine': 'Máquina de palanca',
  'medicine ball': 'Balón medicinal',
  'olympic barbell': 'Barra olímpica',
  'resistance band': 'Banda de resistencia',
  roller: 'Rodillo',
  rope: 'Cuerda',
  'skierg machine': 'Máquina de esquí',
  'sled machine': 'Trineo',
  'smith machine': 'Máquina Smith',
  'stability ball': 'Balón de estabilidad',
  'stationary bike': 'Bicicleta estática',
  'stepmill machine': 'Escaladora',
  tire: 'Neumático',
  'trap bar': 'Barra trampa',
  'upper body ergometer': 'Ergómetro de brazo',
  weighted: 'Con peso',
  'wheel roller': 'Rueda abdominal',
}

// Etiquetas en español para los músculos objetivo.
export const TARGET_LABELS = {
  abductors: 'Abductores',
  abs: 'Abdominales',
  adductors: 'Aductores',
  biceps: 'Bíceps',
  calves: 'Gemelos',
  'cardiovascular system': 'Cardiovascular',
  delts: 'Deltoides',
  forearms: 'Antebrazos',
  glutes: 'Glúteos',
  hamstrings: 'Isquiotibiales',
  lats: 'Dorsales',
  'levator scapulae': 'Elevador de la escápula',
  pectorals: 'Pectorales',
  quads: 'Cuádriceps',
  'serratus anterior': 'Serrato anterior',
  spine: 'Columna',
  traps: 'Trapecios',
  triceps: 'Tríceps',
  'upper back': 'Espalda alta',
}

// Etiquetas en español para los grupos musculares secundarios.
export const MUSCLE_GROUP_LABELS = {
  abdominals: 'Abdominales',
  'ankle stabilizers': 'Estabilizadores del tobillo',
  ankles: 'Tobillos',
  biceps: 'Bíceps',
  calves: 'Gemelos',
  chest: 'Pecho',
  core: 'Core',
  deltoids: 'Deltoides',
  forearms: 'Antebrazos',
  glutes: 'Glúteos',
  hamstrings: 'Isquiotibiales',
  hands: 'Manos',
  'hip flexors': 'Flexores de cadera',
  'latissimus dorsi': 'Dorsal ancho',
  lats: 'Dorsales',
  'lower back': 'Lumbar',
  obliques: 'Oblicuos',
  quadriceps: 'Cuádriceps',
  rhomboids: 'Romboides',
  'rotator cuff': 'Manguito rotador',
  shoulders: 'Hombros',
  soleus: 'Sóleo',
  trapezius: 'Trapecio',
  traps: 'Trapecios',
  triceps: 'Tríceps',
  'upper back': 'Espalda alta',
  'wrist extensors': 'Extensores de muñeca',
  'wrist flexors': 'Flexores de muñeca',
  wrists: 'Muñecas',
}

// Opciones de ordenación del catálogo.
export const SORT_OPTIONS = [
  { value: 'name', label: 'Nombre' },
  { value: 'body_part', label: 'Grupo corporal' },
  { value: 'equipment', label: 'Equipo' },
]
