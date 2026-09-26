// Tests del store de filtros del catálogo.
import { describe, it, expect, beforeEach } from 'vitest'
import { useFilterStore } from './filterStore.js'
import { ALL } from '@/utils/constants.js'

describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.setState({
      search: '',
      bodyPart: ALL,
      equipment: ALL,
      target: ALL,
      muscleGroup: ALL,
      sortBy: 'name',
    })
  })

  it('actualiza la búsqueda', () => {
    useFilterStore.getState().setSearch('press')
    expect(useFilterStore.getState().search).toBe('press')
  })

  it('actualiza el grupo corporal', () => {
    useFilterStore.getState().setBodyPart('chest')
    expect(useFilterStore.getState().bodyPart).toBe('chest')
  })

  it('restablece todos los filtros', () => {
    useFilterStore.getState().setSearch('x')
    useFilterStore.getState().setBodyPart('chest')
    useFilterStore.getState().setSortBy('equipment')
    useFilterStore.getState().reset()
    expect(useFilterStore.getState()).toMatchObject({ search: '', bodyPart: ALL, sortBy: 'name' })
  })
})
