// Tests de los validadores del dataset.
import { describe, it, expect } from 'vitest'
import { isValidExercise } from './validators.js'
import { exerciseFixture } from '@/test/fixtures.js'

describe('isValidExercise', () => {
  it('acepta un registro válido', () => {
    expect(isValidExercise(exerciseFixture())).toBe(true)
  })

  it('rechaza un registro sin id', () => {
    expect(isValidExercise({ ...exerciseFixture(), id: undefined })).toBe(false)
  })

  it('rechaza un registro sin instrucciones en español', () => {
    expect(isValidExercise({ ...exerciseFixture(), instructions: {} })).toBe(false)
  })

  it('rechaza un registro sin media', () => {
    expect(isValidExercise({ ...exerciseFixture(), image: undefined })).toBe(false)
  })
})
