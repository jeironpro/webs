/*
 * Modulo de dados - gestiona la creacion y manipulacion de dados en el DOM
 * Cada dado se representa visualmente con una cuadricula 3x3 de puntos (pips)
 */

import { createElement, clearElement } from '../utils/dom.js';
import { roll, rollMultiple } from '../services/diceService.js';

/*
 * Mapa de posiciones de puntos para cada valor de dado (1-6)
 * Las posiciones corresponden a una cuadricula 3x3 numerada del 1 al 9:
 *   1 2 3
 *   4 5 6
 *   7 8 9
 */
const DOT_POSITIONS = {
    1: [5],
    2: [3, 7],
    3: [3, 5, 7],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
};

const ROLL_DURATION = 600;
const FLASH_INTERVAL = 60;

export class DiceManager {
    constructor(container) {
        this.container = container;
        this.count = 1;
        this.dice = [];
        this.isRolling = false;
    }

    /**
     * Establece la cantidad de dados a mostrar y re-renderiza
     * @param {number} count - Nueva cantidad de dados (1-12)
     */
    setCount(count) {
        this.count = count;
        this.render();
    }

    /**
     * Renderiza todos los dados en el contenedor
     * Crea la cuadricula y los elementos DOM para cada dado
     */
    render() {
        clearElement(this.container);
        this.dice = [];

        const cols = this.calculateColumns();
        this.container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        for (let i = 0; i < this.count; i++) {
            const die = this.createDie();
            this.setDieValue(die, roll());
            this.container.appendChild(die.wrapper);
            this.dice.push(die);
        }
    }

    /**
     * Calcula el numero optimo de columnas para la cuadricula
     * @returns {number} Numero de columnas
     */
    calculateColumns() {
        if (this.count <= 3) {
            return this.count;
        }
        return Math.ceil(Math.sqrt(this.count));
    }

    /**
     * Crea un nuevo dado con su estructura DOM completa
     * @returns {Object} Referencia al dado con wrapper, face y value
     */
    createDie() {
        const wrapper = createElement('div', ['dice-wrapper']);
        const face = createElement('div', ['dice-face']);

        for (let i = 1; i <= 9; i++) {
            const cell = createElement('div', ['dice-cell']);
            face.appendChild(cell);
        }

        wrapper.appendChild(face);

        return { wrapper, face, value: null };
    }

    /**
     * Establece el valor visual de un dado colocando los puntos
     * @param {Object} die - Referencia al dado
     * @param {number} value - Valor del 1 al 6
     */
    setDieValue(die, value) {
        die.value = value;
        const cells = die.face.querySelectorAll('.dice-cell');
        const positions = DOT_POSITIONS[value] || [];

        cells.forEach((cell, index) => {
            const pos = index + 1;
            if (positions.includes(pos)) {
                cell.classList.add('dot');
            } else {
                cell.classList.remove('dot');
            }
        });
    }

    /**
     * Lanza todos los dados con animacion visual
     * Durante la animacion los valores parpadean aleatoriamente
     * @returns {Promise<number[]>} Promesa que resuelve con los valores finales
     */
    rollAll() {
        if (this.isRolling) {
            return Promise.resolve(this.getValues());
        }

        this.isRolling = true;
        const finalValues = rollMultiple(this.count);

        this.dice.forEach((die) => {
            die.wrapper.classList.add('rolling');
        });

        return new Promise((resolve) => {
            const flashInterval = setInterval(() => {
                const randomValues = rollMultiple(this.count);
                this.dice.forEach((die, index) => {
                    this.setDieValue(die, randomValues[index]);
                });
            }, FLASH_INTERVAL);

            setTimeout(() => {
                clearInterval(flashInterval);

                this.dice.forEach((die, index) => {
                    die.wrapper.classList.remove('rolling');
                    this.setDieValue(die, finalValues[index]);
                });

                this.isRolling = false;
                resolve(finalValues);
            }, ROLL_DURATION);
        });
    }

    /**
     * Obtiene los valores actuales de todos los dados
     * @returns {number[]} Array con los valores actuales
     */
    getValues() {
        return this.dice.map((die) => die.value);
    }
}
