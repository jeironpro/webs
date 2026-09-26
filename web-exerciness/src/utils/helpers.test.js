// Tests de las utilidades de helpers (etiquetas, filtrado y ordenación).
import { describe, it, expect } from 'vitest'
import {
  capitalize,
  getLabel,
  getDistinctOptions,
  filterExercises,
  sortExercises,
} from './helpers.js'
import { BODY_PART_LABELS } from './constants.js'
import { exercisesFixture } from '@/test/fixtures.js'

describe('capitalize', () => {
  it('pone la primera letra en mayúscula', () => {
    expect(capitalize('bicep curl')).toBe('Bicep curl')
  })

  it('devuelve el valor si está vacío', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('getLabel', () => {
  it('devuelve la etiqueta traducida', () => {
    expect(getLabel(BODY_PART_LABELS, 'chest')).toBe('Pecho')
  })

  it('devuelve el valor capitalizado si no hay traducción', () => {
    expect(getLabel(BODY_PART_LABELS, 'unknown')).toBe('Unknown')
  })
})

describe('getDistinctOptions', () => {
  it('incluye "Todos" y las etiquetas traducidas', () => {
    const options = getDistinctOptions(exercisesFixture(), 'body_part', (v) =>
      getLabel(BODY_PART_LABELS, v),
    )
    expect(options[0]).toEqual({ value: 'all', label: 'Todos' })
    expect(options).toContainEqual({ value: 'chest', label: 'Pecho' })
  })
})

describe('filterExercises', () => {
  const exercises = exercisesFixture()
  const baseFilters = {
    search: '',
    bodyPart: 'all',
    equipment: 'all',
    target: 'all',
    muscleGroup: 'all',
  }

  it('filtra por término de búsqueda', () => {
    const result = filterExercises(exercises, { ...baseFilters, search: 'press' })
    expect(result.map((e) => e.id)).toEqual(['0003'])
  })

  it('filtra por grupo corporal', () => {
    const result = filterExercises(exercises, { ...baseFilters, bodyPart: 'upper arms' })
    expect(result.map((e) => e.id)).toEqual(['0002'])
  })

  it('filtra por equipo', () => {
    const result = filterExercises(exercises, { ...baseFilters, equipment: 'dumbbell' })
    expect(result.map((e) => e.id)).toEqual(['0002'])
  })

  it('combina filtros', () => {
    const result = filterExercises(exercises, {
      ...baseFilters,
      search: 'bicep',
      bodyPart: 'upper arms',
    })
    expect(result.map((e) => e.id)).toEqual(['0002'])
  })

  it('no modifica el array original', () => {
    const copy = [...exercises]
    filterExercises(exercises, { ...baseFilters, search: 'press' })
    expect(exercises).toEqual(copy)
  })
})

describe('sortExercises', () => {
  it('ordena por nombre alfabéticamente', () => {
    const result = sortExercises(exercisesFixture(), 'name')
    expect(result.map((e) => e.name)).toEqual(['3/4 sit-up', 'Bench press', 'Bicep curl'])
  })

  it('ordena por grupo corporal', () => {
    const result = sortExercises(exercisesFixture(), 'body_part')
    expect(result.map((e) => e.body_part)).toEqual(['chest', 'upper arms', 'waist'])
  })
})
