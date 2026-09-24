import { describe, it, expect, beforeEach } from 'vitest';
import { DiceManager } from '../js/modules/dice.js';

describe('DiceManager', () => {
    let container;
    let manager;

    beforeEach(() => {
        container = document.createElement('div');
        manager = new DiceManager(container);
    });

    describe('render', () => {
        it('crea la cantidad correcta de dados', () => {
            manager.setCount(3);
            const dice = container.querySelectorAll('.dice-wrapper');
            expect(dice).toHaveLength(3);
        });

        it('crea un unico dado por defecto', () => {
            manager.render();
            const dice = container.querySelectorAll('.dice-wrapper');
            expect(dice).toHaveLength(1);
        });

        it('limpia y recrea al cambiar la cantidad', () => {
            manager.setCount(2);
            manager.setCount(5);
            const dice = container.querySelectorAll('.dice-wrapper');
            expect(dice).toHaveLength(5);
        });

        it('cada dado contiene 9 celdas', () => {
            manager.setCount(2);
            const faces = container.querySelectorAll('.dice-face');
            faces.forEach((face) => {
                const cells = face.querySelectorAll('.dice-cell');
                expect(cells).toHaveLength(9);
            });
        });
    });

    describe('setDieValue', () => {
        it('asigna el numero correcto de puntos para cada valor', () => {
            manager.setCount(1);
            const die = manager.dice[0];

            const expectedDots = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

            Object.entries(expectedDots).forEach(([value, count]) => {
                manager.setDieValue(die, parseInt(value, 10));
                const dots = die.face.querySelectorAll('.dice-cell.dot');
                expect(dots).toHaveLength(count);
            });
        });
    });

    describe('rollAll', () => {
        it('devuelve valores entre 1 y 6', async () => {
            manager.setCount(4);
            const values = await manager.rollAll();
            expect(values).toHaveLength(4);
            values.forEach((v) => {
                expect(v).toBeGreaterThanOrEqual(1);
                expect(v).toBeLessThanOrEqual(6);
            });
        });

        it('devuelve la misma cantidad de valores que de dados', async () => {
            manager.setCount(7);
            const values = await manager.rollAll();
            expect(values).toHaveLength(7);
        });
    });

    describe('getValues', () => {
        it('devuelve los valores actuales de los dados', () => {
            manager.setCount(3);
            const values = manager.getValues();
            expect(values).toHaveLength(3);
            values.forEach((v) => {
                expect(v).toBeGreaterThanOrEqual(1);
                expect(v).toBeLessThanOrEqual(6);
            });
        });
    });

    describe('calculateColumns', () => {
        it('calcula columnas optimas para la cuadricula', () => {
            expect(manager.calculateColumns()).toBe(1);

            manager.setCount(2);
            expect(manager.calculateColumns()).toBe(2);

            manager.setCount(4);
            expect(manager.calculateColumns()).toBe(2);

            manager.setCount(9);
            expect(manager.calculateColumns()).toBe(3);

            manager.setCount(12);
            expect(manager.calculateColumns()).toBe(4);
        });
    });
});
