// Tests del store del comparador.
import { describe, it, expect, beforeEach } from 'vitest'
import {
  useCompareStore,
  selectIsComparing,
  selectCompareCount,
  MAX_COMPARE_ITEMS,
} from './compareStore.js'

describe('compareStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useCompareStore.setState({ ids: [], maxItems: MAX_COMPARE_ITEMS })
  })

  it('añade un ejercicio a la comparación', () => {
    useCompareStore.getState().toggleCompare('0001')
    expect(useCompareStore.getState().ids).toEqual(['0001'])
  })

  it('elimina un ejercicio de la comparación al alternarlo', () => {
    useCompareStore.setState({ ids: ['0001'] })
    useCompareStore.getState().toggleCompare('0001')
    expect(useCompareStore.getState().ids).toEqual([])
  })

  it('no supera el máximo de ejercicios comparados', () => {
    useCompareStore.setState({ ids: ['0001', '0002', '0003', '0004'] })
    useCompareStore.getState().toggleCompare('0005')
    expect(useCompareStore.getState().ids).toEqual(['0001', '0002', '0003', '0004'])
  })

  it('elimina un ejercicio con removeCompare', () => {
    useCompareStore.setState({ ids: ['0001', '0002'] })
    useCompareStore.getState().removeCompare('0001')
    expect(useCompareStore.getState().ids).toEqual(['0002'])
  })

  it('vacía la selección con clear', () => {
    useCompareStore.setState({ ids: ['0001', '0002'] })
    useCompareStore.getState().clear()
    expect(useCompareStore.getState().ids).toEqual([])
  })

  it('persiste la selección en localStorage', () => {
    useCompareStore.getState().toggleCompare('0001')
    const stored = JSON.parse(localStorage.getItem('exerciness-compare'))
    expect(stored.state.ids).toEqual(['0001'])
  })

  it('expone selectores de comparación y contador', () => {
    useCompareStore.setState({ ids: ['0001', '0002'] })
    expect(selectIsComparing('0001')(useCompareStore.getState())).toBe(true)
    expect(selectIsComparing('0009')(useCompareStore.getState())).toBe(false)
    expect(selectCompareCount(useCompareStore.getState())).toBe(2)
  })
})
