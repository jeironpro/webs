import { describe, it, expect } from 'vitest';
import { roll, rollMultiple, sumValues } from '../js/services/diceService.js';

describe('diceService', () => {
    describe('roll', () => {
        it('devuelve un numero entre 1 y 6', () => {
            for (let i = 0; i < 100; i++) {
                const value = roll();
                expect(value).toBeGreaterThanOrEqual(1);
                expect(value).toBeLessThanOrEqual(6);
            }
        });

        it('devuelve numeros enteros', () => {
            for (let i = 0; i < 100; i++) {
                const value = roll();
                expect(Number.isInteger(value)).toBe(true);
            }
        });
    });

    describe('rollMultiple', () => {
        it('devuelve un array con la longitud especificada', () => {
            const result = rollMultiple(5);
            expect(result).toHaveLength(5);
        });

        it('devuelve un array vacio para count 0', () => {
            const result = rollMultiple(0);
            expect(result).toHaveLength(0);
        });

        it('todos los valores estan entre 1 y 6', () => {
            const result = rollMultiple(200);
            result.forEach((value) => {
                expect(value).toBeGreaterThanOrEqual(1);
                expect(value).toBeLessThanOrEqual(6);
            });
        });
    });

    describe('sumValues', () => {
        it('suma correctamente los valores', () => {
            expect(sumValues([1, 2, 3])).toBe(6);
            expect(sumValues([6, 6, 6])).toBe(18);
            expect(sumValues([4, 5, 6, 1])).toBe(16);
        });

        it('devuelve 0 para array vacio', () => {
            expect(sumValues([])).toBe(0);
        });
    });
});
