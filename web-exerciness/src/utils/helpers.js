import {
  BODY_PART_LABELS,
  EQUIPMENT_LABELS,
  MUSCLE_GROUP_LABELS,
  TARGET_LABELS,
  ALL,
} from './constants.js'

// Convierte la primera letra en mayúscula.
export function capitalize(value) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Devuelve la etiqueta traducida o el valor original capitalizado.
export function getLabel(labels, value) {
  if (!value) return value
  return labels[value] || capitalize(value)
}

export function getBodyPartLabel(value) {
  return getLabel(BODY_PART_LABELS, value)
}

export function getEquipmentLabel(value) {
  return getLabel(EQUIPMENT_LABELS, value)
}

export function getTargetLabel(value) {
  return getLabel(TARGET_LABELS, value)
}

export function getMuscleGroupLabel(value) {
  return getLabel(MUSCLE_GROUP_LABELS, value)
}

// Genera las opciones [{ value, label }] para un campo del dataset.
export function getDistinctOptions(exercises, key, labelGetter) {
  const values = [...new Set(exercises.map((exercise) => exercise[key]))].sort()
  return [
    { value: ALL, label: 'Todos' },
    ...values.map((value) => ({ value, label: labelGetter(value) })),
  ]
}

// Filtra el catálogo aplicando la búsqueda y los filtros seleccionados.
export function filterExercises(exercises, { search, bodyPart, equipment, target, muscleGroup }) {
  const query = search.trim().toLowerCase()
  return exercises.filter((exercise) => {
    if (query && !exercise.name.toLowerCase().includes(query)) return false
    if (bodyPart !== ALL && exercise.body_part !== bodyPart) return false
    if (equipment !== ALL && exercise.equipment !== equipment) return false
    if (target !== ALL && exercise.target !== target) return false
    if (muscleGroup !== ALL && exercise.muscle_group !== muscleGroup) return false
    return true
  })
}

// Ordena el catálogo según el campo indicado.
export function sortExercises(exercises, sortBy) {
  const fields = { name: 'name', body_part: 'body_part', equipment: 'equipment' }
  const field = fields[sortBy] || 'name'
  return [...exercises].sort((a, b) => a[field].localeCompare(b[field]))
}
